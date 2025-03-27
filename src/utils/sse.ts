import store from "@/store/store";

let eventSource: EventSource | null = null;

export const connectToSSE = () => {

    if (eventSource) {
        eventSource.close();
    }

const accessToken :string = store.getters.accessToken;
if (accessToken == null) {
    Promise.reject('토큰 없음');
}

const token = accessToken.split(' ')[1];

eventSource = new EventSource(`http://localhost:8080/api/notify/subscribe?token=${token}`);

// SSE 알림 수신 로그
eventSource.onmessage = (event) => {
    console.log('알림 수신: ', event.data);
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