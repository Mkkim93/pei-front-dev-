// // 단일 알림 데이터 타입
// export interface NotifyType {
//     id: string;
//     message: string;
//     type: string;
//     createAt: string;
//     targetId: number | null;
//     url: string | null;
//   }
  
//   // API 전체 응답 타입
// export interface NotifyResponse {
//     status: number;
//     message: string;
//     timestamp: string;
//     data: NotifyType[];
// }

// export interface NotifyItem {
//     id: number;
//     message: string;
//     isRead?: boolean;
// }
  
// export interface NotifyState {
//     notifications: NotifyItem[];
// }


// todo
export interface NotifyType {
    id: string;
    message: string;
    type: string;
    createAt: string;
    targetId: number | null;
    url: string | null;
    isRead: boolean;
  }
  
  // 알림 리스트에 대한 페이지 정보
  interface PageInfo {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }
  
  // 페이지형 알림 응답
  interface NotifyData {
    content: NotifyType[];
    page: PageInfo;
  }
  
  // 전체 응답 구조
  export interface NotifyResponse {
    status: number;
    message: string;
    timestamp: string;
    data: NotifyData;
  }
  
  