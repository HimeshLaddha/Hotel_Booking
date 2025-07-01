# 🏨 QuickStay - Hotel Booking Platform

QuickStay is a full-stack hotel booking platform where users can discover and book rooms effortlessly, and hotel owners can manage listings, track bookings, and monitor revenue through a beautiful and functional dashboard.

---

## 🌐 Live Demo

🔗 [Visit QuickStay](https://your-live-url.com)

---

## 🚀 Features

### 👤 Authentication (via Clerk)
- Secure, passwordless login with Clerk
- Supports email, Google, and other OAuth providers
- Protected routes and user roles (user vs owner)

### 🔍 For Users
- Search hotels and filter rooms by price/type
- Real-time room availability check
- Stripe-powered payment for secure bookings
- View all past and upcoming bookings

### 🏨 For Hotel Owners
- Add new hotels and rooms with images
- Monitor all bookings tied to owned hotels
- Dashboard showing revenue and total bookings

---

## 🛠️ Tech Stack

### 🧑‍💻 Frontend
- React.js + Vite
- Tailwind CSS
- Clerk Authentication
- Axios for API requests
- React Router DOM
- React Hot Toast

### 🔧 Backend
- Node.js + Express
- MongoDB + Mongoose
- Stripe for payments
- Cloudinary for image uploads
- Clerk JWT middleware for auth protection

---

## 🧠 Core Logic

- 🧩 **Room Availability**: Checked based on booking date overlap
- 💸 **Stripe Integration**: Booking confirmed after successful payment
- 🧾 **Booking Model**: Includes user, hotel, room, price, guests, and dates
- 📊 **Dashboard Stats**: Aggregates bookings and revenue for owners
