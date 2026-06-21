import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Landing from '../pages/Landing'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Products from '../pages/Products'
import Sales from '../pages/Sales'
import AboutUs from '../pages/AboutUs'
import UserSettings from '../pages/UserSettings'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedShell />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/settings" element={<UserSettings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AuthenticatedShell() {
  return (
    <>
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
    </>
  )
}

export default AppRoutes
