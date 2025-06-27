import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast"

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [isOwner, setIsOwner] = useState(false)
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setsearchedCities] = useState([])
    const [rooms, setRooms] = useState([])

    const fetchRooms = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/rooms',{ headers: {Authorization: `Bearer ${token}`}})
            if (data.success) {
                setRooms(data.rooms)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUser = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setIsOwner(data.role === "hotelOwner")
                setsearchedCities(data.recentSearchedCities)
            } else {
                setTimeout(() => {
                    fetchUser()
                }, 5000);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user])

    useEffect(() => {
        fetchRooms();
    }, [])

    const value = {
        currency, navigate, user, getToken, isOwner, setIsOwner, axios, showHotelReg, setShowHotelReg, searchedCities, setsearchedCities, setRooms, rooms
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context;
}
