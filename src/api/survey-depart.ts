import axiosPublic from '@/plugins/axiosPublic';
import { SurveyDepartList } from '@/types/survey-depart';
import { ApiPageResponse } from '@/types/api';
export async function fetchSurveyDepartList(
    x: number | undefined,
    y: number | undefined,
    plag: boolean,
) :Promise<ApiPageResponse<SurveyDepartList>>{
    const response = await axiosPublic.get<ApiPageResponse<SurveyDepartList>>('/api/survey-depart', {
        params: {
            page: x,
            size: y,
            all: plag
        }
    });
    return response.data;
}