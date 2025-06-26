import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;

        const { userId } = await req.auth;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        const owner = userId;

        // Check if user already registered
        const hotel = await Hotel.findOne({ owner })
        if (hotel) {
            res.json({ success: false, message: "Hotel Already Registered" });
        }

        await Hotel.create({ name, address, contact, city, owner });

        await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

        res.json({ success: true, message: "Hotel Registered Successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}