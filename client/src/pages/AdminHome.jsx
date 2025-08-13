import React, { useEffect, useState } from "react";
import { listStudents, deleteStudent, createStudent } from "../lib/api";

const AdminHome = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    rollNo: "",
    gender: "",
    password: "",
    profilePicUrl: ""
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await listStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error fetching students", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createStudent(formData);
      setShowForm(false);
      setFormData({
        fullName: "",
        rollNo: "",
        gender: "",
        password: "",
        profilePicUrl: ""
      });
      fetchStudents();
    } catch (err) {
      console.error("Error creating student", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h1>Admin - Students</h1>

      <button onClick={() => setShowForm(true)}>Create Student</button>
      <a href="admin/rooms" style={{ marginLeft: "10px" }}>Rooms</a>

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Roll No</th>
              <th>Gender</th>
              <th>Room</th>
              <th>Profile Picture</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6">No students found</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id}>
                  <td>{student.fullName}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.gender}</td>
                  <td>{student.room ? student.room.roomNo : "Not allotted"}</td>
                  <td>
                    <img src={student.profilePicUrl} alt="Profile" width="50" />
                  </td>
                  <td>
                    <button onClick={() => handleDelete(student._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <div>
          <h2>Create Student</h2>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <br />
            <input
              type="text"
              placeholder="Roll No"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              required
            />
            <br />
            <input
              type="text"
              placeholder="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <br />
            <input
              type="text"
              placeholder="Profile Pic URL"
              value={formData.profilePicUrl}
              onChange={(e) => setFormData({ ...formData, profilePicUrl: e.target.value })}
              required
            />
            <br />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminHome;