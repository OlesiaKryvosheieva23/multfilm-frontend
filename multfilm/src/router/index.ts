import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import MyToWatchFilms from "@/components/MyToWatchFilms.vue";
import MySeenFilms from "@/components/MySeenFilms.vue";
import SearchFilm from "@/components/SearchFilm.vue";
import WelcomeItem from "@/components/WelcomeItem.vue";
import TheWelcome from "@/components/TheWelcome.vue";
import MovieDetails from "@/components/MovieDetails.vue";

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
      path: '/watchlist',
      name: 'watchlist',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MyToWatchFilms,
    },
    {
      path: '/seen',
      name: 'seen',
      component: MySeenFilms,
    },
    {
      path: '/movie/:id',
      name: 'movie-details',
      component: MovieDetails,
    }
  ],
})

export default router
