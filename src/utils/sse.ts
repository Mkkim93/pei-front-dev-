import store from "@/store/store";
import { useToast } from "vue-toastification";
import { fetchNotifyList } from "@/api/notify";
import axiosPublic from "@/plugins/axiosPublic";
import '@/assets/css/toast-custom.css';

const toast = useToast();
let eventSource: EventSource | null = null;

export const connectToSSE = async () => {
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

// SSE 알림 수신 로그
eventSource.onmessage = async (event) => {
    const updatedIds :string[] = []; 
    const response = await fetchNotifyList(0, 5);
    const notifyList = response.data.content;
    notifyList.forEach((item) => {
        toast.dismiss(item.id);
        console.log('알림 수신: ', event.data);
        store.dispatch("notify/addNotification", item);
        toast.success(item.message, { id: item.id });
        console.log('notifyList: ', notifyList);
        // toast.clear(); 모든 알림 닫기 나중에 모든 알림 닫기 창 구현
        console.log('notifyList itemIds: ', notifyList);
        if (item.id !== "") {
            updatedIds.push(item.id);
        }
        console.log('updatedIds:', updatedIds);
        try {
            const response = axiosPublic.patch(`/api/notify/isDisplayed`, updatedIds)
            console.log(' updated-response', response);
        } catch (error) {
            console.log('error', error);
        }
    })
};

// SSE 연결 오류
eventSource!.onerror = (error) => {
    console.error('SSE 연결 오류: ', error);
    eventSource?.close();
    };
};

// SSE 연결 해제
export const disconnectSSE = () => {
    eventSource?.close();
    eventSource = null;
}