<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Model } from 'survey-core';
import { SurveyComponent } from 'survey-vue3-ui';
import * as SurveyTheme from 'survey-core/themes';

const props = defineProps<{
  surveyJson: any
}>();

const survey = ref<Model | null>(null);

onMounted( async () => {
  if (props.surveyJson) {
    survey.value = new Model(props.surveyJson.data.content);
    survey.value.applyTheme(SurveyTheme.BorderlessDark);

    survey.value.onComplete.add((sender) => {
      console.log(JSON.stringify(sender.data, null, 2));
    });
  }
});
</script>

<template>
  <SurveyComponent v-if="survey" :model="survey" />
</template>
