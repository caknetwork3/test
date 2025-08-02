<template>
  <div class="home-page">
    <div class="container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Bienvenido a <span class="brand-highlight">CAK</span>
          </h1>
          <p class="hero-subtitle">
            La plataforma oficial de streamers de la agencia CAK
          </p>
          <div v-if="!authStore.isLoggedIn" class="hero-actions">
            <router-link to="/register" class="btn btn-primary">
              Únete Ahora
            </router-link>
            <router-link to="/about" class="btn btn-secondary">
              Conoce más sobre CAK
            </router-link>
          </div>
          <div v-else class="welcome-message">
            <h2>¡Hola, {{ authStore.user.username }}! 👋</h2>
            <p>Explora a nuestros streamers y mantente al día con las transmisiones en vivo</p>
          </div>
        </div>
      </section>

      <!-- Streamers en Vivo -->
      <section class="live-section">
        <div class="section-header">
          <h2>🔴 Streamers en Vivo</h2>
          <p>Descubre quién está transmitiendo ahora mismo</p>
        </div>
        <LiveStreamers />
      </section>

      <!-- Grid de Streamers -->
      <section class="streamers-section">
        <div class="section-header">
          <h2>🎮 Nuestros Streamers</h2>
          <p>Conoce a la increíble comunidad de streamers de CAK</p>
        </div>
        <StreamerGrid />
      </section>

      <!-- Estadísticas -->
      <section v-if="authStore.isLoggedIn" class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🍫</div>
            <div class="stat-content">
              <div class="stat-number">{{ authStore.userBalance }}</div>
              <div class="stat-label">ChococCoins</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-number">{{ totalStreamers }}</div>
              <div class="stat-label">Streamers</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔴</div>
            <div class="stat-content">
              <div class="stat-number">{{ liveStreamers }}</div>
              <div class="stat-label">En Vivo</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔔</div>
            <div class="stat-content">
              <div class="stat-number">{{ authStore.unreadNotifications }}</div>
              <div class="stat-label">Notificaciones</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Información sobre CAK -->
      <section class="info-section">
        <div class="info-content">
          <div class="info-text">
            <h2>¿Qué es CAK?</h2>
            <p>
              CAK es una agencia de streamers dedicada a apoyar y promover el talento 
              en el mundo del streaming. Ofrecemos una plataforma donde nuestros 
              streamers pueden conectar con su audiencia y crecer juntos.
            </p>
            <router-link to="/about" class="btn btn-primary">
              Conoce más sobre nosotros
            </router-link>
          </div>
          <div class="info-visual">
            <div class="feature-grid">
              <div class="feature-item">
                <div class="feature-icon">🎯</div>
                <h4>Misión</h4>
                <p>Impulsar el crecimiento de streamers talentosos</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🌟</div>
                <h4>Visión</h4>
                <p>Ser la agencia líder en el mundo del streaming</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🤝</div>
                <h4>Valores</h4>
                <p>Comunidad, calidad y crecimiento conjunto</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🚀</div>
                <h4>Futuro</h4>
                <p>Innovación constante en entretenimiento digital</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import StreamerGrid from '../components/StreamerGrid.vue'
import LiveStreamers from '../components/LiveStreamers.vue'

const authStore = useAuthStore()

const totalStreamers = computed(() => {
  return authStore.users.filter(u => u.role === 'streamer').length
})

const liveStreamers = computed(() => {
  return authStore.users.filter(u => u.role === 'streamer' && u.isStreaming).length
})

onMounted(() => {
  // Simular algunos streamers en vivo para demo
  if (authStore.users.length > 1) {
    const streamers = authStore.users.filter(u => u.role === 'streamer')
    if (streamers.length > 0) {
      // Hacer que algunos streamers estén "en vivo" aleatoriamente
      streamers.forEach((streamer, index) => {
        if (Math.random() > 0.7) { // 30% de probabilidad de estar en vivo
          streamer.isStreaming = true
        }
      })
      authStore.saveUsers()
    }
  }
})
</script>

<style scoped>
.home-page {
  padding-bottom: 2rem;
}

.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 50%, var(--secondary-color) 100%);
  padding: 4rem 0;
  margin-bottom: 4rem;
  border-radius: var(--border-radius);
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-highlight {
  background: linear-gradient(135deg, var(--white), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--text-color);
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.welcome-message {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-top: 2rem;
}

.welcome-message h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.welcome-message p {
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.2rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.section-header p {
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.live-section,
.streamers-section {
  margin-bottom: 4rem;
}

.stats-section {
  margin-bottom: 4rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-top: 0.25rem;
}

.info-section {
  background: linear-gradient(135deg, var(--white) 0%, var(--light-gray) 100%);
  padding: 4rem 2rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
}

.info-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.info-text h2 {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.info-text p {
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.feature-item {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  text-align: center;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.feature-item h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.feature-item p {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.875rem;
  margin-bottom: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .info-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 0;
  }
  
  .hero-content {
    padding: 0 1rem;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .info-section {
    padding: 2rem 1rem;
  }
  
  .welcome-message {
    padding: 1.5rem;
  }
}
</style>