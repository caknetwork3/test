<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showResults = true"
        type="text"
        placeholder="Buscar streamers, perfiles..."
        class="search-input"
      />
      <div class="search-icon">🔍</div>
    </div>
    
    <!-- Resultados de búsqueda -->
    <div v-if="showResults && searchQuery" class="search-results">
      <div v-if="loading" class="search-loading">
        <div class="loading"></div>
        <span>Buscando...</span>
      </div>
      
      <div v-else-if="results.length === 0" class="no-results">
        <span>No se encontraron resultados para "{{ searchQuery }}"</span>
      </div>
      
      <div v-else class="results-list">
        <div
          v-for="streamer in results"
          :key="streamer.id"
          @click="goToStreamer(streamer.id)"
          class="result-item"
        >
          <div class="result-avatar">
            <img 
              v-if="streamer.profileImage" 
              :src="streamer.profileImage" 
              :alt="streamer.username"
              class="avatar-img"
            />
            <div v-else class="avatar-placeholder">
              {{ streamer.username.charAt(0).toUpperCase() }}
            </div>
          </div>
          
          <div class="result-info">
            <div class="result-name">{{ streamer.username }}</div>
            <div class="result-bio">{{ streamer.bio || 'Sin descripción' }}</div>
            <div v-if="streamer.isStreaming" class="streaming-badge">
              🔴 En vivo
            </div>
          </div>
          
          <div class="result-arrow">→</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const results = ref([])
const showResults = ref(false)
const loading = ref(false)

let searchTimeout = null

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  if (!searchQuery.value.trim()) {
    results.value = []
    return
  }
  
  loading.value = true
  
  searchTimeout = setTimeout(() => {
    results.value = authStore.searchStreamers(searchQuery.value)
    loading.value = false
  }, 300) // Debounce de 300ms
}

const goToStreamer = (streamerId) => {
  router.push(`/streamer/${streamerId}`)
  showResults.value = false
  searchQuery.value = ''
}

// Cerrar resultados al hacer click fuera
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-container')) {
    showResults.value = false
  }
}

// Manejar teclas
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    showResults.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1rem;
  background: var(--white);
  color: var(--text-color);
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 182, 193, 0.2);
}

.search-input::placeholder {
  color: var(--text-color);
  opacity: 0.6;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  opacity: 0.6;
  pointer-events: none;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1002;
  margin-top: 0.5rem;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--text-color);
  opacity: 0.7;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
}

.results-list {
  max-height: 350px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: var(--transition);
  border-bottom: 1px solid var(--border-color);
}

.result-item:hover {
  background: var(--light-gray);
}

.result-item:last-child {
  border-bottom: none;
}

.result-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-color);
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.result-bio {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.streaming-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #ff4444;
  font-weight: 500;
  margin-top: 0.25rem;
  animation: pulse 2s infinite;
}

.result-arrow {
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.5;
  flex-shrink: 0;
}

/* Scrollbar personalizada */
.results-list::-webkit-scrollbar {
  width: 6px;
}

.results-list::-webkit-scrollbar-track {
  background: var(--light-gray);
  border-radius: 3px;
}

.results-list::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}

@media (max-width: 768px) {
  .search-input {
    padding: 0.625rem 2.5rem 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .search-icon {
    right: 0.75rem;
    font-size: 1rem;
  }
  
  .result-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .result-avatar {
    width: 32px;
    height: 32px;
  }
  
  .result-name {
    font-size: 0.875rem;
  }
  
  .result-bio {
    font-size: 0.75rem;
  }
}
</style>