<script setup lang="ts">
import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import type { CommonSurvey } from '@/types/common/survey';
import { fetchCommonSurvey } from '@/api/survey';
import router from '@/router';

const store = useStore();
const route = useRoute();
const fallbackImg = 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg';
const body = document.getElementsByTagName("body")[0];
const surveySelectList = ref<CommonSurvey[]>();
const hosId = ref<number>();

onMounted( async () => {
  hosId.value = Number(route.params.id);
  const res = await fetchCommonSurvey(0, 10, hosId.value, 'ACTIVE');
  surveySelectList.value = res.data.content;
});

function goToSurveyList(hospitalId: number) {
  router.push({ name: 'SurveyCategoryList', params: { id: hospitalId } });
}

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = true;
  body.classList.remove("bg-gray-100");
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
}); 
</script>

<template>
  <div>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container px-4 px-lg-5">
        <a class="navbar-brand" href="#">설문 시스템</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li class="nav-item">
              <RouterLink class="nav-link active" to="/">Home</RouterLink>
            </li>
            <li class="nav-item"><a class="nav-link" href="#">About</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Header -->
    <header class="bg-dark py-5">
      <div class="container px-4 px-lg-5 my-5">
        <div class="text-center text-white">
          <h1 class="display-4 fw-bolder">병원을 선택해주세요</h1>
          <p class="lead fw-normal text-white-50 mb-0">병원별 설문 리스트로 이동합니다.</p>
        </div>
      </div>
    </header>

    <!-- Hospital List Section -->
    <section class="py-5">
      <div class="container px-4 px-lg-5 mt-5">
        <div class="row gx-4 gx-lg-5 row-cols-1 row-cols-md-2 row-cols-xl-4 justify-content-center">
          <div v-for="survey in surveySelectList" :key="survey.id" class="col mb-5 position-relative">
            <div class="card h-100" @click="goToSurveyList(survey.id)" style="cursor: pointer; position: relative;">

              <!-- 📌 Category Badge -->
              <span class="badge bg-primary position-absolute top-0 start-0 m-2">
                {{ survey.category }}
              </span>

              <img class="card-img-top" :src="survey.imageUrl || fallbackImg" alt="병원 이미지" />

              <div class="card-body p-4 text-center">
                <h5 class="fw-bolder">{{ survey.title }}</h5>
                <p class="text-muted small">{{ survey.description }}</p>
              </div>

              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent text-center">
                <span class="btn btn-outline-dark mt-auto">설문 참여</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-5 bg-dark">
      <div class="container">
        <p class="m-0 text-center text-white">© 설문 시스템 2025</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  transition: all 0.2s ease-in-out;
}
</style>