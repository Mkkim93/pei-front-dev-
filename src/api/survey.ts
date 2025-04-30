import axiosPublic from '@/plugins/axiosPublic';
import axiosAuth from '@/plugins/axiosAuth';
import { ApiPageResponse } from '@/types/api';
import { SurveyPostType, CategoryMap, SurveyHospitalType } from '@/types/survey';

export async function testSurvey() {
    const response = await axiosPublic.get('/api/survey');
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