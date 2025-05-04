<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import SidenavItem from "./SidenavItem.vue";

const isSurveyDropdownOpen = ref(false);

defineProps({
  currentPage: {
    type: String,
    default: "",
  },
  currentDirectory: {
    type: String,
    default: "",
  },
});

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="isRTL ? '홈' : '홈'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/billing"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="isRTL ? '설문 관리' : '설문 관리'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

        <!-- 드롭다운 메뉴 -->
  <!-- <ul v-if="isSurveyDropdownOpen" class="navbar-nav ps-4">
    <li class="nav-item">
      <sidenav-item
        to="/survey-list"
        :class="getRoute() === 'survey-list' ? 'active' : ''"
        navText="설문 목록"
      />
    </li>
    <li class="nav-item">
      <sidenav-item
        to="/survey-before"
        :class="getRoute() === 'survey-before' ? 'active' : ''"
        navText="설문 작성"
      />
    </li>
  </ul> -->

      <li class="nav-item">
        <sidenav-item
          to="/rtl-page"
          :class="getRoute() === 'rtl-page' ? 'active' : ''"
          navText="통계 관리"
        >
          <template v-slot:icon>
            <i class="ni ni-world-2 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/tables"
          :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="isRTL ? '공지 관리' : '공지 관리'"
        >
          <template v-slot:icon>
            <font-awesome-icon :icon="['fas', 'pen-to-square']" />
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="#"
          :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="isRTL ? '일정 관리' : '일정 관리'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/virtual-reality"
          :class="getRoute() === 'virtual-reality' ? 'active' : ''"
          :navText="isRTL ? '전체 현황' : '전체 현황'"
        >
          <template v-slot:icon>
            <i class="ni ni-app text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="mt-3 nav-item">
        <h6
          v-if="isRTL"
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        > 사용자 관리
        </h6>

        <h6
          v-else
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          사용자 관리
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="isRTL ? '내 정보' : '내 정보'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/hospital"
          :class="getRoute() === 'hospital' ? 'active' : ''"
          :navText="isRTL ? '병원 관리' : '병원 관리'"
        >
          <template v-slot:icon>
            <font-awesome-icon :icon="['fas', 'hospital']" />
          </template>
        </sidenav-item>
      </li>

      <!-- <li class="nav-item">
        <sidenav-item
          to="/user-manager"
          :class="getRoute() === 'user-manager' ? 'active' : ''"
          :navText="isRTL ? '사용자' : '사용자'"
        >
          <template v-slot:icon>
            <font-awesome-icon :icon="['fas', 'users-gear']" />
          </template>
        </sidenav-item>
      </li> -->

      <!-- <li class="nav-item">
        <sidenav-item
          to="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="isRTL ? '회원 가입' : '회원 가입'"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->
    </ul>
  </div>

  <div class="pt-3 mx-3 mt-3 sidenav-footer">
    
  </div>
</template>
