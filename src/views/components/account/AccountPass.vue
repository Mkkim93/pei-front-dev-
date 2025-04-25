<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonAlert from '@/components/ArgonAlert.vue';
import { ApiResponse } from '@/types/api';
import { requestPasswordLink } from '@/api/users';
import { useStore } from 'vuex';
import Navbar from '@/examples/PageLayout/Navbar.vue';

import { AxiosError } from 'axios';
const body = document.getElementsByTagName("body")[0];
const store = useStore();
const mail = ref<string>('');
const errorMessage = ref<string | any>('');
const showErrorMessage = ref<boolean>(false);

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

// 계정 응답
async function requestmail(mail: string) {
  try {
    if (typeof mail === 'string') {
      const response = await requestPasswordLink(mail);
      console.log('response: ', response);
      if (response.data !== null) {
        localStorage.setItem('token', response.data);
      }
      showErrorMessage.value = false;
      alert(response.message);
    } else {
      alert("이메일 형식이 올바르지 않습니다.");
      showErrorMessage.value = true;
    }
  } catch (error) {
    console.log('error: ', error);
    const axiosError = error as AxiosError<ApiResponse<string>>;
    console.log('axiosError: ', axiosError);
    errorMessage.value = axiosError.response?.data.message;
    console.log('axiosError.message: ', axiosError.response?.data.message);
    showErrorMessage.value = true;
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
              <!-- <img :src="PeiLogo" alt="logo" style="width: 20%; height: 100%;" /> -->
              <h5 class="mt-5">비밀번호 찾기</h5>
              <argon-alert v-if="showErrorMessage" color="warning">{{ errorMessage }}</argon-alert>
              <p class="text-lead mt-5">
                계정 가입 시 등록한 이메일을 입력해주세요. 이메일을 통해 비밀번호 변경 링크가 전송됩니다.
              </p>
            </div>
            <div class="card-body">
              <form role="form" @submit.prevent="requestmail(mail)">
                <div>
                  <argon-input id="code" type="email" 
                  placeholder="example@naver.com" 
                  v-model="mail"
                  label="mail" />
                  <argon-button fullWidth color="dark" variant="gradient" class="mb-3">변경 링크 전송</argon-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped></style>