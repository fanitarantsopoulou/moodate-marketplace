import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ListingsView from '../views/ListingsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MessagesView from '../views/MessagesView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import AddListView from '../views/AddListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'welcome', component: WelcomeView },
    { path: '/swipe', name: 'swipe', component: HomeView },
    { path: '/listings', name: 'listings', component: ListingsView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/profile', name: 'profile', component: ProfileView },  
    { path: '/messages', name: 'messages', component: MessagesView },
    { path: '/add-listing', name: 'add-listing', component: AddListView },
  ]
})

export default router