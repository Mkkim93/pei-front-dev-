<script setup lang="ts">
const props = defineProps<{
  modelValue: string | undefined;
  value: string;
  name: string;
  id: string;
}>();
const emit = defineEmits(['update:modelValue']);

const onChange = () => {
  emit('update:modelValue', props.value);
}
</script>
<template>
  <div class="form-check">
    <input
      :id="id"
      class="form-check-input"
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      @change="onChange"
    />
    <label class="custom-control-label" :for="id">
      <slot />
    </label>
  </div>
</template>
