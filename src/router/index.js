import { createRouter, createWebHistory } from 'vue-router'
import PublicHomeView from '@/views/public/HomeView.vue'
import LoginView from '@/views/auth/AuthLogin.vue'
import RegisterView from '@/views/auth/AuthRegister.vue'
import ForgetPasswordView from '@/views/auth/ForgetPassword.vue'
import ChangePasswordView from '@/views/auth/ChangePassword.vue'

import DashboardLayout from '@/views/dashboard/HomeView.vue'
import DashboardHome from '@/components/dashboard/DashboardPage.vue'
import UserManagementPage from '@/components/users/UserPage.vue'
import ProfilePage from '@/views/user/ProfileView.vue'
import TransactionPage from '@/components/transaction/TransactionPage.vue'
import SettingsPage from '@/views/settings/SettingView.vue'

import UnauthorizedPage from '@/views/error/UnauthorizedPage.vue'

const routes = [
  {
    path: '/',
    name: 'PublicHome',
    component: PublicHomeView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresUnauth: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresUnauth: true },
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: ForgetPasswordView,
    meta: { requiresUnauth: true },
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePasswordView,
    meta: { requiresUnauth: true },
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: UnauthorizedPage,
  },

  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true, roles: ['SUPER_ADMIN', 'OWNER', 'CUSTOMER'] },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: DashboardHome,
        meta: { label: 'Dashboard', icon: 'gauge', roles: ['SUPER_ADMIN', 'OWNER', 'CUSTOMER'] },
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagementPage,
        meta: {
          label: 'Daftar User',
          parent: 'User Management',
          icon: 'users',
          roles: ['SUPER_ADMIN'],
        },
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: ProfilePage,
        meta: {
          label: 'Profile',
          parent: 'User Management',
          icon: 'user',
          roles: ['SUPER_ADMIN', 'OWNER', 'CUSTOMER'],
        },
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: TransactionPage,
        meta: { label: 'Transaksi', icon: 'money-check-dollar', roles: ['SUPER_ADMIN', 'OWNER'] },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsPage,
        meta: { label: 'Setting', icon: 'gear', roles: ['SUPER_ADMIN', 'OWNER'] },
      },
    ],
  },

  {
    path: '/:catchAll(.*)',
    redirect: '/unauthorized',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.name === 'ChangePassword' && (!to.query.token || to.query.token === '')) {
    return next({ name: 'Login' })
  }

  if (authStore.token && !authStore.checkTokenValidity()) {
    authStore.logout()
    return next({ name: 'Login' })
  }

  if (to.meta.requiresUnauth && authStore.token) {
    return next({ name: 'DashboardHome' })
  }

  if (to.meta.requiresAuth) {
    if (!authStore.token) return next({ name: 'Login' })
    if (to.meta.roles && !to.meta.roles.includes(authStore.role))
      return next({ name: 'Unauthorized' })
  }

  next()
})

export default router
