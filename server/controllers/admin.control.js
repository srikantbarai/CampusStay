import User from "../models/user.models.js"
import Room from "../models/room.model.js"

export const createStudent = async (req, res) => {
    const { fullName, rollNo, gender, password, profilePicUrl } = req.body;
    try {
        if (!fullName || !rollNo || !gender || !password || !profilePicUrl) {
            return res.status(400).json({ data: "All fields are required" });
        }
        const existingStudent = await User.findOne({rollNo});
        if (existingStudent) {
            return res.status(400).json({ data: "Student with this roll number already exists" });
        }
        if (password.length < 8) {
            return res.status(400).json({ data: "Password must be at least 8 characters" });
        }
        const email = `${rollNo}@nitrkl.ac.in`;
        const newStudent = await User.create({
            fullName,
            rollNo,
            email,
            gender,
            password,
            profilePicUrl
        });
        const student = await User.findById(newStudent._id).select("-password");
        return res.status(201).json({ data: student });
    } catch (error) {
        return res.status(500).json({ data: "Error creating student" });
    }
};

export const listRooms = async (req, res) => {
    try {
        const { hostel, block, floor } = req.query;
        const filter = {};
        if (hostel) filter.hostel = hostel;
        if (block) filter.block = block;
        if (floor) filter.floor = parseInt(floor);
        const rooms = await Room.find(filter)
            .populate({
                path: 'occupants',
                select: 'fullName rollNo',
            })
            .sort({ hostel: 1, block: 1, floor: 1, roomNo: 1 });
        return res.status(200).json({data: rooms});
    } catch (error) {
        return res.status(500).json({ data: "Error fetching rooms" });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ data: "Student not found" });
        await User.findByIdAndDelete(studentId);
        return res.status(200).json({ data: "Student deleted successfully" });
    } catch (error) {
        return res.status(500).json({ data: "Error deleting student" });
    }
}