import { useEffect, useMemo, useState } from 'react'
import SaleForm from '../../components/sales/SaleForm'
import ProductSelectionTable from '../../components/sales/ProductSelectionTable'
import SelectedProducts from '../../components/sales/SelectedProducts'
import SalesSummary from '../../components/sales/SalesSummary'
import { productService } from '../../services/productService'
import { salesService } from '../../services/salesService'
import './SalesPage.css'

function SalesPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saleDate, setSaleDate] = useState(getToday())
  const [selectedProducts, setSelectedProducts] = useState([])
  const [message, setMessage] = useState('')
  const [isCreatingSale, setIsCreatingSale] = useState(false)
  const [productTableKey, setProductTableKey] = useState(0)

  useEffect(() => {
    if (message !== 'Sale created successfully.') {
      return undefined
    }

    const timer = setTimeout(() => {
      setMessage('')
    }, 3500)

    return () => clearTimeout(timer)
  }, [message])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getAllProducts()
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const summary = useMemo(() => {
    const totalItems = selectedProducts.length
    const totalQuantity = selectedProducts.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = selectedProducts.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    )

    return { totalItems, totalQuantity, totalAmount }
  }, [selectedProducts])

  const handleAddProduct = (product, quantity) => {
    setMessage('')
    setSelectedProducts((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product.productId)

      if (!existingItem) {
        return [...currentItems, { ...product, productId: product.productId, quantity }]
      }

      const nextQuantity = Math.min(existingItem.quantity + quantity, product.stock)
      return currentItems.map((item) =>
        item.productId === product.productId ? { ...item, quantity: nextQuantity } : item,
      )
    })
  }

  const handleQuantityChange = (productId, quantity) => {
    setMessage('')
    setSelectedProducts((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock) }
          : item,
      ),
    )
  }

  const handleRemoveProduct = (productId) => {
    setMessage('')
    setSelectedProducts((currentItems) => currentItems.filter((item) => item.productId !== productId))
  }

  const handleCreateSale = async () => {
    if (!saleDate) {
      setMessage('Please select a sale date.')
      return
    }

    if (selectedProducts.length === 0) {
      setMessage('Add at least one product before creating a sale.')
      return
    }

    const salePayload = {
      saleDate,
      saleTime: getCurrentTime(),
      items: selectedProducts.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }

    try {
      setIsCreatingSale(true)
      await salesService.createSale(salePayload)
      setMessage('Sale created successfully.')
      setSelectedProducts([])
      const refreshedProducts = await productService.getAllProducts()
      setProducts(refreshedProducts)
      setSaleDate(getToday())
      setProductTableKey((currentKey) => currentKey + 1)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setIsCreatingSale(false)
    }
  }

  return (
    <section className="sales-page">
      <div className="sales-hero">
        <div>
          <span className="sales-eyebrow">Sales Management</span>
          <h1>Create sale</h1>
          <p>
            Build a tenant-ready sale by selecting products, adjusting quantities, and reviewing totals before sending it to billing.
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

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="sales-layout">
          <div className="sales-main">
            <SaleForm saleDate={saleDate} onSaleDateChange={setSaleDate} />

            <ProductSelectionTable
              key={productTableKey}
              products={products}
              onAddProduct={handleAddProduct}
            />

            <SelectedProducts
              items={selectedProducts}
              onQuantityChange={handleQuantityChange}
              onRemoveProduct={handleRemoveProduct}
              isCreatingSale={isCreatingSale}
            />

            <SalesSummary
              saleDate={saleDate}
              summary={summary}
              message={message}
              canCreate={selectedProducts.length > 0 && !isCreatingSale}
              isCreating={isCreatingSale}
              onCreateSale={handleCreateSale}
            />
          </div>
        </div>
      )}
    </section>
  )
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function getCurrentTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export default SalesPage
