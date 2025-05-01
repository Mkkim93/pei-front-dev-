<script setup lang="ts">
import SurveyManager from './SurveyManager.vue';
import { onMounted, ref } from 'vue';
import { fetchSurveyTemplate } from '@/api/survey';
import { useRoute } from 'vue-router';

const route = useRoute();
const surveyTemplate = ref<any>();

onMounted(async () => {
  const id = Number(route.params.id);
    const response = await fetchSurveyTemplate(id);
    surveyTemplate.value = response;
    console.log('surveyTemplate: ', surveyTemplate.value);
})

</script>

<template>
  <div class="container-flud">
    <SurveyManager v-if="surveyTemplate" :surveyJson="surveyTemplate" />
  </div>
</template>

<style scoped></style>