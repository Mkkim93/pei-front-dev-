// api/board.ts
import axios from "axios";
import type { BoardListResponse } from "@/types/board";

export async function fetchBoardList(
    x: number | undefined,
    y: number | undefined
  ): Promise<BoardListResponse> {
    const response = await axios.get("http://localhost:8080/api/board", {
      params: {
        page: x,
        size: y,
      },
    });
    return response.data;
  }
  