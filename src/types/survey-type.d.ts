export interface SurveyTypeList {
    id: number;
    name: string;
    updatedAt?: string;
    description: string;
}

export interface SurveyTypeRecent {
    id: number;
    name: string;
    updatedAt: string;
}

export interface SuveyTypeDetailList {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    usageCount: number;
}

export interface SurveyTypeStatusList {
    // SurveyType
    id: number;
    name: string;
    description: string;

    // Survey
    title: string;
    category: string;
    surveyStatus: string;
    openAt: string;
    closeAt: string;
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
    visible: boolean;

    // SurveyDepart
    departName: string;

    // Hospital
    hospitalName: string;
}