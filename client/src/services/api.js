import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  getMe: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
}

// Admin API
export const adminAPI = {
  createStudent: (studentData) => api.post('/api/admin/students', studentData),
  listStudents: () => api.get('/api/admin/students'),
  deleteStudent: (studentId) => api.delete(`/api/admin/students/${studentId}`),
  listRooms: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.hostel) params.append('hostel', filters.hostel)
    if (filters.block) params.append('block', filters.block)
    if (filters.floor) params.append('floor', filters.floor)
    return api.get(`/api/admin/rooms?${params.toString()}`)
  }
}

// Student API
export const studentAPI = {
  getStudentAllotment: () => api.get('/api/student/allotment'),
  getAvailableRooms: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.hostel) params.append('hostel', filters.hostel)
    if (filters.block) params.append('block', filters.block)
    if (filters.floor) params.append('floor', filters.floor)
    return api.get(`/api/student/rooms?${params.toString()}`)
  },
  allotRoom: (roomId) => api.post(`/api/student/rooms/${roomId}`)
}

export default api