<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
<!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

    <div class="wrapper">
<!--      <HelloWorld msg="You did it!" />-->
      <RouterLink class="brand" to="/search">Mufilm</RouterLink>

      <nav>
<!--        <RouterLink to="/">Login</RouterLink>-->
        <RouterLink to="/search">Home</RouterLink>
        <RouterLink to="/watchlist">Watchlist</RouterLink>
        <RouterLink to="/seen">To See</RouterLink>
      </nav>
    </div>
  </header>


  <RouterView />
</template>

<style scoped>
.app-header {
  line-height: 1.5;
  margin-bottom: 2rem;
}

.wrapper {
  align-items: center;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(43, 122, 120, 0.12);
  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(35, 53, 52, 0.08);
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  padding: 0.85rem 1rem;
}

.brand {
  color: #17252a;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0;
}

nav {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.95rem;
  gap: 0.4rem;
  justify-content: flex-end;
}

nav a {
  border-radius: 999px;
  color: #345c5a;
  display: inline-block;
  font-weight: 700;
  padding: 0.55rem 0.9rem;
}

nav a:hover,
nav a.router-link-active {
  background: #def0ee;
  color: #205f5d;
}

@media (min-width: 1024px) {
  .app-header {
    display: block;
  }
}

@media (max-width: 640px) {
  .wrapper {
    align-items: flex-start;
    flex-direction: column;
  }

  nav {
    justify-content: flex-start;
    width: 100%;
  }
}
</style>
