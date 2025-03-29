import { createRouter, createWebHistory } from "vue-router";
import { expiredCheck } from "@/utils/auth";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import axios from "@/plugins/axiosAuth";
import store from "@/store/store";


const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
  },
  {
    path: "/dashboard-default",
    name: "대시보드",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "조사 설정",
    component: Tables,
  },
  {
    path: "/billing",
    name: "조사 관리",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "전체 현황",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "서비스 관리",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
});

// router nav
// to : 대상 Route 객체 이동
// from: 현재 라우트로 오기전 라우트
// next: 훅 해결을 위해 호출 action은 next() 에 제공된 전달 인자에 달려 있다.
// next(false) : 현재 네비게이션 중단 시 사용 (from 경로의 Url 로 재설정)
router.beforeEach(async (to, from, next) => {
  // 로그인 페이지는 제외
  if (to.path === '/signin') {
    return next();
  }

  if (to.path === '/signup') {
    return next();
  }

  try {
    console.log('[Router Nav] to.Path: ', to.path);
    console.log('[Router Nav] from: ', from);

    if (expiredCheck()) {
      const response = await axios.post('/api/reissue');
      store.dispatch('login', response.headers['authorization']);
    }

    next();
  } catch (error) {
    console.error('token auth error: ', error);
    store.dispatch('logout'); // 토큰 클리어 처리
    next('/signin'); // 로그인 페이지로 리다이렉트
  }
});

export default router;
