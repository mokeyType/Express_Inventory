import { useMemo, useState } from 'react'
import QuantityInput from './QuantityInput'

function ProductSelectionTable({ products, onAddProduct }) {
  const [quantities, setQuantities] = useState(
    products.reduce((values, product) => ({ ...values, [product.productId]: 1 }), {}),
  )

  const [query, setQuery] = useState('')

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter((p) => {
      const matchesSearch = q
        ? getSalesProductSearchText(p).includes(q)
        : true

      return matchesSearch
    })
      .sort((firstProduct, secondProduct) =>
        compareSearchPriority(firstProduct, secondProduct, q),
      )
  }, [products, query])

  const updateQuantity = (productId, quantity) => {
    setQuantities((currentQuantities) => ({ ...currentQuantities, [productId]: quantity }))
  }

  const resetSearch = () => {
    setQuery('')
  }

  return (
    <section className="sale-card">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Product selection</span>
          <h2>Available products</h2>
        </div>
        <p>Select stock-controlled products for the current sale.</p>
      </div>

      <div className="sales-product-finder">
        <div className="sales-search-field">
          <label htmlFor="salesProductSearch">Search products</label>
          <input
            id="salesProductSearch"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name or ID"
            aria-label="Search products"
          />
        </div>

        <button type="button" className="sales-clear-search" onClick={resetSearch}>
          Reset
        </button>
      </div>

      <div className="sales-result-strip">
        <span>
          Showing {filteredProducts.length} of {products.length} products
        </span>
        {query && <strong>Search: "{query}"</strong>}
      </div>

      <div className="sales-table-wrap">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Available Stock</th>
              <th>Quantity</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const quantityId = `quantity-${product.productId}`
              const quantity = Math.min(quantities[product.productId] || 1, product.stock)

              return (
                <tr key={product.productId}>
                  <td>#{product.productId}</td>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    <span className={product.stock < 5 ? 'sale-stock low' : 'sale-stock'}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span id={quantityId} className="visually-hidden">
                      Quantity for {product.name}
                    </span>
                    <QuantityInput
                      value={quantity}
                      max={product.stock}
                      labelledBy={quantityId}
                      onChange={(nextQuantity) => updateQuantity(product.productId, nextQuantity)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="sale-primary-small"
                      disabled={product.stock === 0}
                      onClick={() => onAddProduct(product, quantity)}
                    >
                      Add To Sale
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="sales-product-cards">
        {filteredProducts.map((product) => {
          const quantityId = `card-quantity-${product.productId}`
          const quantity = Math.min(quantities[product.productId] || 1, product.stock)

          return (
            <article className="sales-product-card" key={product.productId}>
              <div>
                <span>#{product.productId}</span>
                <h3>{product.name}</h3>
                <p>
                  {product.category} • {product.brand}
                </p>
              </div>
              <div className="sales-product-meta">
                <strong>{formatCurrency(product.price)}</strong>
                <span className={product.stock < 5 ? 'sale-stock low' : 'sale-stock'}>
                  Stock {product.stock}
                </span>
              </div>
              <div className="mobile-add-row">
                <span id={quantityId} className="visually-hidden">
                  Quantity for {product.name}
                </span>
                <QuantityInput
                  value={quantity}
                  max={product.stock}
                  labelledBy={quantityId}
                  onChange={(nextQuantity) => updateQuantity(product.productId, nextQuantity)}
                />
                <button
                  type="button"
                  className="sale-primary-small"
                  disabled={product.stock === 0}
                  onClick={() => onAddProduct(product, quantity)}
                >
                  Add
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="sales-empty-products">
          <h3>No products found</h3>
          <p>Try another product name or product ID.</p>
        </div>
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

function getSalesProductSearchText(product) {
  return [
    product.productId,
    product.name,
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

export default ProductSelectionTable
