// api/board.ts
import axiosAuth from "@/plugins/axiosAuth";
import type { BoardListResponse, BoardDetailResponse, BoardUpdateType, BoardDeleteIdsType } from "@/types/board.d";
import { ApiResponse } from "@/types/api";

// 게시글 목록 조회
export async function fetchBoardList(
  x: number | undefined,
  y: number | undefined,
  keyword: string | undefined,
): Promise<BoardListResponse> {
  const response = await axiosAuth.get("/api/board", {
    params: {
      page: x,
      size: y,
      searchKeyword: keyword,
    },
  });
  return response.data;
}

// 상세 조회
export async function fetchBoardDetail(id: number): Promise<BoardDetailResponse> {
  const response = await axiosAuth.get(`/api/board/${id}`, {
  });
  return response.data;
}

// 수정
export async function patchBoardContent(obj: BoardUpdateType) {
  const response = await axiosAuth.patch('/api/board', obj);
  return response.data;
}

// 작성
export async function createPost(title: string, content: string): Promise<ApiResponse<number>> {
  const response = await axiosAuth.post(`/api/board`, {
    title: title,
    content: content
  },
    {
      headers: { 'Content-Type': 'application/json' }
    })
  return response.data;
}

// 삭제
export async function deleteBoardIds(ids: BoardDeleteIdsType) {
  const param = Array.isArray(ids.id)
    ? ids.id.map(id => `${id}`).join('&')
    : `${ids.id}`;
  const response = await axiosAuth.delete(`/api/board?ids=${param}`);
  return response.data;
}