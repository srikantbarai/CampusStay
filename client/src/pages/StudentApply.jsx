import React, { useState } from "react";
import useGetMyInfo from "../hooks/useGetMyInfo";
import { getAvailableRooms, allotRoom } from "../lib/api";

const StudentApply = () => {
  const { myInfo } = useGetMyInfo();
  const [filters, setFilters] = useState({
    hostel: "",
    block: "",
    floor: "",
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const findRooms = async () => {
    setLoading(true);
    try {
      const res = await getAvailableRooms({
        ...filters,
        gender: myInfo.gender,
      });

      // Make sure rooms is always an array
      const roomsArray = res?.data ?? []; // backend sends { data: [...] }
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
      findRooms(); // refresh list after applying
    } catch (err) {
      console.error(err);
      alert("Error applying for room");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Apply for Room Change</h1>

      {/* Filter Form */}
      <div>
        <label>
          Hostel:
          <input
            name="hostel"
            value={filters.hostel}
            onChange={handleChange}
            placeholder="Hostel Name"
          />
        </label>
        <label>
          Block:
          <input
            name="block"
            value={filters.block}
            onChange={handleChange}
            placeholder="Block"
          />
        </label>
        <label>
          Floor:
          <input
            name="floor"
            value={filters.floor}
            onChange={handleChange}
            placeholder="Floor"
          />
        </label>
        <button onClick={findRooms} disabled={loading}>
          {loading ? "Finding..." : "Find Rooms"}
        </button>
      </div>

      {/* Room List */}
      <h2>Available Rooms</h2>
      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room._id}>
              Hostel: {room.hostel}, Block: {room.block}, Floor: {room.floor},{" "}
              No: {room.roomNo}, Space Left: {room.availableSpots}
              <button onClick={() => applyForRoom(room._id)}>Apply</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentApply;