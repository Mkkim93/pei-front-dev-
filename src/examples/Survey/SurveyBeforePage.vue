<script setup lang="ts">
import { onMounted, ref, reactive, toRaw } from 'vue';
import { useStore } from 'vuex';

import { decodePayload } from '@/types/jwt.d';
import { SurveyPostType, CategoryMap } from '@/types/survey';
import { SurveyTypeList } from '@/types/survey-type';
import { SurveyDepartList } from '@/types/survey-depart';

import { fetchsurveyTypeList } from '@/api/survey-type';
import { fetchCategoryList } from '@/api/survey';
import { fetchSurveyDepartList } from '@/api/survey-depart';

import ArgonRadio from '@/components/ArgonRadio.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';

const store = useStore();
const surveyType = ref<SurveyTypeList[]>();
const surveyTypeSelectedId = ref<number>(0);
const surveyDepartSelectedId = ref<number>(1);
const surveyCategoryList = ref<string[] | any>([]);
const selectedCategory = ref<CategoryMap>();
const selectedOpenAt = ref<string>('');
const selectedCloseAt = ref<string>('');
const inputTitle = ref<string>('');
const surveyDepartType = ref<SurveyDepartList[]>([]);
const onlylistPlag = ref<boolean>(true);

const postSurveyStorage = reactive<SurveyPostType>({
  title: '',
  category: '',
  content: '',
  openAt: '',
  closeAt: '',
  surveyTypeId: 0,
  surveyDepartId: 0,
  hospitalId: 0,
  usersId: 0,
})

onMounted(async () => {
  const typeResponse = await fetchsurveyTypeList(0, 10);
  surveyType.value = typeResponse.data.content;

  const cateResponse: string[] | any = await fetchCategoryList();
  surveyCategoryList.value = cateResponse.data;

  const departResponse: SurveyDepartList[] | any = await fetchSurveyDepartList(0, 20, onlylistPlag.value);
  surveyDepartType.value = departResponse.data;
})

const SurveyCreator = async () => {
  const token = store.getters.accessToken;
  const resToken = await decodePayload(token);
  postSurveyStorage.usersId = resToken.id;
  postSurveyStorage.hospitalId = resToken.hospital;
  postSurveyStorage.title = inputTitle.value;
  postSurveyStorage.category = selectedCategory.value;
  postSurveyStorage.openAt = selectedOpenAt.value;
  postSurveyStorage.closeAt = selectedCloseAt.value;
  postSurveyStorage.surveyTypeId = surveyTypeSelectedId.value;
  postSurveyStorage.surveyDepartId = surveyDepartSelectedId.value;
  store.commit("setSurveyPostData", toRaw(postSurveyStorage));
}
</script>

<template>
  <div class="container px-4">
    <div class="card mt-5">
      <div class="card-header pb-0">
        <h5 class="mb-0">[STEP 1] 설문 기본 정보 설정</h5>
        <p class="text-sm text-muted mb-0">설문 작성 전에 필요한 항목을 선택하세요.</p>
      </div>

      <div class="card-body">
        <div class="mb-4">
          <label for="surveyTitle" class="form-label fw-bold">설문명
            <ArgonInput type="String" id="surveyTitle" name="surveyTitle" style="width: 400px;" v-model="inputTitle" size="lg" placeholder="설문 제목을 입력해주세요"></ArgonInput>
          </label>
        </div>

        <!-- 설문 유형 -->
        <div class="mb-4">
          <label for="surveyTypeSelect" class="form-label fw-bold">설문 유형 선택</label>
          <select 
          id="surveyTypeSelect" 
          class="form-select" 
          v-if="surveyType" 
          v-model="surveyTypeSelectedId"
          >
          
            <option v-for="type in surveyType" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>

        <!-- 설문 대상 진료과 선택 (선택 사항) -->
        <div class="mb-4">
          <label for="form-label fw-bold">진료과 선택</label>
          
          <select
          id="surveyDepartSelect"
          class="form-select"
          v-if="surveyDepartType"
          v-model="surveyDepartSelectedId"
          >
          <option v-for="depart in surveyDepartType" :key="depart.id" :value="depart.id">
            {{ depart.name }}
          </option>
        </select>
        </div>

        <!-- 설문 분류 (외래/입원/공통) -->

        <div class="mb-4">
          <label class="form-label fw-bold">설문 분류</label>
          <div class="d-flex flex-wrap gap-3">
            <div class="form-check form-check-radio d-flex align-items-center" v-for="cate in surveyCategoryList"
              :key="cate">
              <ArgonRadio id="cate" class="form-check-input me-2" name="cate" v-model="selectedCategory"
                :value="cate" />
              <label class="form-check-label mb-0 text-nowrap">{{ cate }}</label>
            </div>
          </div>
        </div>

        <label>설문 기간
        <div class="mb-4">
          <div class="d-flex align-items-center gap-4">
            <div class="d-flex flex-column">
              <label class="form-label fw-bold">시작일</label>
              <ArgonInput type="datetime-local" v-model="selectedOpenAt" />
            </div>
            <p> ~ </p>
            <div class="d-flex flex-column">
              <label class="form-label fw-bold">종료일</label>
              <ArgonInput type="datetime-local" v-model="selectedCloseAt" />
            </div>
          </div>
        </div>
      </label>


        <!-- 다음 버튼 -->
        <div class="mt-4">
          <router-link to="/survey-creator">
          <argon-button color="primary" class="w-100" @click="SurveyCreator">다음으로</argon-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.form-check-input {
  white-space: normal;
  word-break: break-word;
}
</style>