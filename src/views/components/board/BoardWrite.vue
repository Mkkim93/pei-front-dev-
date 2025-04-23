<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
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
  console.log("저장전 파일 객체: ", postBoard.boardFiles);
};

const submitPost = async () => {
  const postBoard: BoardCreateType = {
    title: title.value,
    content: content.value,
    boardFiles: boardFiles.value,
  };
  console.log('emit 으로 넘어온 updateBoardfiles: ', postBoard.boardFiles);
  try {
    const response = await createPost(postBoard);
    alert(response.message);
    router.push(`/detail/${response.data}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    const message = (axiosError as any)?.data.errors?.title as string;
    alert(message);
  }
}

const removeFile = async (obj: BoardFileListType) => {
  console.log('삭제할 파일:', obj);
  console.log('현재 서버로 저장될 파일들2: ', postBoard.boardFiles);
  postBoard.boardFiles.forEach((item) => {
    if (item.name === obj.name) {
      obj.used = false;
    }
  });
  console.log('삭제한 파일의 used 상태: ', obj.used);
}

const nowrite = async () => {
  const isConfirmed = confirm('게시글 작성을 취소 하시겠습니까?');
  if (isConfirmed) {
    alert('작성이 취소 되었습니다.');
    router.push('/auth-table');
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
          <ArgonButton color="secondary" @click="nowrite">취소</ArgonButton>
        </div>
      </div>

      <div class="card-body px-4 pt-2 pb-2">
        <div class="table-responsive p-0" style="overflow: visible;">
          <div class="p-4">
            <ArgonInput type="text" placeholder="제목을 입력해주세요" class="mb-3" v-model="title" />

            <div class="row">
              <div class="col-12">
                <div class="table-responsive">
                  <table class="table mb-1 align-middle">
                    <thead>
                      <tr>
                        <th class="align-middle">파일명</th>
                        <th class="text-end align-middle" style="min-width: 400px;">크기</th>
                        <th class="text-end align-middle" style="min-width: 50px;">형식</th>
                        <th class="text-end align-middle" style="min-width: 50px;">삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(file, index) in boardFiles.filter(f => f.renderType === 'LIST' && f.used == true)"
                        :key="index">
                        <td class="align-middle">{{ file.name }}</td>
                        <td class="text-end align-middle" style="min-width: 400px;">{{ file.size }}</td>
                        <td class="text-end align-middle" style="min-width: 50px;">{{ file.type }}</td>
                        <td class="text-end align-middle" style="min-width: 50px;">
                          <div class="d-flex align-items-center justify-content-end">
                            <argon-button @click="removeFile(file)" size="sm" color="dark"
                              style="padding: 0.3rem 0.4rem; font-size: 0.55rem;">
                              x
                            </argon-button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <EditorManager v-model="content" @update:boardFiles="handleBoardFilesUpdate" />
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
