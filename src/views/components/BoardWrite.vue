<script setup lang="ts">
import { ref } from "vue";
import EditorManagerment from '@/examples/editor/EditorManagerment.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import { Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const editor = new Editor({
  extensions: [StarterKit],
  content: '',
})

const content = ref<string | unknown>('');
</script>

<template>
  <div class="card mt-6 px-4 custom-card">
    <div class="card-header pb-4 d-flex justify-content-between align-items-center">
  <h6>게시글 작성</h6>
  <div class="d-flex gap-2 ms-auto">
    <ArgonButton color="primary">작성</ArgonButton>
    <router-link to="/auth-table">
      <ArgonButton color="secondary">취소</ArgonButton>
    </router-link>
  </div>
</div>

    <div class="card-body px-4 pt-2 pb-2">
        <div class="table-responsive p-0" style="overflow: visible;">
        <div class="p-4">
          <ArgonInput type="text" placeholder="제목을 입력해주세요" class="mb-3" />
            <EditorManagerment :editor="editor"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-card {
    min-height: 80vh;
}
/* 입력창과 에디터 사이 여백 등을 추가로 조정하고 싶다면 여기에 스타일 추가하세요 */
</style>
