<template>
  <div class="notification-bell">
    <div class="bell-container" @click="toggleNotifications">
      <div class="bell-icon">🔔</div>
      <div v-if="unreadCount > 0" class="notification-badge">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </div>
    </div>
    
    <!-- Panel de notificaciones -->
    <div v-if="showNotifications" class="notifications-panel">
      <div class="panel-header">
        <h3>Notificaciones</h3>
        <button 
          v-if="notifications.length > 0" 
          @click="markAllAsRead"
          class="mark-all-read"
        >
          Marcar todas como leídas
        </button>
      </div>
      
      <div class="notifications-list">
        <div v-if="notifications.length === 0" class="no-notifications">
          <div class="no-notif-icon">📭</div>
          <p>No tienes notificaciones</p>
        </div>
        
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification-item', { 'unread': !notification.read }]"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-content">
            <div class="notification-message">
              {{ notification.message }}
            </div>
            <div class="notification-time">
              {{ formatTime(notification.createdAt) }}
            </div>
          </div>
          <div v-if="!notification.read" class="unread-dot"></div>
        </div>
      </div>
      
      <div v-if="notifications.length > 5" class="panel-footer">
        <button class="view-all-btn">Ver todas las notificaciones</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const showNotifications = ref(false)

const notifications = computed(() => {
  return authStore.getUserNotifications().slice(0, 10) // Mostrar solo las últimas 10
})

const unreadCount = computed(() => {
  return authStore.unreadNotifications
})

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAsRead = (notificationId) => {
  authStore.markNotificationAsRead(notificationId)
}

const markAllAsRead = () => {
  authStore.markAllNotificationsAsRead()
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'Ahora'
  } else if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} min`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `Hace ${hours}h`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `Hace ${days}d`
  }
}

// Cerrar panel al hacer click fuera
const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-bell')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notification-bell {
  position: relative;
}

.bell-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--white);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
}

.bell-container:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow);
  transform: scale(1.05);
}

.bell-icon {
  font-size: 1.2rem;
  transition: var(--transition);
}

.bell-container:hover .bell-icon {
  animation: bellRing 0.5s ease-in-out;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;
}

.notifications-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1003;
  margin-top: 0.5rem;
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.mark-all-read {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: var(--transition);
}

.mark-all-read:hover {
  background: var(--light-gray);
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  max-height: 350px;
}

.no-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.no-notif-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-notifications p {
  color: var(--text-color);
  opacity: 0.7;
  margin: 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: var(--transition);
}

.notification-item:hover {
  background: var(--light-gray);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.unread {
  background: rgba(255, 182, 193, 0.1);
}

.notification-content {
  flex: 1;
}

.notification-message {
  color: var(--text-color);
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.notification-time {
  color: var(--text-color);
  opacity: 0.6;
  font-size: 0.75rem;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.panel-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.view-all-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--secondary-color);
  border: none;
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.view-all-btn:hover {
  background: var(--primary-color);
}

/* Animaciones */
@keyframes bellRing {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

/* Scrollbar personalizada */
.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: var(--light-gray);
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}

@media (max-width: 768px) {
  .notifications-panel {
    width: 300px;
    right: -50px;
  }
}

@media (max-width: 480px) {
  .notifications-panel {
    width: 280px;
    right: -100px;
  }
  
  .panel-header {
    padding: 0.75rem;
  }
  
  .notification-item {
    padding: 0.75rem;
  }
  
  .notification-message {
    font-size: 0.8rem;
  }
}
</style>