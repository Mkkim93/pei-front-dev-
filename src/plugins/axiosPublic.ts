// Header 미포함 API
import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});


instance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        const code = error.response?.data?.code;
        const status = error.response?.status;

        console.log('[Axios Public response Interceptor Issue]:', error.response?.data);
        
        if (status === 400) {
            return Promise.reject(error);
        }
        
        if (status === 410) {
            return Promise.reject(error);
        }
    }
)
export default instance;