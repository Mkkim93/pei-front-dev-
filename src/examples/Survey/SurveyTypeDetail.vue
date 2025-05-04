<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import ArgonPagination from '@/components/ArgonPagination.vue';
import ArgonPaginationItem from '@/components/ArgonPaginationItem.vue';
import { PageResponseType } from '@/types/page';
import { fetchSurveyTypeUsagePage } from '@/api/survey-type';
import { SuveyTypeDetailList } from '@/types/survey-type';
import { formatDateDetail } from '@/utils/date';

const surveyTypeDetailList = ref<SuveyTypeDetailList[]>([]);
const pageData = ref<PageResponseType>();
const currentPage = ref<number>(0);
const groupSize = 10; // 한 번에 보여줄 페이지 수
const currentGroup = computed(() => Math.floor(currentPage.value / groupSize));
const paginatedPages = computed(() => {
    const total = pageData.value?.totalPages ?? 1;
    const start = currentGroup.value * groupSize + 1;
    const end = Math.min(start + groupSize - 1, total);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const getRowNumber = (index: number) => {
    return currentPage.value * groupSize + index + 1;
};

const selectedSurvey = ref<SuveyTypeDetailList | any>(null);
const showDetailModal = ref(false);
const showEditModal = ref(false);

const activeType = ref<boolean>(true);

const onChangeType = async (isPublic :boolean) => {
    activeType.value = isPublic;
    const response = await fetchSurveyTypeUsagePage(0, 10, activeType.value)
    surveyTypeDetailList.value = response.data.content;
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


onMounted(async () => {
    console.log('surveyTypeDetail 컴포넌트 랜더링');
    const response = await fetchSurveyTypeUsagePage(0, 10, activeType.value);
    console.log('디테일에서 타입 목록 응답: ', response);
    surveyTypeDetailList.value = response.data.content;
    pageData.value = response.data.page;
})

const changePage = async (page: number) => {
    if (page < 0 || (pageData.value && page >= pageData.value.totalPages)) return;
    const response = await fetchSurveyTypeUsagePage(0, 10, activeType.value);
    surveyTypeDetailList.value = response.data.content;
    pageData.value = response.data.page;
    currentPage.value = page;
};
</script>

<template>
    <div class="container-flud">
        <div class="card mb-4">
            <div class="card-header pb-0">
                <h6>설문 유형 목록</h6>
            </div>
            <div class="card-header pb-0 p-3">
      <div class="row">
        <div class="col-6 d-flex align-items-center">
          <h6 class="mb-0">설문 유형</h6>
        </div>
        <div class="col-6 text-end">
          <!-- ✅ 필터 버튼 그룹을 카드 안에서 꽉 차게 유지 -->
          <div class="btn-group w-100" role="group">
            <button class="btn btn-sm" :class="activeType === true ? 'btn-success' : 'btn-outline-success'"
              @click="onChangeType(true)" style="flex: 1 1 0; min-width: 80px; max-width: 100%; white-space: nowrap;">
              내병원
            </button>
            <button class="btn btn-sm" :class="activeType === false ? 'btn-success' : 'btn-outline-success'"
              @click="onChangeType(false)"
              style="flex: 1 1 0; min-width: 80px; max-width: 100%; white-space: nowrap;">
              공통
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
                                    최근 수정일
                                </th>

                                <th
                                    class="text-uppercase text-secondary fw-bold font-weight-bolder text-center opacity-7 text-center">
                                    삭제일
                                </th>

                                <th
                                    class="text-uppercase text-secondary fw-bold font-weight-bolder text-center opacity-7 text-center">
                                    사용 중인 설문
                                </th>
                                <th
                                    class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">
                                </th>
                            </tr>
                        </thead>
                        <tbody class="border-bottom border-light" v-for="(survey, index) in surveyTypeDetailList"
                            :key="survey.id">
                            <tr>
                                <td class="text-center">

                                    <div class="d-flex align-items-center gap-2 text-center">
                                        <p class="text-sm font-weight-bold mb-0 ">{{ getRowNumber(index) }}</p>
                                    </div>
                                </td>
                                <td class="border-light">
                                    <p class="text-sm font-weight-bolder mb-0">{{ survey.name }}</p>
                                </td>
                                <td class="text-center">
                                    <p class="text-sm font-weight-bold mb-0">
                                        {{ formatDateDetail(survey.createdAt) }}
                                    </p>
                                </td>
                                <td class="text-center">
                                    <p class="text-sm font-weight-bold mb-0">
                                        {{ formatDateDetail(survey.updatedAt) }}
                                    </p>
                                </td>
                                <td class="text-center">
                                    <p class="text-sm font-weight-bold mb-0">
                                        {{ formatDateDetail(survey.deletedAt) }}
                                    </p>
                                </td>
                                <td class="text-center">
                                    <p class="text-sm font-weight-bold mb-0">
                                        {{ survey.usageCount }}
                                    </p>
                                </td>
                                <td class="align-middle position-relative">
                                    <div class="dropdown">
                                        <button class="btn btn-link text-secondary mb-0 dropdown-toggle" type="button"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <button class="dropdown-item" @click="openDetailModal(survey)">
                                                    <i class="fa fa-eye me-2 text-sm"></i> 자세히 보기
                                                </button>
                                            </li>
                                            <li>
                                                <button class="dropdown-item" @click="openEditModal(survey)">
                                                    <i class="fa fa-edit me-2 text-sm"></i> 설문 수정
                                                </button>
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
                                    <p><strong>삭제일:</strong> {{ formatDateDetail(selectedSurvey?.deletedAt) || '없음' }}</p>
                                    <p><strong>사용중인 설문 수:</strong> {{ selectedSurvey?.usageCount }}</p>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-secondary" @click="closeModal">닫기</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 수정 모달 (기본 틀만) -->
                    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1"
                        style="background-color: rgba(0,0,0,0.5);">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">설문 유형 수정</h5>
                                    <button type="button" class="btn-close" @click="closeModal"></button>
                                </div>
                                <div class="modal-body">
                                    <!-- 입력 폼 예시 -->
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