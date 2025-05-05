<script setup lang="ts">
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { fetchHospitalMainList } from '@/api/hospital';
import { HospitalListType } from '@/types/hospital';
import ArgonButton from '@/components/ArgonButton.vue';

const route = useRoute();
const router = useRouter();
const body = document.getElementsByTagName("body")[0];
const store = useStore();
const hospitalListData = ref<HospitalListType[]>();

onMounted(async () => {
  const response = await fetchHospitalMainList(0, 10);
  hospitalListData.value = response.data.content;
  console.log('hospi.value: ', hospitalListData.value);

});

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

const showCate = (hospitalId :number) => {
  router.push(`/survey-cate/${hospitalId}`);
}

</script>

<template>

  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container px-lg-5">
      <a class="navbar-brand" href="#!">Start Bootstrap</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span
          class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link active" aria-current="page" href="/">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="#!">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#!">Contact</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <header class="py-5">
    <div class="container px-lg-5">
      <div class="p-4 p-lg-5 bg-light rounded-3 text-center">
        <div class="m-4 m-lg-5">
          <h1 class="display-5 fw-bold">방문하신 병원을 선택해주세요</h1>
          <p class="fs-4">정확한 병원 선택은 더 나은 설문 경험으로 이어집니다.</p>
          <small>선택하신 병원 정보는 설문 통계 외에 사용되지 않습니다.</small>
        </div>
      </div>
    </div>
  </header>

  <section class="pt-4">
  <div class="container px-lg-5">
    <div class="row gx-lg-5">
      <!-- 병원 리스트 (좌측) -->
      <div class="col-lg-8">
        <div class="row">
          <div
            class="col-md-6 col-xxl-6 mb-4"
            v-for="hospital in hospitalListData"
            :key="hospital.id"
          >
            <div class="card bg-light border-0 h-100">
              <div class="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                <div
                  class="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4"
                >
                  <i class="bi bi-hospital"></i>
                </div>
                <h2 class="fs-3 pt-2 fw-bold">{{ hospital.name }}</h2>
                <p class="mb-3">{{ hospital.description }}</p>
                <argon-button size="md" color="primary" @click="showCate(hospital.id)">바로 가기</argon-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 소개 섹션 (우측) - large 이상에서만 표시 -->
      <div class="col-lg-4 d-none d-lg-block">
        <div class="card h-100 shadow-sm">
          <div class="card-body p-3">
            <h3 class="fw-bold mb-3">웹 설문 시스템 소개</h3>
            <p>
              본 시스템은 병원 방문자 및 환자의 소중한 의견을 수집하여
              의료 서비스 품질 향상에 기여합니다.
            </p>
            <ul>
              <li>간편한 설문 참여</li>
              <li>실시간 통계 제공</li>
              <li>모바일 완벽 대응</li>
            </ul>
            <p class="text-muted small mt-5">
              ※ 모든 데이터는 익명으로 처리되며, 통계 분석 외에 사용되지 않습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
