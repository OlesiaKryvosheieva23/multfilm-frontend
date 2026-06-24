<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const movie = ref<any>(null)

const baseUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://multfilm-backend.onrender.com'

async function loadMovie() {

  const response = await axios.get(
    `${baseUrl}/api/tmdb/movie/${route.params.id}`
  )

  movie.value = response.data
}

onMounted(loadMovie)

function goBack() {
  router.back()
}

</script>

<template>

  <div v-if="movie" class="movie-details">

    <h1>{{ movie.title }}</h1>
    <img
      :src="movie.posterUrl"
      :alt="movie.title"
      class="poster"
    >

    <p>
      <strong>Vote Average:</strong>
      {{ movie.voteAverage }}
    </p>

    <p>
      <strong>Release Date:</strong>
      {{ movie.releaseDate }}
    </p>



    <h3>Overview</h3>

    <p>
      {{ movie.overview }}
    </p>

    <button
      class="btn btn-secondary"
      @click="goBack"
    >
      ← Back
    </button>


  </div>

</template>

<style scoped>
.movie-details {
  max-width: 900px;
  margin: 2rem auto;
}

.poster {
  width: 300px;
  border-radius: 12px;
  margin-bottom: 2rem;
}
</style>
