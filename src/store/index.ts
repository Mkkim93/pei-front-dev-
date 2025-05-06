import { createStore } from "vuex";
import notify from "./notifystore";
import survey from "./surveystore";
import surveyresstore from "./surveyresstore";

interface State {
  hideConfigButton: boolean;
  isPinned: boolean;
  showConfig: boolean;
  sidebarType: string;
  isRTL: boolean;
  mcolor: string;
  darkMode: boolean;
  isNavFixed: boolean;
  isAbsolute: boolean;
  showNavs: boolean;
  showSidenav: boolean;
  showNavbar: boolean;
  showFooter: boolean;
  showMain: boolean;
  layout: string;
  accessToken: string;
  showAuthTalbe: boolean;
}

export default createStore<State>({
  state: {
    hideConfigButton: false,
    isPinned: false,
    showConfig: false,
    sidebarType: "bg-white",
    isRTL: false,
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
    accessToken: "",
    showAuthTalbe: true,
  },
  mutations: {
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    sidebarMinimize(state) {
      const sidenav_show = document.querySelector("#app") as HTMLElement | null;
      if (!sidenav_show) return;

      if (state.isPinned) {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      } else {
        sidenav_show.classList.add("g-sidenav-pinned");
        sidenav_show.classList.remove("g-sidenav-hidden");
        state.isPinned = true;
      }
    },
    sidebarType(state, payload: string) {
      state.sidebarType = payload;
    },
    navbarFixed(state) {
      state.isNavFixed = !state.isNavFixed;
    },

    setAccessToken(state, token) {
      state.accessToken = token;
    },

    clearAccessToken(state) {
      state.accessToken = "";
    }
  },
  actions: {
    toggleSidebarColor({ commit }, payload: string) {
      commit("sidebarType", payload);
    },

    login({ commit }, token) {
      commit("setAccessToken", token);
    },
    
    logout({ commit }) {
      commit("clearAccessToken");
    },
  },
  getters: {
    accessToken: (state) => state.accessToken
  },

  modules: {
    notify,
    survey,
    surveyresstore
  }
});
