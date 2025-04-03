// Header 가 포함되지 않은 API 
import axios from "axios";

const axiosPublic = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});
export default axiosPublic;