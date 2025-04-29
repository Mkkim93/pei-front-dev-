export interface SurveyTypeList {
    id: number;
    name: string;
    description: string;
}

export interface SurveyPostType {
    category: string;
    content : string;
    surveyType: string;
    surveyDepart: string;
    hospital: string;
}