import axiosAuth from '@/plugins/axiosAuth';
import store from '@/store/store';
import type { NotifyResponse } from '@/types/notify';

// 최근 뜨지 않은 알림 5개만 랜더링 (초기화면)
export async function fetchNotifyList(
  x: number | undefined,
  y: number | undefined,
): Promise<NotifyResponse> {
  const response = await axiosAuth.get('/api/notify/isDisplayed', {
    params: {
      page: 0,
      size: 5,
    },
    headers: {
      Authorization: store.getters.accessToken
    }
  });
  return response.data;
}

// 내정보 에서 모든 알림 조회
export async function fetchNotifyListAll(
  x: number | undefined,
  y: number | undefined,
): Promise<NotifyResponse> {
  const response = await axiosAuth.get('/api/notify', {
    params: {
      page: x,
      size: y,
    },
    headers: {
      Authorization: store.getters.accessToken
    }
  });
  return response.data;
}

// 한번 올라온 알림은 다시 뜨지 않도록 isDisplayed update 쿼리 전송 (false -> true)
export const markNotifycationAsRead = (id: number) => {
  return axiosAuth.patch(`/api/notify?id=${id}`);
}