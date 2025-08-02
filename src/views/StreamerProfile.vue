<template>
  <div class="streamer-profile">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading"></div>
        <p>Cargando perfil...</p>
      </div>

      <!-- Streamer Not Found -->
      <div v-else-if="!streamer" class="not-found">
        <div class="not-found-icon">😕</div>
        <h2>Streamer no encontrado</h2>
        <p>El perfil que buscas no existe o ha sido eliminado.</p>
        <router-link to="/" class="btn btn-primary">
          Volver al Inicio
        </router-link>
      </div>

      <!-- Streamer Profile -->
      <div v-else class="profile-content">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="header-background">
            <div class="background-overlay"></div>
          </div>
          
          <div class="header-content">
            <div class="profile-avatar">
              <img 
                v-if="streamer.profileImage" 
                :src="streamer.profileImage" 
                :alt="streamer.username"
                class="avatar-img"
              />
              <div v-else class="avatar-placeholder">
                {{ streamer.username.charAt(0).toUpperCase() }}
              </div>
              
              <div v-if="streamer.isStreaming" class="live-indicator">
                <span class="live-dot"></span>
                <span class="live-text">EN VIVO</span>
              </div>
            </div>
            
            <div class="profile-info">
              <h1 class="streamer-name">{{ streamer.username }}</h1>
              <div class="streamer-stats">
                <div class="stat-item">
                  <span class="stat-icon">🍫</span>
                  <span class="stat-value">{{ streamer.chococoins }}</span>
                  <span class="stat-label">ChococCoins</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">📅</span>
                  <span class="stat-value">{{ formatJoinDate(streamer.createdAt) }}</span>
                  <span class="stat-label">Miembro desde</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">🎮</span>
                  <span class="stat-value">{{ streamer.role }}</span>
                  <span class="stat-label">Rol</span>
                </div>
              </div>
            </div>
            
            <div class="profile-actions">
              <button 
                v-if="streamer.isStreaming" 
                @click="watchStream"
                class="btn btn-primary stream-btn"
              >
                🔴 Ver Stream
              </button>
              <button @click="followStreamer" class="btn btn-secondary">
                {{ isFollowing ? '💔 Dejar de Seguir' : '❤️ Seguir' }}
              </button>
              <button @click="shareProfile" class="btn btn-secondary">
                📤 Compartir
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Navigation -->
        <div class="profile-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['nav-btn', { active: activeTab === tab.id }]"
          >
            <span class="nav-icon">{{ tab.icon }}</span>
            <span class="nav-label">{{ tab.label }}</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- About Tab -->
          <div v-if="activeTab === 'about'" class="tab-panel">
            <div class="about-section">
              <div class="bio-card">
                <h3>📝 Sobre mí</h3>
                <p v-if="streamer.bio" class="bio-text">{{ streamer.bio }}</p>
                <p v-else class="no-bio">Este streamer aún no ha agregado una descripción.</p>
              </div>
              
              <div class="social-links-card">
                <h3>🔗 Enlaces</h3>
                <div class="social-links">
                  <a 
                    v-if="streamer.socialLinks.twitch" 
                    :href="streamer.socialLinks.twitch" 
                    target="_blank" 
                    class="social-link twitch"
                  >
                    <span class="social-icon">📺</span>
                    <span class="social-name">Twitch</span>
                    <span class="external-icon">↗</span>
                  </a>
                  <a 
                    v-if="streamer.socialLinks.youtube" 
                    :href="streamer.socialLinks.youtube" 
                    target="_blank" 
                    class="social-link youtube"
                  >
                    <span class="social-icon">📹</span>
                    <span class="social-name">YouTube</span>
                    <span class="external-icon">↗</span>
                  </a>
                  <a 
                    v-if="streamer.socialLinks.twitter" 
                    :href="streamer.socialLinks.twitter" 
                    target="_blank" 
                    class="social-link twitter"
                  >
                    <span class="social-icon">🐦</span>
                    <span class="social-name">Twitter</span>
                    <span class="external-icon">↗</span>
                  </a>
                  <a 
                    v-if="streamer.socialLinks.instagram" 
                    :href="streamer.socialLinks.instagram" 
                    target="_blank" 
                    class="social-link instagram"
                  >
                    <span class="social-icon">📷</span>
                    <span class="social-name">Instagram</span>
                    <span class="external-icon">↗</span>
                  </a>
                </div>
                
                <div v-if="!hasAnyLinks" class="no-links">
                  <p>Este streamer aún no ha agregado enlaces sociales.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Stream Tab -->
          <div v-if="activeTab === 'stream'" class="tab-panel">
            <div class="stream-section">
              <div v-if="streamer.isStreaming" class="live-stream-card">
                <div class="stream-header">
                  <div class="live-badge">
                    <span class="live-dot"></span>
                    <span class="live-text">EN VIVO</span>
                  </div>
                  <h3>{{ getStreamTitle() }}</h3>
                </div>
                
                <div class="stream-info">
                  <div class="stream-stats">
                    <div class="stream-stat">
                      <span class="stat-icon">👥</span>
                      <span class="stat-value">{{ getViewerCount() }}</span>
                      <span class="stat-label">Espectadores</span>
                    </div>
                    <div class="stream-stat">
                      <span class="stat-icon">⏱️</span>
                      <span class="stat-value">{{ getStreamDuration() }}</span>
                      <span class="stat-label">Duración</span>
                    </div>
                    <div class="stream-stat">
                      <span class="stat-icon">🎮</span>
                      <span class="stat-value">{{ getStreamCategory() }}</span>
                      <span class="stat-label">Categoría</span>
                    </div>
                  </div>
                  
                  <div class="stream-actions">
                    <button @click="watchStream" class="btn btn-primary">
                      📺 Ver en Twitch
                    </button>
                    <button @click="shareStream" class="btn btn-secondary">
                      📤 Compartir Stream
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-else class="offline-card">
                <div class="offline-icon">📺</div>
                <h3>Stream Offline</h3>
                <p>{{ streamer.username }} no está transmitiendo en este momento.</p>
                <button @click="notifyWhenLive" class="btn btn-secondary">
                  🔔 Notificarme cuando esté en vivo
                </button>
              </div>
              
              <!-- Recent Streams (Simulado) -->
              <div class="recent-streams">
                <h3>📼 Streams Recientes</h3>
                <div class="streams-list">
                  <div
                    v-for="stream in recentStreams"
                    :key="stream.id"
                    class="stream-item"
                  >
                    <div class="stream-thumbnail">
                      <div class="thumbnail-placeholder">
                        <span class="play-icon">▶️</span>
                      </div>
                      <div class="stream-duration">{{ stream.duration }}</div>
                    </div>
                    <div class="stream-details">
                      <h4 class="stream-title">{{ stream.title }}</h4>
                      <div class="stream-meta">
                        <span class="stream-date">{{ formatStreamDate(stream.date) }}</span>
                        <span class="stream-views">{{ stream.views }} visualizaciones</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Community Tab -->
          <div v-if="activeTab === 'community'" class="tab-panel">
            <div class="community-section">
              <div class="community-stats">
                <div class="community-card">
                  <div class="community-icon">👥</div>
                  <div class="community-info">
                    <div class="community-number">{{ getFollowerCount() }}</div>
                    <div class="community-label">Seguidores</div>
                  </div>
                </div>
                <div class="community-card">
                  <div class="community-icon">💬</div>
                  <div class="community-info">
                    <div class="community-number">{{ getChatActivity() }}</div>
                    <div class="community-label">Mensajes/día</div>
                  </div>
                </div>
                <div class="community-card">
                  <div class="community-icon">⭐</div>
                  <div class="community-info">
                    <div class="community-number">{{ getCommunityRating() }}</div>
                    <div class="community-label">Rating</div>
                  </div>
                </div>
              </div>
              
              <!-- Community Feed (Simulado) -->
              <div class="community-feed">
                <h3>💬 Actividad de la Comunidad</h3>
                <div class="feed-list">
                  <div
                    v-for="activity in communityActivity"
                    :key="activity.id"
                    class="activity-item"
                  >
                    <div class="activity-avatar">
                      <div class="activity-avatar-placeholder">
                        {{ activity.user.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                    <div class="activity-content">
                      <div class="activity-header">
                        <span class="activity-user">{{ activity.user }}</span>
                        <span class="activity-time">{{ formatActivityTime(activity.time) }}</span>
                      </div>
                      <div class="activity-message">{{ activity.message }}</div>
                    </div>
                    <div class="activity-type">{{ activity.type }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const streamer = ref(null)
const activeTab = ref('about')
const isFollowing = ref(false)

const tabs = [
  { id: 'about', label: 'Sobre mí', icon: '📝' },
  { id: 'stream', label: 'Stream', icon: '📺' },
  { id: 'community', label: 'Comunidad', icon: '👥' }
]

// Datos simulados para streams recientes
const recentStreams = ref([
  {
    id: 1,
    title: 'Gameplay épico de la tarde',
    duration: '2:34:15',
    date: new Date(Date.now() - 86400000), // Ayer
    views: 1234
  },
  {
    id: 2,
    title: 'Charlando con la comunidad',
    duration: '1:45:30',
    date: new Date(Date.now() - 172800000), // Hace 2 días
    views: 856
  },
  {
    id: 3,
    title: 'Probando nuevos juegos',
    duration: '3:12:45',
    date: new Date(Date.now() - 259200000), // Hace 3 días
    views: 2103
  }
])

// Actividad de la comunidad simulada
const communityActivity = ref([
  {
    id: 1,
    user: 'GamerFan123',
    message: '¡Excelente stream de ayer! 🎮',
    type: '💬',
    time: new Date(Date.now() - 3600000) // Hace 1 hora
  },
  {
    id: 2,
    user: 'StreamLover',
    message: 'Nuevo seguidor aquí! 👋',
    type: '❤️',
    time: new Date(Date.now() - 7200000) // Hace 2 horas
  },
  {
    id: 3,
    user: 'ProPlayer99',
    message: 'Ese clutch estuvo increíble',
    type: '⭐',
    time: new Date(Date.now() - 10800000) // Hace 3 horas
  }
])

const hasAnyLinks = computed(() => {
  if (!streamer.value) return false
  const links = streamer.value.socialLinks
  return links.twitch || links.youtube || links.twitter || links.instagram
})

const formatJoinDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  })
}

const formatStreamDate = (date) => {
  const now = new Date()
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Ayer'
  return `Hace ${diffInDays} días`
}

const formatActivityTime = (date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  const diffInDays = Math.floor(diffInHours / 24)
  return `Hace ${diffInDays}d`
}

const getStreamTitle = () => {
  const titles = [
    'Stream épico de la noche',
    'Jugando con la comunidad',
    'Probando nuevos juegos',
    'Charlando y gaming',
    'Competitivo hasta tarde'
  ]
  return titles[Math.floor(Math.random() * titles.length)]
}

const getViewerCount = () => {
  return Math.floor(Math.random() * 500) + 50
}

const getStreamDuration = () => {
  const hours = Math.floor(Math.random() * 4) + 1
  const minutes = Math.floor(Math.random() * 60)
  return `${hours}:${minutes.toString().padStart(2, '0')}:00`
}

const getStreamCategory = () => {
  const categories = ['Just Chatting', 'Valorant', 'League of Legends', 'Minecraft', 'Variety']
  return categories[Math.floor(Math.random() * categories.length)]
}

const getFollowerCount = () => {
  return Math.floor(Math.random() * 10000) + 500
}

const getChatActivity = () => {
  return Math.floor(Math.random() * 1000) + 100
}

const getCommunityRating = () => {
  return (Math.random() * 2 + 3).toFixed(1) // Entre 3.0 y 5.0
}

const watchStream = () => {
  if (streamer.value?.socialLinks?.twitch) {
    window.open(streamer.value.socialLinks.twitch, '_blank')
  } else {
    window.showToast?.('Enlace de Twitch no disponible', 'warning')
  }
}

const followStreamer = () => {
  isFollowing.value = !isFollowing.value
  const action = isFollowing.value ? 'siguiendo' : 'dejaste de seguir'
  window.showToast?.(`Ahora ${action} a ${streamer.value.username}`, 'success')
}

const shareProfile = async () => {
  const url = window.location.href
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Perfil de ${streamer.value.username} - CAK Streamers`,
        text: `Mira el perfil de ${streamer.value.username} en CAK Streamers`,
        url: url
      })
    } catch (error) {
      // Fallback to clipboard
      copyToClipboard(url)
    }
  } else {
    copyToClipboard(url)
  }
}

const shareStream = async () => {
  const url = streamer.value?.socialLinks?.twitch || window.location.href
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${streamer.value.username} está en vivo!`,
        text: `¡${streamer.value.username} está transmitiendo en vivo! Únete ahora.`,
        url: url
      })
    } catch (error) {
      copyToClipboard(url)
    }
  } else {
    copyToClipboard(url)
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    window.showToast?.('Enlace copiado al portapapeles', 'success')
  } catch (error) {
    window.showToast?.('No se pudo copiar el enlace', 'error')
  }
}

const notifyWhenLive = () => {
  if (!authStore.isLoggedIn) {
    window.showToast?.('Inicia sesión para recibir notificaciones', 'warning')
    return
  }
  
  window.showToast?.(`Te notificaremos cuando ${streamer.value.username} esté en vivo`, 'success')
}

onMounted(async () => {
  const streamerId = route.params.id
  
  // Simular carga
  setTimeout(() => {
    streamer.value = authStore.getStreamerById(streamerId)
    loading.value = false
    
    if (!streamer.value) {
      window.showToast?.('Streamer no encontrado', 'error')
    }
  }, 800)
})
</script>

<style scoped>
.streamer-profile {
  min-height: calc(100vh - 140px);
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

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found h2 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.not-found p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 2rem;
}

.profile-content {
  width: 100%;
}

.profile-header {
  position: relative;
  margin-bottom: 2rem;
}

.header-background {
  height: 200px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: var(--border-radius);
  position: relative;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.header-content {
  position: absolute;
  bottom: -50px;
  left: 2rem;
  right: 2rem;
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  flex-wrap: wrap;
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-img,
.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--white);
  box-shadow: var(--shadow);
}

.avatar-img {
  object-fit: cover;
}

.avatar-placeholder {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 3rem;
  color: var(--text-color);
}

.live-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
  animation: pulse 2s infinite;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: blink 1s infinite;
}

.profile-info {
  flex: 1;
  min-width: 300px;
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.streamer-name {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.streamer-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1.1rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  text-transform: capitalize;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 200px;
}

.stream-btn {
  background: linear-gradient(135deg, #ff4444, #ff6b6b);
  animation: pulse 2s infinite;
}

.profile-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: var(--white);
  padding: 0.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow-x: auto;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-color);
  font-weight: 500;
  white-space: nowrap;
}

.nav-btn:hover {
  background: var(--light-gray);
}

.nav-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: var(--text-color);
  box-shadow: var(--shadow);
}

.nav-icon {
  font-size: 1.2rem;
}

.tab-content {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  min-height: 400px;
}

.tab-panel {
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
}

.about-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.bio-card,
.social-links-card {
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.bio-card h3,
.social-links-card h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.bio-text {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 0;
}

.no-bio,
.no-links p {
  color: var(--text-color);
  opacity: 0.7;
  font-style: italic;
  margin-bottom: 0;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.social-link.twitch:hover {
  border-color: #9146ff;
}

.social-link.youtube:hover {
  border-color: #ff0000;
}

.social-link.twitter:hover {
  border-color: #1da1f2;
}

.social-link.instagram:hover {
  border-color: #e4405f;
}

.social-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.social-name {
  flex: 1;
  font-weight: 500;
}

.external-icon {
  opacity: 0.5;
  font-size: 0.9rem;
}

.stream-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.live-stream-card,
.offline-card {
  background: var(--light-gray);
  padding: 2rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  text-align: center;
}

.stream-header {
  margin-bottom: 1.5rem;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ff4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

.stream-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stream-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stream-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stream-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.offline-card {
  padding: 3rem 2rem;
}

.offline-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.recent-streams {
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.recent-streams h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.streams-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stream-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--white);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.stream-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.stream-thumbnail {
  position: relative;
  width: 120px;
  height: 68px;
  flex-shrink: 0;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background: var(--light-gray);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
}

.play-icon {
  font-size: 1.5rem;
  opacity: 0.7;
}

.stream-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
}

.stream-details {
  flex: 1;
}

.stream-title {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.stream-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.community-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.community-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.community-card {
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.community-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.community-info {
  flex: 1;
}

.community-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.community-label {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-top: 0.25rem;
}

.community-feed {
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.community-feed h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--white);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.activity-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.activity-avatar {
  flex-shrink: 0;
}

.activity-avatar-placeholder {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-color);
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.activity-user {
  font-weight: 600;
  color: var(--text-color);
}

.activity-time {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.6;
}

.activity-message {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.4;
}

.activity-type {
  font-size: 1.2rem;
  flex-shrink: 0;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    bottom: -80px;
    left: 1rem;
    right: 1rem;
  }

  .profile-info {
    min-width: auto;
    width: 100%;
  }

  .streamer-stats {
    justify-content: center;
  }

  .profile-actions {
    width: 100%;
    max-width: 300px;
  }

  .profile-nav {
    margin-top: 3rem;
  }

  .about-section {
    grid-template-columns: 1fr;
  }

  .stream-stats {
    gap: 1rem;
  }

  .stream-actions {
    flex-direction: column;
    align-items: center;
  }

  .community-stats {
    grid-template-columns: 1fr;
  }

  .community-card {
    flex-direction: column;
    text-align: center;
  }

  .stream-item {
    flex-direction: column;
    gap: 0.75rem;
  }

  .stream-thumbnail {
    width: 100%;
    height: 120px;
  }

  .activity-item {
    flex-direction: column;
    gap: 0.75rem;
  }

  .activity-header {
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .tab-panel {
    padding: 1rem;
  }

  .header-content {
    bottom: -100px;
  }

  .profile-nav {
    margin-top: 4rem;
  }

  .avatar-img,
  .avatar-placeholder {
    width: 100px;
    height: 100px;
  }

  .avatar-placeholder {
    font-size: 2.5rem;
  }

  .streamer-name {
    font-size: 1.5rem;
  }

  .nav-btn {
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-label {
    font-size: 0.8rem;
  }
}
</style>