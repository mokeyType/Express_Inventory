import { Fragment, useState } from 'react'

function SalesTable({ sales, currentPage, totalPages, onPageChange, onLoadSaleDetails }) {
  const [expandedSaleId, setExpandedSaleId] = useState(null)
  const [saleDetailsById, setSaleDetailsById] = useState({})
  const [loadingSaleId, setLoadingSaleId] = useState(null)
  const [detailsError, setDetailsError] = useState('')

  const handleToggleSale = async (sale) => {
    if (expandedSaleId === sale.saleId) {
      setExpandedSaleId(null)
      return
    }

    setExpandedSaleId(sale.saleId)
    setDetailsError('')

    if (saleDetailsById[sale.saleId] || !onLoadSaleDetails) {
      return
    }

    try {
      setLoadingSaleId(sale.saleId)
      const detailedSale = await onLoadSaleDetails(sale.saleId)
      setSaleDetailsById((currentDetails) => ({
        ...currentDetails,
        [sale.saleId]: detailedSale,
      }))
    } catch (error) {
      setDetailsError(error.message)
    } finally {
      setLoadingSaleId(null)
    }
  }

  return (
    <section className="dashboard-card sales-table-card">
      <div className="dashboard-section-heading">
        <div>
          <span className="dashboard-section-kicker">Sales records</span>
          <h2>Filtered sales</h2>
        </div>
        <p>Click a sale row to load product-level details.</p>
      </div>

      <div className="dashboard-table-wrap">
        <table className="dashboard-sales-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Sale Date</th>
              <th>Time</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Products Included</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => {
              const isExpanded = expandedSaleId === sale.saleId
              const detailedSale = saleDetailsById[sale.saleId]
              const saleForDisplay = detailedSale || sale
              const saleItems = saleForDisplay.items || []

              return (
                <Fragment key={sale.saleId}>
                  <tr className="sale-row" onClick={() => handleToggleSale(sale)}>
                    <td>#{sale.saleId}</td>
                    <td>{formatDate(sale.saleDate)}</td>
                    <td>{formatTime(sale.saleTime)}</td>
                    <td>{sale.itemCount ?? saleItems.length}</td>
                    <td>{formatCurrency(getSaleTotal(sale))}</td>
                    <td>{getProductsLabel(saleItems)}</td>
                    <td>{sale.owner}</td>
                  </tr>
                  {isExpanded && (
                    <tr className="sale-details-row">
                      <td colSpan="7">
                        {loadingSaleId === sale.saleId ? (
                          <div className="sale-details-loading">Loading sale items...</div>
                        ) : (
                          <div className="sale-items-grid">
                            {detailsError && (
                              <div className="sale-details-error">{detailsError}</div>
                            )}
                            {saleItems.map((item) => (
                              <article className="sale-item-detail" key={item.id}>
                                <div>
                                  <strong>{item.product.name}</strong>
                                  <span>
                                    {item.product.category} • {item.product.brand}
                                  </span>
                                </div>
                                <div>
                                  <span>Qty</span>
                                  <strong>{item.quantity}</strong>
                                </div>
                                <div>
                                  <span>Price</span>
                                  <strong>{formatCurrency(item.product.price)}</strong>
                                </div>
                                <div>
                                  <span>Amount</span>
                                  <strong>{formatCurrency(item.amount)}</strong>
                                </div>
                              </article>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {sales.length === 0 && (
        <div className="dashboard-empty">
          <h3>No sales found</h3>
          <p>Try changing the filter type or resetting the dashboard filters.</p>
        </div>
      )}

      <div className="dashboard-pagination">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  )
}

function getSaleTotal(sale) {
  return Number(
    sale.totalAmount ||
      (sale.items || []).reduce((sum, item) => sum + Number(item.amount || 0), 0),
  )
}

function getProductsLabel(items) {
  if (!items.length) {
    return 'Click row to load products'
  }

  return items.map((item) => item.product.name).join(', ')
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateValue}T00:00:00`))
}

function formatTime(timeValue) {
  if (!timeValue) {
    return 'Not recorded'
  }

  const [hours = '00', minutes = '00'] = String(timeValue).split(':')
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(`2000-01-01T${hours}:${minutes}:00`))
}

export default SalesTable
