<script setup lang="ts">
import { reactive, onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { SurveyCreatorComponent } from "survey-creator-vue";
import { SurveyCreatorModel } from "survey-creator-core";
import { surveyLocalization } from "survey-core";

import { SurveyPostType } from "@/types/survey";
import { postSurvey } from '@/api/survey';

import ArgonButton from '@/components/ArgonButton.vue';

const route = useRoute();
const surveyId = computed(() => route.params.id);

surveyLocalization.locales["ko"] = {
  pagePrevText: "이전",
  pageNextText: "다음",
  completeText: "완료",
  previewText: "미리보기",
  editText: "편집",
  startSurveyText: "설문 시작",
  otherItemText: "기타(직접 입력)",
  noneItemText: "없음",
  selectAllItemText: "전체 선택",
  progressText: "페이지 {0} / {1}",
  indexText: "{0}의 {1}",
  panelDynamicProgressText: "{0} / {1} 패널 완료",
  panelDynamicTabTextFormat: "패널 {panelIndex}",
  questionsProgressText: "답변 완료 {0} / {1} 문항",
  emptySurvey: "설문에 페이지나 질문이 없습니다.",
  completingSurvey: "설문을 완료해주셔서 감사합니다!",
  completingSurveyBefore: "이미 이 설문을 완료하셨습니다.",
  loadingSurvey: "설문을 불러오는 중입니다...",
  placeholder: "선택하세요...",
  
  // 오류 메시지
  requiredError: "이 질문은 필수 항목입니다.",
  requiredErrorInPanel: "모든 질문에 답변해주세요.",
  requiredInAllRowsError: "모든 행에 답변이 필요합니다.",
  numericError: "값은 숫자여야 합니다.",
  textMinLength: "{0}자 이상 입력해야 합니다.",
  textMaxLength: "{0}자 이내로 입력해야 합니다.",
  textMinMaxLength: "{0}자 이상 {1}자 이내로 입력해야 합니다.",
  minRowCountError: "최소 {0}개 이상의 행을 선택해야 합니다.",
  minSelectError: "최소 {0}개 이상 선택해야 합니다.",
  maxSelectError: "{0}개 이하로 선택할 수 있습니다.",
  numericMinMax: "{0}보다 크거나 같고 {1}보다 작거나 같은 수를 입력하세요.",
  numericMin: "{0}보다 크거나 같은 수를 입력하세요.",
  numericMax: "{0}보다 작거나 같은 수를 입력하세요.",
  invalidEmail: "유효한 이메일 주소를 입력하세요.",
  invalidExpression: "표현식: {0}이(가) 'false'를 반환합니다.",
  urlRequestError: "요청 중 오류가 발생했습니다: {0}. {1}",
  urlGetChoicesError: "요청이 비어 있거나 잘못되었습니다.",
  exceedMaxSize: "파일 크기는 {0}MB를 초과할 수 없습니다.",
  otherRequiredError: "기타 항목에 값을 입력하세요.",
  uploadingFile: "파일 업로드 중입니다. 잠시 기다려 주세요...",
  loadingFile: "로드 중...",
  chooseFile: "파일 선택...",
  
  // 설문 진행 관련
  removeFile: "선택한 파일 삭제",
  booleanCheckedLabel: "예",
  booleanUncheckedLabel: "아니오",
  confirmDelete: "정말 삭제하시겠습니까?",
  confirmDeleteFile: "정말 이 파일을 삭제하시겠습니까?",
  addRow: "행 추가",
  removeRow: "행 삭제",
  addPanel: "패널 추가",
  removePanel: "패널 삭제",
  choices_Item: "항목",

  // 기본 텍스트
  matrixDragHandleHint: "드래그하여 행 순서 변경",
  emptyRowsText: "행이 없습니다.",
  multipleTextItems: "텍스트 입력란",
  savingData: "서버에 결과를 저장하는 중입니다...",
  savingDataError: "오류가 발생하여 결과를 저장할 수 없습니다.",
  savingDataSuccess: "결과가 저장되었습니다!",
  
  saveAgainButton: "다시 시도",
  timerMin: "분",
  timerSec: "초",
  timerSpentAll: "총 시간: {0}",
  timerSpentPage: "이 페이지 시간: {0}",
  timerSpentSurvey: "설문 총 시간: {0}",
  timerLimitAll: "총 시간 제한: {0}",
  timerLimitPage: "이 페이지 시간 제한: {0}",
  timerLimitSurvey: "설문 전체 시간 제한: {0}",
  clearCaption: "지우기",
  signaturePlaceHolder: "서명하세요",
  chooseFileCaption: "파일 선택",
  removeFileCaption: "파일 삭제",
  booleanCheckedLabelTrue: "예",
  booleanCheckedLabelFalse: "아니오",
  confirmRemoveFile: "이 파일을 삭제하시겠습니까?",
  confirmRemoveAllFiles: "모든 파일을 삭제하시겠습니까?",
  surveyTitlePlaceholder: "설문 제목",
  pageTitlePlaceholder: "페이지 제목",
  questionTitlePlaceholder: "질문 제목",
  surveyDescriptionPlaceholder: "설문 설명",
  pageDescriptionPlaceholder: "페이지 설명",
  descriptionPlaceholder: "설명 입력",
};

surveyLocalization.currentLocale = "ko"; // ✅ 한국어 적용 완료

const store = useStore();
const creator = new SurveyCreatorModel();
creator.showLogicTab = true;
creator.showThemeTab = true;

const postData = reactive<SurveyPostType>({
    title: '',
    category: '',
    content: '',
    openAt: '',
    closeAt: '',
    surveyTypeId: 0,
    surveyDepartId: 0,
    hospitalId: 0,
    usersId: 0,
});

const saveSurvey = async () => {
    const json = creator.JSON;
    console.log("설문 JSON:", json);
    console.log('스토어로 받은 survey 데이터', store.getters.surveyDetail);
    postData.content = json;
    console.log('postData.content: ', postData.content);
    const response = await postSurvey(postData);
    // TODO 저장 후 로직 
}

onMounted( async () => {
  // 기존 양식 수정 모드
  if (surveyId.value) {
    Object.assign(postData, store.getters.surveyDetail);
    console.log('수정폼 postData: ', postData);
    creator.JSON = postData.content;
  }
  
  // 새로운 양식 작성 모드
  else if(!surveyId.value) {
    Object.assign(postData, store.getters.survey);
    console.log('신규폼 postData: ', postData);
    creator.JSON = postData.content;
  }
})

</script>

<template>
    <div class="creator-wrapper">
      <SurveyCreatorComponent :model="creator" />
      <div class="bottom-button-wrapper">
        <argon-button @click="saveSurvey">설문 저장</argon-button>
      </div>
    </div>
  </template>
  
  <style scoped>
  .creator-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 1rem;
    box-sizing: border-box;
  }
  
  .svc-creator {
    flex: 1 1 auto;
    min-height: 0;
  }
  
  .bottom-button-wrapper {
    padding-top: 1rem;
    text-align: right;
  }
  </style>
  
