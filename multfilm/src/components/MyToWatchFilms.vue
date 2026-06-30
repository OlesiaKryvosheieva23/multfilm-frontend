<script setup lang="ts">
import {computed, ref, type Ref} from "vue";

const items: Ref<Film[]> = ref([])
const errorMessage = ref('')
const searchTerm = ref('')
const statusFilter = ref<'all' | 'unseen' | 'seen'>('all')
const customMovieTitle = ref('')
const addSuccessMessage = ref('')


import axios, {type AxiosResponse} from "axios";
import type {Film} from "@/types.ts";
import { getBaseUrl } from "@/api";
import { t } from "@/i18n";

const baseUrl = getBaseUrl()
const DEFAULT_CUSTOM_POSTER_URL = '/theater-placeholder.svg'

const filteredItems = computed(() => {
  const normalizedSearchTerm = searchTerm.value.trim().toLowerCase()

  return items.value.filter((film: Film) => {
    const matchesSearchTerm = !normalizedSearchTerm
      || film.title.toLowerCase().includes(normalizedSearchTerm)

    const matchesStatusFilter =
      statusFilter.value === 'all'
      || (statusFilter.value === 'seen' && film.seen)
      || (statusFilter.value === 'unseen' && !film.seen)

    return matchesSearchTerm && matchesStatusFilter
  })
})

function mapMovieEntry(film: any): Film {
  return {
    movieID: film.movieID,
    title: film.title,
    id: film.id,
    owner: film.owner,
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

function isTitleInWatchlist(title: string) {
  const normalizedTitle = title.trim().toLowerCase()

  return items.value.some((film: Film) =>
    film.title.trim().toLowerCase() === normalizedTitle
  )
}

async function loadToWatchList () {

  const endpoint = baseUrl + '/api/movie-entries/watchlist'

  const response: AxiosResponse = await axios.get(endpoint)

  items.value = response.data.map(mapMovieEntry)
}

async function addCustomMovie() {
  errorMessage.value = ''
  addSuccessMessage.value = ''

  const title = customMovieTitle.value.trim()

  if (!title) {
    errorMessage.value = t('titleRequired')
    return
  }

  if (isTitleInWatchlist(title)) {
    errorMessage.value = t('duplicateMovie')
    return
  }

  try {
    const customMovieId = -Date.now()
    const response: AxiosResponse = await axios.post(baseUrl + '/api/movie-entries', {
      title: title,
      owner: 'user',
      id: customMovieId,
      toWatch: true,
      seen: false,
      commentText: '',
      personalRating: 0,
      overview: 'Eigener Film',
      posterUrl: DEFAULT_CUSTOM_POSTER_URL,
      releaseDate: '',
      director: '',
      voteAverage: 0
    })

    items.value.push(mapMovieEntry(response.data))
    addSuccessMessage.value = `${title} ${t('movieAdded')}`
    customMovieTitle.value = ''
  } catch (error) {
    errorMessage.value = t('movieAddError')
  }
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
    errorMessage.value = t('seenStatusError')
  }
}

loadToWatchList()
</script>

<template>

<main class="page">
<h1 class="header">{{ t('watchlistTitle') }}</h1>
  <section class="add-movie-panel">
    <h2>{{ t('addOwnMovie') }}</h2>
    <form class="add-search" @submit.prevent="addCustomMovie">
      <input
        v-model="customMovieTitle"
        type="text"
        :placeholder="t('movieTitlePlaceholder')"
      >
      <button class="btn btn-secondary" type="submit">
        {{ t('add') }}
      </button>
    </form>

    <p v-if="addSuccessMessage" class="success-message">{{ addSuccessMessage }}</p>
  </section>

  <div class="search-bar">
    <label for="watchlist-search">{{ t('searchWatchlist') }}</label>
    <input
      id="watchlist-search"
      v-model="searchTerm"
      type="search"
      :placeholder="t('searchTitlePlaceholder')"
    >
  </div>
  <div class="filter-bar" :aria-label="t('filterWatchlist')">
    <button
      class="filter-button"
      :class="{ active: statusFilter === 'all' }"
      @click="statusFilter = 'all'"
      type="button"
    >
      {{ t('filterAll') }}
    </button>
    <button
      class="filter-button"
      :class="{ active: statusFilter === 'unseen' }"
      @click="statusFilter = 'unseen'"
      type="button"
    >
      {{ t('filterUnseen') }}
    </button>
    <button
      class="filter-button"
      :class="{ active: statusFilter === 'seen' }"
      @click="statusFilter = 'seen'"
      type="button"
    >
      {{ t('filterSeen') }}
    </button>
  </div>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  <p
    v-if="filteredItems.length === 0 && items.length > 0"
    class="empty-message"
  >
    {{ t('noWatchlistMatch') }}
  </p>
  <div class="movie-list">
  <div
    v-for="film in filteredItems"
    :key="film.id"
    class="movie-card"
  >
    <h3 class="movie-title">{{ film.title }}</h3>
    <img :src="film.posterUrl || DEFAULT_CUSTOM_POSTER_URL" alt="poster">
<!--    <p>{{ film.overview }}</p>-->

    <div class="movie-actions">
      <button
        class="seen-button"
        :class="{ active: film.seen }"
        :aria-label="film.seen ? t('markUnseen') : t('markSeen')"
        :data-tooltip="film.seen ? t('markUnseen') : t('markSeen')"
        :title="film.seen ? t('markUnseen') : t('markSeen')"
        @click="toggleSeen(film)"
        type="button"
      >
        <span v-if="film.seen">&#10003;</span>
      </button>

      <router-link v-if="film.id > 0" :to="`/movie/${film.id}`">
        <button class="btn btn-secondary">
          {{ t('details') }}
        </button>
      </router-link>

      <button class="btn btn-secondary" @click="removeFromWatchlist(film.movieID)">{{ t('remove') }}</button>
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
  margin-bottom: 1.25rem;
}

.add-movie-panel {
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(43, 122, 120, 0.14);
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(35, 53, 52, 0.08);
  margin-bottom: 1.5rem;
  padding: 1rem;
}

.add-movie-panel h2 {
  color: #17252a;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 0.85rem;
}

.add-search {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.add-search input {
  background: #f7fbfa;
  border: 1px solid rgba(43, 122, 120, 0.22);
  border-radius: 999px;
  color: #17252a;
  flex: 1 1 260px;
  font: inherit;
  padding: 0.75rem 1rem;
}

.add-search input:focus {
  border-color: #2b7a78;
  box-shadow: 0 0 0 3px rgba(43, 122, 120, 0.14);
  outline: none;
}

.search-bar {
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(43, 122, 120, 0.14);
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(35, 53, 52, 0.08);
  margin-bottom: 1.5rem;
  max-width: 520px;
  padding: 1rem;
}

.search-bar label {
  color: #345c5a;
  display: block;
  font-size: 0.86rem;
  font-weight: 800;
  margin-bottom: 0.45rem;
}

.search-bar input {
  background: #f7fbfa;
  border: 1px solid rgba(43, 122, 120, 0.22);
  border-radius: 999px;
  color: #17252a;
  font: inherit;
  padding: 0.75rem 1rem;
  width: 100%;
}

.search-bar input:focus {
  border-color: #2b7a78;
  box-shadow: 0 0 0 3px rgba(43, 122, 120, 0.14);
  outline: none;
}

.filter-bar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 1.5rem;
}

.filter-button {
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(43, 122, 120, 0.18);
  border-radius: 999px;
  color: #345c5a;
  cursor: pointer;
  font-weight: 800;
  padding: 0.6rem 0.95rem;
  transition:
    background-color 0.18s ease,
    box-shadow 0.18s ease,
    color 0.18s ease;
}

.filter-button:hover,
.filter-button.active {
  background: #def0ee;
  box-shadow: 0 8px 18px rgba(43, 122, 120, 0.12);
  color: #205f5d;
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

.success-message {
  background: #eefbf1;
  border: 1px solid #b7ebc1;
  border-radius: 10px;
  color: #2f7d3e;
  font-weight: 800;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
}

.empty-message {
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(43, 122, 120, 0.14);
  border-radius: 10px;
  color: #345c5a;
  font-weight: 700;
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
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
