export interface CommonSurvey {
    id: number;
    title: string;
    surveyTypeName: string;
    category: string;
    description: string;
    openAt: string;
    closeAt: string;
    surveyStatus: string;
}

export interface CommonSurveyTemplate {
    id: number;
    title: string;
    category: string;
    content: string;
}