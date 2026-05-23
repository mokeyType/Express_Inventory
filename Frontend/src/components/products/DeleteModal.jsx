function DeleteModal({ product, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="delete-modal" role="dialog" aria-modal="true" aria-labelledby="deleteProductTitle">
        <span className="modal-kicker">Confirm deletion</span>
        <h2 id="deleteProductTitle">Delete {product.name}?</h2>
        <p>
          This will remove product #{product.productId} from the current product list. You can connect this action to the backend delete API later.
        </p>
        <div className="modal-actions">
          <button type="button" className="secondary-action" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="danger-solid-action" onClick={onConfirm}>
            Delete Product
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
