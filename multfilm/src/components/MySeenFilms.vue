<script setup lang="ts">
import { ref, type Ref } from "vue";

import axios, { type AxiosResponse } from "axios";
import type { Film } from "@/types.ts";
import { getBaseUrl } from "@/api";

const items: Ref<Film[]> = ref([])
const errorMessage = ref('')

const baseUrl = getBaseUrl()

async function loadSeenFilms() {
  const response: AxiosResponse = await axios.get(baseUrl + '/api/movie-entries/seen')

  items.value = response.data.map((film: any) => ({
    movieID: film.movieID,
    title: film.title,
    owner: film.owner,
    id: film.id,
    toWatch: film.toWatch,
    seen: film.seen,
    overview: film.overview ?? '',
    posterUrl: film.posterUrl,
    releaseDate: film.releaseDate ?? '',
    director: film.director ?? '',
    voteAverage: film.voteAverage ?? 0
  }))
}

async function toggleSeen(film: Film) {
  errorMessage.value = ''
  const previousSeen = film.seen
  film.seen = !film.seen

  try {
    const response: AxiosResponse = await axios.put(baseUrl + `/api/movie-entries/${film.movieID}/toggle-seen`)
    const updatedFilm: Film = response.data

    if (updatedFilm.seen) {
      film.seen = updatedFilm.seen
    } else {
      items.value = items.value.filter((item: Film) => item.movieID !== film.movieID)
    }
  } catch (error) {
    film.seen = previousSeen
    errorMessage.value = 'Seen-Status konnte nicht gespeichert werden.'
  }
}

loadSeenFilms()
</script>

<template>
  <h1>To See</h1>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

  <div class="movie-list">
    <div
      v-for="film in items"
      :key="film.movieID"
      class="movie-card"
    >
      <h3 class="movie-title">{{ film.title }}</h3>
      <img :src="film.posterUrl" alt="poster">

      <div class="movie-actions">
        <button
          class="seen-button active"
          aria-label="Als nicht gesehen markieren"
          data-tooltip="Als nicht gesehen markieren"
          title="Als nicht gesehen markieren"
          @click="toggleSeen(film)"
          type="button"
        >
          &#10003;
        </button>

        <router-link :to="`/movie/${film.id}`">
          <button class="btn btn-secondary">
            Details
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  width: 400px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  min-height: 470px;
  padding: 16px;
  margin: 12px 0;
  border-radius: 8px;
}

.movie-title {
  min-height: 58px;
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
}

.movie-list {
  display: flex;
  width: 1500px;
  flex-wrap: wrap;
  gap: 20px;
}

.movie-actions {
  align-items: center;
  display: flex;
  gap: 8px;
  margin-top: auto;
  min-height: 38px;
}

.movie-actions .btn {
  min-height: 34px;
}

.error-message {
  color: #b42318;
  margin-bottom: 1rem;
}

.seen-button {
  width: 34px;
  height: 34px;
  border: 2px solid cadetblue;
  border-radius: 50%;
  background: transparent;
  color: white;
  cursor: pointer;
  flex: 0 0 34px;
  font-weight: 700;
  position: relative;
  vertical-align: middle;
}

.seen-button.active {
  background: #2f9e44;
  border-color: #2f9e44;
}

.seen-button::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  line-height: 1.3;
  opacity: 0;
  padding: 4px 8px;
  pointer-events: none;
  transition: opacity 0.15s ease;
  white-space: nowrap;
  z-index: 10;
}

.seen-button:hover::after,
.seen-button:focus-visible::after {
  opacity: 1;
}
</style>
