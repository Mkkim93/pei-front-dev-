<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { fetchBoardDetail, deleteBoardIds, downloadFile } from "@/api/board";
import { useRoute } from "vue-router";
import { BoardDetailType, BoardDeleteIdsType, BoardDetailFileType } from "@/types/board";
import { formatDateDetail } from "@/utils/date";
import ArgonButton from "@/components/ArgonButton.vue";
import router from "@/router";
import { AxiosError } from "axios";

const route = useRoute();
const boardContent = reactive<BoardDetailType>({
  id: 0,
  title: '',
  content: '',
  updatedAt: '',
  writer: '',
  views: 0,
  boardFiles: [],
});
const boardFileContent = ref<BoardDetailFileType[]>([]);
const delIds = ref<BoardDeleteIdsType>();

onMounted(async () => {

  const id = Number(route.params.id);

  if (isNaN(id)) {
    console.error("존재하지 않은 게시글");
    return;
  }

  try {
    
    const response = await fetchBoardDetail(id);
    Object.assign(boardContent, response.data);
    boardFileContent.value = boardContent.boardFiles;

  } catch (error) {

    console.log("로그에서 없는 게시글 조회 시: ", error);
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
    console.log('delIds: ', delIds.value);
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
  <div class="container-flud">
    <div class="card mt-6 px-4 custom-card">
      <div class="card-header pb-4 d-flex justify-content-between align-items-center">
        <h6>상세 페이지</h6>
        <div class="d-flex gap-2 ms-auto">

          <router-link to="/auth-table">
            <argon-button color="dark">목록</argon-button>
          </router-link>

          <router-link :to="`/update/${boardContent.id}`">
            <argon-button color="secondary">수정</argon-button>
          </router-link>

          <argon-button color="light" @click="deleteBoards">삭제
          </argon-button>
        </div>

      </div>

      <div class="card-body px-4 pt-2 pb-2">
        <div class="table-responsive p-0" style="overflow: visible;">
          <div class="p-4">
            <div class="col-md-5">
              <span class="bbs-label">제목:</span>
              <span class="bbs-value">{{ boardContent.title }}</span>
            </div>

            <div class="col-md-3">
              <span class="bbs-label">작성자:</span>
              <span class="bbs-value">{{ boardContent.writer }}</span>
            </div>

            <div class="col-md-4 text-md-end">
              <span class="bbs-label">작성일:</span>
              <span class="bbs-value">{{ formatDateDetail(boardContent.updatedAt) }}</span>
            </div>

            <div class="col-md-4 text-md-end">
              <div v-for="f in boardFileContent" :key="f.id">
                <div v-if="f.renderType === 'LIST'">
                  <span>{{ f.orgName }}</span>
                  <argon-button @click="download(f.id, f.name)">다운로드</argon-button>
                </div>
              </div>
            </div>
            <!-- 에디터 영역 -->
            <div v-html="boardContent.content"></div>
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