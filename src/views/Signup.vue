<script setup lang="ts">
import { onBeforeUnmount, onBeforeMount, ref, onMounted, watch, reactive, computed } from "vue";
import { useStore } from "vuex";
import { AxiosError } from "axios"; // error 타입 정의
import router from "@/router/router";
import { ApiResponse, PasswordStranghType } from "@/types/signup";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import PeiLogo from '@/assets/img/logos/pei_logo.jpeg';
import { checkUsername, checkPhone, validCode, postSignup } from "@/api/signup";
import ArgonAlert from "@/components/ArgonAlert.vue";
import ArgonProgress from "@/components/ArgonProgress.vue";
const body = document.getElementsByTagName("body")[0];


const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

// TODO 각가의 인증 항목에 대해 논리값을 결정 후 최종 회원가입 권한을 부여
const validUsername = ref(false); // 계정 중복 확인
const validPassword = ref(false); // 비밀번호 안전 등급 확인
const validPhone = ref(false); // 전화번호 인증 확인
const registerBtn = ref(false);

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const phone = ref('');
const mail = ref('');
const code = ref('');

const errorMessage = ref('');
const showErrorMessage = ref(false);

const successMessage = ref('');
const showSuccessMessage = ref(false);

const codeActivity = ref(false);
const isPosting = ref(false);

const timer = ref();
let interval: number | null = null;

const startTimer = () => {
  if (interval) clearInterval(interval);

  timer.value = 180;
  interval = window.setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(interval!);
      interval = null;
      // 타이머 종료 처리 (예: 재요청 버튼 활성화)
    }
  }, 1000);
};

const stopTimer = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

const signup = async () => {
  console.log('singup start');
  const registerDTO = {
    username: username.value,
    password: password.value,
    name: name.value,
    phone: phone.value,
    mail: mail.value
  };

  if (!validUsername.value) {
    alert('계정 중복 체크를 해주세요');
    return;
  } else if (!validPassword.value) {
    alert('비밀번호가 안전하지 않습니다.');
  } else if (!validPhone.value) {
    alert('휴대폰 번호 인증을 해주세요');
    return;
  } else {
    try {
      console.log('registerDto : ', registerDTO);
      const response = await postSignup(registerDTO);
      console.log('response : ', response.message);
      alert(response.message);
      router.push('/signin');
    } catch (error) {
      console.log(error);
    }
  }
};

async function checkedUsername() {

  try {
    const response = await checkUsername(username.value);

    showSuccessMessage.value = true;
    successMessage.value = response.message;
    validUsername.value = true;
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;

    if (axiosError.response) {
      errorMessage.value = axiosError.response.data.message;
    } else {
      console.error('알 수 없는 에러 발생: ', error);
    }
    showErrorMessage.value = true;
    setTimeout(() => {
      showErrorMessage.value = false;
    }, 3000);
  }
};

async function postedCode() {
  if (isPosting.value) return;

  isPosting.value = true;

  try {
    const response = await checkPhone(phone.value); // TODO 메서드 이름 변경

    console.log(response);
    codeActivity.value = true;
    timer.value = response.data;
    startTimer();

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('pn', phone.value);
    }

  } catch (error) {
    console.log(error);
  } finally {
    isPosting.value = false;
  }
};


async function validedCode() {

  const beforePhone: string | null = localStorage.getItem('pn');
  // const beforePhone = '01055072536';

  if (typeof beforePhone !== 'string') {
    console.log('잘못된 형식의 번호 입니다.');
    return;
  }

  try {
    const response = await validCode(code.value, beforePhone);

    console.log('response: ', response);
    localStorage.removeItem('pn');
    clearInterval(interval!);
    codeActivity.value = false;

  } catch (error) {
    console.log(error);
  }
};

const passwordAdvicer = reactive<PasswordStranghType>({
  description: '',
  grade: 0,
  strongPassword: false,
});

const passwordMatch = ref(false);
const passMatches = ref('');
const passwordStrength = ref(0);
const passwordDescription = ref('');
const isStrongPassword = ref(false);

watch([password, confirmPassword], ([newPass, newConfirm]) => {
  if (newPass && newConfirm) {
    passwordMatch.value = newPass === newConfirm;
    passMatches.value = passwordMatch.value
      ? '패스워드가 일치 합니다.'
      : '패스워드가 일치하지 않습니다.';
  }
  if (newPass) {
    const result = evaluatePasswordStrength(newPass);
    passwordStrength.value = result.grade;
    passwordDescription.value = result.description;
    isStrongPassword.value = result.strongPassword;
    passwordAdvicer.description = result.description;
    passwordAdvicer.grade = result.grade;
    passwordAdvicer.strongPassword = result.strongPassword;
  } else {
    passwordStrength.value = 0;
    passwordDescription.value = '';
    isStrongPassword.value = false;
    passwordAdvicer.description = '';
    passwordAdvicer.grade = 0;
    passwordAdvicer.strongPassword = false;
  }
});

const passwordProgress = computed(() => {
  switch (passwordAdvicer.grade) {
    case 0:
    case 1:
      return { color: 'danger', percentage: 25 };
    case 2:
      return { color: 'warning', percentage: 50 };
    case 3:
      return { color: 'info', percentage: 75 };
    case 4:
      return { color: 'success', percentage: 100 };
    default:
      return { color: 'danger', percentage: 0 };
  }
});

function evaluatePasswordStrength(password: string) {
  const MIN_LENGTH = 8;
  const STRONG_PASSWORD_THRESHOLD = 4;
  let strength = 0;
  if (password.length >= MIN_LENGTH) strength++;
  if (/\d/.test(password)) strength++;
  if (/[a-zA-Z]/.test(password)) strength++;
  if (/[!@#$%^&*()_+=]/.test(password)) strength++;
  const strongPassword = strength >= STRONG_PASSWORD_THRESHOLD;
  const description = (() => {
    switch (strength) {
      case 0:
      case 1:
        return "현재 비밀번호는 보안에 취약합니다. 최소 8자리 이상 숫자, 영문 특수문자를 조합하세요";
      case 2:
      case 3:
        return "현재 비밀번호는 보안에 취약합니다. 숫자, 영문, 특수문자를 조합하세요";
      case 4:
        return "안전한 비밀번호 입니다.";
      default:
        return "사용 불가능한 비밀번호 입니다.";
    }
  })();
  return { grade: strength, description, strongPassword };
};

onBeforeUnmount(() => stopTimer());
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg" style="
        background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg&quot;);
        background-position: top;
      ">
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">환영합니다</h1>
            <p class="text-lead text-white">
              회원가입을 위해 등록 버튼을 클릭해주세요
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>회원 가입</h5>
            </div>
            <div class="row px-xl-5 px-sm-4 px-3">
              <a class="btn btn-outline-light w-100" href="javascript:;">
                <img :src="PeiLogo" alt="logo" style="width: 20%; height: 100%;" />
              </a>
              <div class="mt-2 position-relative text-center">
                <p class="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3">
                  or
                </p>
              </div>
            </div>
            <div class="card-body">
              <form role="form" @submit.prevent="signup">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <argon-input id="username" type="text" placeholder="사용할 계정을 입력해주세요" aria-label="username"
                    v-model="username" class="flex-grow-1" />
                  <argon-button type="button" size="mb" color="light" class="mb-3" @click="checkedUsername">
                    중복 확인
                  </argon-button>
                </div>
                <ArgonAlert v-if="showSuccessMessage" :color="'info'" :dismissible="true">
                  {{ successMessage }}
                </ArgonAlert>

                <ArgonAlert v-if="showErrorMessage" :color="'warning'" :dismissible="true">
                  {{ errorMessage }}
                </ArgonAlert>

                <argon-input id="password" type="password" placeholder="비밀번호를 입력해주세요" aria-label="Password"
                  v-model="password" />
                <argon-input id="confirmPassword" type="password" placeholder="비밀번호 확인" aria-label="confirmPassword"
                  v-model="confirmPassword" />
                <small v-if="password || confirmPassword" :class="passwordMatch ? 'text-success' : 'text-danger'">
                  {{ passMatches }}</small>
                <br>

                <div v-if="password">
                  <small> {{ passwordAdvicer.description }} </small>
                  <ArgonProgress class="mb-3" :color="passwordProgress.color"
                    :percentage="passwordProgress.percentage" />
                </div>

                <!-- <div v-if="!passwordAdvicer.strongPassword && passwordAdvicer.grade < 2">
                <small> {{ passwordAdvicer.description }} </small>
                <ArgonProgress class="mb-3" color="danger" :percentage="10" />
              </div> -->
                <argon-input id="name" type="text" placeholder="이름을 입력해주세요" aria-label="Name" v-model="name" />

                <div class="d-flex align-items-center gap-2 mb-1">
                  <argon-input id="text" type="text" placeholder="연락처를 입력해주세요 ('-'제외)" aria-label="phone"
                    v-model="phone" class="flex-grow-1" />
                  <argon-button type="button" size="mb" color="light" class="mb-3" :disabled="isPosting" @click="postedCode">인증번호
                    받기</argon-button>
                </div>

                <span v-if="timer > 0">
                  남은 시간: {{ Math.floor(timer / 60) }}분 {{ timer % 60 }}초
                </span>
                <div v-if="codeActivity" class="d-flex align-items-center gap-2 mb-1">
                  <argon-input id="code" type="text" placeholder="인증 번호 입력 (6자리)" aria-label="code" v-model="code"
                    class="flex-grow-1" />

                  <argon-button type="button" size="mb" color="'success'" class="mb-3" @click="validedCode">인증번호 확인</argon-button>
                </div>

                <argon-input id="mail" type="email" placeholder="이메일 주소를 입력해주세요" aria-label="mail" v-model="mail" />

                <argon-checkbox checked>
                  <label class="form-check-label" for="flexCheckDefault">
                    PEI
                    <a href="javascript:;" class="text-dark font-weight-bolder">이용 약관에 동의 합니다.</a>
                  </label>
                </argon-checkbox>
                <div class="text-center">
                  <argon-button fullWidth color="dark" variant="gradient" class="my-4 mb-2" disabled="true">회원 가입</argon-button>
                </div>
                <p class="text-sm mt-3 mb-0">
                  이미 존재하는 계정이 있으신가요?
                  <a href="/signin" class="text-dark font-weight-bolder">로그인</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>
<style scoped></style>
