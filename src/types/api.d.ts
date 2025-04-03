export interface ApiResponse<T> {
    status: number;
    message: string;
    errorCode?: string;
    timestamp: string;
    data: T;
}