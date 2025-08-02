<template>
  <div class="notification-sender">
    <div class="sender-header">
      <h2>🔔 Envío de Notificaciones</h2>
      <p>Envía notificaciones personalizadas a tus usuarios</p>
    </div>

    <!-- Formulario de Envío -->
    <div class="notification-form-section">
      <div class="form-container">
        <form @submit.prevent="sendNotification" class="notification-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tipo de Notificación</label>
              <select v-model="notificationForm.type" class="form-input">
                <option value="info">📢 Información</option>
                <option value="success">✅ Éxito</option>
                <option value="warning">⚠️ Advertencia</option>
                <option value="error">❌ Error</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Destinatarios</label>
              <select v-model="notificationForm.target" class="form-input">
                <option value="all">Todos los usuarios</option>
                <option value="streamers">Solo streamers</option>
                <option value="specific">Usuarios específicos</option>
              </select>
            </div>
          </div>

          <!-- Selección de usuarios específicos -->
          <div v-if="notificationForm.target === 'specific'" class="form-group">
            <label class="form-label">Seleccionar Usuarios</label>
            <div class="users-selection">
              <div
                v-for="user in availableUsers"
                :key="user.id"
                class="user-checkbox"
              >
                <label class="checkbox-label">
                  <input
                    v-model="selectedUsers"
                    :value="user.id"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="user-info">
                    <div class="user-avatar">
                      <img 
                        v-if="user.profileImage" 
                        :src="user.profileImage" 
                        :alt="user.username"
                        class="avatar-img"
                      />
                      <div v-else class="avatar-placeholder">
                        {{ user.username.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                    <span class="username">{{ user.username }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mensaje</label>
            <textarea
              v-model="notificationForm.message"
              class="form-textarea"
              placeholder="Escribe tu mensaje aquí..."
              rows="4"
              required
            ></textarea>
            <div class="character-count">
              {{ notificationForm.message.length }}/500 caracteres
            </div>
          </div>

          <!-- Plantillas Predefinidas -->
          <div class="templates-section">
            <label class="form-label">Plantillas Rápidas</label>
            <div class="templates-grid">
              <button
                v-for="template in templates"
                :key="template.id"
                type="button"
                @click="useTemplate(template)"
                class="template-btn"
              >
                <span class="template-icon">{{ template.icon }}</span>
                <span class="template-name">{{ template.name }}</span>
              </button>
            </div>
          </div>

          <!-- Vista Previa -->
          <div class="preview-section">
            <label class="form-label">Vista Previa</label>
            <div class="notification-preview" :class="`preview-${notificationForm.type}`">
              <div class="preview-icon">
                {{ getNotificationIcon(notificationForm.type) }}
              </div>
              <div class="preview-content">
                <div class="preview-message">
                  {{ notificationForm.message || 'Tu mensaje aparecerá aquí...' }}
                </div>
                <div class="preview-time">Ahora</div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="resetForm"
              class="btn btn-secondary"
            >
              Limpiar
            </button>
            <button
              type="submit"
              :disabled="!canSend"
              class="btn btn-primary"
            >
              <span v-if="sending" class="loading"></span>
              {{ sending ? 'Enviando...' : 'Enviar Notificación' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Estadísticas de Envío -->
    <div class="stats-section">
      <h3>📊 Estadísticas de Envío</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📤</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalSent }}</div>
            <div class="stat-label">Notificaciones Enviadas</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalRecipients }}</div>
            <div class="stat-label">Usuarios Alcanzados</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-number">{{ todaySent }}</div>
            <div class="stat-label">Enviadas Hoy</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <div class="stat-content">
            <div class="stat-number">{{ lastSentTime }}</div>
            <div class="stat-label">Último Envío</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Notificaciones -->
    <div class="history-section">
      <div class="history-header">
        <h3>📋 Historial de Notificaciones</h3>
        <button @click="clearHistory" class="btn btn-secondary btn-small">
          🗑️ Limpiar Historial
        </button>
      </div>

      <div class="history-list">
        <div v-if="notificationHistory.length === 0" class="no-history">
          <div class="no-history-icon">📭</div>
          <p>No hay notificaciones en el historial</p>
        </div>

        <div
          v-for="notification in notificationHistory"
          :key="notification.id"
          class="history-item"
        >
          <div class="history-icon" :class="`icon-${notification.type}`">
            {{ getNotificationIcon(notification.type) }}
          </div>
          
          <div class="history-content">
            <div class="history-message">{{ notification.message }}</div>
            <div class="history-meta">
              <span class="history-time">{{ formatHistoryTime(notification.timestamp) }}</span>
              <span class="history-recipients">
                {{ getRecipientText(notification.targetUsers) }}
              </span>
            </div>
          </div>

          <div class="history-actions">
            <button
              @click="resendNotification(notification)"
              class="action-btn resend-btn"
              title="Reenviar"
            >
              🔄
            </button>
            <button
              @click="deleteFromHistory(notification.id)"
              class="action-btn delete-btn"
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const sending = ref(false)
const selectedUsers = ref([])
const notificationHistory = ref([])

const notificationForm = reactive({
  type: 'info',
  target: 'all',
  message: ''
})

const templates = [
  {
    id: 1,
    name: 'Bienvenida',
    icon: '👋',
    type: 'success',
    message: '¡Bienvenido a la comunidad CAK! Esperamos que disfrutes tu experiencia con nosotros.'
  },
  {
    id: 2,
    name: 'Mantenimiento',
    icon: '🔧',
    type: 'warning',
    message: 'Realizaremos mantenimiento programado el próximo domingo de 2:00 AM a 4:00 AM. Disculpa las molestias.'
  },
  {
    id: 3,
    name: 'Evento Especial',
    icon: '🎉',
    type: 'info',
    message: '¡Evento especial este fin de semana! Únete a nuestros streamers para contenido exclusivo y premios.'
  },
  {
    id: 4,
    name: 'Actualización',
    icon: '🆕',
    type: 'info',
    message: 'Nueva actualización disponible con mejoras y nuevas características. ¡Descúbrelas ahora!'
  },
  {
    id: 5,
    name: 'ChococCoins',
    icon: '🍫',
    type: 'success',
    message: '¡Has recibido ChococCoins! Úsalos para interactuar más con tus streamers favoritos.'
  },
  {
    id: 6,
    name: 'Stream Alert',
    icon: '🔴',
    type: 'info',
    message: '¡Tu streamer favorito está en vivo! No te pierdas la acción.'
  }
]

const availableUsers = computed(() => {
  return authStore.getAllUsers()
})

const canSend = computed(() => {
  if (!notificationForm.message.trim()) return false
  if (notificationForm.target === 'specific' && selectedUsers.value.length === 0) return false
  return true
})

const totalSent = computed(() => {
  return notificationHistory.value.length
})

const totalRecipients = computed(() => {
  return notificationHistory.value.reduce((total, notification) => {
    if (notification.targetUsers === 'all') {
      return total + authStore.getAllUsers().length
    } else if (Array.isArray(notification.targetUsers)) {
      return total + notification.targetUsers.length
    }
    return total
  }, 0)
})

const todaySent = computed(() => {
  const today = new Date().toDateString()
  return notificationHistory.value.filter(notification => 
    new Date(notification.timestamp).toDateString() === today
  ).length
})

const lastSentTime = computed(() => {
  if (notificationHistory.value.length === 0) return 'Nunca'
  const lastNotification = notificationHistory.value[0]
  return formatHistoryTime(lastNotification.timestamp)
})

const getNotificationIcon = (type) => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }
  return icons[type] || icons.info
}

const useTemplate = (template) => {
  notificationForm.type = template.type
  notificationForm.message = template.message
}

const sendNotification = async () => {
  if (!canSend.value) return
  
  sending.value = true
  
  try {
    let targetUsers = 'all'
    
    if (notificationForm.target === 'streamers') {
      targetUsers = authStore.users
        .filter(u => u.role === 'streamer')
        .map(u => u.id)
    } else if (notificationForm.target === 'specific') {
      targetUsers = [...selectedUsers.value]
    }
    
    // Enviar notificación
    authStore.addNotification({
      message: notificationForm.message,
      type: notificationForm.type,
      targetUsers: targetUsers
    })
    
    // Agregar al historial
    const historyItem = {
      id: Date.now(),
      message: notificationForm.message,
      type: notificationForm.type,
      targetUsers: targetUsers,
      timestamp: new Date().toISOString()
    }
    
    notificationHistory.value.unshift(historyItem)
    
    // Mostrar mensaje de éxito
    const recipientCount = targetUsers === 'all' 
      ? authStore.getAllUsers().length 
      : Array.isArray(targetUsers) 
        ? targetUsers.length 
        : authStore.users.filter(u => u.role === 'streamer').length
    
    window.showToast?.(`Notificación enviada a ${recipientCount} usuario${recipientCount !== 1 ? 's' : ''}`, 'success')
    
    // Limpiar formulario
    resetForm()
    
  } catch (error) {
    window.showToast?.('Error al enviar la notificación', 'error')
  } finally {
    sending.value = false
  }
}

const resetForm = () => {
  notificationForm.type = 'info'
  notificationForm.target = 'all'
  notificationForm.message = ''
  selectedUsers.value = []
}

const resendNotification = (notification) => {
  notificationForm.type = notification.type
  notificationForm.message = notification.message
  
  if (notification.targetUsers === 'all') {
    notificationForm.target = 'all'
  } else if (Array.isArray(notification.targetUsers)) {
    notificationForm.target = 'specific'
    selectedUsers.value = [...notification.targetUsers]
  } else {
    notificationForm.target = 'streamers'
  }
  
  window.showToast?.('Notificación cargada para reenvío', 'info')
}

const deleteFromHistory = (notificationId) => {
  const index = notificationHistory.value.findIndex(n => n.id === notificationId)
  if (index > -1) {
    notificationHistory.value.splice(index, 1)
    window.showToast?.('Notificación eliminada del historial', 'success')
  }
}

const clearHistory = () => {
  if (confirm('¿Estás seguro de que quieres limpiar todo el historial?')) {
    notificationHistory.value = []
    window.showToast?.('Historial limpiado', 'success')
  }
}

const formatHistoryTime = (timestamp) => {
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

const getRecipientText = (targetUsers) => {
  if (targetUsers === 'all') {
    return 'Todos los usuarios'
  } else if (Array.isArray(targetUsers)) {
    return `${targetUsers.length} usuario${targetUsers.length !== 1 ? 's' : ''} específico${targetUsers.length !== 1 ? 's' : ''}`
  } else {
    return 'Streamers'
  }
}

onMounted(() => {
  // Cargar historial desde localStorage si existe
  const savedHistory = localStorage.getItem('cak_notification_history')
  if (savedHistory) {
    notificationHistory.value = JSON.parse(savedHistory)
  }
  
  // Guardar historial cuando cambie
  const saveHistory = () => {
    localStorage.setItem('cak_notification_history', JSON.stringify(notificationHistory.value))
  }
  
  // Observar cambios en el historial
  const originalPush = notificationHistory.value.push
  const originalSplice = notificationHistory.value.splice
  
  notificationHistory.value.push = function(...args) {
    const result = originalPush.apply(this, args)
    saveHistory()
    return result
  }
  
  notificationHistory.value.splice = function(...args) {
    const result = originalSplice.apply(this, args)
    saveHistory()
    return result
  }
})
</script>

<style scoped>
.notification-sender {
  width: 100%;
}

.sender-header {
  margin-bottom: 2rem;
}

.sender-header h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.sender-header p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.notification-form-section {
  margin-bottom: 2rem;
}

.form-container {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.users-selection {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  background: var(--light-gray);
}

.user-checkbox {
  margin-bottom: 0.75rem;
}

.user-checkbox:last-child {
  margin-bottom: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.checkbox-label:hover {
  background: var(--white);
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  flex-shrink: 0;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  color: var(--text-color);
  font-weight: bold;
  font-size: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.user-avatar {
  width: 24px;
  height: 24px;
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
  font-size: 0.7rem;
}

.username {
  font-size: 0.875rem;
  color: var(--text-color);
}

.character-count {
  text-align: right;
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
  margin-top: 0.25rem;
}

.templates-section {
  margin-bottom: 1.5rem;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.template-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: var(--light-gray);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.template-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.template-icon {
  font-size: 1.2rem;
}

.template-name {
  font-size: 0.75rem;
  color: var(--text-color);
  font-weight: 500;
}

.preview-section {
  margin-bottom: 1.5rem;
}

.notification-preview {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  margin-top: 0.5rem;
}

.preview-info {
  background: rgba(33, 150, 243, 0.1);
  border-color: #2196f3;
}

.preview-success {
  background: rgba(76, 175, 80, 0.1);
  border-color: #4caf50;
}

.preview-warning {
  background: rgba(255, 193, 7, 0.1);
  border-color: #ffc107;
}

.preview-error {
  background: rgba(244, 67, 54, 0.1);
  border-color: #f44336;
}

.preview-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
}

.preview-message {
  color: var(--text-color);
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.preview-time {
  color: var(--text-color);
  opacity: 0.6;
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.stats-section {
  margin-bottom: 2rem;
}

.stats-section h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-top: 0.25rem;
}

.history-section {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.history-header h3 {
  color: var(--text-color);
  margin-bottom: 0;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-history {
  text-align: center;
  padding: 2rem;
}

.no-history-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-history p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.history-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.history-item:hover {
  background: var(--light-gray);
}

.history-item:last-child {
  border-bottom: none;
}

.history-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.history-content {
  flex: 1;
}

.history-message {
  color: var(--text-color);
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.history-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.resend-btn {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.resend-btn:hover {
  background: rgba(33, 150, 243, 0.2);
}

.delete-btn {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.delete-btn:hover {
  background: rgba(244, 67, 54, 0.2);
}

/* Scrollbar personalizada */
.users-selection::-webkit-scrollbar,
.history-list::-webkit-scrollbar {
  width: 6px;
}

.users-selection::-webkit-scrollbar-track,
.history-list::-webkit-scrollbar-track {
  background: var(--light-gray);
  border-radius: 3px;
}

.users-selection::-webkit-scrollbar-thumb,
.history-list::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.users-selection::-webkit-scrollbar-thumb:hover,
.history-list::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .templates-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .stat-card {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.2rem;
  }
  
  .history-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .history-item {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .history-actions {
    justify-content: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>