import { getAuth } from "@clerk/express"; // ✅ import this
import User from "../models/User.js";

// Middleware to check user Authentication
export const protect = async (req, res, next) => {
    const auth = getAuth(req); // ✅ new and correct way to get user info
    if (!auth.userId) {
        return res.json({ success: false, message: "Not Authorized" });
    }

    const user = await User.findById(auth.userId);
    req.user = user;
    req.auth = auth; // Optional: attach auth to req if needed in controllers

    next();
};
