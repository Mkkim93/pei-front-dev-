// types/board.ts

// TYPE 1 : BOARD LIST
export type BoardListType = {
    id: number;
    title: string;
    content: string;
    createAt: string; 
    updateAt: string;
    writer: string;
    roleType: string;
    views: number;
    usersId: number;
}

export type BoardFileListType = {
  id: number;
  name: string;
  path: string;
  orgName: string;
  type: string;
  size: number;
  renderType: string; 
  used: boolean;
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
 
// type 2: BOARD DETAIL
export interface BoardDetailResponse {
  status: number;
  message: string;
  timestamp: string;
  data: {
    content: BoardDetailType[];
  }
}

export type BoardDetailType = {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  writer: string;
  views: number;
  usersId: number;
  boardFiles: BoardFileListType[]
}

export type BoardDetailFileType = {
  boardId: number,
  id: number,
  name: string,
  orgName: string,
  path: string,
  renderType: string,
  used: boolean,
}

// TYPE 3: BOARD UPDATE
export type BoardUpdateType = {
  id: number;
  title: string;
  content: string;
  boardFiles: BoardFileListType[]
}

export type BoardFileUpdateType = {
  id: number;
  name: string;
  path: string;
  orgName: string;
  type: string;
  size: number;
  renderType: string;
  used: boolean;
  boardId: number;
}

// TYPE 4: BOARD DELETE
export type BoardDeleteIdsType = {
  id: number[] | number | undefined;
}

// TYPE 5: BOARD CREATE
export interface BoardCreateType {
  title: string;
  content: string;
  isTemp: boolean;
  boardFiles: BoardFileListType[]
}

// TYPE 6: BOARD TEMP
export type BoardTempListType = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  usersId: number;
  page: PageInfoType[]
}


