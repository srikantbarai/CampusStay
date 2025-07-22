import User from "../models/user.models.js"
import Room from "../models/room.model.js"

export const getAvailableRooms = async (req, res) => {
    try {
        const { hostel, block, floor} = req.query;
        const filter = {};
        if (hostel) filter.hostel = hostel;
        if (block) filter.block = block;
        if (floor) filter.floor = parseInt(floor);
        const rooms = await Room.find(filter);
        const availableRooms = rooms
            .filter(room => room.occupants.length < room.capacity)
            .map(room => ({
                _id: room._id,
                hostel: room.hostel,
                block: room.block,
                floor: room.floor,
                roomNo: room.roomNo
            }));
        
        return res.status(200).json({data: availableRooms}); 
    } catch (error) {
        return res.status(500).json({data: "Error fetching available rooms"});
    }
};