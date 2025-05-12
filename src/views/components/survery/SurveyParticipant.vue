<script setup lang="ts">
import { onMounted, onBeforeMount, onBeforeUnmount, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { fetchResponseMetaData } from '@/api/survey-res';
import { SurveyResponseMetaType, DepartList, WardList, ageGroupList, genderTypeList, SurveyMetaStoreType} from '@/types/common/survey-res';
import ArgonRadio from '@/components/ArgonRadio.vue';
const store = useStore();
const route = useRoute();
const router = useRouter();
const metaType = ref<SurveyResponseMetaType | null>(null);
const wardList = ref<WardList[]>([]);
const departList = ref<DepartList[]>([]);
const ageGroupList = ref<ageGroupList[] | any>([]);
const genderTypeList = ref<genderTypeList[] | any>([]);
const selectedWard = ref<number>(0);
const selectedDepart = ref<number>(0);
const nextSurveyId = computed(() => route.params.surveyId);
const selectedAge = ref<string>('');
const selectedGender = ref<string>('');
const consentChecked = ref<boolean>(false);
const surveyMainTitle = ref<string>('');

onMounted(async () => {
  console.log('nextsurvey: ', nextSurveyId.value);
  const response = await fetchResponseMetaData(Number(route.params.hospitalId));
  metaType.value = response.data as SurveyResponseMetaType;
  wardList.value = metaType.value?.wardList ?? [];
  departList.value = metaType.value?.departList ?? [];
  ageGroupList.value = metaType.value?.ageGroup ?? [];
  genderTypeList.value = metaType.value?.genderType ?? [];
  console.log('ageG: ', ageGroupList.value);
  console.log('genT: ', genderTypeList.value);
  surveyMainTitle.value = localStorage.getItem('title') as string;
});

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = true;
  document.body.classList.remove("bg-gray-100");
});

const goToSurveyWrite = () => {
  if (!consentChecked.value) {
    alert('개인정보 수집 및 이용에 동의해주세요.')
    return
  }
  console.log('goToSurvey');
  console.log('selectedward: ', selectedWard.value);
  console.log('selectedDepart: ', selectedDepart.value);
  console.log('selectedAge: ', selectedAge.value);
  console.log('selectGender: ', selectedGender.value);
  if (!selectedWard.value || !selectedDepart.value || !selectedAge.value || !selectedGender.value) {
  alert('모든 항목을 선택해주세요.');
  return;
}
  store.commit('setSurveyMetaStore', {
  wardId: selectedWard.value,
  departId: selectedDepart.value,
  ageGroup: selectedAge.value,
  surveyId: nextSurveyId.value,
  genderType: selectedGender.value,
  submittedAt: new Date().toISOString(),
});
  const surveyId :number | undefined = Number(nextSurveyId.value);
  router.push({ name: 'SurveyWrite', params: { surveyId } });
}

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  document.body.classList.add("bg-gray-100");
});

</script>

<template>
  <div class="container py-5">
    <!-- 개인정보 동의 안내 -->
    <div class="row justify-content-center mb-4">
      <div class="col-md-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-gradient-primary text-white text-center">
            <h5 class="mb-0">{{ surveyMainTitle }}</h5>
          </div>
          <div class="card-body">
            <h6 class="fw-bold mb-3">개인정보 수집·이용 동의</h6>
            <div class="bg-light p-3 rounded text-sm text-muted mb-3">
              <p class="mb-2">※ 입력하신 개인정보는 아래의 목적에 따라 사용됩니다.</p>
              <ul class="ps-3 mb-2">
                <li>수집 항목: 연락처</li>
                <li>수집 목적: 설문조사 이벤트 당첨 통보</li>
                <li>보유 기간: 수집일로부터 1년</li>
              </ul>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" v-model="consentChecked" id="consentCheckbox" />
              <label class="form-check-label" for="consentCheckbox">
                위 개인정보 수집·이용에 동의합니다.
              </label>
            </div>
            <hr class="my-4" />
            <p class="text-sm mb-1">
              본 병원은 더 나은 의료서비스 제공을 위해 매년 외래환자 만족도 조사를 시행하고 있습니다.
            </p>
            <p class="text-sm mb-2">
              올해는 코로나19로 인해 홈페이지를 통한 비대면 설문조사를 진행하게 되었으니 많은 참여 부탁드립니다.
            </p>
            <ul class="text-sm ps-3">
              <li>이벤트 참여자 중 추첨을 통해 커피 쿠폰 제공</li>
              <li>문의: 기획실 051-664-4912</li>
              <li class="text-primary fw-bold">조사 기간: 2020.09.07 ~ 2020.10.10</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white text-center">
            <h5 class="mb-0">설문 참여 전 기본 정보 입력</h5>
          </div>
          <div class="card-body">
            <p class="text-muted mb-4">
              병동과 진료과를 선택하신 후 설문을 시작하실 수 있습니다.
            </p>

            <div class="mb-3">
              <label for="ward" class="form-label">병동</label>
              <select v-model="selectedWard" id="ward" class="form-select">
                <option disabled value="">병동을 선택하세요</option>
                <option v-for="ward in wardList" :key="ward.id" :value="ward.id">
                  {{ ward.name }} 병동
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="depart" class="form-label">진료과</label>
              <select v-model="selectedDepart" id="depart" class="form-select">
                <option disabled value="">진료과를 선택하세요</option>
                <option v-for="depart in departList" :key="depart.id" :value="depart.id">
                  {{ depart.name }}
                </option>
              </select>
            </div>

            <div class="mb-4">
                    <label class="form-label fw-bold">연령대</label>
                    <div class="d-flex flex-wrap gap-3">
                        <div class="form-check form-check-radio d-flex align-items-center"
                            v-for="(age, index) in ageGroupList" :key="index">
                            <ArgonRadio
                            :id="'age-' + index" 
                            class="form-check-input me-2" 
                            name="age" 
                            v-model="selectedAge"
                            :value="age" />
                            <label class="form-check-label mb-0 text-nowrap" :for="'age-' + index">{{ age }}</label>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="form-label fw-bold">성별</label>
                    <div class="d-flex flex-wrap gap-3">
                        <div class="form-check form-check-radio d-flex align-items-center"
                            v-for="(gender, index) in genderTypeList" :key="index">
                            <ArgonRadio
                            :id="'gender-' + index" 
                            class="form-check-input me-2" 
                            name="gender" 
                            v-model="selectedGender"
                            :value="gender" />
                            <label class="form-check-label mb-0 text-nowrap" :for="'gender-' + index">{{ gender }}</label>
                        </div>
                    </div>
                </div>
            <div class="text-end mt-4">
              <button 
                class="btn btn-outline-primary"

                @click="goToSurveyWrite"
              >
                설문 시작
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
