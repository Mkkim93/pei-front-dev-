import { SurveyMetaStoreType } from "@/types/common/survey-res";

interface SurveyResState {
    surveyResMeta: SurveyMetaStoreType;
    surveyTitle: string;
}

const state = () => ({
    surveyResMeta: [],
    surveyTitle: ','
});

const mutations = {
    setSurveyMetaStore(state: SurveyResState, data: SurveyMetaStoreType) {
        state.surveyResMeta = data;
    },
    setSurveyTitle(state: SurveyResState, data: string) {
        state.surveyTitle = data;
    }
};

const actions = {

}

const getters = {
    surveyResMeta: (state : SurveyResState) => state.surveyResMeta,
    surveyTitle: (state : SurveyResState) => state.surveyTitle,
}

export default {
    mutations,
    actions,
    state,
    getters,
}