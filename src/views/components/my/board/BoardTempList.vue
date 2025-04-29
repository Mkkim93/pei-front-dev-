<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchTempBoardList } from '@/api/board';

const keyword = ref<string | undefined>('');
onMounted( async() => {
  const response = await fetchTempBoardList(0, 10, keyword.value);
  console.log('response', response);
})

</script>

<template>
  <div>
    <p>임시 저장 글 목록</p>
  </div>
</template>

<style scoped>

</style>