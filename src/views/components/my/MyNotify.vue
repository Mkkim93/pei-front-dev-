<script setup lang="ts">
import { formatDate } from '@/utils/date';
import { ref, onMounted } from 'vue';
import { fetchNotifyListAll } from '@/api/notify';
import { NotifyType } from '@/types/notify';
import ArgonButton from '@/components/ArgonButton.vue';

const notifyData = ref<NotifyType[]>([]);

onMounted(async () => {
  const response = await fetchNotifyListAll(0, 10);
  console.log('notify response: ', response.data.content);
  Object.assign(notifyData.value, response.data.content);
  console.log('notifyData: ', notifyData.value);
})
</script>

<template>
  <div class="card mt-1">
      <div class="card-header pb-0 d-flex justify-content-between align-items-center">
        <h6>알림 목록</h6>
        <router-link to="/board-write">
          <ArgonButton variant="outline" size="sm" color="success">
            <font-awesome-icon :icon="['fas', 'trash-can']" /> 전체 삭제
          </ArgonButton>
        </router-link>
      </div>

      <div class="card-body px-4 pt-3 pb-2">
        <div class="table-responsive p-3">
          <!-- <router-view /> TODO -->

          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">내용</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">유형</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">자세히보기</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">수신일</th>
                <th class="text-secondary opacity-7"></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="notify in notifyData" :key="notify.id">
                <td>
                  <div class="d-flex px-2 py-1">
                    <div>
                      <img src="../../assets/img/team-2.jpg" class="avatar avatar-sm me-3" alt="user1" />
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <router-link :to="`/auth-table/${notify.id}`">
                        <h6 class="mb-0 text-sm">{{ notify.message }}</h6>
                      </router-link>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0">{{ notify.type }}</p>
                  <p class="text-xs text-secondary mb-0">{{ notify.targetId }}</p>
                </td>
                <td class="align-middle text-center text-sm">
                  <span class="badge badge-sm bg-gradient-success">{{ notify.url }}</span>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{ formatDate(notify.createAt) }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
         

        </div>
      </div>
    </div>
</template>

<style scoped>

</style>