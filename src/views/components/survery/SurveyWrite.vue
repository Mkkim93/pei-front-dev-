<script setup lang="ts">
import SurveyManager from '@/examples/Survey/SurveyManager.vue';
import { onMounted, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useRoute } from 'vue-router'; 
import { fetchCommonSurveyDetail } from '@/api/survey';
import { useStore } from 'vuex'; 
import { SurveyResponsePostType } from '@/types/common/survey-res';
import { postSurveyResponseData } from '@/api/survey-res';
import router from '@/router';
const store = useStore();
const route = useRoute();
const body = document.getElementsByTagName("body")[0];
const surveyTemplate = ref<any>();
const hospitalId = ref<number>();
const surveyId = ref<number>();

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = true;
  body.classList.remove("bg-gray-100");
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

onMounted( async () => {
  hospitalId.value = Number(localStorage.getItem('hospitalId'));
  surveyId.value = Number(route.params.surveyId);
  const response = await fetchCommonSurveyDetail(hospitalId.value, surveyId.value);
  surveyTemplate.value = response;
})

// 최종 설문 전송
const submitSurveyHandler = async (payload: SurveyResponsePostType) => {
  console.log('payload: ', payload);
  const response = await postSurveyResponseData(payload);
  console.log('설문 전송 후 res: ', response);
  alert(response.message);
  router.push('/');
  
}
</script>

<template>
  <div class="container-flud">
    <SurveyManager v-if="surveyTemplate" :surveyJson="surveyTemplate" @submitSurvey="submitSurveyHandler"></SurveyManager>
  </div>
</template>

<style scoped>

</style>