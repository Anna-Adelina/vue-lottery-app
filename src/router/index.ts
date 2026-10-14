import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
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