import axiosPublic from '@/plugins/axiosPublic';
import axiosAuth from '@/plugins/axiosAuth';
import { ApiPageResponse } from '@/types/api';
import { SurveyTypeList } from '@/types/survey-type';

export async function fetchsurveyTypeList(
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