import './assets/main.css'

import 'bootstrap/dist/css/bootstrap.css'

import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'

import { createApp } from 'vue'

import { createPinia } from 'pinia'

import router from './router'

const app = createApp(App)

app.use(createPinia())

app.use(router)

app.mount('#app')
