// 서버 공통 응답 객체
export interface ApiResponse<T> {
    status: number;
    message: string;
    errorCode?: string | undefined;
    timestamp: string;
    data: T | null;
}

export interface ApiPageResponse<T> {
    status?: number;
    message?: string;
    timestamp?: string;
    data: {
        content: T[];
        page: PageType;
    }
}

export interface PageType {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}