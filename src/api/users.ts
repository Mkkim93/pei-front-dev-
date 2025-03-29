// api/users.ts
import axiosAuth from '@/plugins/axiosAuth';
import { UsersType } from '@/types/users.d';
import { ApiResponse } from '@/types/api.d';

export async function fetchUsersProfile(): Promise<ApiResponse<UsersType>>{
    const response = await axiosAuth.get("/api/users/profile");
    return response.data;
}
   

