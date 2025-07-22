import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    hostel: {
        type: String,
        enum: ['KMS', 'BF', 'CVR', 'VS', 'SD', 'GDB', 'MV', 'MSS', 'DBA', 'HB'],
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    block: {
        type: String,
        enum: ['A', 'B', 'C'],
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    roomNo: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        default: 2
    },
    occupants: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        }
    ]
}, { timestamps: true });

const Room =  mongoose.model("Room", roomSchema);
export default Room