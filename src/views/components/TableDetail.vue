<script setup lang="ts">
import { onMounted } from "vue";
import { fetchBoardDetail } from "@/api/board";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(async () => {
  const id = Number(route.params.id); // 여기서 변환!
  console.log('라우터 아이디: ', id);
  if (isNaN(id)) {
    console.error("유효하지 않은 게시글 ID입니다.");
    return;
  }

  const data = await fetchBoardDetail(id);
  console.log("게시글 상세", data);
});
</script>

<template>
  <<div class="container mt-5 bbs-detail">
  <div class="card shadow">
    <div class="card-header border-0">
      <h3 class="mb-0">📄 게시글 상세</h3>
    </div>

    <div class="card-body">
      <dl class="row">
        <dt class="col-sm-2 bbs-label">제목</dt>
        <dd class="col-sm-10 bbs-value">Vue + Spring 연동 게시판</dd>

        <dt class="col-sm-2 bbs-label">작성자</dt>
        <dd class="col-sm-10 bbs-value">MK</dd>

        <dt class="col-sm-2 bbs-label">등록일</dt>
        <dd class="col-sm-10 bbs-value">2025-04-02</dd>

        <dt class="col-sm-2 bbs-label">내용</dt>
        <dd class="col-sm-10 bbs-value">
          게시판 상세 페이지 예시입니다. Argon Dashboard 스타일과 충돌 없이 표현됩니다.
        </dd>
      </dl>

      <div class="text-right">
        <router-link to="/auth-table" class="btn btn-sm btn-secondary">목록으로</router-link>
        <a href="/board/edit/1" class="btn btn-sm btn-primary">수정</a>
        <button class="btn btn-sm btn-danger">삭제</button>
      </div>
    </div>
  </div>
</div>
</template>

<style>
  .bbs-detail .bbs-label {
    font-weight: bold;
    color: #5e72e4; /* argon primary */
  }

  .bbs-detail .bbs-value {
    padding-bottom: 10px;
  }

  .bbs-detail .card {
    border-radius: 1rem;
  }
</style>