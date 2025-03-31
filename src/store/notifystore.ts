// Vuex 알림 모듈
import { NotifyState, NotifyItem } from "@/types/nodify";
import { ActionContext } from "vuex";

const state = (): NotifyState => ({
    notifications: []
  });
  
  const mutations = {
    SET_NOTIFICATIONS(state :NotifyState, list :NotifyItem[]) {
      state.notifications = list;
    },
    ADD_NOTIFICATION(state :NotifyState, item :NotifyItem) {
      const exists = state.notifications.find(n => n.id === item.id);
      if (!exists) {
        state.notifications.push(item);
      }
    },
    MARK_AS_READ(state :NotifyState, id :number) {
      state.notifications = state.notifications.filter(n => n.id !== id);
    },
    CLEAR_NOTIFICATIONS(state :NotifyState) {
      state.notifications = [];
    }
  };
  
  const actions = {
    setNotifications({ commit }: ActionContext<NotifyState, any>, list :NotifyItem[]) {
      commit('SET_NOTIFICATIONS', list);
    },
    addNotification({ commit }: ActionContext<NotifyState, any>, item :NotifyItem) {
      commit('ADD_NOTIFICATION', item);
    },
    markAsRead({ commit }: ActionContext<NotifyState, any>, id :number) {
      commit('MARK_AS_READ', id);
    },
    clearNotifications({ commit }: ActionContext<NotifyState, any>) {
      commit('CLEAR_NOTIFICATIONS');
    }
  };
  
  const getters = {
    notifications: (state :any) => state.notifications,
    unreadCount: (state :any) => state.notifications.length
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  };
  