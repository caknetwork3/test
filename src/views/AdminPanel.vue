<template>
  <div class="admin-panel">
    <div class="container">
      <!-- Header del Admin -->
      <div class="admin-header">
        <div class="admin-title">
          <h1>⚙️ Panel de Administración</h1>
          <p>Gestiona usuarios, ChococCoins y notificaciones</p>
        </div>
        <div class="admin-info">
          <div class="admin-badge">
            <span class="badge-icon">👑</span>
            <span class="badge-text">Administrador</span>
          </div>
          <div class="admin-name">{{ authStore.user.username }}</div>
        </div>
      </div>

      <!-- Estadísticas Rápidas -->
      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalUsers }}</div>
            <div class="stat-label">Usuarios Totales</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎮</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalStreamers }}</div>
            <div class="stat-label">Streamers</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🍫</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalChococoins }}</div>
            <div class="stat-label">ChococCoins Total</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔴</div>
          <div class="stat-content">
            <div class="stat-number">{{ liveStreamers }}</div>
            <div class="stat-label">En Vivo</div>
          </div>
        </div>
      </div>

      <!-- Pestañas de Administración -->
      <div class="admin-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Contenido de las Pestañas -->
      <div class="tab-content">
        <!-- Gestión de Usuarios -->
        <div v-if="activeTab === 'users'" class="tab-panel">
          <UserManagement />
        </div>

        <!-- Gestión de ChococCoins -->
        <div v-if="activeTab === 'coins'" class="tab-panel">
          <CoinManagement />
        </div>

        <!-- Envío de Notificaciones -->
        <div v-if="activeTab === 'notifications'" class="tab-panel">
          <NotificationSender />
        </div>

        <!-- Configuración del Sistema -->
        <div v-if="activeTab === 'settings'" class="tab-panel">
          <SystemSettings />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import UserManagement from '../components/admin/UserManagement.vue'
import CoinManagement from '../components/admin/CoinManagement.vue'
import NotificationSender from '../components/admin/NotificationSender.vue'
import SystemSettings from '../components/admin/SystemSettings.vue'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('users')

const tabs = [
  { id: 'users', label: 'Usuarios', icon: '👥' },
  { id: 'coins', label: 'ChococCoins', icon: '🍫' },
  { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
  { id: 'settings', label: 'Configuración', icon: '⚙️' }
]

const totalUsers = computed(() => {
  return authStore.users.filter(u => u.role !== 'admin').length
})

const totalStreamers = computed(() => {
  return authStore.users.filter(u => u.role === 'streamer').length
})

const totalChococoins = computed(() => {
  return authStore.users.reduce((total, user) => total + (user.chococoins || 0), 0)
})

const liveStreamers = computed(() => {
  return authStore.users.filter(u => u.role === 'streamer' && u.isStreaming).length
})

onMounted(() => {
  // Verificar que el usuario sea admin
  if (!authStore.isAdmin) {
    window.showToast?.('No tienes permisos de administrador', 'error')
    router.push('/')
    return
  }
  
  window.showToast?.('Bienvenido al panel de administración', 'success')
})
</script>

<style scoped>
.admin-panel {
  padding: 2rem 0;
  min-height: calc(100vh - 140px);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: var(--border-radius);
  color: var(--text-color);
}

.admin-title h1 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-title p {
  opacity: 0.9;
  font-size: 1.1rem;
  margin-bottom: 0;
}

.admin-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.admin-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--white);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: var(--shadow);
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-text {
  font-weight: 600;
  color: var(--text-color);
}

.admin-name {
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.9;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  border: 1px solid var(--border-color);
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

.admin-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: var(--white);
  padding: 0.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow-x: auto;
}

.tab-btn {
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

.tab-btn:hover {
  background: var(--light-gray);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: var(--text-color);
  box-shadow: var(--shadow);
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-label {
  font-size: 1rem;
}

.tab-content {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  min-height: 500px;
}

.tab-panel {
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
}

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

@media (max-width: 768px) {
  .admin-panel {
    padding: 1rem 0;
  }
  
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1.5rem;
  }
  
  .admin-title h1 {
    font-size: 1.8rem;
  }
  
  .admin-info {
    align-items: center;
  }
  
  .admin-stats {
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
  
  .admin-tabs {
    gap: 0.25rem;
    padding: 0.25rem;
  }
  
  .tab-btn {
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .tab-label {
    font-size: 0.8rem;
  }
  
  .tab-panel {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .admin-stats {
    grid-template-columns: 1fr 1fr;
  }
  
  .tab-btn {
    padding: 0.5rem;
  }
  
  .tab-icon {
    font-size: 1rem;
  }
  
  .tab-label {
    font-size: 0.7rem;
  }
}
</style>