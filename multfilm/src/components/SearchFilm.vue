

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import axios from 'axios'

import type {AxiosResponse} from 'axios'
import type {Film} from '@/types'

const items: Ref<Film[]> = ref([])
const titleField = ref('')
const overviewField = ref('')
const posterUrlField = ref('')
const releaseDateField = ref('')
const directorField = ref('')



async function loadFilms () {

  const baseUrl = 'http://localhost:8080'
  const endpoint = baseUrl + '/api/tmdb/trending'

  const response: AxiosResponse = await axios.get(endpoint)

  items.value = response.data.map((film: any) => ({
    title: film.title,
    overview: film.overview,
    posterUrl: 'https://image.tmdb.org/t/p/w500' + film.poster_path,
    releaseDate: film.release_date,
    director: ''
  }))
}

loadFilms()
</script>

// async function save () {
//   const baseUrl = 'http://localhost:8080'
//   const endpoint = baseUrl + '/api/tmdb/trending'
//   const data: Film = {
//     title: titleField.value,
//     overview: overviewField.value,
//     posterUrl: posterUrlField.value,
//     releaseDate: releaseDateField.value,
//     director: directorField.value
//
//   }
//   const response: AxiosResponse = await axios.post(endpoint, data);
//   const responseData: Film = response.data;
//   console.log('Success:', responseData)
// }





<template>
  <div>
    <div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="What do you want to see?" aria-label="Recipient’s username" aria-describedby="button-addon2">
      <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
    </div>

<div class="search-result">
  <h1>Top 10 most popular films</h1>
  <div v-for="film in items" :key="film.title">

    <h2>{{ film.title }}</h2>

    <img :src="film.posterUrl" alt="poster">

    <p>{{ film.overview }}</p>

  </div>
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
