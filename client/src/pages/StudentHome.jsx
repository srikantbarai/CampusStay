// StudentAllotmentPage.jsx
import React, { useEffect, useState } from "react";
import { getStudentAllotment } from "../lib/api"; // your API functions
import { Link } from "react-router-dom";

export default function StudentAllotmentPage() {
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

  if (loading) return <p>Loading...</p>;

  if (!student) return <p>Could not load student info.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Room Allotment</h2>
      <p><strong>Name:</strong> {student.fullName}</p>
      <p><strong>Roll No:</strong> {student.rollNo}</p>
      <p><strong>Gender:</strong> {student.gender}</p>
      <p><strong>Email:</strong> {student.email}</p>

      {student.room ? (
        <>
          <p><strong>Hostel:</strong> {student.room.hostel}</p>
          <p><strong>Block:</strong> {student.room.block}</p>
          <p><strong>Floor:</strong> {student.room.floor}</p>
          <p><strong>Room No:</strong> {student.room.roomNo}</p>
        </>
      ) : (
        <p style={{ color: "red" }}>No allotment yet</p>
      )}

      <div style={{ marginTop: "1rem" }}>
        <Link to="/student/apply">
          <button>Apply for Room Change</button>
        </Link>
      </div>
    </div>
  );
}
