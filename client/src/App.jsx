import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/LoginPage";
import useGetMyInfo from "./hooks/useGetMyInfo";
import AdminHome from "./pages/AdminHome";
import AdminRooms from "./pages/AdminRooms";
import StudentHome from "./pages/StudentHome";
import StudentApply from "./pages/StudentApply";

function App() {
  const { myInfo, isLoading } = useGetMyInfo();
  const isAuthenticated = Boolean(myInfo);
  const isAdmin = myInfo?.role === "admin";
  const isStudent = myInfo?.role === "student";

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? "/admin" : "/student"} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to={isAdmin ? "/admin" : "/student"} />
          )
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          isAuthenticated && isAdmin ? <AdminHome /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/admin/rooms"
        element={
          isAuthenticated && isAdmin ? <AdminRooms /> : <Navigate to="/login" />
        }
      />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          isAuthenticated && isStudent ? (
            <StudentHome />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/student/apply"
        element={
          isAuthenticated && isStudent ? (
            <StudentApply />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
