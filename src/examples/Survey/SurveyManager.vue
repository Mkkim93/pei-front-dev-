<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Model } from 'survey-core';
import { SurveyComponent } from 'survey-vue3-ui';
import * as SurveyTheme from 'survey-core/themes';
import { useStore } from 'vuex';
import { SurveyResponsePostType } from '@/types/common/survey-res';

const store = useStore();
const props = defineProps<{
  surveyJson: any
}>();

const emit = defineEmits<{
  (e: 'submitSurvey', payload: SurveyResponsePostType): void;
}>();

const survey = ref<Model | any>(null);
const surveyPostDTO = ref<SurveyResponsePostType>();
onMounted(async () => {
  if (props.surveyJson) {
    survey.value = new Model(props.surveyJson.data.content);
    survey.value.applyTheme(SurveyTheme.BorderlessDark);
    survey.value.onComplete.add((sender: any) => {
      console.log(JSON.stringify(sender.data));

      // answerContent
      const rawData = JSON.stringify(sender.data, null, 2);
      console.log('rawData: ', rawData);

      const metaData = store.getters.surveyResMeta;
      console.log('metaData: ', metaData);

      const payload: SurveyResponsePostType = {
        answerContent: rawData,
        submittedAt: metaData.submittedAt,
        surveyId: metaData.surveyId,
        wardId: metaData.wardId,
        departId: metaData.departId,
        ageGroup: metaData.ageGroup,
        genderType: metaData.genderType,
      };``
      emit('submitSurvey', payload);
    });
  }
});
</script>

<template>
  <SurveyComponent v-if="survey" :model="survey" />
</template>
