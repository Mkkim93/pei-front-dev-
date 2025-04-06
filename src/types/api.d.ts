export interface ApiResponse<T> {
    status: number;
    message: string;
    errorCode?: string | undefined;
    timestamp: string;
    data: T;
}