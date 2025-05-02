<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { fetchSurveyHosList } from '@/api/survey';
import { SurveyHospitalType } from '@/types/survey';
import { PageResponseType } from '@/types/page';

import ArgonPagination from '@/components/ArgonPagination.vue';
import ArgonPaginationItem from '@/components/ArgonPaginationItem.vue';
import ArgonBadge from '@/components/ArgonBadge.vue';
const pageData = ref<PageResponseType>();
const surveyContent = ref<SurveyHospitalType[] | any>();
const currentPage = ref<number>(0);
const groupSize = 10; // 한 번에 보여줄 페이지 수
const currentGroup = computed(() => Math.floor(currentPage.value / groupSize));
const paginatedPages = computed(() => {
  const total = pageData.value?.totalPages ?? 1;
  const start = currentGroup.value * groupSize + 1;
  const end = Math.min(start + groupSize - 1, total);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

onMounted(async () => {
  const response = await fetchSurveyHosList(0, 10);
  surveyContent.value = response.data.content;
  console.log(surveyContent.value);
  pageData.value = response.data.page;
})

const changePage = async (page: number) => {
  if (page < 0 || (pageData.value && page >= pageData.value.totalPages)) return;
  const response = await fetchSurveyHosList(page, 10);
  surveyContent.value = response.data.content;
  pageData.value = response.data.page;
  currentPage.value = page;
};
</script>

<template>
  <div class="container-flud">
    <div class="card mb-4">
      <div class="card-header pb-0">
        <h6>설문 양식 목록</h6>
      </div>
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center justify-content-center mb-0">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary font-weight-bolder opacity-7">
                  설문제목
                </th>
                <th class="text-uppercase text-secondary font-weight-bolder opacity-7">
                  설문주제
                </th>
                <th class="text-uppercase text-secondary font-weight-bolder fw-bold opacity-7 ps-2 text-center">
                  설문대상부서
                </th>
                <th class="text-uppercase text-secondary font-weight-bolder fw-bold opacity-7 ps-2 text-center">
                  상태(대기/진행중/종료)
                </th>
                <th class="text-uppercase text-secondary fw-bold font-weight-bolder text-center opacity-7 ps-2">
                  설문진행률
                </th>
                <th class="text-uppercase text-secondary fw-bold font-weight-bolder text-center opacity-7 text-center">
                  공개/비공개
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">
                </th>
              </tr>
            </thead>
            <tbody class="border-bottom border-light" v-for="survey in surveyContent" :key="survey.id">
              <tr>
                <td>
                  <div class="d-flex px-2">
                    <div class="d-flex align-items-center gap-2">
                      <argon-badge variant="gradient"
                        :color="survey.category === '입원' ? 'success' : survey.category === '외래' ? 'info' : 'primary'">
                        <small>{{ survey.category }}</small>
                      </argon-badge>
                      <h6 class="mb-0 text-fs">{{ survey.title }}</h6>
                    </div>
                  </div>
                </td>
                <td class="border-light">
                  <p class="text-sm font-weight-bolder mb-0">{{ survey.surveyTypeName }}</p>
                </td>
                <td>
                  <p class="text-sm font-weight-bolder mb-0 text-center">{{ survey.surveyDepartName }}</p>
                </td>
                <td>
                  <p class="text-sm font-weight-bolder mb-0 text-center">{{ survey.surveyStatus }}</p>
                </td>
                <td class="align-middle text-center">
                  <div class="d-flex align-items-center justify-content-center">
                    <span class="me-2 text-xs font-weight-bolder ">60%</span>
                    <div>
                      <div class="progress">
                        <div class="progress-bar bg-gradient-info" role="progressbar" aria-valuenow="60"
                          aria-valuemin="0" aria-valuemax="100" style="width: 60%"></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <argon-badge variant="gradient" :color="survey.visible ? 'success' : 'light'">
                    <p class="text-sm font-weight-bold mb-0">
                      {{ survey.visible ? '공개' : '비공개' }}
                    </p>
                  </argon-badge>
                </td>
                <td class="align-middle position-relative">
                  <div class="dropdown">
                    <button class="btn btn-link text-secondary mb-0 dropdown-toggle" type="button"
                      data-bs-toggle="dropdown" aria-expanded="false">
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end">
                      <li>
                        <router-link class="dropdown-item" :to="`/survey-template/${survey.id}`">
                          <i class="fa fa-eye me-2 text-sm"></i> 설문 보기
                        </router-link>
                      </li>
                      <li>
                        <router-link class="dropdown-item" :to="`/survey-edit/${survey.id}`">
                          <i class="fa fa-edit me-2 text-sm"></i> 설문 수정
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
          <ArgonPagination variant="gradient" color="secondary" class="mt-3 justify-content-center">
            <!-- 이전 그룹 -->
            <ArgonPaginationItem :disabled="currentGroup === 0" @click="changePage((currentGroup - 1) * groupSize)"
              prev />

            <!-- 페이지 번호 -->
            <ArgonPaginationItem v-for="page in paginatedPages" :key="page" :active="(page - 1) === currentPage"
              @click="changePage(page - 1)">
              {{ page }}
            </ArgonPaginationItem>

            <!-- 다음 그룹 -->
            <ArgonPaginationItem :disabled="(currentGroup + 1) * groupSize >= (pageData?.totalPages ?? 0)"
              @click="changePage((currentGroup + 1) * groupSize)" next />
          </ArgonPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>