import { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students')
  const [students, setStudents] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [roomFilters, setRoomFilters] = useState({
    hostel: '',
    block: '',
    floor: ''
  })

  const [newStudent, setNewStudent] = useState({
    fullName: '',
    rollNo: '',
    gender: '',
    password: '',
    profilePicUrl: ''
  })

  const hostels = ['KMS', 'BF', 'CVR', 'VS', 'SD', 'GDB', 'MV', 'MSS', 'DBA', 'HB']
  const blocks = ['A', 'B', 'C']

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents()
    } else if (activeTab === 'rooms') {
      fetchRooms()
    }
  }, [activeTab])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.listStudents()
      setStudents(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch students')
    }
    setLoading(false)
  }

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.listRooms(roomFilters)
      setRooms(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch rooms')
    }
    setLoading(false)
  }

  const handleCreateStudent = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.createStudent(newStudent)
      toast.success('Student created successfully')
      setShowCreateForm(false)
      setNewStudent({
        fullName: '',
        rollNo: '',
        gender: '',
        password: '',
        profilePicUrl: ''
      })
      fetchStudents()
    } catch (error) {
      const message = error.response?.data?.data || 'Failed to create student'
      toast.error(message)
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    try {
      await adminAPI.deleteStudent(studentId)
      toast.success('Student deleted successfully')
      fetchStudents()
    } catch (error) {
      toast.error('Failed to delete student')
    }
  }

  const handleRoomFilterChange = (field, value) => {
    setRoomFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearFilters = () => {
    setRoomFilters({
      hostel: '',
      block: '',
      floor: ''
    })
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rooms'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rooms
          </button>
        </nav>
      </div>

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              {showCreateForm ? 'Cancel' : 'Add Student'}
            </button>
          </div>

          {/* Create Student Form */}
          {showCreateForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-medium mb-4">Create New Student</h3>
              <form onSubmit={handleCreateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newStudent.fullName}
                  onChange={(e) => setNewStudent(prev => ({...prev, fullName: e.target.value}))}
                  className="border rounded-md px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Roll Number"
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent(prev => ({...prev, rollNo: e.target.value}))}
                  className="border rounded-md px-3 py-2"
                  required
                />
                <select
                  value={newStudent.gender}
                  onChange={(e) => setNewStudent(prev => ({...prev, gender: e.target.value}))}
                  className="border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input
                  type="password"
                  placeholder="Password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent(prev => ({...prev, password: e.target.value}))}
                  className="border rounded-md px-3 py-2"
                  required
                />
                <input
                  type="url"
                  placeholder="Profile Picture URL"
                  value={newStudent.profilePicUrl}
                  onChange={(e) => setNewStudent(prev => ({...prev, profilePicUrl: e.target.value}))}
                  className="border rounded-md px-3 py-2 md:col-span-2"
                  required
                />
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Create Student
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Students List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {students.map((student) => (
                  <li key={student._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {student.profilePicUrl && (
                          <img 
                            src={student.profilePicUrl} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover mr-4"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.fullName}</p>
                          <p className="text-sm text-gray-500">Roll: {student.rollNo}</p>
                          <p className="text-sm text-gray-500">Email: {student.email}</p>
                          {student.room && (
                            <p className="text-sm text-blue-600">
                              Room: {student.room.hostel}-{student.room.block}-{student.room.floor}-{student.room.roomNo}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {students.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No students found
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Rooms Management</h2>
          </div>

          {/* Room Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={roomFilters.hostel}
                onChange={(e) => handleRoomFilterChange('hostel', e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="">All Hostels</option>
                {hostels.map(hostel => (
                  <option key={hostel} value={hostel}>{hostel}</option>
                ))}
              </select>
              <select
                value={roomFilters.block}
                onChange={(e) => handleRoomFilterChange('block', e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="">All Blocks</option>
                {blocks.map(block => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Floor"
                value={roomFilters.floor}
                onChange={(e) => handleRoomFilterChange('floor', e.target.value)}
                className="border rounded-md px-3 py-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={fetchRooms}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex-1"
                >
                  Filter
                </button>
                <button
                  onClick={() => {
                    clearFilters()
                    fetchRooms()
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Rooms List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div key={room._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">
                      {room.hostel}-{room.block}-{room.floor}-{room.roomNo}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      room.occupants.length >= room.capacity 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {room.occupants.length}/{room.capacity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Gender: {room.gender}</p>
                  
                  {room.occupants.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Occupants:</p>
                      {room.occupants.map((occupant) => (
                        <p key={occupant._id} className="text-sm text-gray-600">
                          {occupant.fullName} ({occupant.rollNo})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {rooms.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No rooms found
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard