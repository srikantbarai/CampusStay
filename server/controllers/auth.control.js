import jwt from "jsonwebtoken";
import User from "../models/user.models.js"

const secret = process.env.jwtsecret

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ data: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ data: "Invalid email or password" });
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ data: "Invalid email or password" });
        }
        const payload = {
            _id: user._id,
            role: user.role
        };
        const token = jwt.sign(payload, secret, {
            expiresIn: "3d"
        });
        
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 3*24*60*60*1000 
        });
        
        return res.status(200).json({ data: user });
    } catch (error) {
        return res.status(500).json({ data: "Login error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            expires: new Date(0)
        });
        return res.status(200).json({ data: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ data: "Logout error" });
    }
}