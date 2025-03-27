// types/board.ts
export interface BoardListType {
    id: number;
    title: string;
    content: string;
    createAt: Date;
    updateAt: string;
    writer: string;
    views: number;
  }
  
  export interface PageInfoType {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }
  
  export interface BoardListResponse {
    status: number;
    message: string;
    timestamp: string;
    data: {
      content: BoardListType[];
      page: PageInfoType;
    };
  }
  