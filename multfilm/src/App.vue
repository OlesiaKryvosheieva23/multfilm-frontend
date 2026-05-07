<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import SearchFilm from "@/components/SearchFilm.vue";
</script>

<template>
  <header>
<!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

    <div class="wrapper">
<!--      <HelloWorld msg="You did it!" />-->

      <nav>
        <RouterLink to="/">Login</RouterLink>
        <RouterLink to="/search">Home</RouterLink>
        <RouterLink to="/myFilms">MyFilms</RouterLink>
      </nav>
    </div>
  </header>


  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}



nav {
 width: 100%;
  font-size: 12px;
 text-align: center;
 margin-top: 2rem;
}



nav a {
 display: inline-block;
 padding: 0 1rem;
  border-left: 1px solid ;
}

nav a:first-of-type {
  border: 0;
}


@media (min-width: 1024px) {
 header {
    display: flex;
    place-items: center;

  }



  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

nav {
    text-align: left;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
