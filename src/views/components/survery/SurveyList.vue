<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchSurveyHosList } from '@/api/survey';
import { SurveyHospitalType } from '@/types/survey';
import { PageResponseType } from '@/types/page';

const pageData = ref<PageResponseType>();
const surveyContent = ref<SurveyHospitalType[]>();

onMounted( async () => {
  const response = await fetchSurveyHosList(0, 10);
  console.log('response: ', response);
  surveyContent.value = response.data.content;
  pageData.value = response.data.page;
})
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
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                설문제목
              </th>

              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                설문주제
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                설문대상부서
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                상태(대기/진행중/종료)
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2"
              >
                설문진행률
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2"
              >
              </th>
            </tr>
          </thead>
          <tbody v-for="survey in surveyContent" :key="survey.id">
            <tr>
              <td>
                <div class="d-flex px-2">
                  <div class="my-auto">
                    <small>{{ survey.category }}</small>
                    <h6 class="mb-0 text-sm">{{ survey.title  }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-sm font-weight-bold mb-0">{{ survey.surveyTypeName }}</p>
              </td>
              <td>
                <p class="text-sm font-weight-bold mb-0">{{ survey.surveyDepartName }}</p>
              </td>
              <td>
                <span class="text-xs font-weight-bold">{{ survey.surveyStatus }}</span>
              </td>
              <td class="align-middle text-center">
                <div class="d-flex align-items-center justify-content-center">
                  <span class="me-2 text-xs font-weight-bold">60%</span>
                  <div>
                    <div class="progress">
                      <div
                        class="progress-bar bg-gradient-info"
                        role="progressbar"
                        aria-valuenow="60"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style="width: 60%"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="align-middle">
                <button class="btn btn-link text-secondary mb-0">
                  <i class="fa fa-ellipsis-v text-xs" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>