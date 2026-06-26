<script setup lang="ts">
import {ref, type Ref} from "vue";

const items: Ref<Film[]> = ref([])
const errorMessage = ref('')


import axios, {type AxiosResponse} from "axios";
import type {Film} from "@/types.ts";
import { getBaseUrl } from "@/api";

const baseUrl = getBaseUrl()

async function loadToWatchList () {

  const endpoint = baseUrl + '/api/movie-entries/watchlist'

  const response: AxiosResponse = await axios.get(endpoint)

  items.value = response.data.map((film: any) => ({
    movieID: film.movieID,
    title: film.title,
    id: film.id,
    owner: film.owner,
    toWatch: film.toWatch,
    seen: film.seen,
    commentText: film.commentText ?? '',
    overview: film.overview ?? '',
    posterUrl: film.posterUrl,
    releaseDate: film.releaseDate ?? '',
    director: film.director ?? '',
    voteAverage: film.voteAverage ?? 0
  }))
}

async function removeFromWatchlist(movieID: number) {

  await axios.put(baseUrl + `/api/movie-entries/${movieID}/remove-watchlist`)

  await loadToWatchList()
}

async function toggleSeen(film: Film) {
  errorMessage.value = ''
  const previousSeen = film.seen
  film.seen = !film.seen

  try {
    const response: AxiosResponse = await axios.put(baseUrl + `/api/movie-entries/${film.movieID}/toggle-seen`)
    film.seen = response.data.seen
  } catch (error) {
    film.seen = previousSeen
    errorMessage.value = 'Seen-Status konnte nicht gespeichert werden.'
  }
}

loadToWatchList()
</script>

<template>

<main class="page">
<h1 class="header">My to watch List</h1>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  <div class="movie-list">
  <div
    v-for="film in items"
    :key="film.id"
    class="movie-card"
  >
    <h3 class="movie-title">{{ film.title }}</h3>
    <img :src="film.posterUrl" alt="poster">
<!--    <p>{{ film.overview }}</p>-->

    <div class="movie-actions">
      <button
        class="seen-button"
        :class="{ active: film.seen }"
        :aria-label="film.seen ? 'Als nicht gesehen markieren' : 'Als gesehen markieren'"
        :data-tooltip="film.seen ? 'Als nicht gesehen markieren' : 'Als gesehen markieren'"
        :title="film.seen ? 'Als nicht gesehen markieren' : 'Als gesehen markieren'"
        @click="toggleSeen(film)"
        type="button"
      >
        <span v-if="film.seen">&#10003;</span>
      </button>

      <router-link :to="`/movie/${film.id}`">
        <button class="btn btn-secondary">
          Details
        </button>
      </router-link>

      <button class="btn btn-secondary" @click="removeFromWatchlist(film.movieID)">Remove</button>
    </div>
  </div>
  </div>
</main>
</template>

<style scoped>
.page {
  padding-bottom: 2rem;
}

.header {
  color: #17252a;
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 2rem;
}

.movie-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(43, 122, 120, 0.12);
  border-radius: 14px;
  box-shadow: 0 16px 36px rgba(35, 53, 52, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 470px;
  padding: 18px;
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.movie-card:hover {
  box-shadow: 0 22px 46px rgba(35, 53, 52, 0.16);
  transform: translateY(-3px);
}

.movie-title {
  color: #17252a;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.2;
  min-height: 58px;
}

.movie-card img {
  aspect-ratio: 2 / 3;
  width: 100%;
  max-height: 390px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 16px 30px rgba(23, 37, 42, 0.12);
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0.8rem;
  margin-bottom: 1.1rem;
}

.movie-list {
  display: grid;
  gap: 22px;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  width: 100%;
}

.movie-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  min-height: 38px;
}

.movie-actions .btn {
  min-height: 34px;
}

.error-message {
  background: #fff1f0;
  border: 1px solid #ffd1cc;
  border-radius: 10px;
  color: #b42318;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
}

.seen-button {
  width: 34px;
  height: 34px;
  border: 2px solid #2b7a78;
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
  box-shadow: 0 8px 18px rgba(47, 158, 68, 0.2);
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
