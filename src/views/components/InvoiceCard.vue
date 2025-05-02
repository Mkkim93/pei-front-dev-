<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { SurveyTypeList } from "@/types/survey-type";
const surveyMyHosTypeList = computed(() => props.surveyMyHosTypeList);

const list = ref<SurveyTypeList[] | any>();
const emit = defineEmits<{
  (e: 'changeFilter', value: 'my' | 'common' | 'more'): void
}>();

const props = defineProps<{ surveyMyHosTypeList: SurveyTypeList[] }>();

const activeType = ref<'my' | 'common' | 'more'>('my');

const onChangeType = (type: 'my' | 'common' | 'more') => {
  activeType.value = type;
  if (activeType.value === 'more') {
    console.log('더보기 컴포넌트로 이동');
  }
  emit('changeFilter', type);
};

onMounted( async () => {
  list.value = props.surveyMyHosTypeList;
});
</script>
<template>
  <div class="card pb-4 mb-3">
    <div class="card-header pb-0 p-3">
      <div class="row">
        <div class="col-6 d-flex align-items-center">
          <h6 class="mb-0">설문 유형</h6>
        </div>
        <div class="col-6 text-end">
        <!-- ✅ 필터 버튼 -->
        <div class="btn-group" role="group">
          <button
            class="btn btn-sm"
            :class="activeType === 'my' ? 'btn-success' : 'btn-outline-success'"
            @click="onChangeType('my')"
          >
            내병원
          </button>
          <button
            class="btn btn-sm"
            :class="activeType === 'common' ? 'btn-success' : 'btn-outline-success'"
            @click="onChangeType('common')"
          >
            공통
          </button>
          <button
            class="btn btn-sm"
            :class="activeType === 'more' ? 'btn-success' : 'btn-outline-success'"
            @click="onChangeType('more')"
          >
          <font-awesome-icon :icon="['fas', 'angle-right']" />
          </button>
        </div>
      </div>
        
      </div>
    </div>

    <!-- api -->
    <div class="card-body p-3 pb-0 mb-0">
      <ul class="list-group">
        <li v-for="mysurvey in surveyMyHosTypeList" :key="mysurvey.id"
          class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-1 text-dark font-weight-bold text-sm">
              {{ mysurvey.name }}
            </h6>
            <span class="text-sm">{{ mysurvey.description }}</span>
          </div>
          <div class="d-flex align-items-center text-sm">
            $180
            <button class="btn btn-link text-dark text-sm mb-0 px-0 ms-4">
              <i class="fas fa-file-pdf text-lg me-1" aria-hidden="true"></i>
              PDF
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
