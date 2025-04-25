<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { AxiosError } from 'axios';
import { userSignUp } from '@/api/signup';
import { requestResetPassword } from '@/api/users';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonProgress from '@/components/ArgonProgress.vue';

import router from '@/router';
import { ApiResponse } from '@/types/api';
const password = ref<string>('');
const confirmPassword = ref<string>('');
const color1 = ref<string>('#f5f5f5');
const color2 = ref<string>('#f5f5f5');
const store = useStore();
const passwordValidCheck = ref<boolean>(false);
const body = document.getElementsByTagName("body")[0];

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

// TODO 비밀번호 expired 만료 시간 후 어떻게 되는지 확인
const resetPassword = async (password: string) => {
    
    if (validPasswordMatched.value == false) {
        alert('비밀번호가 일치 하지 않습니다.');
        return;
    }

    if (validPassword.value == false) {
        alert('안전하지 않은 비밀번호 입니다.');
        return;
    }
    const token = localStorage.getItem('token');
    try {
        if (typeof token === 'string') {
            const response = await requestResetPassword(token, password);
            console.log('response: ', response);
            alert(response.message);
            router.push('/signin');
        } 
        else {
            // alert('올바른 메일 형식이 아닙니다.')
            return;
        }
    } catch (error) {
        console.error('resetPasword error: ', error);
        const axiosError = error as AxiosError<ApiResponse<string>>;
        const errorMessage = axiosError.response?.data.message;
        alert(errorMessage);
        router.push('/recover-password');
    } finally {
        localStorage.removeItem('token');
        console.log('로직 종료 후 로컬 확인: ', localStorage.getItem('token'));
    }
}

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

const {
    passwordMatch, passMatches, validPasswordMatched, passwordStrength, passwordDescription,
    isStrongPassword, passwordAdvicer, evaluatePasswordStrength, passwordProgress, validPassword
} = userSignUp();


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
                            <!-- <img :src="PeiLogo" alt="logo" style="width: 20%; height: 100%;" /> -->
                            <h5 class="mt-5">새로운 비밀번호</h5>
                            <ul class="text-lead mt-5 list-unstyled">
                                <li class="d-flex align-items-center mb-2">
                                    <font-awesome-icon :icon="['fas', 'check']" class="me-2"
                                        :style="{ color: `${color2}` }" />
                                    <span>영문, 숫자, 특수 문자를 포함 해주세요</span>
                                </li>
                                <li class="d-flex align-items-center mb-2">
                                    <font-awesome-icon :icon="['fas', 'check']" class="me-2"
                                        :style="{ color: `${color1}` }" />
                                    <span>최소 8 ~ 20 이내의 비밀번호를 입력해주세요</span>
                                </li>
                            </ul>
                        </div>
                        <div class="card-body">
                            <form role="form" @submit.prevent="resetPassword(password)">
                                <!-- 수직 정렬로 변경 -->
                                <div class="mb-3">
                                    <argon-input id="password" type="password" placeholder="********" label="password"
                                        v-model="password" />
                                </div>
                                <div class="mb-3">
                                    <argon-input id="confirmPassword" type="password" placeholder="********"
                                        label="confirmPassword" v-model="confirmPassword" />
                                    <small v-if="password || confirmPassword"
                                        :class="passwordMatch ? 'text-success' : 'text-danger'">
                                        {{ passMatches }}</small>
                                    <div v-if="password">
                                        <small> {{ passwordAdvicer.description }} </small>
                                        <ArgonProgress class="mb-3" :color="passwordProgress.color"
                                            :percentage="passwordProgress.percentage" />
                                    </div>
                                </div>

                                <argon-button fullWidth color="primary" variant="gradient" class="mb-3">
                                    변경
                                </argon-button>
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