<template>
  <div class="streamer-card" @click="$emit('click')">
    <div class="card-header">
      <div class="avatar-container">
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
      
      <div class="streamer-info">
        <h3 class="streamer-name">{{ streamer.username }}</h3>
        <div class="streamer-stats">
          <div class="stat-item">
            <span class="stat-icon">🍫</span>
            <span class="stat-value">{{ streamer.chococoins }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📅</span>
            <span class="stat-value">{{ formatDate(streamer.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card-body">
      <p class="streamer-bio">
        {{ streamer.bio || 'Este streamer aún no ha agregado una descripción.' }}
      </p>
    </div>
    
    <div class="card-footer">
      <div class="social-links">
        <a 
          v-if="streamer.socialLinks.twitch" 
          :href="streamer.socialLinks.twitch" 
          target="_blank" 
          class="social-link twitch"
          @click.stop
        >
          <span class="social-icon">📺</span>
          <span class="social-label">Twitch</span>
        </a>
        <a 
          v-if="streamer.socialLinks.youtube" 
          :href="streamer.socialLinks.youtube" 
          target="_blank" 
          class="social-link youtube"
          @click.stop
        >
          <span class="social-icon">📹</span>
          <span class="social-label">YouTube</span>
        </a>
        <a 
          v-if="streamer.socialLinks.twitter" 
          :href="streamer.socialLinks.twitter" 
          target="_blank" 
          class="social-link twitter"
          @click.stop
        >
          <span class="social-icon">🐦</span>
          <span class="social-label">Twitter</span>
        </a>
        <a 
          v-if="streamer.socialLinks.instagram" 
          :href="streamer.socialLinks.instagram" 
          target="_blank" 
          class="social-link instagram"
          @click.stop
        >
          <span class="social-icon">📷</span>
          <span class="social-label">Instagram</span>
        </a>
      </div>
      
      <button class="view-profile-btn">
        Ver Perfil
        <span class="btn-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  streamer: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Hoy'
  } else if (diffInDays === 1) {
    return 'Ayer'
  } else if (diffInDays < 30) {
    return `Hace ${diffInDays} días`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `Hace ${years} ${years === 1 ? 'año' : 'años'}`
  }
}
</script>

<style scoped>
.streamer-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.streamer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar-img,
.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  flex-shrink: 0;
}

.avatar-img {
  object-fit: cover;
  border: 3px solid var(--border-color);
}

.avatar-placeholder {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--text-color);
  border: 3px solid var(--border-color);
}

.live-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
  animation: pulse 2s infinite;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: blink 1s infinite;
}

.live-text {
  font-size: 0.65rem;
  letter-spacing: 0.5px;
}

.streamer-info {
  flex: 1;
}

.streamer-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.streamer-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.stat-icon {
  font-size: 1rem;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
}

.streamer-bio {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.5;
  margin-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--light-gray);
}

.social-links {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.75rem;
  font-weight: 500;
  transition: var(--transition);
}

.social-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.social-link.twitch:hover {
  border-color: #9146ff;
  background: rgba(145, 70, 255, 0.1);
}

.social-link.youtube:hover {
  border-color: #ff0000;
  background: rgba(255, 0, 0, 0.1);
}

.social-link.twitter:hover {
  border-color: #1da1f2;
  background: rgba(29, 161, 242, 0.1);
}

.social-link.instagram:hover {
  border-color: #e4405f;
  background: rgba(228, 64, 95, 0.1);
}

.social-icon {
  font-size: 0.875rem;
}

.social-label {
  font-size: 0.7rem;
}

.view-profile-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border: none;
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.view-profile-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-arrow {
  transition: var(--transition);
}

.view-profile-btn:hover .btn-arrow {
  transform: translateX(2px);
}

/* Animaciones */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

@media (max-width: 768px) {
  .card-header,
  .card-body,
  .card-footer {
    padding: 1rem;
  }
  
  .avatar-img,
  .avatar-placeholder {
    width: 50px;
    height: 50px;
  }
  
  .avatar-placeholder {
    font-size: 1.2rem;
  }
  
  .streamer-name {
    font-size: 1.1rem;
  }
  
  .streamer-stats {
    gap: 0.75rem;
  }
  
  .stat-item {
    font-size: 0.8rem;
  }
  
  .social-links {
    gap: 0.375rem;
  }
  
  .social-link {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .avatar-container {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .streamer-stats {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>