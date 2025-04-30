export interface SurveyPostType {
    title: string;
    category: categoryMap;
    content: string;
    openAt: string;
    closeAt: string;
    surveyTypeId: number;
    surveyDepartId: number | undefined;
    hospitalId: number;
    usersId: number;
}

export type CategoryMap = Record<string, string>;

export interface SurveyHospitalType {
    id: number;
    title: string;
    category: string;
    createdAt: string;
    openAt: string;
    closeAt: string;
    surveyStatus: string;
    surveyTypeName: string;
    surveyDepartName: string;
}