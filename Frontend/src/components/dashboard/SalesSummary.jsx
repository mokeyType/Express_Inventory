const filterLabels = {
  currentMonth: 'Current month sales',
  saleId: 'Sale ID filter',
  allSales: 'All sales',
  betweenDates: 'Sales between dates',
  particularDate: 'Sales of particular date',
  product: 'Sales of particular product',
}

function SalesSummary({ filters, salesCount }) {
  return (
    <section className="dashboard-summary">
      <div>
        <span>Active view</span>
        <strong>{filterLabels[filters.mode]}</strong>
      </div>
      <div>
        <span>Matching sales</span>
        <strong>{salesCount}</strong>
      </div>
      <div>
        <span>Backend target</span>
        <strong>{getEndpointLabel(filters.mode)}</strong>
      </div>
    </section>
  )
}

function getEndpointLabel(mode) {
  if (mode === 'saleId') return '/sales/{id}'
  if (mode === 'allSales') return '/sales/paginated'
  if (mode === 'betweenDates') return '/sales/between'
  if (mode === 'particularDate') return '/sales/date'
  if (mode === 'product') return '/sales/product/{id}'
  return '/sales/between'
}

export default SalesSummary
