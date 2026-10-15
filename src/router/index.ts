import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    layout?: 'default' | 'auth'
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About author' },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
    meta: { title: 'Users', requiresAuth: true },
  },
  {
    path: '/users/new',
    name: 'user-create',
    component: () => import('@/views/UserCreateView.vue'),
    meta: { title: 'New user', requiresAuth: true },
  },
  {
    path: '/users/:id(\\d+)',
    name: 'user-detail',
    component: () => import('@/views/UserDetailView.vue'),
    props: true,
    meta: { title: 'User', requiresAuth: true },
    children: [
        {
        path: 'edit',
        name: 'user-edit',
        component: () => import('@/views/UserEditView.vue'),
        props: true,
        meta: { title: 'Edit user', requiresAuth: true },
        },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login', layout: 'auth' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // закрита сторінка без логіну → на /login, запам'ятавши, куди хотів
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // вже залогінений відкриває /login → на /users
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'users' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Vue Lottery` : 'Vue Lottery'
})