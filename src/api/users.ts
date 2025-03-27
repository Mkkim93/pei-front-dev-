// api/users.ts
import axios from '@/plugins/axios';
import { UsersType } from '@/types/users';

export async function fetchUsersProfile(): Promise<UsersType>{

    const response = await axios.get("http://localhost:8080/api/users/profile");

    return response.data.data;
}
   

