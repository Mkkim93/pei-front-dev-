import axiosPublic from '@/plugins/axiosPublic';
import { ApiPageResponse } from '@/types/api';
import { SurveyTypeList } from '@/types/survey-type';

export async function fetchsurveyTypeList(
    x: number | undefined,
    y: number | undefined,
) : Promise<ApiPageResponse<SurveyTypeList>> {
    const response = await axiosPublic.get<ApiPageResponse<SurveyTypeList>>(`/api/survey-type`, {
        params: {
            page: x,
            size: y
        }
    })
    return response.data;
}