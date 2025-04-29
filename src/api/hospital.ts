import axiosPublic from '@/plugins/axiosPublic';
import { HospitalListType } from '@/types/hospital';
import { ApiResponse, ApiPageResponse } from '@/types/api';

// 병원 리스트 조회
export async function fetchHospitalList(
    x: number | undefined,
    y: number | undefined,
) : Promise<ApiPageResponse<HospitalListType>>{
    const response = await axiosPublic.get<ApiPageResponse<HospitalListType>>(`/api/hospital`, {
        params: {
            page: x,
            size: y
        }
    })
    return response.data;
}