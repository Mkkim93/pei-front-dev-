import { createApp } from "vue";
import App from './App.vue';
import store from "./store/store";
import router from "./router/router";
import axios from "./plugins/axiosAuth";
import argonDashboard from "./argon-dashboard";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import mitt from 'mitt';
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

const options: PluginOptions = {
    // TODO
}
let emitter = mitt();

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;
app.config.globalProperties.$axios = axios;
app.config.globalProperties.store = store;
app.config.globalProperties.emitter = emitter;


app.use(Toast, options);
app.use(store)
app.use(router)
app.use(argonDashboard)
app.mount('#app');
