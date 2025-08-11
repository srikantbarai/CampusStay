import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Loading from './components/Loading'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  return (
    <Routes>
      <Route path="/login" element={
        user ? (
          <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
        ) : (
          <Login />
        )
      } />
      
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/*" element={
        <ProtectedRoute requiredRole="student">
          <Layout>
            <StudentDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        user ? (
          <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  )
}

export default App