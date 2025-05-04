<script setup lang="ts">
import ArgonButton from "@/components/ArgonButton.vue";
import { onMounted, ref } from "vue";
import { fetchSurveyTypeRecentPage } from "@/api/survey-type";
import { SurveyTypeRecent } from "@/types/survey-type";
import { formatDate } from "@/utils/date";

const isPublic = ref<boolean>(false);
const surveyTypeRecentData = ref<SurveyTypeRecent[]>([]);
onMounted(async () => {
  const response = await fetchSurveyTypeRecentPage(0, 10, isPublic.value);
  surveyTypeRecentData.value = response.data.content;
  console.log('surveyTypeRecent: ', surveyTypeRecentData.value);
})
</script>
<template>
  <div class="card h-100 mb-4">
    <div class="card-header pb-0 px-3">
      <div class="row">
        <div class="col-md-6">
          <h6 class="mb-0">최근 수정된 양식</h6>
        </div>
        <!-- <div class="col-md-6 d-flex justify-content-end align-items-center">
        </div> -->
      </div>
    </div>
    <div class="card-body pt-4 p-3">
    
      <ul class="list-group">
        <li v-for="recent in surveyTypeRecentData" :key="recent.id"
          class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg">
          <div class="d-flex align-items-center">
            <argon-button color="danger" variant="outline" size="sm"
              class="btn-icon-only btn-rounded mb-0 me-3 d-flex align-items-center justify-content-center">
              <i class="fas fa-arrow-down" aria-hidden="true"></i>
            </argon-button>
            <div class="d-flex flex-column">
              <h6 class="mb-1 text-dark text-sm">{{ recent.name }}</h6>
              <span class="text-xs">{{ formatDate(recent.updatedAt) }}</span>
            </div>
          </div>
          <div class="d-flex align-items-center text-success text-gradient text-sm font-weight-bold">
            자세히보기
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
