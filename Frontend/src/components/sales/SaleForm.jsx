function SaleForm({ saleDate, onSaleDateChange }) {
  return (
    <section className="sale-card sale-form-card">
      <div>
        <span className="section-kicker">Sale details</span>
        <h2>Billing setup</h2>
        <p>The backend create-sale API expects a sale date and a list of product quantities.</p>
      </div>

      <div className="sale-form-grid">
        <div className="sale-field">
          <label htmlFor="saleDate">Sale date</label>
          <input
            id="saleDate"
            type="date"
            value={saleDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(event) => onSaleDateChange(event.target.value)}
          />
        </div>
        <div className="sale-note">
          <strong>Future API payload</strong>
          <span>{'{ saleDate, items: [{ productId, quantity }] }'}</span>
        </div>
      </div>
    </section>
  )
}

export default SaleForm
