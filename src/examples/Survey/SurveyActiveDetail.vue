<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import ArgonPagination from '@/components/ArgonPagination.vue';
import ArgonPaginationItem from '@/components/ArgonPaginationItem.vue';
import { PageResponseType } from '@/types/page';

import { SuveyTypeDetailList } from '@/types/survey-type';
import { formatDateDetail } from '@/utils/date';
import { fetchSurveyTypeStatusPage } from '@/api/survey-type';
import { SurveyTypeStatusList } from '@/types/survey-type';
import { formatDate } from "@/utils/date";
const surveyTypeStatusData = ref<SurveyTypeStatusList[]>();
const isPublic = ref<boolean>(false);
onMounted(async () => {
    const response = await fetchSurveyTypeStatusPage(0, 10, isPublic.value, 'ACTIVE');
    surveyTypeStatusData.value = response.data.content;
    pageData.value = response.data.page;
})

const pageData = ref<PageResponseType>();
const currentPage = ref<number>(0);
const groupSize = 10;
const currentGroup = computed(() => Math.floor(currentPage.value / groupSize));
const paginatedPages = computed(() => {
    const total = pageData.value?.totalPages ?? 1;
    const start = currentGroup.value * groupSize + 1;
    const end = Math.min(start + groupSize - 1, total);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const selectedSurvey = ref<SuveyTypeDetailList | any>(null);
const showDetailModal = ref(false);
const showEditModal = ref(false);

const getRowNumber = (index: number) => {
    return currentPage.value * groupSize + index + 1;
};

const onChangeType = async (pub: boolean) => {
    isPublic.value = pub;
    const response = await fetchSurveyTypeStatusPage(0, 10, isPublic.value, 'ACTIVE')
    surveyTypeStatusData.value = response.data.content;
    pageData.value = response.data.page;
}

const openDetailModal = (survey: SuveyTypeDetailList) => {
    selectedSurvey.value = survey;
    showDetailModal.value = true;
};

const openEditModal = (survey: SuveyTypeDetailList) => {
    selectedSurvey.value = survey;
    showEditModal.value = true;
};

const closeModal = () => {
    showDetailModal.value = false;
    showEditModal.value = false;
    selectedSurvey.value = null;
};

const changePage = async (page: number) => {
    console.log('isPublic.value: ', isPublic.value);
    if (page < 0 || (pageData.value && page >= pageData.value.totalPages)) return;
    const response = await fetchSurveyTypeStatusPage(page, 10, isPublic.value, 'ACTIVE');
    surveyTypeStatusData.value = response.data.content;
    pageData.value = response.data.page;
    currentPage.value = page;
};

</script>

<template>
    <div class="container-flud">
        <div class="card mb-4">
            <div class="card-header pb-0">
                <h6>진행 중인 설문 리스트</h6>
            </div>
            <div class="card-header pb-0 p-3">
                <div class="row justify-content-end">
                    <div class="col-auto">
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm"
                                :class="isPublic === true ? 'btn-success' : 'btn-outline-success'"
                                @click="onChangeType(true)" style="min-width: 90px;">
                                공통
                            </button>
                            <button class="btn btn-sm"
                                :class="isPublic === false ? 'btn-success' : 'btn-outline-success'"
                                @click="onChangeType(false)" style="min-width: 90px;">
                                내병원
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-body px-0 pt-0 pb-2">
                <div class="table-responsive p-0">
                    <table class="table align-items-center justify-content-center mb-0">
                        <thead>
                            <tr>
                                <th
                                    class="text-uppercase text-secondary font-weight-bolder fw-bold opacity-7 text-center">
                                    No
                                </th>
                                <th class="text-uppercase text-secondary font-weight-bolder opacity-7">
                                    설문주제
                                </th>

                                <th
                                    class="text-uppercase text-secondary font-weight-bolder fw-bold opacity-7 ps-2 text-center">
                                    양식 생성일
                                </th>

                                <th
                                    class="text-uppercase text-secondary fw-bold font-weight-bolder text-center opacity-7 text-center">
                                    시작일
                                </th>

                                <th
                                    class="text-uppercase text-secondary fw-bold font-weight-bolder text-center opacity-7 text-center">
                                    종료일
                                </th>
                                <th
                                    class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">
                                </th>
                            </tr>
                        </thead>
                        <tbody class="border-bottom border-light" v-for="(active, index) in surveyTypeStatusData"
                            :key="`${active.id}-${active.createdAt}`">
                            <tr>
                                <td class="text-center">

                                    <div class="d-flex align-items-center gap-2 text-center">
                                        <p class="text-sm font-weight-bold mb-0 ">{{ getRowNumber(index) }}</p>
                                    </div>
                                </td>
                                <td class="border-light">
                                    <p class="text-sm font-weight-bolder mb-0">{{ active.name }}</p>
                                </td>
                                <td class="text-center">
                                    <p class="text-sm font-weight-bold mb-0">
                                        {{ formatDate(active.createdAt) }}
                                    </p>
                                </td>
                                <td class="text-center">
                                    <p class="text-sm font-weight-bold mb-0">
                                        {{ formatDate(active.openAt) }}
                                    </p>
                                </td>
                                <td class="text-center">
                                    <p class="text-sm font-weight-bold mb-0">
                                        {{ formatDate(active.closeAt) }}
                                    </p>
                                </td>

                                <td class="align-middle position-relative">
                                    <div class="dropdown">
                                        <button class="btn btn-link text-secondary mb-0 dropdown-toggle" type="button"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <!-- <button class="dropdown-item" @click="openDetailModal(survey)">
                                                    <i class="fa fa-eye me-2 text-sm"></i> 자세히 보기
                                                </button> -->
                                            </li>
                                            <li>
                                                <!-- <button class="dropdown-item" @click="openEditModal(survey)">
                                                    <i class="fa fa-edit me-2 text-sm"></i> 설문 수정
                                                </button> -->
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="showDetailModal" class="modal fade show d-block" tabindex="-1"
                        style="background-color: rgba(0,0,0,0.5);">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">설문 유형 상세</h5>
                                    <button type="button" class="btn-close" @click="closeModal"></button>
                                </div>
                                <div class="modal-body">
                                    <p><strong>설문 주제:</strong> {{ selectedSurvey?.name }}</p>
                                    <p><strong>생성일:</strong> {{ formatDateDetail(selectedSurvey?.createdAt) }}</p>
                                    <p><strong>최근 수정일:</strong> {{ formatDateDetail(selectedSurvey?.updatedAt) }}</p>
                                    <p><strong>삭제일:</strong> {{ formatDateDetail(selectedSurvey?.deletedAt) || '없음' }}
                                    </p>
                                    <p><strong>사용중인 설문 수:</strong> {{ selectedSurvey?.usageCount }}</p>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-secondary" @click="closeModal">닫기</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1"
                        style="background-color: rgba(0,0,0,0.5);">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">설문 유형 수정</h5>
                                    <button type="button" class="btn-close" @click="closeModal"></button>
                                </div>
                                <div class="modal-body">

                                    <input type="text" class="form-control" v-model="selectedSurvey.name" />
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-primary">저장</button>
                                    <button class="btn btn-secondary" @click="closeModal">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ArgonPagination variant="gradient" color="secondary" class="mt-3 justify-content-center">

                        <ArgonPaginationItem :disabled="currentGroup === 0"
                            @click="changePage((currentGroup - 1) * groupSize)" prev />

                        <ArgonPaginationItem v-for="page in paginatedPages" :key="page"
                            :active="(page - 1) === currentPage" @click="changePage(page - 1)">
                            {{ page }}
                        </ArgonPaginationItem>

                        <ArgonPaginationItem :disabled="(currentGroup + 1) * groupSize >= (pageData?.totalPages ?? 0)"
                            @click="changePage((currentGroup + 1) * groupSize)" next />
                    </ArgonPagination>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>