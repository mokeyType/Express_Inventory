import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from '../components/auth/Loader'
import { useAuth } from '../context/useAuth'

function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loader message="Checking your secure session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
