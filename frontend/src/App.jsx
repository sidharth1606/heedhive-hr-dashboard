import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Employees from './pages/Employees'
import Analytics from './pages/Analytics'

function PrivateRoute({ children }) {
  return localStorage.getItem('hh_token') ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="employees"  element={<Employees />} />
          <Route path="analytics"  element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
