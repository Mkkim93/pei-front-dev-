<script setup lang="ts">
import { onMounted, onBeforeMount, onBeforeUnmount, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { fetchResponseMetaData } from '@/api/survey-res';
import { SurveyResponseMetaType, DepartList, WardList, ageGroupList, genderTypeList, SurveyMetaStoreType} from '@/types/common/survey-res';
import ArgonRadio from '@/components/ArgonRadio.vue';
import { formatDateOrgDetail } from '@/utils/date';
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

const postStoreMetaData = ref<SurveyMetaStoreType>({
  wardId: 0,
  departId: 0,
  ageGroup: '',
  genderType: '',
  submittedAt: '',
  // TODO 다른 데이터도 저장 (환자 연령대, 성별 등)
});

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
});

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = true;
  document.body.classList.remove("bg-gray-100");
});

const goToSurveyWrite = () => {
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
