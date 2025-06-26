import { getAuth } from "@clerk/express";
import User from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node"; // make sure this is installed & configured

export const protect = async (req, res, next) => {
    const auth = getAuth(req);

    if (!auth.userId) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    try {
        let user = await User.findById(auth.userId);

        if (!user) {
            // fetch user from Clerk
            const clerkUser = await clerkClient.users.getUser(auth.userId);

            user = await User.create({
                _id: clerkUser.id, // Clerk user ID as _id
                username: clerkUser.username || clerkUser.firstName || "Guest",
                email: clerkUser.emailAddresses[0].emailAddress,
                image: clerkUser.imageUrl,
                role: "user",
                recentSearchedCities: [],
            });
        }

        req.user = user;
        req.auth = auth;
        next();

    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
