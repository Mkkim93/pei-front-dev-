<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { SurveyTypeList } from "@/types/survey-type";
import router from "@/router";
const surveyMyHosTypeList = computed(() => props.surveyMyHosTypeList);

const list = ref<SurveyTypeList[] | any>();
const emit = defineEmits<{
  (e: 'changeFilter', value: 'my' | 'common' | 'more'): void
}>();

const props = defineProps<{ surveyMyHosTypeList: SurveyTypeList[] | undefined }>();

const activeType = ref<'my' | 'common' | 'more'>('my');

const onChangeType = (type: 'my' | 'common' | 'more') => {
  activeType.value = type;
  if (activeType.value === 'more') {
    console.log('더보기 컴포넌트로 이동');
    // TODO 더보기 컴포넌트에서 현재 공통 양식과 내 병원 양식 유형을 모두 조회하고 수정, 및 삭제 관리 할 수 있게 한다
    // 해당 컴포넌트에서 수정할 때는 설문양식이 진행중일 때 특정 데이터 필드만 수정 할 수 있게 하고
    // 삭제의 경우 어떻게 삭제 처리를 할 지 고민 해봐야함
    // 공통 설문 양식은 해당 설문을 작성한 본인만 수정할 수 있는 권한 필요 (작성자 외 관리자가 접근 시 수정 버튼 비활성화)
    // 공통 설문 양식은 거의 조회만 할 수 있게 만들 것
    // 내 병원에서 작성한 설문 양식은 해당 병원 관계자라면 누구든 수정 할 수 있도록 하고 삭제 권한은 작성자만 가질 수 있도록 할 것
  }
  emit('changeFilter', type);
};

const getMore = () => {
  router.push('/survey-type-detail');
}

onMounted(async () => {
  list.value = props.surveyMyHosTypeList;
});
</script>
<template>
  <div class="card pb-5 mb-4">
    <div class="card-header pb-0 p-3">
      <div class="row">
        <div class="col-6 d-flex align-items-center">
          <h6 class="mb-0">유형 관리</h6>
        </div>
        <div class="col-6 text-end">
          <!-- ✅ 필터 버튼 그룹을 카드 안에서 꽉 차게 유지 -->
          <div class="btn-group w-100" role="group">
            <button class="btn btn-sm" :class="activeType === 'my' ? 'btn-success' : 'btn-outline-success'"
              @click="onChangeType('my')" style="flex: 1 1 0; min-width: 80px; max-width: 100%; white-space: nowrap;">
              내병원
            </button>
            <button class="btn btn-sm" :class="activeType === 'common' ? 'btn-success' : 'btn-outline-success'"
              @click="onChangeType('common')"
              style="flex: 1 1 0; min-width: 80px; max-width: 100%; white-space: nowrap;">
              공통
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- api -->
    <div class="card-body p-3 pb-0 mb-0">
      <ul class="list-group">
        <li v-for="mysurvey in surveyMyHosTypeList" :key="mysurvey.id"
          class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg">
          <div class="d-flex flex-column">
            <h6 class="mb-1 text-dark font-weight-bold text-sm">
              {{ mysurvey.name }}
            </h6>
            <span class="text-sm">{{ mysurvey.description }}</span>
          </div>
        </li>
      </ul>
    </div>
    <button class="btn btn-sm mx-auto d-block" :class="activeType === 'more' ? 'btn-success' : 'btn-outline-success'"
      style="width: 120px;" @click="getMore">
      더보기
    </button>
  </div>
</template>
