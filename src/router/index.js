import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import HomeView from '@/views/Home.vue'
import LoginView from '@/views/auth/AuthLogin.vue'
import RegisterView from '@/views/auth/AuthRegister.vue'
import HomeViewUser from '@/views/user/HomeView.vue'
import Unauthorized from '@/views/error/UnauthorizedPage.vue'
import ForgetPassword from '@/views/auth/ForgetPassword.vue'
import ChangePassword from '@/views/auth/ChangePassword.vue'
import Profile from '@/views/user/UserProfile.vue'
import Dashboard from '@/components/user/component/DashboardUser.vue'
import UserList from '@/components/user/component/UserList.vue'
import TransactionList from '@/views/order/TransactionList.vue'

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
      path: '/home',
      component: HomeViewUser,
      meta: { requiresAuth: true, roles: ['SUPER_ADMIN', 'OWNER', 'CUSTOMER'] },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'users',
          name: 'users',
          component: UserList,
          meta: { roles: ['SUPER_ADMIN'] },
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: TransactionList,
        },
        {
          path: 'profile',
          name: 'profile',
          component: Profile,
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/unauthorized',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useAuthStore()

  if (to.name === 'change-password' && (!to.query.token || to.query.token === '')) {
    return next('/login')
  }

  if (to.meta.requiresUnauth && userStore.token) {
    return next('/home')
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
