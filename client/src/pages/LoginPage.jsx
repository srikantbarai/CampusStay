import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Building2, Users } from "lucide-react";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginMutation, isPending, error } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "1000px",
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "600px"
      }}>
        
        <div style={{ padding: "40px" }}>
          {error && (
            <div style={{
              color: "#dc3545",
              fontSize: "14px",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "4px"
            }}>
              {error?.response?.data?.message || "Login failed. Please try again."}
            </div>
          )}
          
          <div style={{ marginBottom: "30px", textAlign: "center" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "15px"
            }}>
              <Building2 style={{ width: "32px", height: "32px", color: "#007bff", marginRight: "10px" }} />
              <h2 style={{ 
                fontSize: "28px", 
                fontWeight: "bold", 
                color: "#343a40",
                margin: 0
              }}>
                HostelMS
              </h2>
            </div>
            <p style={{ 
              fontSize: "14px", 
              color: "#6c757d", 
              marginTop: "5px",
              margin: 0
            }}>
              Hostel Management System
            </p>
            <h1 style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              marginTop: "20px", 
              color: "#495057",
              margin: "20px 0 0 0"
            }}>
              Welcome back, please sign in
            </h1>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                color: "#495057",
                fontWeight: "bold",
                marginBottom: "8px",
                gap: "8px"
              }}>
                <Mail style={{ width: "16px", height: "16px" }} />
                Email Address
              </label>
              <input
                type="email"
                placeholder="student@example.com or admin@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#007bff"}
                onBlur={(e) => e.target.style.borderColor = "#ccc"}
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                color: "#495057",
                fontWeight: "bold",
                marginBottom: "8px",
                gap: "8px"
              }}>
                <Lock style={{ width: "16px", height: "16px" }} />
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    paddingRight: "45px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#007bff"}
                  onBlur={(e) => e.target.style.borderColor = "#ccc"}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#6c757d",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center"
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseOver={(e) => e.target.style.color = "#495057"}
                  onMouseOut={(e) => e.target.style.color = "#6c757d"}
                >
                  {showPassword ? 
                    <EyeOff style={{ width: "16px", height: "16px" }} /> : 
                    <Eye style={{ width: "16px", height: "16px" }} />
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              style={{
                width: "100%",
                backgroundColor: isPending ? "#6c757d" : "#007bff",
                color: "white",
                fontWeight: "500",
                padding: "12px",
                border: "none",
                borderRadius: "4px",
                cursor: isPending ? "not-allowed" : "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s ease"
              }}
              onMouseOver={(e) => {
                if (!isPending) e.target.style.backgroundColor = "#0056b3";
              }}
              onMouseOut={(e) => {
                if (!isPending) e.target.style.backgroundColor = "#007bff";
              }}
            >
              {isPending ? (
                <>
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid white",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginRight: "8px"
                  }}></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
            <p style={{ 
              fontSize: "14px", 
              color: "#6c757d",
              margin: 0
            }}>
              Need help? Contact your hostel administrator
            </p>
          </div>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
          padding: "40px",
          textAlign: "center"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "25px"
          }}>
            <Building2 style={{ width: "64px", height: "64px", color: "#007bff" }} />
          </div>
          
          <h3 style={{ 
            fontWeight: "bold", 
            color: "#1a365d", 
            fontSize: "20px", 
            marginBottom: "20px",
            margin: "0 0 20px 0"
          }}>
            Hostel Management System
          </h3>
          
          <div style={{ marginBottom: "25px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: "#495057",
              marginBottom: "15px",
              justifyContent: "center"
            }}>
              <Users style={{ width: "20px", height: "20px", color: "#007bff", marginRight: "12px" }} />
              <span>Student & Admin Access</span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: "#495057",
              justifyContent: "center"
            }}>
              <Building2 style={{ width: "20px", height: "20px", color: "#007bff", marginRight: "12px" }} />
              <span>Room Allocation & Management</span>
            </div>
          </div>
          
          <p style={{ 
            color: "#6c757d", 
            fontSize: "14px", 
            lineHeight: "1.6",
            margin: 0,
            maxWidth: "280px"
          }}>
            Streamline hostel operations with our comprehensive management system. 
            Students can view room allotments and request changes, while administrators 
            can efficiently manage student records and room assignments.
          </p>
        </div>

      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .login-container {
              grid-template-columns: 1fr !important;
              max-width: 400px !important;
            }
            .info-panel {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;