import axios from "axios";
import store from "@/store/store";

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const token = store.state.accessToken;

        if (token) {
            config.headers["Authorization"] = `Bearer + ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)    
);

// TODO 서버 response 응답 인터셉터 구현


export default instance;