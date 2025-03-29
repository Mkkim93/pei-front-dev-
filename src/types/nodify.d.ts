// 단일 알림 데이터 타입
export interface NotifyType {
    id: string;
    message: string;
    type: string;
    createAt: string;
    targetId: number | null;
    url: string | null;
  }
  
  // API 전체 응답 타입
  export interface NotifyResponse {
    status: number;
    message: string;
    timestamp: string;
    data: NotifyType[];
  }