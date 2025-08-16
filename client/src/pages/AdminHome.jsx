import React, { useEffect, useState } from "react";
import { listStudents, deleteStudent, createStudent } from "../lib/api";
import Navbar from "../components/Navbar";

const AdminHome = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    rollNo: "",
    gender: "",
    password: "",
    profilePicUrl: ""
  });

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset";

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

  const handleImageUpload = async (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        profilePicUrl: data.secure_url
      }));

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.profilePicUrl) {
      alert('Please upload a profile picture');
      return;
    }

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
      alert('Student created successfully!');
    } catch (err) {
      console.error("Error creating student", err);
      alert('Error creating student. Please try again.');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      profilePicUrl: ""
    }));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Admin - Students</h1>

        <div style={{ marginBottom: "20px" }}>
          <button 
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px"
            }}
          >
            Create Student
          </button>
          <a 
            href="admin/rooms" 
            style={{ 
              color: "#007bff", 
              textDecoration: "none",
              padding: "10px 20px",
              border: "1px solid #007bff",
              borderRadius: "4px"
            }}
          >
            Manage Rooms
          </a>
        </div>

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <table border="1" cellPadding="10" style={{ marginTop: "10px", width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
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
                  <td colSpan="6" style={{ textAlign: "center" }}>No students found</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.fullName}</td>
                    <td>{student.rollNo}</td>
                    <td style={{ textTransform: "capitalize" }}>{student.gender}</td>
                    <td>{student.room ? student.room.roomNo : "Not allotted"}</td>
                    <td>
                      <img 
                        src={student.profilePicUrl} 
                        alt="Profile" 
                        width="50" 
                        height="50"
                        style={{ 
                          borderRadius: "50%", 
                          objectFit: "cover",
                          border: "2px solid #dee2e6"
                        }}
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDelete(student._id)}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
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
          <div style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: "rgba(0,0,0,0.5)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{ 
              backgroundColor: "white", 
              padding: "20px", 
              borderRadius: "8px", 
              minWidth: "450px",
              maxHeight: "90vh",
              overflowY: "auto"
            }}>
              <h2>Create Student</h2>
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Full Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "10px", 
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px"
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Roll Number:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter roll number"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "10px", 
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px"
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Gender:
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "10px", 
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      backgroundColor: "white"
                    }}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Password:
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "10px", 
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px"
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Profile Picture:
                  </label>
                  
                  {!formData.profilePicUrl ? (
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        style={{ 
                          width: "100%", 
                          padding: "10px", 
                          borderRadius: "4px",
                          border: "2px dashed #ccc",
                          fontSize: "14px",
                          backgroundColor: "#f8f9fa"
                        }}
                        disabled={imageUploading}
                      />
                      {imageUploading && (
                        <div style={{ 
                          textAlign: "center", 
                          marginTop: "10px",
                          color: "#007bff"
                        }}>
                          <p>Uploading image... Please wait</p>
                        </div>
                      )}
                      <small style={{ color: "#6c757d", fontSize: "12px" }}>
                        Supported formats: JPEG, PNG, GIF, WebP (Max size: 5MB)
                      </small>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={formData.profilePicUrl}
                        alt="Profile Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid #28a745",
                          marginBottom: "10px"
                        }}
                      />
                      <div>
                        <button
                          type="button"
                          onClick={removeImage}
                          style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "5px 15px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px"
                          }}
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button 
                    type="submit"
                    disabled={imageUploading || !formData.profilePicUrl}
                    style={{
                      backgroundColor: (imageUploading || !formData.profilePicUrl) ? "#6c757d" : "#28a745",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "4px",
                      cursor: (imageUploading || !formData.profilePicUrl) ? "not-allowed" : "pointer"
                    }}
                  >
                    {imageUploading ? "Uploading..." : "Create Student"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        fullName: "",
                        rollNo: "",
                        gender: "",
                        password: "",
                        profilePicUrl: ""
                      });
                    }}
                    style={{
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHome;