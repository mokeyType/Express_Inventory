import QuantityInput from './QuantityInput'

function SelectedProducts({ items, onQuantityChange, onRemoveProduct, isCreatingSale }) {
  return (
    <section className="sale-card">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Current sale</span>
          <h2>Selected products</h2>
        </div>
        <p>Review quantities and subtotals before creating the sale.</p>
      </div>

      {items.length === 0 ? (
        <div className="selected-empty">
          <h3>No products selected</h3>
          <p>Add products from the table above to start building the sale.</p>
        </div>
      ) : (
        <div className="sales-table-wrap">
          <table className="sales-table selected-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const quantityId = `selected-quantity-${item.productId}`

                return (
                  <tr key={item.productId}>
                    <td>
                      <strong>{item.name}</strong>
                      <span className="selected-product-detail">
                        #{item.productId} • {item.brand}
                      </span>
                    </td>
                    <td>
                      <span id={quantityId} className="visually-hidden">
                        Selected quantity for {item.name}
                      </span>
                      <QuantityInput
                        value={item.quantity}
                        max={item.stock}
                        labelledBy={quantityId}
                        onChange={(quantity) => onQuantityChange(item.productId, quantity)}
                        disabled={isCreatingSale}
                      />
                    </td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="sale-danger-small"
                        onClick={() => onRemoveProduct(item.productId)}
                        disabled={isCreatingSale}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default SelectedProducts
