import store from "@/store/store";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import { fetchNotifyList } from "@/api/nodify";

const toast = useToast();

let eventSource: EventSource | null = null;

export const connectToSSE = () => {

    if (eventSource) {
        eventSource.close();
    }

const accessToken :string = store.getters.accessToken;
if (accessToken == null) {
    console.warn("토큰 없음: SSE 연결 중단");
    return;
}

const token = accessToken.split(' ')[1];

// TODO 나중에 .env 파일로 도메인 경로 prefix 로 설정해야됨
eventSource = new EventSource(`http://localhost:8080/api/notify/subscribe?token=${token}`);

let initialized = false; // 중복 호출 방지
// SSE 알림 수신 로그
eventSource.onmessage = async (event) => {

    if (initialized) return;
    initialized = true;

    const response = await fetchNotifyList();

    response.data.forEach((item) => {
        toast.dismiss(item.id);
        console.log('알림 수신: ', event.data);
        console.log("response: ", response);
        toast(item.message, { id: item.id });
        // toast.clear(); 모든 알림 닫기 나중에 모든 알림 닫기 창 구현
    })
};

// SSE 연결 오류
eventSource.onerror = (error) => {
    console.error('SSE 연결 오류: ', error);
    eventSource?.close();
    };
};

// SSE 연결 해제
export const disconnectSSE = () => {
    eventSource?.close();
    eventSource = null;
}