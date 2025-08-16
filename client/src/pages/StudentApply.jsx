import React, { useState } from "react";
import useGetMyInfo from "../hooks/useGetMyInfo";
import { getAvailableRooms, allotRoom } from "../lib/api";
import Navbar from "../components/Navbar";

const StudentApply = () => {
  const { myInfo } = useGetMyInfo();
  const [filters, setFilters] = useState({
    hostel: "",
    block: "",
    floor: "",
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const hostelOptions =
    myInfo?.gender === "female"
      ? ["BF", "KMS", "CVR", "HB"]
      : ["VS", "SD", "GDB", "MV", "MSS", "DBA", ];

  const blockOptions = ["A", "B", "C"];
  const floorOptions = [1, 2, 3, 4];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const findRooms = async () => {
  setLoading(true);
  try {
    const selectedHostels =
      filters.hostel !== "" ? [filters.hostel] : hostelOptions;

    const res = await getAvailableRooms({
      hostel: filters.hostel, 
      block: filters.block,
      floor: filters.floor,
      gender: myInfo.gender,
    });

    const roomsArray = res?.data ?? [];
    setRooms(Array.isArray(roomsArray) ? roomsArray : []);
  } catch (err) {
    console.error(err);
    alert("Error fetching rooms");
    setRooms([]);
  } finally {
    setLoading(false);
  }
};


  const applyForRoom = async (roomId) => {
    try {
      await allotRoom(roomId);
      alert("Room applied successfully!");
      findRooms(); 
    } catch (err) {
      console.error(err);
      alert("Error applying for room");
    }
  };

  const clearFilters = () => {
    setFilters({
      hostel: "",
      block: "",
      floor: "",
    });
    setRooms([]);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Apply for Room Change</h1>

        {myInfo && (
          <div
            style={{
              backgroundColor: "#e3f2fd",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #bbdefb",
            }}
          >
            <p>
              <strong>Searching for rooms suitable for:</strong>{" "}
              {myInfo.gender} students
            </p>
          </div>
        )}

        {/* ✅ Filter Section */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
            Filter Available Rooms
          </h3>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "end",
              flexWrap: "wrap",
              justifyContent: "center", // ✅ Center align
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Hostel:
              </label>
              <select
                name="hostel"
                value={filters.hostel}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  minWidth: "200px", // ✅ wider input
                  backgroundColor: "white",
                }}
              >
                <option value="">Select Hostel</option>
                {hostelOptions.map((hostel) => (
                  <option key={hostel} value={hostel}>
                    {hostel}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Block:
              </label>
              <select
                name="block"
                value={filters.block}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  minWidth: "150px", // ✅ wider input
                  backgroundColor: "white",
                }}
              >
                <option value="">Select Block</option>
                {blockOptions.map((block) => (
                  <option key={block} value={block}>
                    {block}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Floor:
              </label>
              <select
                name="floor"
                value={filters.floor}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  minWidth: "150px", // ✅ wider input
                  backgroundColor: "white",
                }}
              >
                <option value="">Select Floor</option>
                {floorOptions.map((floor) => (
                  <option key={floor} value={floor}>
                    Floor {floor}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={findRooms}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#6c757d" : "#28a745",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                minWidth: "120px",
              }}
            >
              {loading ? "Finding..." : "Find Rooms"}
            </button>
            <button
              onClick={clearFilters}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* ✅ Available Rooms Section remains same */}
        <div>
          <h2>Available Rooms</h2>
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Searching for available rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                backgroundColor: "#fff3cd",
                borderRadius: "8px",
                border: "1px solid #ffeaa7",
              }}
            >
              <p>No rooms found. Try adjusting your filters or search again.</p>
            </div>
          ) : (
            <div>
              <p style={{ marginBottom: "15px", color: "#6c757d" }}>
                Found {rooms.length} available room
                {rooms.length !== 1 ? "s" : ""}
              </p>
              <div style={{ display: "grid", gap: "15px" }}>
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      padding: "20px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4
                        style={{ margin: "0 0 10px 0", color: "#343a40" }}
                      >
                        Room {room.roomNo}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          fontSize: "0.9rem",
                        }}
                      >
                        <span>
                          <strong>Hostel:</strong> {room.hostel}
                        </span>
                        <span>
                          <strong>Block:</strong> {room.block}
                        </span>
                        <span>
                          <strong>Floor:</strong> {room.floor}
                        </span>
                        <span style={{ color: "#28a745" }}>
                          <strong>Space Left:</strong> {room.availableSpots}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => applyForRoom(room._id)}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#0056b3")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#007bff")
                      }
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentApply;