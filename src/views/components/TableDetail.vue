<script setup lang="ts">
import { reactive, watchEffect } from "vue";
import { fetchBoardDetail } from "@/api/board";
import { useRoute } from "vue-router";
import { BoardDetailType } from "@/types/board";
import { formatDateDetail } from "@/utils/date";

const route = useRoute();

const boardContent = reactive<BoardDetailType>({
  id: 0,
  title: '',
  content: '',
  updatedAt: '',
  writer: '',
  views: 0,
});

watchEffect(async () => {
  const id = Number(route.params.id);
  if (isNaN(id)) {
    console.error("존재하지 않은 게시글");
    return;
  }
  const response = await fetchBoardDetail(id);
  Object.assign(boardContent, response.data);
  console.log('[watchEffect]: ', response.data);
})

</script>

<template>
  <div class="container-fluid bbs-detail">
    <div class="card shadow">
      <div class="card-header border-0">
        <div class="row align-items-center">
          <div class="col-md-5">
            <span class="bbs-label">제목:</span>
            <span class="bbs-value">{{ boardContent.title }}</span>
          </div>
          <div class="col-md-3">
            <span class="bbs-label">작성자:</span>
            <span class="bbs-value">{{ boardContent.writer }}</span>
          </div>
          <div class="col-md-4 text-md-end">
            <span class="bbs-label">등록일:</span>
            <span class="bbs-value">{{ formatDateDetail(boardContent.updatedAt) }}</span>
          </div>
        </div>
        <dd class="col-sm-10 bbs-value">
        <div v-html="boardContent.content"></div>
      </dd>
      </div>
    </div>
  </div>

</template>

<style>
.bbs-detail .bbs-label {
  font-weight: bold;
  color: #5e72e4;
  margin-right: 5px;
  padding-bottom: 10px;
}

.bbs-detail .card {
  border-radius: 1rem;
}

.bbs-detail .bbs-value {
  padding-bottom: 10px;
  display: inline-block;
}

.card-header {
  background-color: #f8f9fe;
}
</style>