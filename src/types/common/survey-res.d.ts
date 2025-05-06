// 환자 응답을 위한 타입 데이터
export interface SurveyResponseMetaType {
    wardList: WardList[],
    departList: DepartList[],
    ageGroup: ageGroupList[],
    genderType: genderTypeList[],
}

// 추가될 가능성 있음 (환자나이, 성별 등)
export interface SurveyMetaStoreType {
    wardId: number;
    departId: number;
    ageGroup: string;
    genderType: string;
    submittedAt: string;
}

type ageGroupList = {
    string: [],
}

type genderTypeList = {
    string: [],
}

type DepartList = {
    id: number;
    name: string;
}

type WardList = {
    id: number;
    name: string;
}

// 설문 완료 시 최종적으로 서버로 보낼 DTO
export interface SurveyResponsePostType {
    
    answerContent: string;
    submittedAt: string; // 작성 시점
    
    surveyId: number;
    wardId: number;
    departId: number;

    ageGroup: string;
    genderType: string;
}