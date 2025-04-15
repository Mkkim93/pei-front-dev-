// 서버 공통 응답 객체
export interface ApiResponse<T> {
    status: number;
    message: string;
    errorCode?: string | undefined;
    timestamp: string;
    data: T;
}