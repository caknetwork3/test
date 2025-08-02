<template>
  <div class="streamer-grid">
    <div v-if="loading" class="loading-container">
      <div class="loading"></div>
      <p>Cargando streamers...</p>
    </div>
    
    <div v-else-if="streamers.length === 0" class="no-streamers">
      <div class="no-streamers-icon">👥</div>
      <h3>No hay streamers registrados</h3>
      <p>¡Sé el primero en unirte a la comunidad CAK!</p>
      <router-link v-if="!authStore.isLoggedIn" to="/register" class="btn btn-primary">
        Registrarse
      </router-link>
    </div>
    
    <div v-else class="streamers-container">
      <div class="streamers-list">
        <StreamerCard
          v-for="streamer in streamers"
          :key="streamer.id"
          :streamer="streamer"
          @click="goToStreamer(streamer.id)"
        />
      </div>
      
      <div v-if="streamers.length > 6" class="view-all-container">
        <button @click="showAll = !showAll" class="btn btn-secondary">
          {{ showAll ? 'Ver menos' : `Ver todos (${totalStreamers})` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import StreamerCard from './StreamerCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const showAll = ref(false)

const allStreamers = computed(() => {
  return authStore.users.filter(u => u.role === 'streamer')
})

const streamers = computed(() => {
  const streamersToShow = showAll.value ? allStreamers.value : allStreamers.value.slice(0, 6)
  return streamersToShow
})

const totalStreamers = computed(() => {
  return allStreamers.value.length
})

const goToStreamer = (streamerId) => {
  router.push(`/streamer/${streamerId}`)
}

onMounted(async () => {
  // Simular carga
  setTimeout(() => {
    loading.value = false
  }, 500)
  
  // Crear algunos streamers de ejemplo si no existen
  if (allStreamers.value.length === 0) {
    createSampleStreamers()
  }
})

const createSampleStreamers = () => {
  const sampleStreamers = [
    {
      id: 'streamer_1',
      username: 'GamerPro',
      email: 'gamerpro@example.com',
      password: '123456',
      role: 'streamer',
      chococoins: 250,
      profileImage: null,
      bio: 'Streamer de videojuegos con más de 5 años de experiencia. Me especializo en juegos de estrategia y RPGs.',
      socialLinks: {
        twitch: 'https://twitch.tv/gamerpro',
        youtube: 'https://youtube.com/gamerpro',
        twitter: 'https://twitter.com/gamerpro',
        instagram: 'https://instagram.com/gamerpro'
      },
      isStreaming: Math.random() > 0.7,
      createdAt: new Date().toISOString()
    },
    {
      id: 'streamer_2',
      username: 'StreamQueen',
      email: 'streamqueen@example.com',
      password: '123456',
      role: 'streamer',
      chococoins: 180,
      profileImage: null,
      bio: 'Creadora de contenido enfocada en juegos indie y arte digital. ¡Siempre buscando nuevas aventuras!',
      socialLinks: {
        twitch: 'https://twitch.tv/streamqueen',
        youtube: 'https://youtube.com/streamqueen',
        twitter: 'https://twitter.com/streamqueen',
        instagram: 'https://instagram.com/streamqueen'
      },
      isStreaming: Math.random() > 0.7,
      createdAt: new Date().toISOString()
    },
    {
      id: 'streamer_3',
      username: 'TechNinja',
      email: 'techninja@example.com',
      password: '123456',
      role: 'streamer',
      chococoins: 320,
      profileImage: null,
      bio: 'Experto en tecnología y gaming. Streams de programación, reviews de hardware y gaming competitivo.',
      socialLinks: {
        twitch: 'https://twitch.tv/techninja',
        youtube: 'https://youtube.com/techninja',
        twitter: 'https://twitter.com/techninja',
        instagram: 'https://instagram.com/techninja'
      },
      isStreaming: Math.random() > 0.7,
      createdAt: new Date().toISOString()
    },
    {
      id: 'streamer_4',
      username: 'ArtisticGamer',
      email: 'artisticgamer@example.com',
      password: '123456',
      role: 'streamer',
      chococoins: 150,
      profileImage: null,
      bio: 'Combinando arte y gaming. Streams de dibujo digital, diseño de personajes y juegos creativos.',
      socialLinks: {
        twitch: 'https://twitch.tv/artisticgamer',
        youtube: 'https://youtube.com/artisticgamer',
        twitter: 'https://twitter.com/artisticgamer',
        instagram: 'https://instagram.com/artisticgamer'
      },
      isStreaming: Math.random() > 0.7,
      createdAt: new Date().toISOString()
    }
  ]
  
  sampleStreamers.forEach(streamer => {
    authStore.users.push(streamer)
  })
  authStore.saveUsers()
}
</script>

<style scoped>
.streamer-grid {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-container p {
  color: var(--text-color);
  opacity: 0.7;
  margin-top: 1rem;
}

.no-streamers {
  text-align: center;
  padding: 4rem 2rem;
}

.no-streamers-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-streamers h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.no-streamers p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 2rem;
}

.streamers-container {
  width: 100%;
}

.streamers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.view-all-container {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .streamers-list {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .streamers-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .no-streamers {
    padding: 2rem 1rem;
  }
  
  .no-streamers-icon {
    font-size: 3rem;
  }
}
</style>