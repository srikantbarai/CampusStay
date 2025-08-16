import React, { useState } from "react";
import { logout } from "../lib/api";
import useGetMyInfo from "../hooks/useGetMyInfo";

const Navbar = () => {
  const { myInfo, isLoading } = useGetMyInfo();
  const [imageError, setImageError] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Error logging out:", err);
      alert("Error logging out");
    }
  };

  const handleImageError = (e) => {
    console.log("Image failed to load:", e.target.src);
    setImageError(true);
    e.target.src = "/default-avatar.png"; // Fallback image
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const optimizeCloudinaryUrl = (url) => {
    if (!url) return "/default-avatar.png";
    
    if (url.includes('cloudinary.com')) {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      
      if (uploadIndex !== -1) {
        const transformations = 'w_80,h_80,c_fill,f_auto,q_auto';
        urlParts.splice(uploadIndex + 1, 0, transformations);
        return urlParts.join('/');
      }
    }
    
    return url;
  };

  const getProfileImageUrl = () => {
    if (!myInfo?.profilePicUrl) {
      return "/default-avatar.png";
    }
    
    return optimizeCloudinaryUrl(myInfo.profilePicUrl);
  };

  if (isLoading) {
    return (
      <nav style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "1rem", 
        borderBottom: "1px solid #dee2e6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ color: "#6c757d" }}>Loading...</div>
      </nav>
    );
  }

  const isAdmin = myInfo && (myInfo.email && !myInfo.rollNo) || myInfo.role === 'admin';

  return (
    <nav style={{ 
      backgroundColor: "#f8f9fa", 
      padding: "1rem", 
      borderBottom: "1px solid #dee2e6",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h3 style={{ margin: 0, color: "#343a40" }}>Hostel Management System</h3>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {myInfo && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {!isAdmin && (
                <div style={{ position: "relative" }}>
                  <img 
                    src={getProfileImageUrl()} 
                    alt="Profile" 
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: imageError ? "2px solid #dc3545" : "2px solid #28a745",
                      transition: "border-color 0.3s ease",
                      backgroundColor: "#f8f9fa"
                    }}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                  {!imageError && (
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease"
                    }}>
                      <div style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid #fff",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}></div>
                    </div>
                  )}
                </div>
              )}
              
              {isAdmin && (
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#007bff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "16px",
                  border: "2px solid #0056b3"
                }}>
                  A
                </div>
              )}
              
              <div style={{ textAlign: "right" }}>
                <div style={{ 
                  fontWeight: "bold", 
                  fontSize: "0.9rem",
                  color: "#343a40"
                }}>
                  {myInfo.fullName || "User"} {isAdmin && "(Admin)"}
                </div>
                <div style={{ 
                  fontSize: "0.8rem", 
                  color: "#6c757d"
                }}>
                  {isAdmin ? (myInfo.email || "Administrator") : (myInfo.rollNo || myInfo.email || "No ID")}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "background-color 0.3s ease"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
            >
              Logout
            </button>
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;