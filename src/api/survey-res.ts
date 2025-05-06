import axiosPublic from "@/plugins/axiosPublic";
import { SurveyResponseMetaType, SurveyResponsePostType } from "@/types/common/survey-res";
import { ApiResponse } from "@/types/api";

export async function fetchResponseMetaData(hospitalId : number) :Promise<ApiResponse<SurveyResponseMetaType>>{
    const response = await axiosPublic.get<ApiResponse<SurveyResponseMetaType>>(`/api/survey-res?hospitalId=${hospitalId}`);
    return response.data;
}

// 최종 설문 서버 전송
export async function postSurveyResponseData(obj :SurveyResponsePostType) {
    const response = await axiosPublic.post(`/api/survey-res`, obj);
    return response.data;
}