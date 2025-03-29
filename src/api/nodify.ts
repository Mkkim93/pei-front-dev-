import axiosAuth from '@/plugins/axiosAuth';
import store from '@/store/store';
import type { NotifyResponse } from '@/types/nodify.d';

export async function fetchNotifyList(): Promise<NotifyResponse> {
  const response = await axiosAuth.get('/api/notify', {
    headers: {
      Authorization: store.getters.accessToken
    }
  });
  return response.data;
}