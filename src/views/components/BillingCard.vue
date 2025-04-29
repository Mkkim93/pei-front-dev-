<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchsurveyTypeList } from '@/api/survey-type';
import { SurveyTypeList } from '@/types/survey-type';
import ArgonButton from '@/components/ArgonButton.vue';
const surveyTypeList = ref<SurveyTypeList[]>();

onMounted(async () => {
  const response = await fetchsurveyTypeList(0, 3);
  surveyTypeList.value = response.data.content;
})

</script>
<template>
  <div class="card">
    <div class="card-header pb-0 px-4 d-flex justify-content-between align-items-center">
      <h6 class="mb-0">양식 관리</h6>
      <argon-button color="success" size="sm" variant="outline">
        더보기
      </argon-button>
    </div>
    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <li v-for="type in surveyTypeList" :key="type.id"
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg">
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">{{ type.name }}</h6>
            <span class="mb-2 text-xs">
              Company Name:
              <span class="text-dark font-weight-bold ms-sm-2">Viking Burrito</span>
            </span>
            <span class="mb-2 text-xs">
              Email Address:
              <span class="text-dark ms-sm-2 font-weight-bold">oliver@burrito.com</span>
            </span>
            <span class="text-xs">
              VAT Number:
              <span class="text-dark ms-sm-2 font-weight-bold">FRB1235476</span>
            </span>
          </div>
          <div class="ms-auto text-end">
            <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;">
              <i class="far fa-trash-alt me-2" aria-hidden="true"></i>삭제
            </a>
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
              <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i>수정
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
