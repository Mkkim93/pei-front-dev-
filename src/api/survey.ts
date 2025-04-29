import axiosPublic from '@/plugins/axiosPublic';
import { SurveyPostType } from '@/types/survey';

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