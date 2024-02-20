import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/css/styles.css'
import {routes} from './router'
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
});
app.use(router)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')
