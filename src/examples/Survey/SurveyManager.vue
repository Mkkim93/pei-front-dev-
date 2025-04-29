<script setup lang="ts">
import { onMounted, ref } from 'vue';
import 'survey-core/survey-core.css';
import { Model } from 'survey-core';
import { SurveyComponent } from 'survey-vue3-ui';
import * as SurveyTheme from "survey-core/themes";
import { testSurvey } from '@/api/survey';
const survey = ref<Model | null>(null);

onMounted(async () => {
    const response = await testSurvey();
    console.log('survey res: ', response);
    
    survey.value = new Model(response);  // ❗ 여기서 Model 생성
    survey.value.applyTheme(SurveyTheme.BorderlessLight);
    
    survey.value.onComplete.add((sender, options) => {
        console.log(JSON.stringify(sender.data, null, 3));
    });
});
</script>

<template>
    <SurveyComponent v-if="survey" :model="survey.value" />
  <!-- ... -->
</template>