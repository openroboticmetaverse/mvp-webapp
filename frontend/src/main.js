import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/css/styles.css'
import {routes} from './router'
import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App)

app.use(router)

app.mount('#app')
