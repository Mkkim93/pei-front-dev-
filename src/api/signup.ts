import { ApiResponse, RegisterType } from '@/types/signup.d';
import axiosPublic from '@/plugins/axiosPublic';

async function postSignup(registerData: RegisterType): Promise<ApiResponse> {
    const response = await axiosPublic.post<ApiResponse>(
      "/api/register",
      registerData, // 👉 여기가 body
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

// 서버 prefix : /api/register/..
// 계정 중복 확인 
async function checkUsername(username :string) :Promise<ApiResponse> {
    const response = await axiosPublic.get<ApiResponse>(`/api/register/check-username?username=${username}`);
    return response?.data;
}

async function checkPhone(phone :string) :Promise<ApiResponse> {
    const response = await axiosPublic.post<ApiResponse>(`/api/register/phone?phone=${phone}`);
    return response?.data;
}

async function validCode(code :string, phone :string) :Promise<ApiResponse> {
    const response = await axiosPublic.post<ApiResponse>(`/api/register/verify-code?phone=${phone}&code=${code}`);
    return response?.data;
}

export { checkUsername, checkPhone, validCode, postSignup }