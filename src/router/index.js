import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import SobreProjeto from '@/views/SobreProjeto.vue'
import ConhecimentoView from '@/views/ConhecimentoView.vue'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  }
  ,
  { path: '/dashboard', name: 'DashboardPage', component: DashboardPage },
  {path: '/sobre', name: 'SobreProjeto', component: SobreProjeto},
  {path: '/conhecimento', name: 'ConhecimentoView', component: ConhecimentoView},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
