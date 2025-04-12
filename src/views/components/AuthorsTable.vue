<script setup lang="ts">
import store from "@/store/store";
import { ref, onMounted, computed } from "vue";
import { fetchBoardList } from "@/api/board";
import { BoardListType, PageInfoType } from "@/types/board";
import { formatDate } from "@/utils/date";
import ArgonPagination from "@/components/ArgonPagination.vue";
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import { decodePayload } from "@/types/jwt.d";

const boardList = ref<BoardListType[]>([]);
const pageData = ref<PageInfoType | null>(null);

const rolesAdmin = ref<boolean>(false);
const userId = ref<number>(0);
const keyword = ref<string>('');

const currentPage = ref(0);
const groupSize = 10; // 한 번에 보여줄 페이지 수

// 페이지 그룹 계산
const currentGroup = computed(() => Math.floor(currentPage.value / groupSize));

// 현재 보여줄 페이지 목록 계산
const paginatedPages = computed(() => {
  const total = pageData.value?.totalPages ?? 1;
  const start = currentGroup.value * groupSize + 1;
  const end = Math.min(start + groupSize - 1, total);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// 게시글 목록 초기 로딩
onMounted(async () => {
  const response = await fetchBoardList(0, 10, keyword.value);
  boardList.value = response.data.content;
  pageData.value = response.data.page;

  const token = store.getters.accessToken;
  const response1 = await decodePayload(token);
  if (response1.roles === 'ROLE_ADMIN') {
    rolesAdmin.value = true;
  }
  userId.value = response1.id;
});

// 검색 핸들러
const onSearch = async () => {
  const response = await fetchBoardList(0, 10, keyword.value);
  boardList.value = response.data.content;
  pageData.value = response.data.page;
  currentPage.value = 0;
};

// 페이지 변경 핸들러
const changePage = async (page: number) => {
  if (page < 0 || (pageData.value && page >= pageData.value.totalPages)) return;
  const response = await fetchBoardList(page, 10, keyword.value);
  boardList.value = response.data.content;
  pageData.value = response.data.page;
  currentPage.value = page;
};
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header pb-0 d-flex justify-content-between align-items-center">
        <h6>공지 사항</h6>
        <router-link to="/board-write">
          <ArgonButton variant="contained" size="sm" color="success">
            <font-awesome-icon :icon="['fas', 'pen']" /> 작성
          </ArgonButton>
        </router-link>
      </div>

      <div class="card-body px-4 pt-3 pb-2">
        <div class="table-responsive p-3">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">제목</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">작성자</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">조회수</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">작성일</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="board in boardList" :key="board.id">
                <td>
                  <div class="d-flex px-2 py-1">
                    <div>
                      <img src="../../assets/img/team-2.jpg" class="avatar avatar-sm me-3" alt="user1" />
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <router-link :to="`/detail/${board.id}`">
                        <h6 class="mb-0 text-sm">{{ board.title }}</h6>
                      </router-link>
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
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <ArgonPagination variant="gradient" class="mt-3 justify-content-center">
            <!-- 이전 그룹 -->
            <ArgonPaginationItem
              :disabled="currentGroup === 0"
              @click="changePage((currentGroup - 1) * groupSize)"
              prev
            />

            <!-- 페이지 번호 -->
            <ArgonPaginationItem
              v-for="page in paginatedPages"
              :key="page"
              :active="(page - 1) === currentPage"
              @click="changePage(page - 1)"
            >
              {{ page }}
            </ArgonPaginationItem>

            <!-- 다음 그룹 -->
            <ArgonPaginationItem
              :disabled="(currentGroup + 1) * groupSize >= (pageData?.totalPages ?? 0)"
              @click="changePage((currentGroup + 1) * groupSize)"
              next
            />
          </ArgonPagination>

          <!-- 검색 -->
          <div class="d-flex justify-content-center">
            <form class="d-flex gap-2" @submit.prevent="onSearch">
              <ArgonInput v-model="keyword" placeholder="제목 또는 내용 검색" />
              <ArgonButton size="sm" type="submit" class="px-3" style="height: 38px">
                <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                검색
              </ArgonButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
