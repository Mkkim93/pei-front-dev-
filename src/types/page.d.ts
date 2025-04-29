// 공통 페이징 .d.ts
export interface PageResponse {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
}