import { createRouter, createWebHistory } from "vue-router";
import { expiredCheck } from "@/utils/auth";
import { connectToSSE } from "@/utils/sse";
import axios from "@/plugins/axiosAuth";
import store from "@/store";
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
import AccountUsername from "@/views/components/account/AccountUsername.vue";
import BoardWrite from "@/views/components/board/BoardWrite.vue";
import MyActivity from "@/views/components/my/MyActivity.vue";
import MyNotify from "@/views/components/my/MyNotify.vue";
import MySetting from "@/views/components/my/MySetting.vue";
import MyProfile from "@/views/components/my/MyProfile.vue";
import BoardUpdate from "@/views/components/board/BoardUpdate.vue";
import BoardDetail from "@/views/components/board/BoardDetail.vue";
import ResetPassword from "@/views/components/account/ResetPassword.vue";
import UserManager from "@/views/components/my/auth/UserManager.vue";
import SurveyMain from "@/views/SurveyMain.vue";
import SurveyTemplate from "@/examples/Survey/SurveyTemplate.vue";
import SurveyCreatorPage from "@/examples/Survey/SurveyCreatorPage.vue";
import SurveyBeforePage from "@/examples/Survey/SurveyBeforePage.vue";
import SurveyList from "@/examples/Survey/SurveyList.vue";
import SurveyManager from "@/examples/Survey/SurveyManager.vue";
import SurveyEdit from "@/examples/Survey/SurveyEdit.vue";
import SurveyCate from "@/views/components/survery/SurveyCate.vue";
import SurveyTypeDetail from "@/examples/Survey/SurveyTypeDetail.vue";
import Hospital from "@/views/Hospital.vue";
import MyHospitalWard from "@/views/components/hospital/MyHospitalWard.vue";
import MyHospitalSetting from "@/views/components/hospital/MyHospitalSetting.vue";
import MyHospital from "@/views/components/hospital/MyHospital.vue";
import MyHospitalDepart from "@/views/components/hospital/MyHospitalDepart.vue";
import SurveyActiveDetail from "@/examples/Survey/SurveyActiveDetail.vue";
import SurveyWrite from "@/views/components/survery/SurveyWrite.vue";
import SurveyParticipant from "@/views/components/survery/SurveyParticipant.vue";
import CalenderView from "@/views/CalenderView.vue";

const routes = [
  {
    path: "/",
    name: "SurveyMain",
    component: SurveyMain,
    // redirect: "/",
  },
  {
    path: "/survey-part/:hospitalId/:surveyId",
    name: "SurveyParticipant",
    component: SurveyParticipant,
    props: true,
  },
  { 
    path: "/survey-cate/:id",
    name: "surveyCate",
    component: SurveyCate,
    props: true,
  },
  {
    path: "/survey-write/:surveyId",
    name: "SurveyWrite",
    component: SurveyWrite,
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
    name: "설문 관리",
    component: Billing,
  },
  {
    path: "/survey-list",
    name: "설문 리스트",
    component: SurveyList,
  },
  {
    path: "/survey-template/:id",
    name: "설문 양식",
    component: SurveyTemplate,
    props: true,
  },
  {
    path: "/survey-manager",
    name: "설문 폼",
    component: SurveyManager,
    props: true,
  },
  {
    path: "/survey-edit/:id",
    name: "설문 수정",
    component: SurveyEdit,
    props: true,
  },
  {
    path: "/survey-creator",
    name: "설문 작성",
    component: SurveyCreatorPage,
    props: true,
  },
  {
    path: "/survey-creator/:id",
    name: "설문",
    component: SurveyCreatorPage,
    props: true,
  },
  {
    path: "/survey-before",
    name: "설문 형식 지정",
    component: SurveyBeforePage,
    props: true,
  },
  {
    path: "/survey-type-detail",
    name: "설문 유형 상세",
    component: SurveyTypeDetail,
    props: true,
  },
  {
    path: "/survey-active",
    name: "진행 중인 설문 목록",
    component: SurveyActiveDetail,
  },
  {
    path: "/virtual-reality",
    name: "전체 현황",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "통계 관리",
    component: RTL,
  },
  {
    path: "/calender",
    name: '일정 관리',
    component: CalenderView,
    props: true,
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
  {
    path: "/reset-password",
    component: ResetPassword,
  },

  {
    path: "/hospital",
    name: "Hospital",
    component: Hospital,
    props: true,
    redirect: { name: "MyHospital"},
    children: [
      {
        path: "my-hospital",
        name: "MyHospital",
        component: MyHospital,
        props: true,
      },
      {
        path: "my-depart",
        name: "MyHospitalDepart",
        component: MyHospitalDepart,
        props: true,
      },
      {
        path: "my-setting",
        name: "MyHospitalSetting",
        component: MyHospitalSetting,
        props: true,
      },
      {
        path: "my-ward",
        name: "MyHospitalWard",
        component: MyHospitalWard,
        props: true,
      },
    ]
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
      },
      {
        path: "user-manager",
        name: "UserManager",
        component: UserManager,
        props: true,
      }
    ],
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
  if (to.path === '/') {
    return next();
  }

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

  if (to.path === '/reset-password') {
    return next();
  }

  if (to.path === '/hospital') {
    return next();
  }

  if (to.path.startsWith('/survey-cate')) {
    return next();
  }

  if (to.path.startsWith('/survey-write')) {
    return next();
  }

  if (to.path.startsWith('/survey-part')) {
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
