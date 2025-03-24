import { createApp } from "vue";
import App from './App.vue';
import store from "./store/store";
import router from "./router/router";
import axios from "./plugins/axios";
import argonDashboard from "./argon-dashboard";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import mitt from 'mitt';

const app = createApp(App);
let emitter = mitt();

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;


app.config.globalProperties.$axios = axios;

app.config.globalProperties.store = store;
app.config.globalProperties.emitter = emitter;

app.use(store)
app.use(router)
app.use(argonDashboard)
app.mount('#app');
