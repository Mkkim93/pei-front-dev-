<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchBoardList } from "@/api/board";
import { BoardListType, PageInfoType } from "@/types/board";
import { formatDate } from "@/utils/date";
import ArgonPagination from "@/components/ArgonPagination.vue";
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const boardList = ref<BoardListType[]>([]);
const pageData = ref<PageInfoType | null>(null);
const detailViews = ref<boolean>(false); // TODO 게시판 상세 페이지에서 게시글 목록 제어를 위한 ref 변수

onMounted(async () => {
  const response = await fetchBoardList(0, 10);
  boardList.value = response.data.content;
  pageData.value = response.data.page;
  console.log('pageData.value: ', pageData.value);
});

const currentPage = ref(0);

const changePage = async (page: number) => {
  if (page < 0 || (pageData.value && page >= pageData.value.totalPages)) return;

  const response = await fetchBoardList(page, 10);
  boardList.value = response.data.content;
  pageData.value = response.data.page;
  currentPage.value = page;
};
</script>

<template>
  <div class="card mt-5">
    <div class="card-header pb-0 d-flex justify-content-between align-items-center">
  <h6>공지 사항</h6>
  <router-link to="/board-write">
  <ArgonButton variant="outline" size="lg" color="success">
    <i class="fa-solid fa-pen-to-square m-1"></i>
    글쓰기
  </ArgonButton>
</router-link>
</div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <router-view />
        <table class="table align-items-center mb-0">

          <!-- thead -->
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                제목
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                작성자
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                조회수
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                작성일
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>

          <!-- tbody -->
          <tbody>
            <tr v-for="board in boardList" :key="board.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <img src="../../assets/img/team-2.jpg" class="avatar avatar-sm me-3" alt="user1" />
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <router-link :to="`/auth-table/${board.id}`">
                    <h6 class="mb-0 text-sm">{{ board.title }}</h6>
                    </router-link>
                    <p class="text-xs text-secondary mb-0">
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ board.writer }}</p>
                <p class="text-xs text-secondary mb-0">{{ board.roleType }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="badge badge-sm bg-gradient-success">{{ board.views }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{ formatDate(board.createAt) }}</span>
              </td>
              <td class="align-middle">
                <a href="javascript:;" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip"
                  data-original-title="Edit user">수정</a>
              </td>
            </tr>
          </tbody>
        </table>
        
        <ArgonPagination variant="gradient" class="mt-3 justify-content-center">
          <ArgonPaginationItem :disabled="currentPage === 0" @click="changePage(currentPage - 1)" prev />

          <ArgonPaginationItem v-for="page in pageData?.totalPages" :key="page" :active="(page - 1) === currentPage"
            @click="changePage(page - 1)">
            {{ page }}
          </ArgonPaginationItem>

          <ArgonPaginationItem :disabled="currentPage + 1 >= (pageData?.totalPages ?? 1)"
            @click="changePage(currentPage + 1)" next />
        </ArgonPagination>
      </div>
    </div>
  </div>

</template>
