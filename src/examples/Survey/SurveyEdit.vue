<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import router from '@/router';

import { ApiResponse } from '@/types/api';
import { SurveyTypeList } from '@/types/survey-type';
import { SurveyDepartList } from '@/types/survey-depart';
import { CategoryMap, SurveyDetailDTO } from '@/types/survey';

import { fetchSurveyTemplate, fetchCategoryList } from '@/api/survey';
import { fetchSurveyDepartList } from '@/api/survey-depart';
import { fetchsurveyTypeList } from '@/api/survey-type';

import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonRadio from '@/components/ArgonRadio.vue';

const route = useRoute();
const store = useStore();
const modifiy = ref<boolean>(false);
const surveyId = computed(() => route.params.id);
const beforeData = ref<any>();

const surveyType = ref<SurveyTypeList[]>();
const surveyCategoryList = ref<string[] | any>([]);
const surveyDepartType = ref<SurveyDepartList[]>([]);

const surveyDepartSelectedId = ref<number>(1);
const surveyTypeSelectedId = ref<number>();
const selectedCategory = ref<CategoryMap | any>();
const selectedOpenAt = ref<string>();
const selectedCloseAt = ref<string>();

onMounted(async () => {
    modifiy.value = true;
    const id = Number(surveyId.value);
    const response: ApiResponse<SurveyDetailDTO> | any = await fetchSurveyTemplate(id);
    const departresponse: SurveyDepartList[] | any = await fetchSurveyDepartList(0, 20, true);
    const typeResponse = await fetchsurveyTypeList(0, 10, undefined);
    const cateReponse = await fetchCategoryList();

    surveyType.value = typeResponse.data.content;
    surveyDepartType.value = departresponse.data;
    surveyCategoryList.value = cateReponse.data;

    beforeData.value = response.data;
    console.log('responseData: ', response.data);
    console.log('beforeData: ', beforeData.value);

    surveyDepartSelectedId.value = beforeData.value.surveyDepartId;
    surveyTypeSelectedId.value = beforeData.value.surveyTypeId;
    selectedCategory.value = beforeData.value.category;
});

const updatedBeforeData = () => {
    beforeData.value.surveyDepartId = surveyDepartSelectedId.value;
    beforeData.value.surveyTypeId = surveyTypeSelectedId.value;
    beforeData.value.category = selectedCategory.value;
    beforeData.value.openAt = selectedOpenAt.value;
    beforeData.value.closeAt = selectedCloseAt.value;
    store.commit('setUpdateSurveyData', beforeData.value);
    router.push(`/survey-creator/${beforeData.value.id}`);
}
</script>

<template>
    <div class="container-flud position-relative">

        <div v-if="modifiy" class="card mt-5">
            <div class="card-header pb-0">
                <h5 class="mb-0">설문 기본 정보 수정</h5>
                <p class="text-sm text-muted mb-0">수정할 항목을 선택하세요.</p>
            </div>

            <div class="card-body" v-if="beforeData">
                <div class="mb-4">
                    <label for="title" class="form-label fw-bold">설문명 </label>
                    <ArgonInput type="String" id="title" name="title" v-model="beforeData.title" style="width: 400px;"
                        size="lg" />
                </div>
                <!-- 설문 유형 -->
                <div class="mb-4">
                    <label for="surveyTypeSelect" class="form-label fw-bold">설문 유형 선택</label>
                    <select id="updateData" class="form-select" v-if="beforeData" v-model="surveyTypeSelectedId">

                        <option v-for="type in surveyType" :key="type.id" :value="type.id">
                            {{ type.name }}
                        </option>
                    </select>
                </div>

                <!-- 설문 대상 진료과 선택 (선택 사항) -->
                <div class="mb-4">
                    <label for="form-label fw-bold">진료과 선택</label>

                    <select id="surveyDepartSelect" class="form-select" v-if="surveyDepartType"
                        v-model="surveyDepartSelectedId">
                        <option v-for="depart in surveyDepartType" :key="depart.id" :value="depart.id">
                            {{ depart.name }}
                        </option>
                    </select>
                </div>

                <!-- 설문 분류 (외래/입원/공통) -->

                <div class="mb-4">
                    <label class="form-label fw-bold">설문 분류</label>
                    <div class="d-flex flex-wrap gap-3">
                        <div class="form-check form-check-radio d-flex align-items-center"
                            v-for="cate in surveyCategoryList" :key="cate">
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
                <div class="d-flex justify-content-end">
                    <argon-button size="lg" @click="updatedBeforeData">기본 정보 수정</argon-button>
                </div>
            </div>
        </div>
    </div>
</template>