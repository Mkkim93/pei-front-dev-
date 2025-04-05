<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const editor = new Editor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>
<template>
</template>
