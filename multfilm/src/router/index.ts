import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import MyFilms from "@/components/MyFilms.vue";
import SearchFilm from "@/components/SearchFilm.vue";
import WelcomeItem from "@/components/WelcomeItem.vue";
import TheWelcome from "@/components/TheWelcome.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: TheWelcome,
    },
    {
      path: '/search',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: SearchFilm,
    },
    {
      path: '/myFilms',
      name: 'myFilms',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MyFilms,
    },
  ],
})

export default router
