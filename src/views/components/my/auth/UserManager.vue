<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import GridManager from '@/examples/Grid/GridManager.vue';
import { UsersListType } from '@/types/user-roles';
import { fetchUserList } from '@/api/user-roles';
import ArgonPagination from '@/components/ArgonPagination.vue';
import ArgonPaginationItem from '@/components/ArgonPaginationItem.vue';
import { PageInfoType } from '@/types/notify';

const rowData = ref<UsersListType | any>([]);
const pageData = ref<PageInfoType | null>(null);
const currentPage = ref<number>(0);
const groupSize = 10; // 한 번에 보여줄 페이지 수
const currentGroup = computed(() => Math.floor(currentPage.value / groupSize));
const paginatedPages = computed(() => {
  const total = pageData.value?.totalPages ?? 1;
  const start = currentGroup.value * groupSize + 1;
  const end = Math.min(start + groupSize - 1, total);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const colDefs = ref([
  { field: 'username', headerName: '계정', cellClass: 'text-center', headerClass: 'text-header-center' },
  { field: 'name', headerName: '이름', cellClass: 'text-center', headerClass: 'text-header-center' },
  { field: 'phone', headerName: '연락처', cellClass: 'text-center', headerClass: 'text-header-center'},
  { field: 'mail', headerName: '메일주소', cellClass: 'text-center', headerClass: 'text-header-center' },
  { field: 'createAt', headerName: '가입날짜', cellClass: 'text-center', headerClass: 'text-header-center' },
  { field: 'roleType', headerName: '권한', cellClass: 'text-center', headerClass: 'text-header-center' },
  { field: 'hospitalName', headerName: '소속', cellClass: 'text-center', headerClass: 'text-header-center' },
]);

onMounted(async () => {
  const response = await fetchUserList(0, 10);
  Object.assign(rowData.value, response.data);
  console.log('rowData', rowData.value);
  pageData.value = rowData.value.page;
})

const changePage = async (page: number) => {
  if (page < 0 || (pageData.value && page >= pageData.value.totalPages)) return;
  const response = await fetchUserList(page, 10);
  Object.assign(rowData.value, response.data);
  console.log('rowData', rowData.value);
  pageData.value = rowData.value.page;
  currentPage.value = page;
};

</script>

<template>
<GridManager :rowData="rowData.content" :colDefs="colDefs" height="600px" />

<ArgonPagination variant="gradient" color="secondary" class="mt-3 justify-content-center">
            <!-- 이전 그룹 -->
            <ArgonPaginationItem
              :disabled="currentGroup === 0"
              @click="changePage((currentGroup - 1) * groupSize)"
              prev
            />

            <!-- 페이지 번호 -->
            <ArgonPaginationItem
              v-for="page in paginatedPages"
              :key="page"
              :active="(page - 1) === currentPage"
              @click="changePage(page - 1)"
            >
              {{ page }}
            </ArgonPaginationItem>

            <!-- 다음 그룹 -->
            <ArgonPaginationItem
              :disabled="(currentGroup + 1) * groupSize >= (pageData?.totalPages ?? 0)"
              @click="changePage((currentGroup + 1) * groupSize)"
              next
            />
          </ArgonPagination>

</template>

<style>
.text-center {
  text-align: center;
  justify-content: center;
}

.text-header-center .ag-header-cell-label {
  justify-content: center !important;
}
</style>
