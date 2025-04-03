// api/board.ts
import axiosAuth from "@/plugins/axiosAuth";
import type { BoardListResponse, BoardDetailResponse } from "@/types/board.d";
import store from "@/store/store";

// 게시글 목록 조회
export async function fetchBoardList(
    x: number | undefined,
    y: number | undefined
  ): Promise<BoardListResponse> {
    const response = await axiosAuth.get("/api/board", {
      params: {
        page: x,
        size: y,
      },
    });
    return response.data;
  }

// 상세 조회
export async function fetchBoardDetail(id :number) :Promise<BoardDetailResponse>{
    const response = await axiosAuth.get(`/api/board/${id}`, {
    });
    return response.data;
}

// 수정

// 작성

// 삭제



  