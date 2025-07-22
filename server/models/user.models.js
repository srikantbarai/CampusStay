import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    profilePicUrl: {
        type: String,
        default: null
    },
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        required: true,
        default: 'student'
    },
    allotment: {
        hostel: {
            type: String,
            enum: ['KMS', 'BF', 'CVR', 'VS', 'SD', 'GDB', 'MV', 'MSS', 'DBA', 'HB'],
            default: null
        },
        block: {
            type: String,
            enum: ['A', 'B', 'C'],
            default: null
        },
        floor: {
            type: Number,
            default: null
        },
        roomNo: {
            type: Number,
            default: null
        }
    }
}, {timestamps: true}
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const saltRounds = parseInt(process.env.saltRounds)
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error("Error in password hash",error);
        process.exit(1);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};

const User = mongoose.model('User',userSchema);
export default User;