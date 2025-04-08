import { ApiResponse, RegisterType, PasswordStranghType } from '@/types/signup.d';
import axiosPublic from '@/plugins/axiosPublic';
import { ref, reactive, computed, watch } from "vue";
import { AxiosError } from 'axios';
import router from "@/router";

const username = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');
const name = ref<string>('');
const phone = ref<string>('');
const mail = ref<string>('');
const code = ref<string>('');

const validUsername = ref(false); // 계정 중복 확인
const validPassword = ref(false); // 비밀번호 안전 등급 확인
const validPasswordMatched = ref(false); // 비밀번호 + 비밀번호 확인 동일한지 확인
const validPhone = ref(false); // 전화번호 인증 확인
// const registerBtn = ref(false);

const errorMessage = ref<string>('');
const showErrorMessage = ref(false);

const successMessage = ref<string>('');
const showSuccessMessage = ref(false);

const codeActivity = ref(false);
const isPosting = ref(false);

const timer = ref<number | any>();
let interval: number | null = null;

const passwordMatch = ref(false);
const passMatches = ref<string>('');
const passwordStrength = ref<number>(0);
const passwordDescription = ref<string>('');
const isStrongPassword = ref(false);

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

const signup = async () => {
  console.log('singup start');
  const registerDTO = {
    username: username.value,
    password: password.value,
    name: name.value,
    phone: phone.value,
    mail: mail.value
  };

  console.log('registerDTO:', registerDTO);

  if (!validUsername.value) {
    alert('계정 중복 체크를 해주세요');
    return;
  } else if (!validPassword.value) {
    alert('비밀번호가 안전하지 않습니다.');
  } else if (!validPhone.value) {
    alert('휴대폰 번호 인증을 해주세요');
    return;
  } else if (!validPasswordMatched.value) {
    alert('입력하신 비밀번호가 일치하지 않습니다.');
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
    console.log('validUsername true?: ', validUsername.value);
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

async function postSignup(registerData: RegisterType): Promise<ApiResponse> {
    const response = await axiosPublic.post<ApiResponse>(
      "/api/register",
      registerData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

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
      
      validPhone.value = true;
      console.log('validPhone true?: ', validPhone.value);
  
    } catch (error) {
      console.log(error);
    }
  };

   const passwordAdvicer = reactive<PasswordStranghType>({
    description: '',
    grade: 0,
    strongPassword: false,
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
  
// 서버 prefix : /api/register/..
// 계정 중복 확인 
async function checkUsername(username :string) :Promise<ApiResponse> {
    const response = await axiosPublic.get<ApiResponse>(`/api/register/check-username?username=${username}`);
    return response?.data;
}

async function checkPhone(phone :string) :Promise<ApiResponse> {
    const response = await axiosPublic.post<ApiResponse>(`/api/register/phone?phone=${phone}`);
    return response?.data;
}

async function validCode(code :string, phone :string) :Promise<ApiResponse> {
    const response = await axiosPublic.post<ApiResponse>(`/api/register/verify-code?phone=${phone}&code=${code}`);
    return response?.data;
}

export function userSignUp() { 

  watch(passwordProgress, (val) => {
    validPassword.value = val.percentage === 100;
    console.log('validPassword.value true? :', validPassword.value);
  });

  return { 
    signup, checkedUsername, postedCode, validedCode,
    startTimer, postSignup, checkUsername, checkPhone, validCode,

    // 상태 변수들 (반드시 필요)
    username, password, confirmPassword,
    name, phone, mail, code,
    validUsername, validPassword, validPasswordMatched, validPhone,
    // registerBtn,
    errorMessage, showErrorMessage,
    successMessage, showSuccessMessage,
    codeActivity, isPosting,
    timer,
    passwordMatch, passMatches,
    passwordStrength, passwordDescription,
    isStrongPassword, passwordAdvicer, evaluatePasswordStrength,
    
    // computed
    passwordProgress
    }
}