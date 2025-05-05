import axiosPublic from '@/plugins/axiosPublic';
import { HospitalListType } from '@/types/hospital';
import { ApiPageResponse } from '@/types/api';
import { ApiResponse } from '@/types/api';
import axiosAuth from '@/plugins/axiosAuth';

// 병원 리스트 조회
export async function fetchHospitalMainList(
    x: number | undefined,
    y: number | undefined,
) : Promise<ApiPageResponse<HospitalListType>>{
    const response = await axiosPublic.get<ApiPageResponse<HospitalListType>>(`/api/com-hospital`, {
        params: {
            page: x,
            size: y
        }
    })
    return response.data;
}

export async function fetchHospitalData() :Promise<ApiResponse<HospitalListType>>{
    const response = await axiosAuth.get<ApiResponse<HospitalListType>>('/api/hospital');
    return response.data;
}