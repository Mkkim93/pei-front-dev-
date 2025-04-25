<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GridManager from '@/examples/Grid/GridManager.vue';

import { fetchUserList } from '@/api/user-roles';
const rowData = ref<any[]>([]);

const colDefs = ref([
  { field: 'username', headerName: '계정', cellClass: 'text-center', headerClass: 'text-header-center' },
  { field: 'name', headerName: '이름', cellClass: 'text-center', headerClass: 'text-header-center' },
  { field: 'phone', headerName: '연락처', cellClass: 'text-center', headerClass: 'text-header-center'},
  { field: 'mail', headerName: '메일주소', cellClass: 'text-center', headerClass: 'text-header-center' },
  { field: 'createAt', headerName: '가입날짜', cellClass: 'text-center', headerClass: 'text-header-center' },
  { field: 'roleType', headerName: '권한', cellClass: 'text-center', headerClass: 'text-header-center' }
]);

onMounted(async () => {
  const response = await fetchUserList(0, 10);
  console.log('response data: ', response.data);
  Object.assign(rowData.value, response.data);
  console.log('response.data.content', response?.data)
  console.log('rowData: ', rowData.value);
})
</script>

<template>
<GridManager :rowData="rowData.content" :colDefs="colDefs" height="600px" />
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
