import { createRouter, createWebHistory } from 'vue-router'
import StorePage from '@/views/StorePage.vue'
import AboutPage from '@/views/AboutPage.vue'

const routes = [
  { path: '/store', name: 'Store', component: StorePage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/', name: 'Store', component: StorePage },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
