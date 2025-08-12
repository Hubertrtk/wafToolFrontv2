import CheckNetwork from '@/views/CheckNetwork.vue'
import Database from '@/views/Database.vue'
import Domains from '@/views/Domains.vue'
import Login from '@/views/Login.vue'
import ManualUnblocking from '@/views/ManualUnblocking.vue'
import ServiceManagment from '@/views/ServiceManagment.vue'
import Template from '@/views/Template.vue'
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
    {
      path: '/template',
      name: 'template',
      component: Template,
    },
    {
      path: '/database',
      name: 'database',
      component: Database,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('wtauthuser') // tu ustaw nazwę swojego klucza
  if (!token && to.name !== 'login') {
    // Jeśli brak klucza i próbujemy wejść na stronę inną niż login → przekieruj
    next({ name: 'login' })
  } else {
    // Jeśli jest klucz lub idziemy na login → kontynuuj
    next()
  }
})

export default router
