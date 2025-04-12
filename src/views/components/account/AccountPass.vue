<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import { postUsername } from '@/api/users';
import { useStore } from 'vuex';
import Navbar from '@/examples/PageLayout/Navbar.vue';
import PeiLogo from '@/assets/img/logos/pei_logo.jpeg';
import { P } from 'ts-pattern';
const body = document.getElementsByTagName("body")[0];

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

const phone = ref<string>('');
const code = ref<string>('');

// 계정 응답
async function receivedUsername() {
  try {
    const response = await postUsername(phone.value, code.value);
    console.log('response: ', response);
  } catch (error) {
    console.log(error);
  }
}
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
      <span class="mask bg-gradient-primary opacity-6"></span>
      
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <img :src="PeiLogo" alt="logo" style="width: 20%; height: 100%;" />
              <h5 class="mt-5">비밀번호 찾기</h5>

              <p class="text-lead mt-5">
              계정 가입 시 등록한 이메일을 입력해주세요. 이메일을 통해 비밀번호 변경 링크가 전송됩니다.
            </p>
            </div>
            <div class="card-body">
              <form role="form" @submit.prevent="receivedUsername">
                <div>
                  <argon-input id="code" type="text" placeholder="example@naver.com" v-model="code"
                    aria-label="code" />
                  <argon-button fullWidth color="dark" variant="gradient" class="mb-3">변경 링크 전송</argon-button>
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