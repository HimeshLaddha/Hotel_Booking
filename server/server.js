import express from "express";
import "dotenv/config"
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import { stripeWebhooks } from "./controllers/StripeWebhooks.js";

connectDB();
connectCloudinary();

const app = express();
app.use(cors())

// api to listen stripe webhooks
app.post('/api/stripe', express.raw({type: "application/json"}), stripeWebhooks)

// Middleware
app.use(express.json())
app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
}));

app.use("/api/clerk", clerkWebhooks);

app.get("/", (req,res)=> res.send("Api is working"))

app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req,res)=>{
    console.log(`Server is listening at port : ${PORT}`)
})