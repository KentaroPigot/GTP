import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import AddTask from '@/views/AddTask.vue'
import Manage from '@/views/Manage.vue'
import useAuthStore from '@/stores/auth'

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },

  {
    name: 'addTask',
    path: '/addTask',
    component: AddTask,
    meta: {
      requiresAuth: true,
    },
  },

  {
    name: 'manage',
    path: '/manage',
    component: Manage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'router-link-exact-active',
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
