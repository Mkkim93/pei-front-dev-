<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3';
import { onMounted } from 'vue';
import { themeQuartz } from 'ag-grid-community';
const myTheme = themeQuartz.withParams({
    // bright green, 10% opacity
    selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',

    // alternating row colors will be visible through the semi-transparent
    // selection background color
    oddRowBackgroundColor: '#8881',
    
});

// ✅ Props 받기
const props = defineProps<{
  rowData: any[] | undefined,
  colDefs: any[]
  theme?: string
  height?: string
}>();

onMounted(() => {
  console.log('rowData:', props.rowData);
  console.log('colDefs:', props.colDefs);
});
</script>
<template>
    <!-- The AG Grid component -->
    <ag-grid-vue
        :rowData="props.rowData"
        :columnDefs="props.colDefs"
        :theme="myTheme"
        domLayout='autoHeight'
    >
    </ag-grid-vue>

</template>
<style scoped>

</style>