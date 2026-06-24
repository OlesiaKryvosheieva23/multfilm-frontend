<script setup lang="ts">
import {ref, type Ref} from "vue";

const items: Ref<Film[]> = ref([])


import axios, {type AxiosResponse} from "axios";
import type {Film} from "@/types.ts";

const baseUrl =   window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://multfilm-backend.onrender.com'

async function loadToWatchList () {

  const endpoint = baseUrl + '/api/movie-entries/watchlist'

  const response: AxiosResponse = await axios.get(endpoint)

  items.value = response.data.map((film: any) => ({
    movieID: film.movieID,
    title: film.title,
    id: film.id,
    // overview: film.overview,
    posterUrl: film.posterUrl,
    // releaseDate: film.releaseDate,
    // director: ''
  }))
}

async function removeFromWatchlist(movieID: number) {

  await axios.put(baseUrl + `/api/movie-entries/${movieID}/remove-watchlist`)

  await loadToWatchList()
}

loadToWatchList()
</script>

<template>

<h1>My to watch List</h1>
  <div class="movie-list">
  <div
    v-for="film in items"
    :key="film.id"
    class="movie-card"
  >
    <h3>{{ film.title }}</h3>
    <img :src="film.posterUrl" alt="poster">
<!--    <p>{{ film.overview }}</p>-->

    <router-link :to="`/movie/${film.id}`">
      <button class="btn btn-secondary">
        Details
      </button>
    </router-link>

    <button class="btn btn-secondary" @click="removeFromWatchlist(film.movieID)">Remove</button>
  </div>
  </div>
</template>

<style scoped>
.movie-card {
  width: 400px;
  border: 1px solid #ddd;
  padding: 16px;
  margin: 12px 0;
  border-radius: 8px;
}
.movie-card img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.movie-list {
  display: flex;
  width: 1500px;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
