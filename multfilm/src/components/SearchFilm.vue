<script setup lang="ts">
import { ref } from 'vue'
const items = ref([
 { title: 'Der Teufel trägt Prada 2' },
  { title: 'Die Legende von Aang: Der Herr der Elemente' },
  { title: 'Der Schwiegersohn' },
 { title: 'Glennkill: Ein Schafskrimi' },
  { title: 'Hoppers' },
  { title: 'Die Odyssee' },
  { title: 'Der Astronaut – Project Hail Mary' },
  { title: 'Pegasus 3' },
 { title: 'Send Help' },
{ title: 'Hokum' }])
</script>

<template>
  <div>
    <div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="What do you want to see?" aria-label="Recipient’s username" aria-describedby="button-addon2">
      <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
    </div>

<div class="search-result">
  <h1>Top 10 most popular films</h1>
  <ol>
    <li v-for="item in items">
      {{ item.title }}
    </li>
  </ol>
</div>

  </div>

</template>

<style scoped>
.input-group{
  margin-top: 5rem;
}
.search-result{
  margin-top: 10rem;
}
</style>
