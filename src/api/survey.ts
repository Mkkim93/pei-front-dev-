import axiosPublic from '@/plugins/axiosPublic';
import axiosAuth from '@/plugins/axiosAuth';
import { ApiPageResponse, ApiResponse } from '@/types/api';
import { SurveyPostType, CategoryMap, SurveyHospitalType, SurveyDetailDTO, SurveyUpdateDTO } from '@/types/survey';
import { CommonSurvey } from '@/types/common/survey';

export async function fetchSurveyTemplate(id :number) :Promise<ApiResponse<SurveyDetailDTO>>{
    const response = await axiosAuth.get<ApiResponse<SurveyDetailDTO>>(`/api/survey?id=${id}`);
    return response.data;
}

export async function postSurvey(obj :SurveyPostType) {
    const response = await axiosPublic.post('/api/survey', obj, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.data;
}

export async function updatedSurvey(obj :SurveyUpdateDTO) {
    const response = await axiosPublic.post('/api/survey/update', obj, {
        headers: {
            "Content-Type" : "application/json",
        }
    });
    return response.data;
}

export async function fetchCategoryList() :Promise<CategoryMap>{
    const response = await axiosPublic.get<CategoryMap>('/api/survey/category');
    return response.data;
} 

export async function fetchSurveyHosList(
    x: number | undefined,
    y: number | undefined,
) :Promise<ApiPageResponse<SurveyHospitalType>> {
    const response = await axiosAuth.get<ApiPageResponse<SurveyHospitalType>>('/api/survey/hospital', {
        params: {
            page: x,
            size: y
        }
    })
    return response.data;
}

// 설문자 전용
export async function fetchCommonSurvey(
    x: number | undefined,
    y: number | undefined,
    hospitalId: number,
    status: string | undefined
) :Promise<ApiPageResponse<CommonSurvey>> {
    const response = await axiosPublic.get<ApiPageResponse<CommonSurvey>>(`/api/common-survey`, {
        params: {
            page: x,
            size: y,
            hospitalId: hospitalId,
            status: status,
        }
    })
    return response.data;
}

export async function fetchCommonSurveyDetail(
    hospitalId: number,
    surveyId: number,
) :Promise<ApiResponse<CommonSurvey>> {
    const response = await axiosPublic.get<ApiResponse<CommonSurvey>>(`/api/common-survey/detail?hospitalId=${hospitalId}&surveyId=${surveyId}`);
    return response.data;
}