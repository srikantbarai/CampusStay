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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading student information...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Could not load student information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          gap: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>
          Student Dashboard - Room Allotment
        </h1>

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
            display: "inline-block",
          }}
        >
          Apply for Room Change
        </Link>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            alignItems: "stretch",
            width: "100%",
            maxWidth: "1100px",
          }}
        >
          <div
            style={{
              flex: 1,
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              minWidth: "300px",
            }}
          >
            <h2 style={{ marginTop: "0", color: "#343a40" }}>
              Personal Information
            </h2>
            <div style={{ display: "grid", rowGap: "8px" }}>
              <div>
                <strong>Name:</strong> {student.fullName}
              </div>
              <div>
                <strong>Roll No:</strong> {student.rollNo}
              </div>
              <div>
                <strong>Gender:</strong>{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {student.gender}
                </span>
              </div>
              {student.email && (
                <div>
                  <strong>Email:</strong> {student.email}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              minWidth: "300px",
            }}
          >
            <h2 style={{ marginTop: "0", color: "#343a40" }}>
              Room Allotment Status
            </h2>

            {student.room ? (
              <>
                <div
                  style={{
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "15px",
                    borderRadius: "4px",
                    border: "1px solid #c3e6cb",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  <strong>✓ Room Allotted Successfully</strong>
                </div>

                <div style={{ display: "grid", rowGap: "10px" }}>
                  <div>
                    <strong>Hostel:</strong> {student.room.hostel}
                  </div>
                  <div>
                    <strong>Block:</strong> {student.room.block}
                  </div>
                  <div>
                    <strong>Floor:</strong> {student.room.floor}
                  </div>
                  <div>
                    <strong>Room Number:</strong>{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {student.room.roomNo}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "15px",
                  borderRadius: "4px",
                  border: "1px solid #f5c6cb",
                  textAlign: "center",
                }}
              >
                <strong>⚠ No Room Allotted Yet</strong>
                <p style={{ margin: "10px 0 0 0", fontSize: "14px" }}>
                  Please contact the administrator or apply for room allotment.
                </p>
              </div>
            )}
          </div>
        </div>

        <p style={{ color: "#6c757d", fontSize: "14px", textAlign: "center" }}>
          Need help? Contact the hostel administration for assistance with room
          allotment.
        </p>
      </div>
    </div>
  );
};

export default StudentHome;
