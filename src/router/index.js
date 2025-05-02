import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/auth/user'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import AdminDashboard from '@/views/dashboard/AdminDashboard.vue'
import OwnerDashboard from '@/views/dashboard/OwnerDashboard.vue'
import CustomerDashboard from '@/views/dashboard/CustomerDashboard.vue'
import Unauthorized from '@/views/error/Unauthorized.vue'
import ForgetPassword from '@/views/auth/ForgetPassword.vue'
import ChangePassword from '@/views/auth/ChangePassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresUnauth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresUnauth: true },
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      component: ForgetPassword,
      meta: { requiresUnauth: true },
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePassword,
      meta: { requiresUnauth: true },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: Unauthorized,
    },
    {
      path: '/admin/dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, roles: ['SUPER_ADMIN'] },
    },
    {
      path: '/owner/dashboard',
      component: OwnerDashboard,
      meta: { requiresAuth: true, roles: ['OWNER'] },
    },
    {
      path: '/customer/dashboard',
      component: CustomerDashboard,
      meta: { requiresAuth: true, roles: ['CUSTOMER'] },
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/unauthorized',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.name === 'change-password' && (!to.query.token || to.query.token === '')) {
    return next('/login')
  }

  if (to.meta.requiresUnauth && userStore.token) {
    if (userStore.role === 'SUPER_ADMIN') {
      return next('/admin/dashboard')
    } else if (userStore.role === 'OWNER') {
      return next('/owner/dashboard')
    } else if (userStore.role === 'CUSTOMER') {
      return next('/customer/dashboard')
    }
  }

  if (to.meta.requiresAuth) {
    if (!userStore.token) {
      return next('/login')
    }

    if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
      return next('/unauthorized')
    }
  }

  next()
})

export default router
