import CheckNetwork from '@/views/CheckNetwork.vue'
import Domains from '@/views/Domains.vue'
import Login from '@/views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/domains',
      name: 'domains',
      component: Domains,
    },
    {
      path: '/checkNetwork',
      name: 'checkNetwork',
      component: CheckNetwork,
    },
  ],
})

export default router
