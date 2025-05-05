import axiosAuth from '@/plugins/axiosAuth';
import { ApiPageResponse } from '@/types/api';
import { SurveyTypeList, SuveyTypeDetailList, SurveyTypeRecent, SurveyTypeStatusList } from '@/types/survey-type';
import { aC } from '@fullcalendar/core/internal-common';

export async function fetchsurveyTypePage(
    x: number | undefined,
    y: number | undefined,
    isPublic: boolean | undefined,
) : Promise<ApiPageResponse<SurveyTypeList>> {
    const response = await axiosAuth.get<ApiPageResponse<SurveyTypeList>>(`/api/survey-type`, {
        params: {
            page: x,
            size: y,
            isPublic: isPublic,
        }
    })
    return response.data;
}

export async function fetchSurveyTypeList(isPublic :boolean | undefined) :Promise<SurveyTypeList>{
    const response = await axiosAuth.get<SurveyTypeList>(`/api/survey-type/list?isPublic=${isPublic}`);
    return response.data;
}

export async function fetchSurveyTypeUsagePage(
    x: number | undefined,
    y: number | undefined,
    activeType: boolean | undefined,
) :Promise<ApiPageResponse<SuveyTypeDetailList>> {
    const response = await axiosAuth.get<ApiPageResponse<SuveyTypeDetailList>>(`/api/survey-type/usang`, {
        params: {
            page: x,
            size: y,
            isPublic: activeType,
        }
    })
    return response.data;
}

export async function fetchSurveyTypeRecentPage(
    x: number | undefined,
    y: number | undefined,
    isPublic: boolean | undefined,
) :Promise<ApiPageResponse<SurveyTypeRecent>>{
    const response = await axiosAuth.get<ApiPageResponse<SurveyTypeRecent>>(`/api/survey-type/recent`, {
        params: {
            page: x,
            size: y,
            isPublic: isPublic
        }
    })
    return response.data;
}

export async function fetchSurveyTypeStatusPage(
    x: number | undefined,
    y: number | undefined,
    isPublic: boolean | undefined,
    status: string | undefined,
) :Promise<ApiPageResponse<SurveyTypeStatusList>>{
    console.log('isPublic: ', isPublic);
    console.log('status: ', status);
    const response = await axiosAuth.get<ApiPageResponse<SurveyTypeStatusList>>(`/api/survey-type/status`, {
        params: {
            page: x,
            size: y,
            isPublic: isPublic,
            status: status,
        }
    })
    console.log('ts 에서 데이터 확인: ', response.data);
    return response.data;
}