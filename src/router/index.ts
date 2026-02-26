import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/public/AboutView.vue'),
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/public/ServicesView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/public/ContactView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/SignUpView.vue'),
      meta: { guest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/dashboard/AdminView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/employee',
      name: 'employee',
      component: () => import('../views/dashboard/EmployeeView.vue'),
      meta: { requiresAuth: true, role: 'employee' },
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()
  if (auth.loading) {
    await auth.init()
  }
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const guestOnly = to.matched.some((r) => r.meta.guest)
  const requiredRole = to.meta.role as 'admin' | 'employee' | undefined

  if (requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  if (guestOnly && auth.isAuthenticated) {
    const raw = (to.query.redirect as string) || '/dashboard'
    const redirect =
      typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard'
    next(redirect)
    return
  }
  if (requiredRole === 'admin' && !auth.isAdmin) {
    next(auth.isEmployee ? '/employee' : '/dashboard')
    return
  }
  if (requiredRole === 'employee' && !auth.isEmployee) {
    next(auth.isAdmin ? '/admin' : '/dashboard')
    return
  }
  next()
})

export default router
