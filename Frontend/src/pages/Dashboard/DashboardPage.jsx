import { useEffect, useMemo, useState } from 'react'
import DashboardCards from '../../components/dashboard/DashboardCards'
import SalesFilters from '../../components/dashboard/SalesFilters'
import SalesTable from '../../components/dashboard/SalesTable'
import LowStockCard from '../../components/dashboard/LowStockCard'
import AnalyticsSection from '../../components/dashboard/AnalyticsSection'
import SalesSummary from '../../components/dashboard/SalesSummary'
import { productService } from '../../services/productService'
import { salesService } from '../../services/salesService'
import './DashboardPage.css'

const defaultFilters = {
  mode: 'currentMonth',
  saleId: '',
  date: '',
  startDate: '',
  endDate: '',
  productId: '',
  page: 1,
  pageSize: 5,
}

function DashboardPage() {
  const [filters, setFilters] = useState(defaultFilters)
  const [minimumStock, setMinimumStock] = useState(5)
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalSalesCount, setTotalSalesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts({ page: 0, size: 100, sortBy: 'productId' })
        setProducts(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const data = await productService.getLowStockProducts(Number(minimumStock || 1), {
          page: 0,
          size: 100,
          sortBy: 'productId',
        })
        setLowStockProducts(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchLowStockProducts()
  }, [minimumStock])

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchDashboardSales(filters)
        const normalizedSales = normalizeSales(response.sales)
        setSales(normalizedSales)
        setTotalPages(response.totalPages)
        setTotalSalesCount(response.totalElements)
      } catch (err) {
        setSales([])
        setTotalPages(1)
        setTotalSalesCount(0)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [filters])

  const productOptions = useMemo(
    () => products.map((product) => ({ id: product.productId, name: product.name })),
    [products],
  )

  const analytics = useMemo(() => {
    const totalAmount = sales.reduce((sum, sale) => sum + getSaleTotal(sale), 0)
    const totalItems = sales.reduce(
      (sum, sale) => sum + (sale.itemCount ?? sale.items.length),
      0,
    )
    const totalQuantity = sales.reduce(
      (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    )

    return {
      totalSales: totalSalesCount,
      totalAmount,
      totalItems,
      totalQuantity,
      averageSale: sales.length ? totalAmount / sales.length : 0,
    }
  }, [sales, totalSalesCount])

  const updateFilters = (nextFilters) => {
    setFilters({ ...nextFilters, page: 1 })
  }

  const updatePage = (page) => {
    setFilters((currentFilters) => ({ ...currentFilters, page }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">Analytics Dashboard</span>
          <h1>Sales overview</h1>
          <p>
            Track current-month sales by default, inspect filtered transactions, and keep low-stock risks visible for the tenant inventory.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button type="button" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <SalesSummary filters={filters} salesCount={totalSalesCount} />

      <SalesFilters
        filters={filters}
        productOptions={productOptions}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      <DashboardCards analytics={analytics} />

      <div className="dashboard-grid">
        <AnalyticsSection analytics={analytics} sales={sales} />
        <LowStockCard
          minimumStock={minimumStock}
          products={lowStockProducts}
          onMinimumStockChange={setMinimumStock}
        />
      </div>

      {loading ? (
        <div className="dashboard-card loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard sales...</p>
        </div>
      ) : (
        <SalesTable
          sales={sales}
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={updatePage}
          onLoadSaleDetails={loadSaleDetails}
        />
      )}
    </section>
  )
}

async function loadSaleDetails(saleId) {
  const sale = await salesService.getSaleById(saleId)
  return normalizeSales([sale])[0]
}

async function fetchDashboardSales(filters) {
  const pageParams = {
    page: Math.max(filters.page - 1, 0),
    size: Number(filters.pageSize),
    sortBy: 'saleId',
  }

  if (filters.mode === 'saleId' && filters.saleId.trim()) {
    const sale = await salesService.getSaleById(filters.saleId.trim())
    return { sales: [sale], totalPages: 1, totalElements: 1 }
  }

  if (filters.mode === 'particularDate' && filters.date) {
    const sales = await salesService.getSalesByDate(filters.date)
    return paginateLocalSales(sales, filters)
  }

  if (filters.mode === 'betweenDates' && filters.startDate && filters.endDate) {
    const page = await salesService.getSalesByDateRange({
      date1: filters.startDate,
      date2: filters.endDate,
      ...pageParams,
    })
    return pageToDashboardResult(page)
  }

  if (filters.mode === 'product' && filters.productId) {
    const items = await salesService.getSalesByProduct(filters.productId)
    return paginateLocalSales(groupSaleItems(items), filters)
  }

  if (filters.mode === 'allSales') {
    const page = await salesService.getAllSales(pageParams)
    return pageToDashboardResult(page)
  }

  const { startDate, endDate } = getCurrentMonthRange()
  const page = await salesService.getSalesByDateRange({
    date1: startDate,
    date2: endDate,
    ...pageParams,
  })
  return pageToDashboardResult(page)
}

function pageToDashboardResult(page) {
  const sales = page?.content ?? []
  return {
    sales,
    totalPages: Math.max(1, page?.totalPages ?? 1),
    totalElements: page?.totalElements ?? sales.length,
  }
}

function paginateLocalSales(sales, filters) {
  const pageSize = Number(filters.pageSize)
  const currentPage = Math.max(filters.page - 1, 0)
  const start = currentPage * pageSize

  return {
    sales: sales.slice(start, start + pageSize),
    totalPages: Math.max(1, Math.ceil(sales.length / pageSize)),
    totalElements: sales.length,
  }
}

function getCurrentMonthRange() {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(end),
  }
}

function formatDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeSales(sales) {
  return sales.map((sale) => ({
    ...sale,
    owner: sale.owner || 'Current tenant',
    saleTime: sale.saleTime || '',
    items: (sale.items || []).map(normalizeSaleItem),
  }))
}

function normalizeSaleItem(item) {
  return {
    ...item,
    product: {
      productId: item.productId,
      name: item.productName || item.product?.name || 'Unknown product',
      category: item.category || item.product?.category || 'Not provided',
      brand: item.brand || item.product?.brand || 'Not provided',
      price: Number(item.price || item.product?.price || calculateUnitPrice(item)),
    },
    quantity: Number(item.quantity || 0),
    amount: Number(item.amount || 0),
  }
}

function groupSaleItems(items) {
  const salesById = new Map()

  items.forEach((item) => {
    const saleId = item.saleId || item.id
    const existingSale = salesById.get(saleId) || {
      saleId,
      saleDate: item.saleDate || '',
      saleTime: item.saleTime || '',
      owner: 'Current tenant',
      items: [],
      totalAmount: 0,
    }
    existingSale.items.push(item)
    existingSale.totalAmount += Number(item.amount || 0)
    salesById.set(saleId, existingSale)
  })

  return [...salesById.values()].sort((firstSale, secondSale) =>
    String(secondSale.saleDate).localeCompare(String(firstSale.saleDate)),
  )
}

function calculateUnitPrice(item) {
  const quantity = Number(item.quantity || 0)
  return quantity > 0 ? Number(item.amount || 0) / quantity : 0
}

function getSaleTotal(sale) {
  return Number(sale.totalAmount || sale.items.reduce((sum, item) => sum + Number(item.amount || 0), 0))
}

export default DashboardPage
