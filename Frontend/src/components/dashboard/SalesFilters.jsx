import { useState } from 'react'

function SalesFilters({ filters, productOptions, onChange, onReset }) {
  const [isOpen, setIsOpen] = useState(true)

  const updateField = (name, value) => {
    onChange({ ...filters, [name]: value })
  }

  const updateMode = (mode) => {
    onChange({ ...filters, mode })
  }

  return (
    <section className="dashboard-filter-panel">
      <button
        type="button"
        className="dashboard-filter-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span>Sales filters</span>
        <span>{isOpen ? 'Hide' : 'Show'}</span>
      </button>

      {isOpen && (
        <div className="dashboard-filter-content">
          <div className="dashboard-field">
            <label htmlFor="filterMode">Filter type</label>
            <select
              id="filterMode"
              value={filters.mode}
              onChange={(event) => updateMode(event.target.value)}
            >
              <option value="currentMonth">Current month</option>
              <option value="saleId">Sale ID</option>
              <option value="allSales">All sales paginated</option>
              <option value="betweenDates">Sales between dates</option>
              <option value="particularDate">Particular date</option>
              <option value="product">Particular product</option>
            </select>
          </div>

          {filters.mode === 'saleId' && (
            <div className="dashboard-field">
              <label htmlFor="saleIdFilter">Sale ID</label>
              <input
                id="saleIdFilter"
                type="text"
                inputMode="numeric"
                value={filters.saleId}
                onChange={(event) => updateField('saleId', event.target.value)}
                placeholder="501"
              />
            </div>
          )}

          {filters.mode === 'betweenDates' && (
            <>
              <div className="dashboard-field">
                <label htmlFor="startDate">Start date</label>
                <input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(event) => updateField('startDate', event.target.value)}
                />
              </div>
              <div className="dashboard-field">
                <label htmlFor="endDate">End date</label>
                <input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(event) => updateField('endDate', event.target.value)}
                />
              </div>
            </>
          )}

          {filters.mode === 'particularDate' && (
            <div className="dashboard-field">
              <label htmlFor="particularDate">Sale date</label>
              <input
                id="particularDate"
                type="date"
                value={filters.date}
                onChange={(event) => updateField('date', event.target.value)}
              />
            </div>
          )}

          {filters.mode === 'product' && (
            <div className="dashboard-field">
              <label htmlFor="productFilter">Product</label>
              <select
                id="productFilter"
                value={filters.productId}
                onChange={(event) => updateField('productId', event.target.value)}
              >
                <option value="">Select product</option>
                {productOptions.map((product) => (
                  <option key={product.id} value={product.id}>
                    #{product.id} {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="dashboard-field compact">
            <label htmlFor="pageSize">Page size</label>
            <select
              id="pageSize"
              value={filters.pageSize}
              onChange={(event) => updateField('pageSize', Number(event.target.value))}
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </div>

          <button type="button" className="dashboard-reset-button" onClick={onReset}>
            Reset
          </button>
        </div>
      )}
    </section>
  )
}

export default SalesFilters
