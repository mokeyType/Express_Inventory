function SalesDetailsModal({ sale, onClose }) {
  if (!sale) {
    return null
  }

  return (
    <div className="dashboard-modal-backdrop" role="presentation">
      <div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="saleDetailsTitle">
        <div className="dashboard-modal-header">
          <h2 id="saleDetailsTitle">Sale #{sale.saleId}</h2>
          <button type="button" onClick={onClose} aria-label="Close sale details">
            x
          </button>
        </div>
        <div className="sale-items-grid">
          {sale.items.map((item) => (
            <article className="sale-item-detail" key={item.id}>
              <strong>{item.product.name}</strong>
              <span>{item.product.category}</span>
              <span>Qty {item.quantity}</span>
              <span>{item.amount}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SalesDetailsModal
