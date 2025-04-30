import { SurveyPostType } from "@/types/survey";

interface SurveyState {
    survey: SurveyPostType;
}

const state = (): SurveyPostType | any => ({
    survey: [],
});

const mutations = {
    setSurveyPostData(state: SurveyState, data: SurveyPostType) {
        state.survey = data;
    },
};

const actions = {

}

const getters = {
    survey: (state : SurveyState) => state.survey,
}

export default {
    mutations,
    actions,
    state,
    getters,
};