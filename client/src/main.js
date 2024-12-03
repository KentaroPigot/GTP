// import './assets/base.css'
// import './assets/styles/main.scss'
import './assets/main.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import useAuthStore from '@/stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide('authStore', useAuthStore())

app.mount('#app')
