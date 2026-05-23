function SalesSummary({ saleDate, summary, message, canCreate, isCreating, onCreateSale }) {
  return (
    <section className="summary-card">
      <span className="section-kicker">Sale summary</span>
      <h2>Invoice totals</h2>

      <div className="summary-lines">
        <SummaryLine label="Sale date" value={saleDate || 'Not selected'} />
        <SummaryLine label="Total items" value={summary.totalItems} />
        <SummaryLine label="Total quantity" value={summary.totalQuantity} />
        <SummaryLine label="Total amount" value={formatCurrency(summary.totalAmount)} strong />
      </div>

      {message && <div className="sale-message">{message}</div>}

      <button
        type="button"
        className="create-sale-button"
        disabled={!canCreate}
        onClick={onCreateSale}
      >
        {isCreating ? 'Creating Sale...' : 'Create Sale'}
      </button>
    </section>
  )
}

function SummaryLine({ label, value, strong = false }) {
  return (
    <div className={strong ? 'summary-line total' : 'summary-line'}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default SalesSummary
