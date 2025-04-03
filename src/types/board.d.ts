// types/board.ts
export type BoardListType = {
    id: number;
    title: string;
    content: string;
    createAt: string;
    updateAt: string;
    writer: string;
    roleType: string;
    views: number;
}
  
export interface PageInfoType {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

  // 페이징 처리 편하게 하기 위한 커스텀 응답 객체 생성
export interface BoardListResponse {
    status: number;
    message: string;
    timestamp: string;
    data: {
      content: BoardListType[];
      page: PageInfoType;
    };
}
 
export type BoardDetailType = {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  writer: string;
  views: number;
  // TODO 나중에 파일도 들어가야됨
}

export interface BoardDetailResponse {
  status: number;
  message: string;
  timestamp: string;
  data: {
    content: BoardDetailType[];
  }
}
  