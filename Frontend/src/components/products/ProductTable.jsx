function ProductTable({ products, onEdit, onDelete, isSavingProduct }) {
  return (
    <div className="product-table-wrap">
      <table className="product-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Category</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>#{product.productId}</td>
              <td>{product.category}</td>
              <td>
                <strong>{product.name}</strong>
              </td>
              <td>{product.brand}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>
                <span className={product.stock < 5 ? 'stock-pill low' : 'stock-pill'}>
                  {product.stock}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="ghost-action"
                    onClick={() => onEdit(product)}
                    disabled={isSavingProduct}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger-action"
                    onClick={() => onDelete(product)}
                    disabled={isSavingProduct}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default ProductTable
