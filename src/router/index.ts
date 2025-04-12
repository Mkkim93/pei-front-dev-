import { createRouter, createWebHistory } from "vue-router";
import { expiredCheck } from "@/utils/auth";
import { connectToSSE } from "@/utils/sse";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import AuthorsTable from "@/views/components/AuthorsTable.vue";
import AccountPass from "@/views/components/account/AccountPass.vue";
import axios from "@/plugins/axiosAuth";
import store from "@/store/store";
import AccountUsername from "@/views/components/account/AccountUsername.vue";
import BoardWrite from "@/views/components/board/BoardWrite.vue";
import MyActivity from "@/views/components/my/MyActivity.vue";
import MyNotify from "@/views/components/my/MyNotify.vue";
import MySetting from "@/views/components/my/MySetting.vue";
import MyProfile from "@/views/components/my/MyProfile.vue";
import BoardUpdate from "@/views/components/board/BoardUpdate.vue";
import BoardDetail from "@/views/components/board/BoardDetail.vue";

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
    name: "공지 관리",
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
    props: true,
    redirect: { name: 'MyProfile' },
    children: [
      {
        path: "my-activity",
        name: "MyActivity",
        component: MyActivity,
        props: true,
      },
      {
        path: "my-notify",
        name: "MyNotify",
        component: MyNotify,
        props: true,
      },
      {
        path: "my-setting",
        name: "MySetting",
        component: MySetting,
        props: true,
      },
      {
        path: "my-profile",
        name: "MyProfile",
        component: MyProfile,
        props: true,
      }
    ],
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
  {
    path: "/recover-username",
    name: "AccountUsername",
    component: AccountUsername,
  },
  {
    path: "/recover-password",
    name: "AccountPass",
    component: AccountPass,
  },
  {
    path: "/board-write",
    name: "게시글 작성",
    component: BoardWrite,
    props: true,
  },
  {
    path: "/auth-table",
    name: "게시글 목록",
    component: AuthorsTable,
  },
  {
    path: "/detail/:id",
    name: "게시글 상세",
    component: BoardDetail,
  },
  {
    path: "/update/:id",
    name: "게시글 수정",
    component: BoardUpdate,
    props: true,
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

  if (to.path === '/recover-username') {
    return next();
  }

  if (to.path === '/recover-password') {
    return next();
  }

  try {
    console.log('[Router Nav] to.Path: ', to.path);
    console.log('[Router Nav] from: ', from);

    if (expiredCheck()) {
      const response = await axios.post('/api/reissue');
      store.dispatch('login', response.headers['authorization']);
      console.log('[Router Nav] conToSSE Conntect Retry');
      await connectToSSE();
    }

    next();
  } catch (error) {
    console.error('[Token Auth Error]: ', error);
    store.dispatch('logout'); // 토큰 클리어 처리
    next('/signin'); // 로그인 페이지로 리다이렉트
  }
});

export default router;
