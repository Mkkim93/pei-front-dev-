<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { fetchBoardDetail, deleteBoardIds, downloadFile } from "@/api/board";
import { useRoute } from "vue-router";
import { BoardDetailType, BoardDeleteIdsType, BoardFileListType } from "@/types/board";
import { formatDateDetail } from "@/utils/date";
import ArgonButton from "@/components/ArgonButton.vue";
import router from "@/router";
import { AxiosError } from "axios";
import { decodePayload } from "@/types/jwt.d";
import store from "@/store";


const userRoleType = ref<string>();
const userId = ref<number>(0);
const route = useRoute();
const boardContent = reactive<BoardDetailType>({
  id: 0,
  title: '',
  content: '',
  updatedAt: '',
  writer: '',
  views: 0,
  usersId: 0,
  boardFiles: [],
});

const boardFileContent = ref<BoardFileListType[]>([]);
const delIds = ref<BoardDeleteIdsType>();

onMounted(async () => {
  const token = store.getters.accessToken;
  const payload = decodePayload(token);
  userRoleType.value = (await payload).roles;
  userId.value = (await payload).id;

  const id = Number(route.params.id);

  if (isNaN(id)) {
    console.error("존재하지 않은 게시글");
    return;
  }

  try {
    const response = await fetchBoardDetail(id);
    console.log('상세페이지 데이터: ', response.data);
    Object.assign(boardContent, response.data);
    boardFileContent.value = boardContent.boardFiles;
  } catch (error) {
    const axiosError = error as AxiosError | any;
    const errorMessage = axiosError.data.message || "알 수 없는 오류입니다.";
    alert(errorMessage);
    router.back();
  }
})

const deleteBoards = async () => {
  const isConfirmed = confirm('게시글을 삭제 하시겠습니까?');
  if (isConfirmed) {
    delIds.value = { id: boardContent.id }
    try {
      const response = await deleteBoardIds(delIds.value);
      alert(response.message);
      router.push('/auth-table');
    } catch (error) {
      console.error('delete error: ', error);
    }
  }
}

const download = async (id: number, name: string) => {
  try {
    await downloadFile(id, name);
  } catch (error) {
    console.log('download error: ', error);
  }
}

</script>

<template>
  <div class="container-fluid">
    <div class="card mt-6 px-4 custom-card">
      <div class="card-header pb-4 d-flex justify-content-between align-items-center">
        <h6>상세 페이지</h6>
        <div class="d-flex gap-2 ms-auto">
          <router-link to="/auth-table">
            <argon-button color="dark">목록</argon-button>
          </router-link>
          <div v-if="userRoleType === 'ROLE_ADMIN' || boardContent.usersId === userId" class="d-flex gap-2">
            <router-link :to="`/update/${boardContent.id}`">
              <argon-button color="secondary">수정</argon-button>
            </router-link>
            <argon-button color="light" @click="deleteBoards">삭제</argon-button>
          </div>
        </div>
      </div>

      <div class="card-body px-4 pt-2 pb-4">
        <!-- 제목 -->
        <!-- 제목, 작성자, 작성일을 가로 정렬 -->
        <div class="d-flex justify-content-between flex-wrap align-items-center mb-4 gap-3">
          <div class="text-truncate">
            <span class="fw-bold text-dark me-2">제목:</span>
            <span>{{ boardContent.title }}</span>
          </div>
          <div>
            <span class="fw-bold text-dark me-2">작성자:</span>
            <span>{{ boardContent.writer }}</span>
          </div>
          <div>
            <span class="fw-bold text-dark me-2">작성일:</span>
            <span>{{ formatDateDetail(boardContent.updatedAt) }}</span>
          </div>
        </div>

        <!-- 파일 다운로드 목록 -->
        <div v-if="boardFileContent.length" class="mb-4">
          <label class="fw-bold text-dark">첨부 파일</label>
          <div class="list-group">
            <div v-for="f in boardFileContent.filter(f => f.renderType === 'LIST')" :key="f.id"
              class="d-flex justify-content-between align-items-center list-group-item">
              <span>{{ f.orgName }}</span>
              <argon-button size="sm" variant="outline" color="primary" @click="download(f.id, f.name)">
                <font-awesome-icon :icon="['fas', 'file-arrow-down']" />
              </argon-button>
            </div>
          </div>
        </div>
        <!-- 에디터 본문 -->
        <!-- 상세 페이지 템플릿 -->
<div class="editor-content border rounded p-3 min-editor-height" v-html="boardContent.content"></div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-card {
  min-height: 80vh;
}

.editor-content {
  min-height: 200px;
  font-size: 1rem;
  line-height: 1.6;
}

.min-editor-height {
  min-height: 400px;
}
</style>
