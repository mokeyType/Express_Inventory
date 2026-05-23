function FeatureCard({ icon, title, description, active = false, onSelect }) {
  return (
    <button
      type="button"
      className={active ? 'feature-card active' : 'feature-card'}
      onClick={onSelect}
    >
      <div className="feature-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </button>
  )
}

export default FeatureCard
