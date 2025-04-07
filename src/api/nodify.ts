import axiosAuth from '@/plugins/axiosAuth';
import store from '@/store/store';
import type { NotifyResponse } from '@/types/nodify.d';

export async function fetchNotifyList(
  x: number | undefined,
  y: number | undefined,
): Promise<NotifyResponse> {
  const response = await axiosAuth.get('/api/notify', {
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

export const markNotifycationAsRead = (id: number) => {
  return axiosAuth.patch(`/api/notify?id=${id}`);
}