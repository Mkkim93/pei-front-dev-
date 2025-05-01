import { SurveyPostType, SurveyDetailDTO } from "@/types/survey";

interface SurveyState {
    survey: SurveyPostType;
    surveyDetail: SurveyDetailDTO;
}

const state = () => ({
    survey: [],
    surveyDetail: [],
});

const mutations = {
    setSurveyPostData(state: SurveyState, data: SurveyPostType) {
        state.survey = data;
    },
    setUpdateSurveyData(state: any, data: any) {
        state.surveyDetail = data;
    }
};

const actions = {

}

const getters = {
    survey: (state : SurveyState) => state.survey,
    surveyDetail: (state : SurveyState) => state.surveyDetail,
}

export default {
    mutations,
    actions,
    state,
    getters,
};