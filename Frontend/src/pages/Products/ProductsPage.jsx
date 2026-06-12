import { useMemo, useState, useEffect } from 'react'
import ProductFilters from '../../components/products/ProductFilters'
import ProductForm from '../../components/products/ProductForm'
import ProductTable from '../../components/products/ProductTable'
import ProductCard from '../../components/products/ProductCard'
import DeleteModal from '../../components/products/DeleteModal'
import Pagination from '../../components/products/Pagination'
import { productService } from '../../services/productService'
import './ProductsPage.css'

const emptyFilters = {
  lowStockOnly: false,
  minimumStock: 5,
  category: '',
  productId: '',
}

const pageSize = 5

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isSavingProduct, setIsSavingProduct] = useState(false)

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getAllProducts()
        setProducts(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  )

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products
      .filter((product) => {
      const searchableText = getProductSearchText(product)
      const matchesSearch = normalizedSearch
        ? searchableText.includes(normalizedSearch)
        : true
      const matchesCategory = filters.category ? product.category === filters.category : true
      const matchesProductId = filters.productId
        ? String(product.productId).includes(filters.productId.trim())
        : true
      const matchesStock = filters.lowStockOnly
        ? product.stock < Number(filters.minimumStock || 0)
        : true

      return matchesSearch && matchesCategory && matchesProductId && matchesStock
    })
      .sort((firstProduct, secondProduct) =>
        compareSearchPriority(firstProduct, secondProduct, normalizedSearch),
      )
  }, [filters, products, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const inventoryStats = useMemo(() => {
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
    const inventoryValue = products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0,
    )
    const lowStockCount = products.filter((product) => product.stock < 5).length

    return {
      totalProducts: products.length,
      totalStock,
      inventoryValue,
      lowStockCount,
    }
  }, [products])

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters(emptyFilters)
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const displaySuccess = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 3500)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleUpsertProduct = async (productData) => {
    setIsSavingProduct(true)
    try {
      if (productData.productId) {
        // Update existing product
        const updatedProduct = await productService.updateProduct(
          productData.productId,
          productData,
        )
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.productId === productData.productId ? updatedProduct : product,
          ),
        )
        displaySuccess('Product updated successfully.')
      } else {
        // Create new product
        const newProduct = await productService.createProduct(productData)
        setProducts((currentProducts) => [newProduct, ...currentProducts])
        displaySuccess('Product added successfully.')
      }
      setError(null)
      setIsFormOpen(false)
      setEditingProduct(null)
      setCurrentPage(1)
    } catch (err) {
      setError(err.message)
      setSuccess(null)
      console.error('Error saving product:', err)
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) {
      return
    }

    try {
      await productService.deleteProduct(productToDelete.productId)
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.productId !== productToDelete.productId),
      )
      setProductToDelete(null)
      setCurrentPage(1)
      displaySuccess('Product deleted successfully.')
      setError(null)
    } catch (err) {
      setError(err.message)
      setSuccess(null)
      console.error('Error deleting product:', err)
    }
  }

  return (
    <section className="products-page">
      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="products-hero">
        <div>
          <span className="products-eyebrow">Product Management</span>
          <h1>Inventory catalog</h1>
          <p>
            Manage tenant-ready product records, stock levels, and searchable inventory data from a clean operational workspace.
          </p>
        </div>
        <button type="button" className="primary-action" onClick={handleAddProduct} disabled={isSavingProduct}>
          Add Product
        </button>
      </div>

      {success && (
        <div className="success-banner">
          <strong>Success:</strong> {success}
          <button type="button" onClick={() => setSuccess(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="product-stats" aria-label="Product summary">
        <div className="stat-card">
          <span>Total products</span>
          <strong>{inventoryStats.totalProducts}</strong>
        </div>
        <div className="stat-card">
          <span>Units in stock</span>
          <strong>{inventoryStats.totalStock}</strong>
        </div>
        <div className="stat-card">
          <span>Inventory value</span>
          <strong>{formatCurrency(inventoryStats.inventoryValue)}</strong>
        </div>
        <div className="stat-card warning">
          <span>Low stock items</span>
          <strong>{inventoryStats.lowStockCount}</strong>
        </div>
      </div>

      <div className="products-toolbar">
        <div className="search-field">
          <label htmlFor="productSearch">Search by product name</label>
          <input
            id="productSearch"
            type="search"
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search laptop, printer, coffee..."
          />
        </div>
      </div>

      <ProductFilters
        filters={filters}
        categories={categories}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      <div className="products-panel">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            <div className="panel-heading">
          <div>
            <h2>Products</h2>
            <p>
              Showing {visibleProducts.length} of {filteredProducts.length} matching products.
            </p>
          </div>
        </div>

        <ProductTable
          products={visibleProducts}
          onEdit={handleEditProduct}
          onDelete={setProductToDelete}
          isSavingProduct={isSavingProduct}
        />

        <div className="product-card-list">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onEdit={handleEditProduct}
              onDelete={setProductToDelete}
              isSavingProduct={isSavingProduct}
            />
          ))}
        </div>

        {visibleProducts.length === 0 && (
          <div className="empty-products">
            <h3>No products found</h3>
            <p>Try changing the search term or resetting filters.</p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
          </>
        )}
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleUpsertProduct}
          onClose={() => {
            setIsFormOpen(false)
            setEditingProduct(null)
          }}
          isSubmitting={isSavingProduct}
        />
      )}

      {productToDelete && (
        <DeleteModal
          product={productToDelete}
          onCancel={() => setProductToDelete(null)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </section>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function getProductSearchText(product) {
  return [
    product.productId,
    product.name,
    product.category,
    product.brand,
  ]
    .filter((value) => value !== null && value !== undefined)
    .join(' ')
    .toLowerCase()
}

function compareSearchPriority(firstProduct, secondProduct, searchTerm) {
  if (!searchTerm) {
    return 0
  }

  const firstName = String(firstProduct.name || '').toLowerCase()
  const secondName = String(secondProduct.name || '').toLowerCase()
  const firstStartsWith = firstName.startsWith(searchTerm)
  const secondStartsWith = secondName.startsWith(searchTerm)

  if (firstStartsWith === secondStartsWith) {
    return firstName.localeCompare(secondName)
  }

  return firstStartsWith ? -1 : 1
}

export default ProductsPage
