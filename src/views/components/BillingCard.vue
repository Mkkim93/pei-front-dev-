<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { SurveyHospitalType } from '@/types/survey';
import { fetchSurveyHosList } from '@/api/survey';
import ArgonButton from '@/components/ArgonButton.vue';
const surveyHosList = ref<SurveyHospitalType[]>();

onMounted(async () => {
  const response = await fetchSurveyHosList(0, 3);
  console.log('response1: ', response);
  surveyHosList.value = response.data.content;
})
</script>
<template>
  <div class="card">
    <div class="card-header pb-0 px-4 d-flex justify-content-between align-items-center">
      <h6 class="mb-0">양식 관리</h6>
      <router-link to="/survey-list">
      <argon-button color="success" size="sm" variant="outline">
        더보기
      </argon-button>
    </router-link>
    </div>
    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <li v-for="hos in surveyHosList" :key="hos.id"
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg">
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">{{ hos.title }}</h6>
            <span class="mb-2 text-xs">
              설문 대상:
              <span class="text-dark font-weight-bold ms-sm-2">{{ hos.category }}</span>
            </span>

            <span class="mb-2 text-xs">
              설문명:
              <span class="text-dark ms-sm-2 font-weight-bold">{{ hos.surveyTypeName }}</span>
            </span>

            <span class="text-xs">
              진료과:
              <span class="text-dark ms-sm-2 font-weight-bold">{{ hos.surveyDepartName }}</span>
            </span>

            <span class="text-xs">
              종료일:
              <span class="text-dark ms-sm-2 font-weight-bold">{{ hos.closeAt }}</span>
            </span>
            
          </div>
          <div class="ms-auto text-end">
            
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
