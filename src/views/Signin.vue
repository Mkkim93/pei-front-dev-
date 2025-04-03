<script setup>
import { onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import axiosAuth from "@/plugins/axiosAuth";
import router from "@/router/router";
import { connectToSSE } from "@/utils/sse";
import ArgonAlert from "@/components/ArgonAlert.vue";


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
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

const username = ref('');
const password = ref('');

const showSuccess = ref(false);
const successMessage = ref("");

const showFaild = ref(false);
const faildMessage = ref("");

// 🔆 compision API 에서 axios 사용 (중요 까먹지 말것))
const handleLogin = async () => {
  try {
    const response = await axiosAuth.post("/login", {
      username: username.value,
      password: password.value
    }, {
      headers: { "Content-Type": "application/json" },
    });

    store.dispatch('login', response.headers['authorization']);
    console.log('handleLogin response: ', response);
    connectToSSE();

    successMessage.value = response?.data.message || "로그인 성공";
    showSuccess.value = true;

    setTimeout(() => {
      router.push('/dashboard-default');
    }, 1000);

  } catch (error) {
    const message = error.data?.message || '로그인에 실패했습니다.';
    faildMessage.value = message;
    showFaild.value = true;
    setTimeout(() => {
      showFaild.value = false;
    }, 2000);
  }
}

</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow" v-bind:darkMode="true"
          isBtn="bg-gradient-success" />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">로그인</h4>
                  <p class="mb-0">계정과 비밀번호를 입력해주세요</p>
                </div>
                <div class="card-body">
                  <ArgonAlert v-if="showSuccess" :color="'success'" :icon="'ni ni-check-bold text-white'"
                    :dismissible="true">
                    {{ successMessage }}
                  </ArgonAlert>
                  <ArgonAlert v-if="showFaild" :color="'warning'" :dismissible="true">
                    {{ faildMessage }}
                  </ArgonAlert>
                  <form role="form" @submit.prevent="handleLogin">
                    <div class="mb-3">
                      <argon-input id="username" type="text" v-model="username" placeholder="계정명을 입력해주세요"
                        name="username" size="lg" />
                    </div>
                    <div class="mb-3">
                      <argon-input id="password" type="password" v-model="password" placeholder="비밀번호를 입력해주세요"
                        name="password" size="lg" />
                    </div>
                    <argon-switch id="rememberMe" name="remember-me">로그인 상태 유지</argon-switch>

                    <div class="text-center">
                      <argon-button class="mt-4" variant="gradient" color="success" fullWidth
                        size="lg">로그인</argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    등록된 계정이 없으신가요?
                    <router-link to="/signup" class="text-success text-gradient font-weight-bold">회원 가입</router-link>
                  </p>

                  <!-- //TODO router-link -->
                  <p class="mx-auto mb-4 text-sm">
                    계정을 잊어버리셨나요?
                    <router-link to="/recover-username" class="text-success text-gradient font-weight-bold">계정 찾기</router-link>
                  </p>
                  <!-- // TODO router-link -->
                  <p class="mx-auto mb-4 text-sm">
                    비밀번호를 잊어버리셨나요?
                    <router-link to="/recover-password" class="text-success text-gradient font-weight-bold">비밀번호 찾기</router-link>
                  </p>

                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg&quot;);
                  background-size: cover;
                ">
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  "진짜 변화는 환자의 이야기에서 시작됩니다."
                </h4>
                <p class="text-white position-relative">
                  환자의 경험을 정직하게 듣고, 더 나은 의료 환경을 함께 만들어 갑니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
