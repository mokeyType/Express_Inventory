function QuantityInput({ value, max, onChange, labelledBy, disabled }) {
  const handleChange = (event) => {
    const nextValue = Number(event.target.value)

    if (Number.isNaN(nextValue)) {
      onChange(1)
      return
    }

    onChange(Math.min(Math.max(nextValue, 1), max))
  }

  return (
    <input
      className="quantity-input"
      type="number"
      min="1"
      max={max}
      value={value}
      aria-labelledby={labelledBy}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}

export default QuantityInput
