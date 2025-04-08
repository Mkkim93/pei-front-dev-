<script setup lang="ts">
import { ref } from "vue";
import EditorManagerment from '@/examples/editor/EditorManagerment.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import { createPost } from "@/api/board";
import router from "@/router";

const emit = defineEmits(['update:modelValue'])
const title = ref('');
const content = ref('');

const submitPost = async () => {
  try {
    const response = await createPost(title.value, content.value);
    alert(response.message);
    router.push(`/auth-table/${response.data}`)
  } catch (error) {
    //TODO ERROR MESSAGE
    console.log('error: ', error);
  }
}
</script>

<template>
  <div class="card mt-6 px-4 custom-card">
    <div class="card-header pb-4 d-flex justify-content-between align-items-center">
      <h6>게시글 작성</h6>
      <div class="d-flex gap-2 ms-auto">
        <ArgonButton color="primary" @click="submitPost">작성</ArgonButton>
        <router-link to="/auth-table">
          <ArgonButton color="secondary">취소</ArgonButton>
        </router-link>
      </div>
    </div>

    <div class="card-body px-4 pt-2 pb-2">
      <div class="table-responsive p-0" style="overflow: visible;">
        <div class="p-4">
          <ArgonInput type="text" placeholder="제목을 입력해주세요" class="mb-3" v-model="title" />
          <EditorManagerment v-model="content" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-card {
  min-height: 80vh;
}
</style>
