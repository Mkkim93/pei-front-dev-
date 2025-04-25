import { UsersListType } from "@/types/user-roles";
import axiosAuth from "@/plugins/axiosAuth";
import { ApiResponse } from "@/types/api";

export async function fetchUserList(
    x: number | undefined,
    y: number | undefined,
): Promise<ApiResponse<UsersListType>> {
    const response = await axiosAuth.get('/api/roles', {
        params: {
            page: x,
            size: y,
        },
    });
    return response.data;
}