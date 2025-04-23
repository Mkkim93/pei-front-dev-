<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Breadcrumbs from "../Breadcrumbs.vue";
import axios from "@/plugins/axiosAuth";
import { fetchNotifyListAll } from "@/api/notify";
import { formatDateDetail } from "@/utils/date";

const filterIsRead = ref<undefined>('');
const showMenu = ref(false);
const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const route = useRoute();
const notifyList = ref([]);
const isLoading = ref(false);

// TODO 메서드 호출 지연
// const delay = (ms :number) => new Promise(resolve => setTimeout(resolve, ms));

// TODO badge 는 최근 읽지 않은 알림이 없을 때는 비활성화 (현재는 항상 랜더링 되어 있음)
const currentRouteName = computed(() => {
  return route.name;
});
const currentDirectory = computed(() => {
  let dir = route.path.split("/")[1];
  return dir.charAt(0).toUpperCase() + dir.slice(1);
});

const minimizeSidebar = () => store.commit("sidebarMinimize");
const toggleConfigurator = () => store.commit("toggleConfigurator");

const closeMenu = () => {
  setTimeout(() => {
    showMenu.value = false;
  }, 1000);
};

const logout = async () => {
  try {
    const response = await axios.post('/logout');
    store.dispatch('logout');
    console.log('logout response : ', response?.data);
  } catch (error) {
    console.log('logout : ', error);
  }
}

// TODO 라이플 사이클 훅 비동기 문제 알림이 간헐적으로 조회되지 않은 (서버 Api 요청도 안감)
const callMethodTest = async () => {
  if (isLoading.value) return; // 중복 호출 방지
  isLoading.value = true;
  try {
    console.log('📡 callMethodTest render');
    const response = await fetchNotifyListAll(0, 3, filterIsRead);
    notifyList.value = response.data.content;
    console.log('response success: ', notifyList.value);
    showMenu.value = true;
  } catch (error) {
    console.error('callMethodTest error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
    :class="isRTL ? 'top-0 position-sticky z-index-sticky' : ''" v-bind="$attrs" id="navbarBlur" data-scroll="true">
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs :current-page="currentRouteName" :current-directory="currentDirectory" />

      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar">
        <div class="pe-md-3 d-flex align-items-center" :class="isRTL ? 'me-md-auto' : 'ms-md-auto'">
          <div class="input-group">
            <span class="input-group-text text-body">
              <i class="fas fa-search" aria-hidden="true"></i>
            </span>
            <input type="text" class="form-control" :placeholder="isRTL ? '검색할 자료 입력' : '검색할 자료 입력'" />
          </div>
        </div>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center">
            <!-- target="_blank" : 기존 페이지를 남겨두고 새로운 페이지를 랜더링 -->
            <router-link :to="{ name: 'Signin' }" class="px-0 nav-link font-weight-bold text-white" @click="logout">
              <!-- TODO 로그인 시 내정보, 이거 필요없을 듯 -->
              <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" :class="isRTL ? 'ms-sm-2' : 'me-sm-2'" />
              <span v-if="isRTL" class="d-sm-inline d-none">로그아웃</span>
              <span v-else class="d-sm-inline d-none">로그아웃</span>
            </router-link>
          </li>
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a href="#" @click="minimizeSidebar" class="p-0 nav-link text-white" id="iconNavbarSidenav">
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line bg-white"></i>
                <i class="sidenav-toggler-line bg-white"></i>
                <i class="sidenav-toggler-line bg-white"></i>
              </div>
            </a>
          </li>
          <li class="px-3 nav-item d-flex align-items-center">
            <a class="p-0 nav-link text-white" @click="toggleConfigurator">
              <i class="cursor-pointer fa fa-cog fixed-plugin-button-nav"></i>
            </a>
          </li>
          <li class="nav-item dropdown d-flex align-items-center" :class="isRTL ? 'ps-2' : 'pe-2'">

            <a href="#" class="p-0 nav-link text-white" :class="[showMenu ? 'show' : '']" id="dropdownMenuButton"
              data-bs-toggle="dropdown" aria-expanded="false" @click.prevent="callMethodTest" @blur="closeMenu">
              <div class="notify-icon-wrapper position-relative">
                <i class="cursor-pointer fa fa-bell"></i>
                <span class="notify-badge"></span>
              </div>
            </a>
            <ul class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4" :class="showMenu ? 'show' : ''"
              >

              <div class="d-flex justify-content-between align-items-center px-3 mt-2">
                <p class="m-1 mb-0">최근 알림</p>
                <router-link to="/profile/my-notify" class="text-secondary text-xs">
                  더보기
                </router-link>
              </div>

              <li class="mb-2" v-for="notify in notifyList" :key="notify.id">
                <div class="dropdown-item border-radius-md">
                  <div class="py-1 d-flex">
                    <div class="my-auto">
                      <img src="../../assets/img/team-2.jpg" class="avatar avatar-sm me-3" alt="user image" />
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      {{ notify.type }}
                      <h6 class="mb-1 text-sm font-weight-normal">

                        <span class="font-weight-bold"></span>
                        {{ notify.message }}
                      </h6>
                      <p class="mb-0 text-xs text-secondary">
                        <i class="fa fa-clock me-1"></i>
                        {{ formatDateDetail(notify.createdAt) }}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.notify-icon-wrapper {
  position: relative;
  display: inline-block;
}

.notify-badge {
  position: absolute;
  top: 0;
  left: 8px;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  border: 2px solid white;
  /* 아이콘 위에 둥글게 표시되도록 */
}
</style>
