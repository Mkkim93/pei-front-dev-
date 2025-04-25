import { createApp } from "vue";
import App from './App.vue';
import store from "./store";
import router from "./router";
import axios from "./plugins/axiosAuth";
import argonDashboard from "./argon-dashboard";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import mitt from 'mitt';
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
ModuleRegistry.registerModules([AllCommunityModule]);

const app = createApp(App);
const options: PluginOptions = {
  timeout: 4000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  toastClassName: "my-custom-toast", // 🔥 커스텀 클래스 지정
  bodyClassName: "my-toast-body",    // ✨ 내부 텍스트 커스텀
  transition: "Vue-Toastification__fade", // 또는 fade, slide 등
}
let emitter = mitt();

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;
app.config.globalProperties.$axios = axios;
app.config.globalProperties.store = store;
app.config.globalProperties.emitter = emitter;

app.component('font-awesome-icon', FontAwesomeIcon);
library.add(fas);
app.use(Toast, options);
app.use(store)
app.use(router)
app.use(argonDashboard)
app.mount('#app');
