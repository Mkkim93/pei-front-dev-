<script setup lang="ts">
import { onMounted, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { fetchScheduleList } from '@/api/schedule';
import { ScheduleListType } from '@/types/schedule';
import Calendar from '@/examples/Calendar.vue';

</script>

<template>
  <Calendar />
</template>
<style scoped></style>
