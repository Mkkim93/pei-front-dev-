// Vuex 알림 모듈
import { NotifyListType } from "@/types/notify";
import { ActionContext } from "vuex";

// 알림 상태
const state = (): { notifications: NotifyListType[] } => ({
  notifications: []
});

// 뮤테이션
const mutations = {
  SET_NOTIFICATIONS(state: { notifications: NotifyListType[] }, list: NotifyListType[]) {
    state.notifications = list;
  },
  ADD_NOTIFICATION(state: { notifications: NotifyListType[] }, item: NotifyListType) {
    const exists = state.notifications.find(n => n.id === item.id);
    if (!exists) {
      state.notifications.push(item);
    }
  },
  MARK_AS_READ(state: { notifications: NotifyListType[] }, id: string) {
    state.notifications = state.notifications.filter(n => n.id !== id);
  },
  CLEAR_NOTIFICATIONS(state: { notifications: NotifyListType[] }) {
    state.notifications = [];
  }
};

// 액션
const actions = {
  setNotifications({ commit }: ActionContext<{ notifications: NotifyListType[] }, any>, list: NotifyListType[]) {
    commit('SET_NOTIFICATIONS', list);
  },
  addNotification({ commit }: ActionContext<{ notifications: NotifyListType[] }, any>, item: NotifyListType) {
    commit('ADD_NOTIFICATION', item);
  },
  markAsRead({ commit }: ActionContext<{ notifications: NotifyListType[] }, any>, id: string) {
    commit('MARK_AS_READ', id);
  },
  clearNotifications({ commit }: ActionContext<{ notifications: NotifyListType[] }, any>) {
    commit('CLEAR_NOTIFICATIONS');
  }
};

// 게터
const getters = {
  notifications: (state: { notifications: NotifyListType[] }) => state.notifications,
  unreadCount: (state: { notifications: NotifyListType[] }) => state.notifications.length
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
