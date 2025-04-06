<!-- components/ArgonPaginationItem.vue -->
<script setup>
defineProps({
  label: String,
  active: Boolean,
  disabled: Boolean,
  prev: Boolean,
  next: Boolean,
});
</script>

<template>
  <li class="page-item" :class="{ active, disabled }">
    <a class="page-link" href="javascript:;">
      <slot />
      <i v-if="prev" class="material-icons">keyboard_arrow_left</i>
      <i v-if="next" class="material-icons">keyboard_arrow_right</i>
    </a>
  </li>
</template>

<style>
</style>

