<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import { postedCode, postUsername } from '@/api/users';
import { useStore } from 'vuex';
import Navbar from '@/examples/PageLayout/Navbar.vue';
import PeiLogo from '@/assets/img/logos/pei_logo.jpeg';
import { P } from 'ts-pattern';
const body = document.getElementsByTagName("body")[0];

const validNumber = ref<number>(0);

const store = useStore();

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = true;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = false;
  body.classList.add("bg-gray-100");
});

const postCode = ref<boolean>(false);

const phone = ref<string>('');
const code = ref<string>('');

const receivePhone = ref<string>('');

// 인증 번호 요청
async function postSmsCode() {
  try {
    const response = await postedCode(phone.value);
    console.log(response);
    receivePhone.value = response.data;
    postCode.value = true;
  } catch (error) {
    console.log(error);
  }
};
// 계정 응답
async function receivedUsername() {
  try {
    const response = await postUsername(phone.value, code.value);
    console.log('response: ', response);
  } catch (error) {
    console.log(error);
  }
};

watch(phone, (newVal) => {
  const numeric = newVal.replace(/[^0-9]/g, '').slice(0, 6);
  if (phone.value !== numeric) {
    phone.value = numeric;
  }
});


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
    <div class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg">
      <span class="mask bg-gradient-info opacity-6"></span>
      
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <img :src="PeiLogo" alt="logo" style="width: 20%; height: 100%;" />
              <h5 class="mt-5">아이디 (이메일)</h5>

              <p class="text-lead mt-5">
              계정에 등록된 휴대폰 번호를 인증하시면 사용중인 계정의 이메일 주소를 알려드립니다.
            </p>
            </div>
            <div class="card-body">
              <form role="form" @submit.prevent="receivedUsername">

                <div class="d-flex align-items-center gap-2 mb-7">
                  <argon-input id="phone" type="text" placeholder="휴대전화번호를 입력해주세요" aria-label="phone" v-model="phone"
                    class="flex-grow-1" />
                  <ArgonButton color="light" type="button" class="mb-3" @click="postSmsCode"
                  >인증 요청</ArgonButton>
                </div>
                
                <div v-if="postCode">
                  <argon-input 
                  id="code" 
                  type="text" 
                  placeholder="인증 번호(6자리)를 입력해주세요" 
                  v-model="code"
                  label="code" 
                  />
                  <argon-button fullWidth color="dark" variant="gradient" class="mb-3">인증 번호 전송</argon-button>
                </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <!-- <app-footer /> -->
</template>
<style scoped></style>