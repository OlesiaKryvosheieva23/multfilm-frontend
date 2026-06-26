<script setup lang="ts">
import { ref, type Ref } from 'vue'
import axios from 'axios'

import type {AxiosResponse} from 'axios'
import type {Film} from '@/types'
import { getBaseUrl } from '@/api'

const items: Ref<Film[]> = ref([])
const watchlistIds: Ref<number[]> = ref([])
const movieEntries: Ref<Film[]> = ref([])
const errorMessage = ref('')

const baseUrl = getBaseUrl()

async function loadFilms () {


  const endpoint = baseUrl + '/api/tmdb/trending'

  const response: AxiosResponse = await axios.get(endpoint)

  items.value = response.data.map((film: any) => ({
    movieID: 0,
    title: film.title,
    id: film.id,
    owner: 'user',
    toWatch: false,
    seen: isSeen(film.id),
    overview: film.overview,
    posterUrl: 'https://image.tmdb.org/t/p/w500' + film.poster_path,
    releaseDate: film.release_date,
    director: '',
    voteAverage: film.vote_average
  }))
}

async function loadMovieEntries() {
  const response = await axios.get(baseUrl + '/api/movie-entries', {
    params: {
      owner: 'user'
    }
  })

  movieEntries.value = response.data.map(mapMovieEntry)
  watchlistIds.value = movieEntries.value
    .filter((film: Film) => film.toWatch)
    .map((film: Film) => film.id)
}

function isInWatchlist(id: number) {
  return watchlistIds.value.includes(id)
}

function getMovieEntry(id: number) {
  return movieEntries.value.find((film: Film) => film.id === id)
}

function isSeen(id: number) {
  return getMovieEntry(id)?.seen === true
}

function mapMovieEntry(film: any): Film {
  return {
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
  }
}

function createMovieEntryRequest(film: Film) {
  return {
    title: film.title,
    owner: film.owner,
    id: film.id,
    toWatch: film.toWatch,
    seen: film.seen,
    overview: film.overview,
    posterUrl: film.posterUrl,
    releaseDate: film.releaseDate,
    director: film.director,
    voteAverage: film.voteAverage
  }
}

async function save ( film: Film ) {
  errorMessage.value = ''
  const movieEntry = getMovieEntry(film.id)

  if (movieEntry?.movieID) {
    const previousToWatch = movieEntry.toWatch
    movieEntry.toWatch = true

    try {
      const response: AxiosResponse = await axios.put(baseUrl + `/api/movie-entries/${movieEntry.movieID}/watchlist`)
      Object.assign(movieEntry, mapMovieEntry(response.data))
      watchlistIds.value.push(film.id)
    } catch (error) {
      movieEntry.toWatch = previousToWatch
      errorMessage.value = 'Watchlist-Status konnte nicht gespeichert werden.'
    }

    return
  }

  const endpoint = baseUrl + '/api/movie-entries'

  const data: Film = {
    ...film,
    toWatch: true,
    seen: false
  }

  console.log('Sending data:', data)
  const response: AxiosResponse = await axios.post(endpoint, createMovieEntryRequest(data));
  const responseData: Film = response.data;

  watchlistIds.value.push(film.id)
  movieEntries.value.push(mapMovieEntry(responseData))
  console.log('Success:', responseData)
}

async function toggleSeen(film: Film) {
  errorMessage.value = ''
  const movieEntry = getMovieEntry(film.id)

  if (movieEntry?.movieID) {
    const previousSeen = movieEntry.seen
    movieEntry.seen = !movieEntry.seen

    try {
      const response = await axios.put(baseUrl + `/api/movie-entries/${movieEntry.movieID}/toggle-seen`)
      Object.assign(movieEntry, mapMovieEntry(response.data))
    } catch (error) {
      movieEntry.seen = previousSeen
      errorMessage.value = 'Seen-Status konnte nicht gespeichert werden.'
    }

    return
  }

  const newEntry: Film = {
    movieID: -film.id,
    title: film.title,
    owner: 'user',
    id: film.id,
    toWatch: false,
    seen: true,
    overview: film.overview,
    posterUrl: film.posterUrl,
    releaseDate: film.releaseDate,
    director: film.director,
    voteAverage: film.voteAverage
  }

  movieEntries.value.push(newEntry)

  try {
    const response: AxiosResponse = await axios.post(baseUrl + '/api/movie-entries', createMovieEntryRequest(newEntry))
    const savedMovie = mapMovieEntry(response.data)
    const entryIndex = movieEntries.value.findIndex((entry: Film) => entry.movieID === newEntry.movieID)
    movieEntries.value.splice(entryIndex, 1, savedMovie)
  } catch (error) {
    movieEntries.value = movieEntries.value.filter((entry: Film) => entry.movieID !== newEntry.movieID)
    errorMessage.value = 'Seen-Status konnte nicht gespeichert werden.'
  }
}

async function loadPage() {
  const [movieEntriesResult, filmsResult] = await Promise.allSettled([
    loadMovieEntries(),
    loadFilms()
  ])

  if (movieEntriesResult.status === 'rejected') {
    errorMessage.value = 'Watchlist-/Seen-Status konnte nicht geladen werden.'
  }

  if (filmsResult.status === 'rejected') {
    errorMessage.value = 'Filme konnten nicht geladen werden.'
  }
}

loadPage()

</script>







<template>
  <div>

<!--    <div class="input-group mb-3">-->
<!--      <input type="text" class="form-control" placeholder="What do you want to see?" aria-label="Recipient’s username" aria-describedby="button-addon2">-->
<!--      <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>-->
<!--    </div>-->


    <div class="search-result">
  <h1 class="header">Trending Movies</h1>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="movie-list">
  <div v-for="film in items" :key="film.title" class="movie-card">

    <h2>{{ film.title }}</h2>

    <img :src="film.posterUrl" alt="poster">
    <p>{{ film.overview }}</p>
    <button
      class="btn btn-secondary"
      :disabled="isInWatchlist(film.id)"
      @click="save(film)"
      type="button"
    >
      {{
        isInWatchlist(film.id)
          ? 'Already in Watchlist'
          : 'To watch'
      }}
    </button>

    <button
      class="seen-button"
      :class="{ active: isSeen(film.id) }"
      :aria-label="isSeen(film.id) ? 'Als nicht gesehen markieren' : 'Als gesehen markieren'"
      :data-tooltip="isSeen(film.id) ? 'Als nicht gesehen markieren' : 'Als gesehen markieren'"
      :title="isSeen(film.id) ? 'Als nicht gesehen markieren' : 'Als gesehen markieren'"
      @click="toggleSeen(film)"
      type="button"
    >
      <span v-if="isSeen(film.id)">&#10003;</span>
    </button>

    <router-link :to="`/movie/${film.id}`">
      <button class="btn btn-secondary">
        Details
      </button>
    </router-link>
  </div>
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

.header{
  margin-bottom: 2rem;
}

 img{
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;

}

:disabled{
  background-color: cadetblue;
}

.error-message {
  color: #b42318;
  margin-bottom: 1rem;
}

.movie-card {

  border: 1px solid #ddd;
  padding: 16px;
  margin: 12px 0;
  border-radius: 8px;
  width: 400px;
}

.movie-list{
  width: 1600px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.seen-button {
  width: 34px;
  height: 34px;
  border: 2px solid cadetblue;
  border-radius: 50%;
  background: transparent;
  color: white;
  cursor: pointer;
  font-weight: 700;
  margin-left: 8px;
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
