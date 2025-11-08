import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: 'https://localhost:4000/api/',
    withCredentials: true,
});
