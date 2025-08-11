import CheckNetwork from '@/views/CheckNetwork.vue'
import Domains from '@/views/Domains.vue'
import Login from '@/views/Login.vue'
import ManualUnblocking from '@/views/ManualUnblocking.vue'
import ServiceManagment from '@/views/ServiceManagment.vue'
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
      path: '/serviceManagment',
      name: 'serviceManagment',
      component: ServiceManagment,
    },
    {
      path: '/domains',
      name: 'domains',
      component: Domains,
    },
    {
      path: '/manualUnblocking',
      name: 'manualUnblocking',
      component: ManualUnblocking,
    },
    {
      path: '/checkNetwork',
      name: 'checkNetwork',
      component: CheckNetwork,
    },
  ],
})

export default router
