<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean | undefined;
  name: string;
  id: string;
}>();
const emit = defineEmits(['update:modelValue']);

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
}
</script>
<template>
  <div class="form-check form-switch ps-0">
    <input
      :id="id"
      class="form-check-input ms-0"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      @change="onChange"
    />
    <label class="form-check-label"  :for="id">
      <slot />
    </label>
  </div>
</template>
