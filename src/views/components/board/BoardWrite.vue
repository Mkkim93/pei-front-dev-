<script setup lang="ts">
import { ref, reactive } from "vue";
import EditorManager from "@/examples/editor/EditorManager.vue";
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import { AxiosError } from "axios";
import { createPost } from "@/api/board";
import router from "@/router";
import { BoardCreateType, BoardFileListType } from "@/types/board"; 

const boardFiles = ref<BoardFileListType[]>([]);
const title = ref('');
const content = ref('');

const postBoard = reactive<BoardCreateType>({
  title: title.value,
  content: content.value,
  boardFiles: boardFiles.value
});

const handleBoardFilesUpdate = (files: BoardFileListType[]) => {
  boardFiles.value = files;
  postBoard.boardFiles = files;
};

const submitPost = async () => {
  const postBoard: BoardCreateType = {
    title: title.value,
    content: content.value,
    boardFiles: boardFiles.value,
  };
  try {
    const response = await createPost(postBoard);
    alert(response.message);
    router.push(`/detail/${response.data}`)
  } catch (error) {
    const axiosError = error as AxiosError;
    const message = (axiosError as any)?.data.errors?.title as string;
    alert(message);
  }
}

</script>

<template>
<div class="container-flud">
  <div class="card mt-6 px-4 custom-card">
    <div class="card-header pb-4 d-flex justify-content-between align-items-center">
      <h6>게시글 작성</h6>
      <div class="d-flex gap-2 ms-auto">
        <ArgonButton color="primary" @click="submitPost">저장</ArgonButton>
        <router-link to="/auth-table">
          <ArgonButton color="secondary">취소</ArgonButton>
        </router-link>
      </div>
    </div>

    <div class="card-body px-4 pt-2 pb-2">
      <div class="table-responsive p-0" style="overflow: visible;">
        <div class="p-4">
          <ArgonInput type="text" placeholder="제목을 입력해주세요" class="mb-3" v-model="title" />
          <EditorManager v-model="content" @update:boardFiles="handleBoardFilesUpdate"/>
        </div>
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
