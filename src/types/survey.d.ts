export interface SurveyPostType {
    title: string;
    category: categoryMap;
    content: string;
    openAt: string;
    closeAt: string;
    surveyTypeId: number;
    surveyDepartId: number | undefined;
    hospitalId: number;
    isVisible: boolean;
    usersId: number;
}

export interface SurveyUpdateDTO {
    id: number;
    category: CategoryMap;
    title: string;
    content: string;
    updatedAt: string;
    openAt: string;
    closeAt: string;
    isVisible: boolean;
    surveyDepartId: number;
    surveyTypeId: number;
}

export type CategoryMap = Record<string, string>;

export interface SurveyHospitalType {
    id: number;
    title: string;
    category: string;
    createdAt: string;
    openAt: string;
    closeAt: string;
    visible: boolean;
    surveyStatus: string;
    surveyTypeName: string;
    surveyDepartName: string;
}

export interface SurveyDetailDTO {
    id: number;
    title: string;
    category: string;
    content: unknown;
    createdAt: string;
    openAt: string;
    closeAt: string;
    surveyDepartId: number;
    surveyTypeId: number;
    writer: string;
}

