function ProductCard({ product, onEdit, onDelete, isSavingProduct }) {
  return (
    <article className="product-card">
      <div>
        <span className="product-id">#{product.productId}</span>
        <h3>{product.name}</h3>
        <p>{product.brand}</p>
      </div>
      <div className="product-card-meta">
        <span>{product.category}</span>
        <strong>{formatCurrency(product.price)}</strong>
        <span className={product.stock < 5 ? 'stock-pill low' : 'stock-pill'}>
          Stock {product.stock}
        </span>
      </div>
      <div className="table-actions">
        <button type="button" className="ghost-action" onClick={() => onEdit(product)} disabled={isSavingProduct}>
          Edit
        </button>
        <button type="button" className="danger-action" onClick={() => onDelete(product)} disabled={isSavingProduct}>
          Delete
        </button>
      </div>
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

export default ProductCard
