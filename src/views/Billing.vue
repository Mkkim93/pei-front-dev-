<script setup lang="ts">
import SurveyActiveCard from "./components/SurveyActiveCard.vue";
import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";
import PaymentCard from "./components/PaymentCard.vue";
import InvoiceCard from "./components/InvoiceCard.vue";
import BillingCard from "./components/BillingCard.vue";
import TransactionCard from "./components/TransactionCard.vue";
import { ref, onMounted } from "vue";
import { fetchsurveyTypePage } from "@/api/survey-type";
import { SurveyTypeList } from "@/types/survey-type";
import { PageResponseType } from "@/types/page";
const isPublic = ref<boolean>(false);
const surveyMyHosTypeList = ref<SurveyTypeList[]>();
const pageData = ref<PageResponseType>();

onMounted(async () => {
  console.log('빌링컴포넌트 랜더링');
  const response = await fetchsurveyTypePage(0, 5, isPublic.value);
  surveyMyHosTypeList.value = response.data.content;
  pageData.value = response.data.page;
})

const onChangeSurveyType = async (type: 'my' | 'common' | 'more') => {
  // 예: API 호출 분기
  if (type === 'my') {
    isPublic.value = false;
    const response = await fetchsurveyTypePage(0, 5, isPublic.value);
    console.log('response: ', response);
    surveyMyHosTypeList.value = response.data.content;
  } else {
    isPublic.value = true;
    const respose = await fetchsurveyTypePage(0, 5, isPublic.value);
    surveyMyHosTypeList.value = respose.data.content;
  }
};
</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-8">
        <div class="row mt-4">
          <div class="col-md-12 mb-4">
            <payment-card />
            <SurveyActiveCard />
          </div>
          
        </div>
      </div>
      <div class="col-lg-4">
        <invoice-card class="mt-6" @changeFilter="onChangeSurveyType" :surveyMyHosTypeList="surveyMyHosTypeList" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-7">
        <billing-card />
      </div>
      <div class="col-md-5">
        <transaction-card />
      </div>
    </div>
  </div>
</template>
