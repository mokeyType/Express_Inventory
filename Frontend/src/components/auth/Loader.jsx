import './Loader.css'

function Loader({ message = 'Loading...' }) {
  return (
    <div className="auth-loader" role="status" aria-live="polite">
      <div className="auth-spinner" />
      <p>{message}</p>
    </div>
  )
}

export default Loader
