import { useState } from 'react'

function ProductFilters({ filters, categories, onChange, onReset }) {
  const [isOpen, setIsOpen] = useState(true)

  const updateFilter = (name, value) => {
    onChange({ ...filters, [name]: value })
  }

  return (
    <section className="filter-panel">
      <button
        type="button"
        className="filter-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span>Filters</span>
        <span>{isOpen ? 'Hide' : 'Show'}</span>
      </button>

      {isOpen && (
        <div className="filter-content">
          <label className="checkbox-filter">
            <input
              type="checkbox"
              checked={filters.lowStockOnly}
              onChange={(event) => updateFilter('lowStockOnly', event.target.checked)}
            />
            Stock less than minimum
          </label>

          <div className="filter-field">
            <label htmlFor="minimumStock">Minimum stock</label>
            <input
              id="minimumStock"
              type="number"
              min="0"
              value={filters.minimumStock}
              onChange={(event) => updateFilter('minimumStock', event.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="categoryFilter">Category</label>
            <select
              id="categoryFilter"
              value={filters.category}
              onChange={(event) => updateFilter('category', event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="productIdFilter">Product ID</label>
            <input
              id="productIdFilter"
              type="text"
              inputMode="numeric"
              value={filters.productId}
              onChange={(event) => updateFilter('productId', event.target.value)}
              placeholder="1001"
            />
          </div>

          <button type="button" className="secondary-action reset-action" onClick={onReset}>
            Reset
          </button>
        </div>
      )}
    </section>
  )
}

export default ProductFilters
