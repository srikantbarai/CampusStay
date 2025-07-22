import User from "../models/user.models.js"
import Room from "../models/room.model.js"

export const getStudentAllotment = async (req, res) => {
    try {
        const student = await User.findById(req.user._id).populate('room').select("-password");
        if (!student) {
            return res.status(404).json({data: "Student not found"});
        }
        return res.status(200).json({data: student});
    } catch (error) {
        return res.status(500).json({data: "Error fetching student details"});
    }
}

export const getAvailableRooms = async (req, res) => {
    try {
        const { hostel, block, floor } = req.query;
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
                roomNo: room.roomNo,
                capacity: room.capacity,
                availableSpots: room.capacity - room.occupants.length,
            }));

        return res.status(200).json({data: availableRooms}); 
    } catch (error) {
        return res.status(500).json({data: "Error fetching available rooms"});
    }
};

export const allotRoom = async (req, res) => {
    const studentId = req.user._id;
    const roomId = req.params.roomId;
    
    try {
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ data: "Student not found" });
        }
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ data: "Room not found" });
        }
        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({ data: "Room is full" });
        }
        if (student.gender !== room.gender) {
            return res.status(400).json({ data: "Gender mismatch with room" });
        }
        const currentRoom = await Room.findOne({ occupants: studentId });
        if (currentRoom && currentRoom._id.toString() === roomId) {
            return res.status(400).json({ data: "Student is already in this room"});
        }
        if (currentRoom) {
            await Room.findByIdAndUpdate(
                currentRoom._id,
                { $pull: { occupants: studentId } }
            );
        }
        const updatedRoom = await Room.findOneAndUpdate(
            { 
                _id: roomId, 
                $expr: { $lt: [{ $size: "$occupants" }, "$capacity"] }
            },
            { $addToSet: { occupants: studentId } },
            { new: true }
        );
        if (!updatedRoom) {
            if (currentRoom) {
                await Room.findByIdAndUpdate(
                    currentRoom._id,
                    { $addToSet: { occupants: studentId } }
                );
            }
            return res.status(400).json({ data: "Room became full or unavailable" });
        }
        await User.findByIdAndUpdate(
            studentId,
            {
                $set: {
                    room: roomId
                }
            }
        );
        const updatedStudent = await User.findById(studentId).populate('room').select("-password");
        const finalRoom = await Room.findById(roomId).populate({
            path: 'occupants',
            select: 'fullName rollNo email'
        });
        return res.status(200).json({
            data: {
                student: {
                    _id: updatedStudent._id,
                    fullName: updatedStudent.fullName,
                    rollNo: updatedStudent.rollNo,
                    email: updatedStudent.email,
                    room: updatedStudent.room
                },
                room: {
                    _id: finalRoom._id,
                    hostel: finalRoom.hostel,
                    block: finalRoom.block,
                    floor: finalRoom.floor,
                    roomNo: finalRoom.roomNo,
                    capacity: finalRoom.capacity,
                    currentOccupancy: finalRoom.occupants.length,
                    availableSpots: finalRoom.capacity - finalRoom.occupants.length
                }
            }
        });
    } catch (error) {
        return res.status(500).json({data: "Error allotting room"});
    }
};