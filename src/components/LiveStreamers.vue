<template>
  <div class="live-streamers">
    <div class="section-header">
      <h2>🔴 En Vivo Ahora</h2>
      <p>Nuestros streamers están transmitiendo</p>
      <button @click="refreshStreams" class="refresh-btn" :disabled="loading">
        <span v-if="loading" class="loading"></span>
        {{ loading ? 'Actualizando...' : '🔄 Actualizar' }}
      </button>
    </div>
    
    <div v-if="loading && liveStreamers.length === 0" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando streamers en vivo...</p>
    </div>
    
    <div v-else-if="liveStreamers.length === 0" class="no-live">
      <div class="no-live-icon">📺</div>
      <h3>No hay streamers en vivo</h3>
      <p>¡Vuelve más tarde para ver a nuestros streamers favoritos!</p>
    </div>
    
    <div v-else class="streamers-grid">
      <div
        v-for="streamer in liveStreamers"
        :key="streamer.id"
        class="live-card"
        @click="openStream(streamer)"
      >
        <div class="stream-thumbnail">
          <img :src="streamer.thumbnail" :alt="streamer.title" />
          <div class="live-badge">🔴 EN VIVO</div>
          <div class="viewer-count">
            <span class="viewer-icon">👁️</span>
            {{ formatViewers(streamer.viewers) }}
          </div>
          <div class="stream-duration">{{ getStreamDuration(streamer.startedAt) }}</div>
        </div>
        
        <div class="stream-info">
          <div class="streamer-header">
            <img :src="streamer.profileImage" :alt="streamer.displayName" class="streamer-avatar" />
            <div class="streamer-details">
              <h4 class="streamer-name">{{ streamer.displayName }}</h4>
              <span class="game-name">{{ streamer.game || 'Just Chatting' }}</span>
            </div>
          </div>
          
          <h3 class="stream-title">{{ streamer.title }}</h3>
          
          <div class="stream-meta">
            <span class="language">{{ streamer.language?.toUpperCase() || 'ES' }}</span>
            <span class="viewers-text">{{ formatViewers(streamer.viewers) }} viewers</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="last-updated" v-if="lastUpdated">
      <small>Última actualización: {{ formatLastUpdated(lastUpdated) }}</small>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import twitchApi from '../services/twitchApi.js'

const liveStreamers = ref([])
const loading = ref(false)
const lastUpdated = ref(null)
let updateInterval = null

const loadLiveStreamers = async () => {
  loading.value = true
  try {
    const streamers = await twitchApi.getCAKLiveStreamers()
    liveStreamers.value = streamers
    lastUpdated.value = new Date()
  } catch (error) {
    console.error('Error loading live streamers:', error)
    window.showToast?.('Error al cargar streamers en vivo', 'error')
  } finally {
    loading.value = false
  }
}

const refreshStreams = () => {
  loadLiveStreamers()
}

const formatViewers = (count) => {
  return twitchApi.formatViewerCount(count)
}

const getStreamDuration = (startedAt) => {
  return twitchApi.getStreamDuration(startedAt)
}

const formatLastUpdated = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'hace un momento'
  if (minutes === 1) return 'hace 1 minuto'
  if (minutes < 60) return `hace ${minutes} minutos`
  
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return 'hace 1 hora'
  return `hace ${hours} horas`
}

const openStream = (streamer) => {
  const streamUrl = twitchApi.getStreamUrl(streamer.username)
  window.open(streamUrl, '_blank')
}

onMounted(() => {
  loadLiveStreamers()
  
  // Actualizar cada 2 minutos
  updateInterval = setInterval(loadLiveStreamers, 120000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.live-streamers {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.section-header p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.refresh-btn {
  background: var(--primary-color);
  color: var(--text-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.refresh-btn:hover:not(:disabled) {
  background: var(--accent-color);
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-color);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.no-live {
  text-align: center;
  padding: 3rem;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.no-live-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-live h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.no-live p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.streamers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.live-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.live-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

.stream-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.stream-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.live-card:hover .stream-thumbnail img {
  transform: scale(1.05);
}

.live-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: #ff0000;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.viewer-count {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stream-duration {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.stream-info {
  padding: 1rem;
}

.streamer-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.streamer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-color);
}

.streamer-details {
  flex: 1;
}

.streamer-name {
  color: var(--text-color);
  margin-bottom: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
}

.game-name {
  color: var(--primary-color);
  font-size: 0.8rem;
  font-weight: 500;
}

.stream-title {
  color: var(--text-color);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stream-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.7;
}

.language {
  background: var(--light-gray);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.last-updated {
  text-align: center;
  margin-top: 1rem;
  color: var(--text-color);
  opacity: 0.6;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .streamers-grid {
    grid-template-columns: 1fr;
  }
  
  .stream-thumbnail {
    height: 180px;
  }
  
  .stream-info {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .streamers-grid {
    gap: 1rem;
  }
  
  .stream-thumbnail {
    height: 160px;
  }
  
  .live-card {
    margin: 0 -0.5rem;
  }
}
</style>