<script setup lang="ts">
import { ref, type Ref } from 'vue'
import axios from 'axios'

import type {AxiosResponse} from 'axios'
import type {Film} from '@/types'

const items: Ref<Film[]> = ref([])
const watchlistIds: Ref<number[]> = ref([])

const baseUrl =   window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://multfilm-backend.onrender.com'

let toWatch = false

async function loadFilms () {


  const endpoint = baseUrl + '/api/tmdb/trending'

  const response: AxiosResponse = await axios.get(endpoint)

  items.value = response.data.map((film: any) => ({
    title: film.title,
    id: film.id,
    overview: film.overview,
    posterUrl: 'https://image.tmdb.org/t/p/w500' + film.poster_path,
    releaseDate: film.release_date,
    director: ''
  }))
}

async function loadWatchlist() {


  const response = await axios.get(
    baseUrl + '/api/movie-entries/watchlist'
  )

  watchlistIds.value = response.data.map(
    (film: any) => film.id
  )
}

function isInWatchlist(id: number) {
  return watchlistIds.value.includes(id)
}

async function save ( movieID: number, title: string, owner: string, id: number, toWatch: boolean, overview: string, posterUrl: string, releaseDate: string, director: string, voteAverage: number ) {
 const baseUrl =   window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://multfilm-backend.onrender.com'
  const endpoint = baseUrl + '/api/movie-entries'

  const data: Film = {
   movieID: movieID,
    title: title,
    owner: owner,
    id: id,
    toWatch: true,
    overview: overview,
    posterUrl: posterUrl,
    releaseDate: releaseDate,
    director: director,
    voteAverage: voteAverage
  }

  console.log('Sending data:', data)
  const response: AxiosResponse = await axios.post(endpoint, data);
  const responseData: Film = response.data;

  watchlistIds.value.push(id)
  console.log('Success:', responseData)
}

loadFilms()
loadWatchlist()

</script>







<template>
  <div>

<!--    <div class="input-group mb-3">-->
<!--      <input type="text" class="form-control" placeholder="What do you want to see?" aria-label="Recipient’s username" aria-describedby="button-addon2">-->
<!--      <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>-->
<!--    </div>-->


    <div class="search-result">
  <h1 class="header">Trending Movies</h1>
      <div class="movie-list">
  <div v-for="film in items" :key="film.title" class="movie-card">

    <h2>{{ film.title }}</h2>

    <img :src="film.posterUrl" alt="poster">
    <p>{{ film.overview }}</p>
    <button
      class="btn btn-secondary"
      :disabled="isInWatchlist(film.id)"
      @click="save(film.movieID, film.title, 'user', film.id, film.toWatch, film.overview, film.posterUrl, film.releaseDate, film.director, film.voteAverage)"
      type="button"
    >
      {{
        isInWatchlist(film.id)
          ? 'Already in Watchlist'
          : 'To watch'
      }}
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
</style>
