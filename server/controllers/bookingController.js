import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Function to check availability of room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });

        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}

// Api to check availability of room /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Api to create neww booking /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, guests, room } = req.body;
        const user = req.auth.userId;

        // before booking check availability
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });

        if (!isAvailable) {
            return res.json({ success: false, message: "Room is Not Available" })
        }
        // Get total price for room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        // calculate total price based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))

        totalPrice *= nights;
        const booking = await Booking.create({
            user, room, hotel: roomData.hotel._id, guests: +guests, checkInDate, checkOutDate, totalPrice
        })

        res.json({ success: true, message: "Booking Created Successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message });
        console.log(error.message)
    }
}

// api to get all bookings for a user /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth.userId;
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized user" });
        }
        const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getHotelBookings = async (req, res) => {
    try {
        const { userId } = await req.auth;
        const hotel = await Hotel.findOne({ owner: userId });

        if (!hotel) {
            return res.json({ success: false, message: "No Hotel Found" })
        }

        const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 })

        // Total Bookings
        const totalBookings = bookings.length;
        // Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch Bookings" })
    }
}