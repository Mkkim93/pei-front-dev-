<script setup lang="ts">
import { formatDate } from '@/utils/date';
import { ref, onMounted, computed } from 'vue';
import { fetchNotifyListAll, markNotifycationIsRead } from '@/api/notify';
import { NotifyListType, PageInfoType } from '@/types/notify';
import ArgonCheckbox from '@/components/ArgonCheckbox.vue';
import ArgonPagination from '@/components/ArgonPagination.vue';
import ArgonPaginationItem from '@/components/ArgonPaginationItem.vue';
import ArgonSwitch from '@/components/ArgonSwitch.vue';

const checkboxKey = ref<boolean>(false);
const isChecked = ref<boolean>(false);
const filterisRead = ref<boolean>(false);
const notifyList = ref<NotifyListType[]>([]);
const pageData = ref<PageInfoType | null>(null);
const currentPage = ref(0);
const groupSize = 10;
const currentGroup = computed(() => Math.floor(currentPage.value / groupSize));

const paginatedPages = computed(() => {
  const total = pageData.value?.totalPages ?? 1;
  const start = currentGroup.value * groupSize + 1;
  const end = Math.min(start + groupSize - 1, total);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
 
const changePage = async (page: number) => {
  if (page < 0 || (pageData.value && page >= pageData.value.totalPages)) return;
  const response = await fetchNotifyListAll(page, 10, filterisRead.value);
  notifyList.value = response.data.content;
  pageData.value = response.data.page;
  currentPage.value = page;
  isChecked.value = false;
  checkboxKey.value = !checkboxKey.value;
}

const notifyIds = ref<string[]>();

onMounted(async () => {
  const response = await fetchNotifyListAll(0, 10, filterisRead.value);
  notifyList.value = response.data.content;
  pageData.value = response.data.page;
})

const isReadTrue = async () => {
  notifyIds.value = notifyList.value.map(item => item.id);
  await markNotifycationIsRead(notifyIds.value);
  notifyList.value = notifyList.value.map(item => ({
    ...item,
    isRead: true
  }));
}

const toggleNotifyFilter = async () => {
  filterisRead.value = !filterisRead.value;
  const response = await fetchNotifyListAll(0, 10, filterisRead.value);
  notifyList.value = response.data.content;
  pageData.value = response.data.page;
  currentPage.value = 0;
};
</script>

<template>
  <div class="card mt-1">
      <div class="card-header pb-0 d-flex justify-content-between align-items-center">
        <h6>알림 목록</h6>
          <ArgonCheckbox variant="outline" size="sm" color="success" id="notifyIds" :checked="isChecked" @change="isReadTrue" :key="checkboxKey">
            모두 읽음 처리
          </ArgonCheckbox>
      </div>
      <div class="card-header pb-0 d-flex justify-content-between align-items-left">
        <ArgonSwitch id="notifyIds" name="readFilter" @change="toggleNotifyFilter">읽지 않은 알림</ArgonSwitch>
      </div>
      <div class="card-body px-4 pt-3 pb-2">
        <div class="table-responsive p-3">

          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">내용</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">유형</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">상태</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">수신일</th>
                <th class="text-secondary opacity-7"></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="notify in notifyList" :key="notify.id">         
                <td>
                  <div class="d-flex px-2 py-1">
                    <div>
                      <!-- <img src="../../assets/img/team-2.jpg" class="avatar avatar-sm me-3" alt="user1" /> -->
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <router-link :to="`${notify.url}${notify.targetId}`"> <!-- TODO: 나중에 NotifyList 에서 넘어온 url 로 변경-->
                        <h6 class="mb-0 text-sm">{{ notify.message }}</h6>
                      </router-link>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0">{{ notify.type }}</p>
                  <!-- <p class="text-xs text-secondary mb-0">{{ notify.targetId }}</p> -->
                </td>
                <td class="align-middle text-center text-sm">
                  <span 
                    class="badge badge-sm"
                    :class="notify.isRead ? 'bg-gradient-success' : 'bg-gradient-warning'"
                    >{{ notify.isRead == true ? '읽음' : '읽지않음' }}</span>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{ formatDate(notify.createdAt) }}</span>
                </td>
              </tr>

            </tbody>
          </table>

          <ArgonPagination variant="gradient" class="mt-3 justify-content-center">

            <ArgonPaginationItem
              :disabled="currentGroup === 0"
              @click="changePage((currentGroup - 1) * groupSize)"
              prev
            />

            <ArgonPaginationItem
              v-for="page in paginatedPages"
              :key="page"
              :active="(page - 1) === currentPage"
              @click="changePage(page - 1)"
            >
              {{ page }}
            </ArgonPaginationItem>

            <ArgonPaginationItem
              :disabled="(currentGroup + 1) * groupSize >= (pageData?.totalPages ?? 0)"
              @click="changePage((currentGroup + 1) * groupSize)"
              next
            />
          </ArgonPagination>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>