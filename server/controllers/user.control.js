import User from "../models/user.models.js"

export const getUserInfo = async (req, res) => {
    try {
        const me = await User.findById(req.user._id).select("-password");
        return res.status(200).json({ data: me });
    } catch (error) {
        return res.status(500).json({ data: "Error fetching user info" });
    }
}