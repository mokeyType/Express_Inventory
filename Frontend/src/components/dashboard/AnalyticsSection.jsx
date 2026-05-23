function AnalyticsSection({ analytics, sales }) {
  const dailyRevenue = buildDailyRevenue(sales)
  const maxRevenue = Math.max(...dailyRevenue.map((day) => day.revenue), 0)
  const topDay = dailyRevenue.reduce(
    (bestDay, day) => (day.revenue > bestDay.revenue ? day : bestDay),
    { label: 'No sales yet', revenue: 0, salesCount: 0 },
  )
  const averageDailyRevenue = dailyRevenue.length
    ? analytics.totalAmount / dailyRevenue.length
    : 0

  return (
    <section className="dashboard-card analytics-card">
      <div className="dashboard-section-heading">
        <div>
          <span className="dashboard-section-kicker">Sales analytics</span>
          <h2>Daily revenue</h2>
        </div>
        <p>Revenue grouped by sale date for the current filtered results.</p>
      </div>

      {dailyRevenue.length === 0 ? (
        <div className="analytics-empty">
          <h3>No revenue to chart</h3>
          <p>Create sales or change filters to see revenue activity.</p>
        </div>
      ) : (
        <div className="revenue-chart" aria-label="Daily revenue chart">
          {dailyRevenue.map((day) => (
            <div className="revenue-bar-item" key={day.date}>
              <div className="revenue-bar-track">
                <span
                  className="revenue-bar-fill"
                  style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 8)}%` }}
                  title={`${day.label}: ${formatCurrency(day.revenue)}`}
                />
              </div>
              <strong>{formatShortCurrency(day.revenue)}</strong>
              <span>{day.shortLabel}</span>
            </div>
          ))}
        </div>
      )}

      <div className="analytics-notes">
        <div>
          <span>Top sales day</span>
          <strong>{topDay.label}</strong>
        </div>
        <div>
          <span>Top day revenue</span>
          <strong>{formatCurrency(topDay.revenue)}</strong>
        </div>
        <div>
          <span>Active sales days</span>
          <strong>{dailyRevenue.length}</strong>
        </div>
        <div>
          <span>Avg per active day</span>
          <strong>{formatCurrency(averageDailyRevenue)}</strong>
        </div>
      </div>
    </section>
  )
}

function buildDailyRevenue(sales) {
  const revenueByDate = new Map()

  sales.forEach((sale) => {
    if (!sale.saleDate) {
      return
    }

    const current = revenueByDate.get(sale.saleDate) || {
      date: sale.saleDate,
      revenue: 0,
      salesCount: 0,
    }
    current.revenue += getSaleTotal(sale)
    current.salesCount += 1
    revenueByDate.set(sale.saleDate, current)
  })

  return [...revenueByDate.values()]
    .sort((firstDay, secondDay) => firstDay.date.localeCompare(secondDay.date))
    .map((day) => ({
      ...day,
      label: formatDate(day.date),
      shortLabel: formatShortDate(day.date),
    }))
}

function getSaleTotal(sale) {
  return Number(
    sale.totalAmount ||
      (sale.items || []).reduce((sum, item) => sum + Number(item.amount || 0), 0),
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatShortCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateValue}T00:00:00`))
}

function formatShortDate(dateValue) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${dateValue}T00:00:00`))
}

export default AnalyticsSection
