<script setup lang="ts">
import RocketImg from "@/assets/img/ivancik.jpg";
</script>


<template>
  <div class="card h-100 p-3">
    <div
      class="overflow-hidden position-relative border-radius-lg bg-cover h-100"
      :style="{ backgroundImage: `url(${RocketImg})` }"
    >
      <span class="mask bg-gradient-dark"></span>
      <div class="card-body position-relative z-index-1 p-3 h-100">
        <div class="d-flex flex-column h-100">
          <h5 class="text-white font-weight-bolder mb-4 pt-2">
            제목1 입니다.
          </h5>
          <p class="text-white mb-5">
            내용1 입니다.
          </p>
          <a
            class="text-white font-weight-bold ps-1 mb-0 icon-move-left mt-auto"
            href="javascript:;"
          >
           더보기
            <i class="fas fa-arrow-left text-sm ms-1" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
