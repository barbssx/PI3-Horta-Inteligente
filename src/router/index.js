import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardPage from '@/components/DashboardPage.vue'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  }
  ,
  { path: '/dashboard', name: 'DashboardPage', component: DashboardPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
