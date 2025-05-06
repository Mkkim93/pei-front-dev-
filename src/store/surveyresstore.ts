import { SurveyMetaStoreType } from "@/types/common/survey-res";

interface SurveyResState {
    surveyResMeta: SurveyMetaStoreType;
}

const state = () => ({
    surveyResMeta: [],
});

const mutations = {
    setSurveyMetaStore(state: SurveyResState, data: SurveyMetaStoreType) {
        state.surveyResMeta = data;
    }
};

const actions = {

}

const getters = {
    surveyResMeta: (state : SurveyResState) => state.surveyResMeta,
}

export default {
    mutations,
    actions,
    state,
    getters,
}