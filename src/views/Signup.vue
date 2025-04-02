<script setup lang="ts">
import { onBeforeUnmount, onBeforeMount, watch, ref, computed } from "vue";
import { useStore } from "vuex";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import PeiLogo from '@/assets/img/logos/pei_logo.jpeg';
import { userSignUp } from "@/api/signup";
import ArgonAlert from "@/components/ArgonAlert.vue";
import ArgonProgress from "@/components/ArgonProgress.vue";
const body = document.getElementsByTagName("body")[0];
const store = useStore();
const agree = ref(true);

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

const {
    signup, checkedUsername, postedCode, validedCode,
    evaluatePasswordStrength,

    username, password, confirmPassword,
    name, phone, mail, code,
    validUsername, validPassword, validPasswordMatched, validPhone,
    
    errorMessage, showErrorMessage,
    successMessage, showSuccessMessage,
    codeActivity, isPosting,
    
    passwordMatch, passMatches,
    passwordStrength, passwordDescription,
    isStrongPassword, passwordAdvicer,
    
    passwordProgress
} = userSignUp();


const timer = ref<number | any>();
let interval: number | null = null;

const stopTimer = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

watch([password, confirmPassword], ([newPass, newConfirm]) => {
    if (newPass && newConfirm) {
      passwordMatch.value = newPass === newConfirm;
      passMatches.value = passwordMatch.value
        ? '패스워드가 일치 합니다.'
        : '패스워드가 일치하지 않습니다.';
    }
    if (newPass === newConfirm) {
      validPasswordMatched.value = true;
      console.log('validPasswordMatched true?: ', validPasswordMatched.value);
    }

    if (newPass !== newConfirm) {
      validPasswordMatched.value = false;
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

  onBeforeUnmount(() => {
    stopTimer();
  })
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
                <div v-if="password">
                  <small> {{ passwordAdvicer.description }} </small>
                  <ArgonProgress class="mb-3" :color="passwordProgress.color"
                    :percentage="passwordProgress.percentage" />
                </div>

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

                <argon-checkbox checked v-model="agree">
                  <label class="form-check-label" for="flexCheckDefault">
                    PEI
                    <a href="javascript:;" class="text-dark font-weight-bolder">이용 약관에 동의 합니다.</a>
                  </label>
                </argon-checkbox>

                <div class="text-center">
                  <argon-button fullWidth color="dark" variant="gradient" class="my-4 mb-2">회원 가입</argon-button>
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
