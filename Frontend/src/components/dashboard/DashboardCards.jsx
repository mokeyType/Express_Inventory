function DashboardCards({ analytics }) {
  return (
    <section className="dashboard-cards" aria-label="Sales analytics">
      <MetricCard label="Total Sales" value={analytics.totalSales} />
      <MetricCard label="Total Amount" value={formatCurrency(analytics.totalAmount)} />
      <MetricCard label="Items Sold" value={analytics.totalQuantity} />
      <MetricCard label="Average Sale" value={formatCurrency(analytics.averageSale)} />
    </section>
  )
}

function MetricCard({ label, value }) {
  return (
    <article className="dashboard-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default DashboardCards
