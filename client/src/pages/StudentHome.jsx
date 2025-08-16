import React, { useEffect, useState } from "react";
import { getStudentAllotment } from "../lib/api"; 
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const StudentHome = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllotment() {
      try {
        const res = await getStudentAllotment();
        setStudent(res.data);
      } catch (err) {
        console.error("Error fetching allotment:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllotment();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <p>Loading student information...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <p>Could not load student information.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Student Dashboard - Room Allotment</h1>

        <div style={{ marginBottom: "20px" }}>
          <Link 
            to="/student/apply"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "inline-block"
            }}
          >
            Apply for Room Change
          </Link>
        </div>

        {/* Student Information Card */}
        <div style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #dee2e6",
          marginBottom: "20px"
        }}>
          <h2 style={{ marginTop: "0", color: "#343a40" }}>Personal Information</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "bold", width: "150px" }}>Name:</td>
                <td style={{ padding: "8px 0" }}>{student.fullName}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "bold" }}>Roll No:</td>
                <td style={{ padding: "8px 0" }}>{student.rollNo}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "bold" }}>Gender:</td>
                <td style={{ padding: "8px 0", textTransform: "capitalize" }}>{student.gender}</td>
              </tr>
              {student.email && (
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "bold" }}>Email:</td>
                  <td style={{ padding: "8px 0" }}>{student.email}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #dee2e6",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ marginTop: "0", color: "#343a40" }}>Room Allotment Status</h2>
          
          {student.room ? (
            <div>
              <div style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: "15px",
                borderRadius: "4px",
                border: "1px solid #c3e6cb",
                marginBottom: "20px"
              }}>
                <strong>✓ Room Allotted Successfully</strong>
              </div>
              
              <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ textAlign: "left" }}>Property</th>
                    <th style={{ textAlign: "left" }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Hostel</td>
                    <td>{student.room.hostel}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Block</td>
                    <td>{student.room.block}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Floor</td>
                    <td>{student.room.floor}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Room Number</td>
                    <td><strong>{student.room.roomNo}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "15px",
                borderRadius: "4px",
                border: "1px solid #f5c6cb",
                textAlign: "center"
              }}>
                <strong>⚠ No Room Allotted Yet</strong>
                <p style={{ margin: "10px 0 0 0", fontSize: "14px" }}>
                  Please contact the administrator or apply for room allotment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Actions */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ color: "#6c757d", fontSize: "14px" }}>
            Need help? Contact the hostel administration for assistance with room allotment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;