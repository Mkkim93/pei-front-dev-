// api/users.ts
import axiosAuth from '@/plugins/axiosAuth';
import axiosPublic from '@/plugins/axiosPublic';
import { UsersType } from '@/types/users.d';
import { ApiResponse } from '@/types/api.d';

export async function fetchUsersProfile(): Promise<ApiResponse<UsersType>>{
    const response = await axiosAuth.get("/api/users/profile");
    return response.data;
}

export async function postedCode(phone :string): Promise<ApiResponse<string>> {
    const response = await axiosPublic.post(`/api/users/recover-username?phone=${phone}`);
    return response.data;
}

export async function postUsername(phone :string, code :string): Promise<ApiResponse<string>> {
    const response = await axiosPublic.post(`/api/users/receiver-username?phone=${phone}&code=${code}`);
    return response.data;
}
   

