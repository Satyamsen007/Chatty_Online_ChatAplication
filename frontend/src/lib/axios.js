import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: `https://chatty-online-chataplication-backend.onrender.com/api`,
    withCredentials: true,
})