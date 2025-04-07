<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { fetchLogActive } from "@/api/activelog";
import { PageInfoType, LogDescriptionType } from '@/types/activelog.d';
import ArgonButton from "@/components/ArgonButton.vue";
import { formatDateDetail } from "@/utils/date";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const fetchLogList = ref<LogDescriptionType[]>([]);
const pageData = ref<PageInfoType | null>(null);

onMounted(async () => {
  const response = await fetchLogActive(0, 5);
  fetchLogList.value = response?.data.content;
  pageData.value = response?.data.page;
});

defineProps({
  title: {
    type: String,
    default: "최근 활동",
  },
  categories: {
    type: Array,
    required: true,
    icon: {
      component: String,
      background: String,
    },
    label: String,
    description: String,
  },
});
</script>
<template>
  <div class="card">
    <div class="p-4 pb-5 card-header d-flex justify-content-between align-items-center">
      <h6 class="mb-0">{{ title }}</h6>
      <ArgonButton class="btn btn-sm btn-outline-primary" variant="outline" color="success">더보기</ArgonButton>
    </div>
    <div class="p-3 card-body">
      <ul :class="`list-group ${isRTL ? 'pe-0' : ''}`">
        <li v-for="log in fetchLogList" :key="log.id" :class="`mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg
    ${isRTL ? 'pe-0' : 'ps-0'}`">
          <div class="d-flex align-items-center">
            <div class="text-center shadow icon icon-shape icon-sm bg-gradient-success me-3">
              <i class="ni ni-single-copy-04 text-white opacity-10"></i>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <!-- 왼쪽: 로그 내용 -->
              <div class="d-flex flex-column">
                <h6 class="mb-1 text-sm text-dark">{{ log.description.title }}</h6>
                <div class="text-xs text-muted white-space-nowrap">
                  {{ formatDateDetail(log.description.createdAt) }}
                </div>
                <span class="text-xs text-muted mt-1">{{ log.action }}</span>
              </div>
            </div>
          </div>
          <div class="d-flex">
            <button class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark icon-move-right">
              <i :class="`ni ${isRTL ? 'ni-bold-left' : 'ni-bold-right'}`" aria-hidden="true"></i>
            </button>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>
