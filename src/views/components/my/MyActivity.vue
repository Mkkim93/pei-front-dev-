<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'; 
import { formatDate, beforeFormatDate } from '@/utils/date';
import ArgonPagination from '@/components/ArgonPagination.vue';
import ArgonPaginationItem from '@/components/ArgonPaginationItem.vue';
import { PageInfoType, LogDescriptionType  } from '@/types/activelog';
import { fetchLogActive } from '@/api/activelog';

const logActivityList = ref<LogDescriptionType[]>([]);
const pageData = ref<PageInfoType | null>(null);
const currentPage = ref(0);
const groupSize = 10;
const currentGroup = computed(() => Math.floor(currentPage.value / groupSize));

const paginatedPages = computed(() => {
  const total = pageData.value?.totalPages ?? 1;
  const start = currentGroup.value * groupSize + 1;
  const end = Math.min(start + groupSize - 1, total);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const changePage = async (page: number) => {
  if (page < 0 || (pageData.value && page >= pageData.value.totalPages)) return;
  const response = await fetchLogActive(page, 10);
  logActivityList.value = response.data.content;
  pageData.value = response.data.page;
  currentPage.value = page;
}

onMounted(async() => {
    const response = await fetchLogActive(0, 10);
    logActivityList.value = response.data.content;
    pageData.value = response.data.page;
})

</script>

<template>
  <div class="card mt-1">
      <div class="card-header pb-0 d-flex justify-content-between align-items-center">
        <h6>활동 기록</h6>
      </div>

      <div class="card-body px-4 pt-3 pb-2">
        <div class="table-responsive p-3">

          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">유형</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">내용</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">날짜</th>
                <th class="text-secondary opacity-7"></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="log in logActivityList" :key="log.id">
                <td>
                  <div class="d-flex px-2 py-1">
                    <div>
                      <p class="text-xs font-weight-bold mb-0">{{ log.action }}</p>
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      
                    </div>
                  </div>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0">{{ log.description.title }}</p>
                  <!-- <p class="text-xs text-secondary mb-0">{{ notify.targetId }}</p> -->
                </td>
                <td class="align-middle text-center text-sm">
                  <span class="text-secondary text-xs font-weight-bold">{{ formatDate(log.createdAt) }}</span>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{ beforeFormatDate(log.createdAt) }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <ArgonPagination variant="gradient" class="mt-3 justify-content-center">

            <ArgonPaginationItem
              :disabled="currentGroup === 0"
              @click="changePage((currentGroup - 1) * groupSize)"
              prev
            />

            <ArgonPaginationItem
              v-for="page in paginatedPages"
              :key="page"
              :active="(page - 1) === currentPage"
              @click="changePage(page - 1)"
            >
              {{ page }}
            </ArgonPaginationItem>

            <ArgonPaginationItem
              :disabled="(currentGroup + 1) * groupSize >= (pageData?.totalPages ?? 0)"
              @click="changePage((currentGroup + 1) * groupSize)"
              next
            />
          </ArgonPagination>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>