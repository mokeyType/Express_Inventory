function LowStockCard({ minimumStock, products, onMinimumStockChange }) {
  return (
    <section className="dashboard-card low-stock-card">
      <div className="dashboard-section-heading">
        <div>
          <span className="dashboard-section-kicker">Inventory risk</span>
          <h2>Minimum stock alert</h2>
        </div>
        <div className="minimum-stock-field">
          <label htmlFor="minimumStock">Min stock</label>
          <input
            id="minimumStock"
            type="number"
            min="0"
            value={minimumStock}
            onChange={(event) => onMinimumStockChange(event.target.value)}
          />
        </div>
      </div>

      <div className="low-stock-list">
        {products.length === 0 ? (
          <div className="low-stock-empty">No products are below the selected stock threshold.</div>
        ) : (
          products.map((product) => (
            <article className="low-stock-item" key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <span>
                  {product.category} • {product.brand}
                </span>
              </div>
              <span className="stock-alert-pill">{product.stock}</span>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default LowStockCard
