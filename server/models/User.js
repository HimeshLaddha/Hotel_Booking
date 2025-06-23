import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id: {type: string, required: true},
    username: {type: string, required: true},
    email: {type: string, required: true},
    image: {type: string, required: true},
    role: {type: string, enum: ["user", "hotelOwner"], default: "user"},
    recentSearchCities: [{type: string, required: true}]
},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;