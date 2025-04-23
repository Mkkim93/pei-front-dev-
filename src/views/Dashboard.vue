<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
// import Carousel from "./components/Carousel.vue";
import Calendar from '@/examples/Calendar.vue';
import CategoriesList from "./components/CategoriesList.vue";
import { fetchBoardList } from "@/api/board";
import { BoardListType, PageInfoType } from "@/types/board.d";
import { formatDate } from "@/utils/date";
import ArgonButton from '@/components/ArgonButton.vue';
const boardList = ref<BoardListType[]>([]);
const pageData = ref<PageInfoType | null>(null);

onMounted(async () => {
  const response = await fetchBoardList(0, 8, undefined);
  boardList.value = response.data.content;
  pageData.value = response.data.page;
});

import US from "@/assets/img/icons/flags/US.png";
import DE from "@/assets/img/icons/flags/DE.png";
import GB from "@/assets/img/icons/flags/GB.png";
import BR from "@/assets/img/icons/flags/BR.png";

// TODO 1 알림 구현 (SSE + MONGO)
// TODO 2 데이터 받아와야되고 (최근 데이터 자료 정도 가져와야 될듯)
const sales = {
  us: {
    country: "United States",
    sales: 2500,
    value: "$230,900",
    bounce: "29.9%",
    flag: US,
  },
  germany: {
    country: "Germany",
    sales: "3.900",
    value: "$440,000",
    bounce: "40.22%",
    flag: DE,
  },
  britain: {
    country: "Great Britain",
    sales: "1.400",
    value: "$190,700",
    bounce: "23.44%",
    flag: GB,
  },
  brasil: {
    country: "Brasil",
    sales: "562",
    value: "$143,960",
    bounce: "32.14%",
    flag: BR,
  },
};
</script>
<template>
  <!-- <Carousel /> -->
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="일별 자료"
              value="일별 내용"
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+55%</span> 전일 대비"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="주간 자료"
              value="주간 내용"
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+3%</span> 전주 대비"
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="월별 자료"
              value="월별 내용"
              description="<span
                class='text-sm font-weight-bolder text-danger'
                >-2%</span> 전월 대비"
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="연간 자료"
              value="연간 내용"
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+5%</span> 전년도 대비"
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>
        <div class="row align-items-stretch">
          <div class="col-lg-7 mb-lg">
            <!-- line chart 여기 차트를 일별, 월별, 주간, 월별 로 슬라이드 해서 보여줄 수 있도록 구현하는것도 괜찮을 듯-->
            <div class="card z-index-2 h-100" style="min-height: 450px;">
              <gradient-line-chart
                id="chart-line"
                title="월별 조사 현황"
                description="<i class='fa fa-arrow-up text-success'></i>
      <span class='font-weight-bold'>4% </span> in 2025"
                :chart="{ 
                  labels: [
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                  datasets: [
                    {
                      label: 'Mobile Apps',
                      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
                    },
                  ],
                }"
              />
            </div>
          </div>
          <div class="col-lg-5">
            <!-- <carousel /> -->
             <calendar></calendar>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-7 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 card-header">
                <div class="p-3 pb-4 card-header d-flex justify-content-between align-items-center">
  <h6 class="mb-0">공지 사항</h6>
  <router-link to="/tables">
  <ArgonButton class="btn btn-sm btn-outline-primary" variant="outline">더보기</ArgonButton>
</router-link>
</div>
            </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <thead>
                    <tr class="text-center">
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(board, index) in boardList" :key="index">
                      <td class="w-30">
                        <div class="px-2 py-1 d-flex align-items-center">
                          <div class="ms-4">
                            <h6 class="mb-0 text-sm">
                              <router-link :to="`detail/${board.id}`">
    {{ board.title.length > 10 ? board.title.slice(0, 5) + '...' : board.title }}
                              </router-link>
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          
                          <h6 class="mb-0 text-sm">{{ board.writer }}</h6>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          
                          <h6 class="mb-0 text-sm">{{ formatDate(board.createAt)  }}</h6>
                        </div>
                      </td>
                      <td class="text-sm align-middle">
                        <div class="text-center col">
                          
                          <h6 class="mb-0 text-sm">{{ board.views }}</h6>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <categories-list
              :categories="[
                {
                  icon: {
                    component: 'ni ni-mobile-button',
                    background: 'dark',
                  },
                  label: 'Devices',
                  description: '250 in stock <strong>346+ sold</strong>',
                },
                {
                  icon: {
                    component: 'ni ni-tag',
                    background: 'dark',
                  },
                  label: 'Tickets',
                  description: '123 closed <strong>15 open</strong>',
                },
                {
                  icon: { component: 'ni ni-box-2', background: 'dark' },
                  label: 'Error logs',
                  description: '1 is active <strong>40 closed</strong>',
                },
                {
                  icon: { component: 'ni ni-satisfied', background: 'dark' },
                  label: 'Happy Users',
                  description: '+ 430',
                },
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
