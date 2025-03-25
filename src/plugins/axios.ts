import axios from "axios";
import store from "@/store/store";
import router from "@/router/router";

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
    (error) => Promise.reject(error) // reject : 실패 반환 (복잡한 에러)
);

// TODO 서버 response 응답 인터셉터 구현 (아직 테스트 안함)
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log("인터셉터 에러:", error.response?.data); // 여기 찍히나요?
        

        if (
            error.response?.status === 401 && 
            !originalRequest._retry // _retry : 무한 루프 방지
        ) 
        
        {
            originalRequest._retry = true;

            try {
                const res = await axios.post("/api/reissue", 
                    {},
                    {withCredentials: true}
                );

                const newAccessToken = res.data.accessToken; // 콘솔에서 테스트 해봐야 함
                store.commit("setAccessToken", newAccessToken);
                console.log(res);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                return instance(originalRequest);
            } catch (reissueError) {
                console.log('토큰 재발급 실패', reissueError);
                store.commit("clearAccessToken");
                router.push("/signin");
                return Promise.reject(reissueError);
            }
        }
        return Promise.reject(error); // 위 조건에 해당되지 않으면 에러를 반환
    }
)

export default instance;