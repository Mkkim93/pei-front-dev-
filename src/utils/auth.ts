import dayjs from 'dayjs';
import axios from '@/plugins/axiosAuth';
import store from '@/store';
import { jwtDecode } from "jwt-decode";
import router from '@/router';

export function expiredCheck() :boolean {
    // console.log('expiredCheck(): ');
    const token = store.getters.accessToken;
    if (!token) {
        return true;
    }
    const rawToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    try {
        const decoded: any = jwtDecode(rawToken);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp < now;
    } catch (error) {
        console.warn("Jwt 디코드 실패: ", error);
        return true;
    }
}

export function adminChecked() {
    const token = store.getters.accessToken;
    
    if (!token) {
        alert('로그인이 필요한 서비스 입니다.');
        router.push('/signin'); 
    } 
    

}



