import { useState } from 'react'

const emptyProduct = {
  category: '',
  name: '',
  brand: '',
  price: '',
  stock: '',
}

function ProductForm({ product, onSubmit, onClose }) {
  const [formData, setFormData] = useState(product || emptyProduct)
  const [errors, setErrors] = useState({})
  const isEditing = Boolean(product)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateProduct(formData)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      ...formData,
      category: formData.category.trim(),
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
    })
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="productFormTitle">
        <div className="modal-header">
          <div>
            <span className="modal-kicker">{isEditing ? 'Update catalog item' : 'New catalog item'}</span>
            <h2 id="productFormTitle">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close form">
            x
          </button>
        </div>

        <form className="product-form" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Category"
            name="category"
            value={formData.category}
            error={errors.category}
            maxLength={100}
            onChange={handleChange}
            placeholder="Electronics"
          />
          <FormField
            label="Name"
            name="name"
            value={formData.name}
            error={errors.name}
            maxLength={150}
            onChange={handleChange}
            placeholder="Laptop"
          />
          <FormField
            label="Brand"
            name="brand"
            value={formData.brand}
            error={errors.brand}
            maxLength={100}
            onChange={handleChange}
            placeholder="Dell"
          />
          <div className="form-row">
            <FormField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              error={errors.price}
              min="0"
              step="0.01"
              onChange={handleChange}
              placeholder="75000"
            />
            <FormField
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              error={errors.stock}
              min="0"
              step="1"
              onChange={handleChange}
              placeholder="10"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-action" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-action">
              {isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, name, type = 'text', value, error, onChange, ...inputProps }) {
  return (
    <div className="product-form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}Error` : undefined}
        {...inputProps}
      />
      {error && (
        <span className="field-error" id={`${name}Error`}>
          {error}
        </span>
      )}
    </div>
  )
}

function validateProduct(product) {
  const errors = {}
  const category = product.category.trim()
  const name = product.name.trim()
  const brand = product.brand.trim()
  const price = Number(product.price)
  const stock = Number(product.stock)

  if (!category) {
    errors.category = 'Category is required.'
  } else if (category.length > 100) {
    errors.category = 'Category must be 100 characters or less.'
  }

  if (!name) {
    errors.name = 'Product name is required.'
  } else if (name.length > 150) {
    errors.name = 'Product name must be 150 characters or less.'
  }

  if (!brand) {
    errors.brand = 'Brand is required.'
  } else if (brand.length > 100) {
    errors.brand = 'Brand must be 100 characters or less.'
  }

  if (product.price === '' || Number.isNaN(price)) {
    errors.price = 'Price is required.'
  } else if (price <= 0) {
    errors.price = 'Price must be greater than 0.'
  }

  if (product.stock === '' || Number.isNaN(stock)) {
    errors.stock = 'Stock is required.'
  } else if (stock < 0) {
    errors.stock = 'Stock cannot be negative.'
  }

  return errors
}

export default ProductForm
