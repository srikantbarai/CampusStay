import React, { useEffect, useState } from "react";
import { listRooms } from "../lib/api.js";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    hostel: "",
    block: "",
    floor: ""
  });

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
    fetchRooms(); // fetch all rooms by default
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = {};
    if (filters.hostel) query.hostel = filters.hostel;
    if (filters.block) query.block = filters.block;
    if (filters.floor) query.floor = filters.floor;
    fetchRooms(query);
  };

  return (
    <div>
      <h1>Admin - Rooms</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hostel"
          value={filters.hostel}
          onChange={(e) => setFilters({ ...filters, hostel: e.target.value })}
        />
        <input
          type="text"
          placeholder="Block"
          value={filters.block}
          onChange={(e) => setFilters({ ...filters, block: e.target.value })}
        />
        <input
          type="number"
          placeholder="Floor"
          value={filters.floor}
          onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
        />
        <button type="submit">Filter</button>
      </form>

      {loading ? (
        <p>Loading rooms...</p>
      ) : (
        <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
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
                <td colSpan="5">No rooms found</td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.hostel}</td>
                  <td>{room.block}</td>
                  <td>{room.floor}</td>
                  <td>{room.roomNo}</td>
                  <td>
                    {room.occupants && room.occupants.length > 0
                      ? room.occupants.map((o) => `${o.fullName} (${o.rollNo})`).join(", ")
                      : "Empty"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}