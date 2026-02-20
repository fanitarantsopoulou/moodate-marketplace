import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // ΠΡΟΣΘΗΚΗ

const app = createApp(App)
app.use(router) // ΠΡΟΣΘΗΚΗ
app.mount('#app')