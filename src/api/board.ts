// api/board.ts
import axiosAuth from "@/plugins/axiosAuth";
import type { BoardListResponse } from "@/types/board.d";

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

// 게시글 상세 조회

// 게시글 수정

// 게시글 작성

// 게시글 삭제



  