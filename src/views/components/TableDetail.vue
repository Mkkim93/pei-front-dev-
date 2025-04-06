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

      <dt class="col-sm-2 bbs-label">제목</dt>
        <dd class="col-sm-10 bbs-value">{{ boardContent.title }}</dd>
    </div>

    <div class="card-body">
      <dl class="row">
        
        <dt class="col-sm-2 bbs-label">작성자</dt>
        <dd class="col-sm-10 bbs-value">{{ boardContent.writer }}</dd>

        <dt class="col-sm-2 bbs-label">등록일</dt>
        <dd class="col-sm-10 bbs-value">{{ formatDateDetail(boardContent.updatedAt) }}</dd>

        <dd class="col-sm-10 bbs-value">
          <div v-html="boardContent.content"></div>
        </dd>
      </dl>
    </div>
  </div>
</div>
</template>

<style>
  .bbs-detail .bbs-label {
    font-weight: bold;
    color: #5e72e4;
  }

  .bbs-detail .bbs-value {
    padding-bottom: 10px;
  }

  .bbs-detail .card {
    border-radius: 1rem;
  }
</style>