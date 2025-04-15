// HEADER 포함 API (인증 / 인가)
import axios from "axios";
import store from "@/store";
import router from "@/router";

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: {
        Authorization: store.getters.accessToken
    }
});

instance.interceptors.request.use(

    (config) => {
        const token = store.state.accessToken;

        if (token) {
            config.headers["Authorization"] = `${token}`;
            // console.log("Authorization 헤더:", config.headers.Authorization);
        }
        return config;
    },
    (error) => Promise.reject(error) // reject : 실패 반환 (복잡한 에러)
);

// TODO 서버 response 응답 인터셉터 구현 (아직 테스트 안함)
instance.interceptors.response.use(
    (response) => response,
    
    async (error) => {
        const originalRequest = error.config;
        const code = error.response?.data?.code;
        const status = error.response?.status;
        
        console.log("[Axios response Interceptor Issue]: ", error.response?.data); // 응답 유형 체크

        if (status === 400) {
            return Promise.reject(error.response);
        }

        if (status === 401 && code === "REFRESH_TOKEN_NULL") {
            store.dispatch("logout");
            return Promise.reject(error);   
        }
        
        if (status === 404) {
            return Promise.reject(error.response);
        }
            

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
        }
        
            try {
                const res = await axios.post("/api/reissue", {}, { 
                    withCredentials: true 
                });

                const newAccessToken = res.data.accessToken; // 콘솔에서 테스트 해봐야 함
                store.commit("setAccessToken", newAccessToken);
                console.log(res);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                return instance(originalRequest);
            } catch (reissueError) {
                console.log('[Reissue Request Error]: ', reissueError);
                store.commit("clearAccessToken");
                router.push("/signin");
                return Promise.reject(reissueError);
            }
    }
)

export default instance;