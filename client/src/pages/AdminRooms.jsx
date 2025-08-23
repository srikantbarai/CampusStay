import React, { useEffect, useState } from "react";
import { listRooms } from "../lib/api.js";
import Navbar from "../components/Navbar"; 

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    hostel: "",
    block: "",
    floor: ""
  });

  const hostelOptions = ['KMS', 'BF', 'CVR', 'VS', 'SD', 'GDB', 'MV', 'MSS', 'DBA', 'HB'];
  const blockOptions = ['A', 'B', 'C'];
  const floorOptions = [1, 2, 3, 4];

  const fetchRooms = async (filterParams = {}) => {
    try {
      setLoading(true);
      const res = await listRooms(filterParams);
      setRooms(res.data || []);
    } catch (err) {
      console.error("Error fetching rooms", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(); 
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = {};
    if (filters.hostel) query.hostel = filters.hostel;
    if (filters.block) query.block = filters.block;
    if (filters.floor) query.floor = filters.floor;
    fetchRooms(query);
  };

  const clearFilters = () => {
    setFilters({
      hostel: "",
      block: "",
      floor: ""
    });
    fetchRooms();
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Admin - Rooms</h1>

        <div style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <h3>Filter Rooms</h3>
          <form 
            onSubmit={handleSubmit} 
            style={{ 
              display: "flex", 
              gap: "20px", 
              alignItems: "end", 
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Hostel:</label>
              <select
                value={filters.hostel}
                onChange={(e) => setFilters({ ...filters, hostel: e.target.value })}
                style={{ 
                  padding: "10px", 
                  borderRadius: "4px", 
                  border: "1px solid #ccc", 
                  backgroundColor: "white",
                  minWidth: "150px"
                }}
              >
                <option value="">All</option>
                {hostelOptions.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Block:</label>
              <select
                value={filters.block}
                onChange={(e) => setFilters({ ...filters, block: e.target.value })}
                style={{ 
                  padding: "10px", 
                  borderRadius: "4px", 
                  border: "1px solid #ccc", 
                  backgroundColor: "white",
                  minWidth: "150px"
                }}
              >
                <option value="">All</option>
                {blockOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Floor:</label>
              <select
                value={filters.floor}
                onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                style={{ 
                  padding: "10px", 
                  borderRadius: "4px", 
                  border: "1px solid #ccc", 
                  backgroundColor: "white",
                  minWidth: "150px"
                }}
              >
                <option value="">All</option>
                {floorOptions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Filter
            </button>
            <button 
              type="button"
              onClick={clearFilters}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          </form>
        </div>

        {loading ? (
          <p>Loading rooms...</p>
        ) : (
          <div>
            <p style={{ marginBottom: "10px", color: "#6c757d" }}>
              Found {rooms.length} room{rooms.length !== 1 ? 's' : ''}
            </p>
            <table 
              border="1" 
              cellPadding="10" 
              style={{ 
                marginTop: "10px", 
                width: "100%", 
                borderCollapse: "collapse",
                backgroundColor: "white",
                textAlign: "center"   
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th>Hostel</th>
                  <th>Block</th>
                  <th>Floor</th>
                  <th>Room No</th>
                  <th>Occupants</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      No rooms found with current filters
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr key={room._id}>
                      <td>{room.hostel}</td>
                      <td>{room.block}</td>
                      <td>{room.floor}</td>
                      <td style={{ fontWeight: "bold" }}>{room.roomNo}</td>
                      <td>
                        {room.occupants && room.occupants.length > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            {room.occupants.map((o, index) => (
                              <div key={index} style={{ marginBottom: "5px" }}>
                                <strong>{o.fullName}</strong> ({o.rollNo})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: "#6c757d", fontStyle: "italic" }}>Empty</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRooms;