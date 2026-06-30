<script setup lang="ts">
import { ref, type Ref } from 'vue'
import axios from 'axios'

import type {AxiosResponse} from 'axios'
import type {Film} from '@/types'
import { getBaseUrl } from '@/api'
import { t } from '@/i18n'

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
    commentText: '',
    personalRating: 0,
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
    commentText: film.commentText ?? '',
    personalRating: film.personalRating ?? 0,
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
    commentText: film.commentText,
    personalRating: film.personalRating,
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
      errorMessage.value = t('watchlistStatusError')
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
      errorMessage.value = t('seenStatusError')
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
    commentText: '',
    personalRating: 0,
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
    errorMessage.value = t('seenStatusError')
  }
}

async function loadPage() {
  const [movieEntriesResult, filmsResult] = await Promise.allSettled([
    loadMovieEntries(),
    loadFilms()
  ])

  if (movieEntriesResult.status === 'rejected') {
    errorMessage.value = t('entriesLoadError')
  }

  if (filmsResult.status === 'rejected') {
    errorMessage.value = t('moviesLoadError')
  }
}

loadPage()

</script>







<template>
  <main class="page">

<!--    <div class="input-group mb-3">-->
<!--      <input type="text" class="form-control" placeholder="What do you want to see?" aria-label="Recipient’s username" aria-describedby="button-addon2">-->
<!--      <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>-->
<!--    </div>-->


    <div class="search-result">
  <h1 class="header">{{ t('trendingMovies') }}</h1>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="movie-list">
  <div v-for="film in items" :key="film.title" class="movie-card">

    <h2 class="movie-title">{{ film.title }}</h2>

    <img :src="film.posterUrl" alt="poster">
    <p class="movie-overview">{{ film.overview }}</p>

    <div class="movie-actions">
      <button
        class="btn btn-secondary"
        :disabled="isInWatchlist(film.id)"
        @click="save(film)"
        type="button"
      >
        {{
          isInWatchlist(film.id)
            ? t('alreadyInWatchlist')
            : t('addToWatchlist')
        }}
      </button>

      <button
        class="seen-button"
        :class="{ active: isSeen(film.id) }"
        :aria-label="isSeen(film.id) ? t('markUnseen') : t('markSeen')"
        :data-tooltip="isSeen(film.id) ? t('markUnseen') : t('markSeen')"
        :title="isSeen(film.id) ? t('markUnseen') : t('markSeen')"
        @click="toggleSeen(film)"
        type="button"
      >
        <span v-if="isSeen(film.id)">&#10003;</span>
      </button>

      <router-link :to="`/movie/${film.id}`">
        <button class="btn btn-secondary">
          {{ t('details') }}
        </button>
      </router-link>
    </div>
  </div>
  </div>
  </div>
</main>


</template>

<style scoped>
.input-group{
  margin-top: 5rem;
}
.search-result{
  margin-top: 0;
}

.header{
  color: #17252a;
  font-size: clamp(2rem, 4vw, 3.15rem);
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 1.5rem;
}

.movie-card img{
  aspect-ratio: 2 / 3;
  width: 100%;
  max-height: 330px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 16px 30px rgba(23, 37, 42, 0.12);
  margin-bottom: 1.1rem;
  margin-top: 0.8rem;
  margin-left: auto;
  margin-right: auto;

}

:disabled{
  background-color: #9bb8b6;
}

.error-message {
  background: #fff1f0;
  border: 1px solid #ffd1cc;
  border-radius: 10px;
  color: #b42318;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
}

.page {
  padding-bottom: 2rem;
}

.movie-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(43, 122, 120, 0.12);
  border-radius: 14px;
  box-shadow: 0 16px 36px rgba(35, 53, 52, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 640px;
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
  min-height: 60px;
}

.movie-overview {
  color: #506260;
  display: -webkit-box;
  font-size: 0.94rem;
  line-height: 1.55;
  min-height: 112px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
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

.movie-list{
  display: grid;
  gap: 22px;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  width: 100%;
}

.seen-button {
  width: 34px;
  height: 34px;
  border: 2px solid #2b7a78;
  border-radius: 50%;
  background: transparent;
  color: white;
  cursor: pointer;
  font-weight: 700;
  flex: 0 0 34px;
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
