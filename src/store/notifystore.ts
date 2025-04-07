// Vuex 알림 모듈
import { NotifyType } from "@/types/nodify";
import { ActionContext } from "vuex";

// 알림 상태
const state = (): { notifications: NotifyType[] } => ({
  notifications: []
});

// 뮤테이션
const mutations = {
  SET_NOTIFICATIONS(state: { notifications: NotifyType[] }, list: NotifyType[]) {
    state.notifications = list;
  },
  ADD_NOTIFICATION(state: { notifications: NotifyType[] }, item: NotifyType) {
    const exists = state.notifications.find(n => n.id === item.id);
    if (!exists) {
      state.notifications.push(item);
    }
  },
  MARK_AS_READ(state: { notifications: NotifyType[] }, id: string) {
    state.notifications = state.notifications.filter(n => n.id !== id);
  },
  CLEAR_NOTIFICATIONS(state: { notifications: NotifyType[] }) {
    state.notifications = [];
  }
};

// 액션
const actions = {
  setNotifications({ commit }: ActionContext<{ notifications: NotifyType[] }, any>, list: NotifyType[]) {
    commit('SET_NOTIFICATIONS', list);
  },
  addNotification({ commit }: ActionContext<{ notifications: NotifyType[] }, any>, item: NotifyType) {
    commit('ADD_NOTIFICATION', item);
  },
  markAsRead({ commit }: ActionContext<{ notifications: NotifyType[] }, any>, id: string) {
    commit('MARK_AS_READ', id);
  },
  clearNotifications({ commit }: ActionContext<{ notifications: NotifyType[] }, any>) {
    commit('CLEAR_NOTIFICATIONS');
  }
};

// 게터
const getters = {
  notifications: (state: { notifications: NotifyType[] }) => state.notifications,
  unreadCount: (state: { notifications: NotifyType[] }) => state.notifications.length
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
