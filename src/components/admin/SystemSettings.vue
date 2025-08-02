<template>
  <div class="system-settings">
    <div class="settings-header">
      <h2>⚙️ Configuración del Sistema</h2>
      <p>Administra la configuración general de la plataforma</p>
    </div>

    <!-- Configuración General -->
    <div class="settings-section">
      <h3>🌐 Configuración General</h3>
      <div class="settings-grid">
        <div class="setting-card">
          <div class="setting-header">
            <div class="setting-icon">🏷️</div>
            <div class="setting-info">
              <h4>Nombre de la Plataforma</h4>
              <p>Nombre que aparece en toda la aplicación</p>
            </div>
          </div>
          <div class="setting-control">
            <input
              v-model="settings.platformName"
              type="text"
              class="form-input"
              placeholder="CAK Streamers"
            />
          </div>
        </div>

        <div class="setting-card">
          <div class="setting-header">
            <div class="setting-icon">📝</div>
            <div class="setting-info">
              <h4>Descripción</h4>
              <p>Descripción breve de la plataforma</p>
            </div>
          </div>
          <div class="setting-control">
            <textarea
              v-model="settings.platformDescription"
              class="form-textarea"
              rows="3"
              placeholder="La mejor plataforma para streamers"
            ></textarea>
          </div>
        </div>

        <div class="setting-card">
          <div class="setting-header">
            <div class="setting-icon">🍫</div>
            <div class="setting-info">
              <h4>ChococCoins Iniciales</h4>
              <p>Cantidad que reciben los nuevos usuarios</p>
            </div>
          </div>
          <div class="setting-control">
            <input
              v-model.number="settings.initialCoins"
              type="number"
              min="0"
              class="form-input"
            />
          </div>
        </div>

        <div class="setting-card">
          <div class="setting-header">
            <div class="setting-icon">👥</div>
            <div class="setting-info">
              <h4>Registro Abierto</h4>
              <p>Permitir que nuevos usuarios se registren</p>
            </div>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input
                v-model="settings.openRegistration"
                type="checkbox"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuración de Notificaciones -->
    <div class="settings-section">
      <h3>🔔 Configuración de Notificaciones</h3>
      <div class="settings-grid">
        <div class="setting-card">
          <div class="setting-header">
            <div class="setting-icon">📢</div>
            <div class="setting-info">
              <h4>Notificaciones Automáticas</h4>
              <p>Enviar notificaciones automáticas del sistema</p>
            </div>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input
                v-model="settings.autoNotifications"
                type="checkbox"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-card">
          <div class="setting-header">
            <div class="setting-icon">🔴</div>
            <div class="setting-info">
              <h4>Alertas de Stream</h4>
              <p>Notificar cuando streamers van en vivo</p>
            </div>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input
                v-model="settings.streamAlerts"
                type="checkbox"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-card">
          <div class="setting-header">
            <div class="setting-icon">⏰</div>
            <div class="setting-info">
              <h4>Duración de Notificaciones</h4>
              <p>Tiempo en segundos antes de auto-ocultar</p>
            </div>
          </div>
          <div class="setting-control">
            <input
              v-model.number="settings.notificationDuration"
              type="number"
              min="1"
              max="30"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Gestión de Datos -->
    <div class="settings-section">
      <h3>💾 Gestión de Datos</h3>
      <div class="data-management">
        <div class="data-card">
          <div class="data-header">
            <div class="data-icon">📊</div>
            <div class="data-info">
              <h4>Estadísticas del Sistema</h4>
              <div class="data-stats">
                <div class="stat-item">
                  <span class="stat-label">Usuarios:</span>
                  <span class="stat-value">{{ totalUsers }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Streamers:</span>
                  <span class="stat-value">{{ totalStreamers }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Notificaciones:</span>
                  <span class="stat-value">{{ totalNotifications }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Almacenamiento:</span>
                  <span class="stat-value">{{ storageUsed }} KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="data-actions">
          <div class="action-group">
            <h4>🔄 Respaldo y Restauración</h4>
            <div class="action-buttons">
              <button @click="exportData" class="btn btn-primary">
                📤 Exportar Datos
              </button>
              <button @click="importData" class="btn btn-secondary">
                📥 Importar Datos
              </button>
              <input
                ref="fileInput"
                type="file"
                accept=".json"
                @change="handleFileImport"
                style="display: none"
              />
            </div>
          </div>

          <div class="action-group danger-zone">
            <h4>⚠️ Zona de Peligro</h4>
            <div class="action-buttons">
              <button @click="clearAllData" class="btn btn-danger">
                🗑️ Limpiar Todos los Datos
              </button>
              <button @click="resetToDefaults" class="btn btn-warning">
                🔄 Restaurar Configuración
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Información del Sistema -->
    <div class="settings-section">
      <h3>ℹ️ Información del Sistema</h3>
      <div class="system-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Versión:</span>
            <span class="info-value">1.0.0</span>
          </div>
          <div class="info-item">
            <span class="info-label">Última Actualización:</span>
            <span class="info-value">{{ lastUpdate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Navegador:</span>
            <span class="info-value">{{ browserInfo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Resolución:</span>
            <span class="info-value">{{ screenResolution }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Zona Horaria:</span>
            <span class="info-value">{{ timeZone }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Idioma:</span>
            <span class="info-value">{{ language }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="settings-actions">
      <button @click="saveSettings" class="btn btn-primary">
        💾 Guardar Configuración
      </button>
      <button @click="resetSettings" class="btn btn-secondary">
        🔄 Restablecer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const fileInput = ref(null)

const settings = reactive({
  platformName: 'CAK Streamers',
  platformDescription: 'La mejor plataforma para streamers de la agencia CAK',
  initialCoins: 100,
  openRegistration: true,
  autoNotifications: true,
  streamAlerts: true,
  notificationDuration: 5
})

const totalUsers = computed(() => {
  return authStore.users.length
})

const totalStreamers = computed(() => {
  return authStore.users.filter(u => u.role === 'streamer').length
})

const totalNotifications = computed(() => {
  return authStore.notifications.length
})

const storageUsed = computed(() => {
  const data = JSON.stringify({
    users: authStore.users,
    notifications: authStore.notifications
  })
  return Math.round(new Blob([data]).size / 1024)
})

const lastUpdate = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const browserInfo = computed(() => {
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  return 'Desconocido'
})

const screenResolution = computed(() => {
  return `${screen.width}x${screen.height}`
})

const timeZone = computed(() => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
})

const language = computed(() => {
  return navigator.language || 'es-ES'
})

const saveSettings = () => {
  try {
    localStorage.setItem('cak_system_settings', JSON.stringify(settings))
    window.showToast?.('Configuración guardada correctamente', 'success')
  } catch (error) {
    window.showToast?.('Error al guardar la configuración', 'error')
  }
}

const resetSettings = () => {
  if (confirm('¿Estás seguro de que quieres restablecer la configuración?')) {
    Object.assign(settings, {
      platformName: 'CAK Streamers',
      platformDescription: 'La mejor plataforma para streamers de la agencia CAK',
      initialCoins: 100,
      openRegistration: true,
      autoNotifications: true,
      streamAlerts: true,
      notificationDuration: 5
    })
    window.showToast?.('Configuración restablecida', 'success')
  }
}

const exportData = () => {
  try {
    const data = {
      users: authStore.users,
      notifications: authStore.notifications,
      settings: settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cak-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    window.showToast?.('Datos exportados correctamente', 'success')
  } catch (error) {
    window.showToast?.('Error al exportar los datos', 'error')
  }
}

const importData = () => {
  fileInput.value?.click()
}

const handleFileImport = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      if (confirm('¿Estás seguro de que quieres importar estos datos? Esto sobrescribirá todos los datos actuales.')) {
        if (data.users) {
          authStore.users = data.users
          authStore.saveUsers()
        }
        
        if (data.notifications) {
          authStore.notifications = data.notifications
          authStore.saveNotifications()
        }
        
        if (data.settings) {
          Object.assign(settings, data.settings)
          saveSettings()
        }
        
        window.showToast?.('Datos importados correctamente', 'success')
      }
    } catch (error) {
      window.showToast?.('Error al importar los datos. Archivo inválido.', 'error')
    }
  }
  
  reader.readAsText(file)
  event.target.value = '' // Reset input
}

const clearAllData = () => {
  const confirmation = prompt(
    'Esta acción eliminará TODOS los datos permanentemente.\n' +
    'Escribe "ELIMINAR TODO" para confirmar:'
  )
  
  if (confirmation === 'ELIMINAR TODO') {
    localStorage.clear()
    authStore.users = []
    authStore.notifications = []
    authStore.createDefaultAdmin()
    
    window.showToast?.('Todos los datos han sido eliminados', 'warning')
    
    // Recargar la página después de un breve delay
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }
}

const resetToDefaults = () => {
  if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
    localStorage.removeItem('cak_system_settings')
    resetSettings()
    window.showToast?.('Configuración restaurada a valores por defecto', 'success')
  }
}

onMounted(() => {
  // Cargar configuración guardada
  const savedSettings = localStorage.getItem('cak_system_settings')
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      Object.assign(settings, parsed)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }
})
</script>

<style scoped>
.system-settings {
  width: 100%;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-header h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.settings-header p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.settings-section {
  margin-bottom: 2rem;
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.settings-section h3 {
  color: var(--text-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.setting-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  background: var(--light-gray);
}

.setting-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.setting-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.setting-info {
  flex: 1;
}

.setting-info h4 {
  color: var(--text-color);
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.setting-info p {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.875rem;
  margin-bottom: 0;
  line-height: 1.4;
}

.setting-control {
  width: 100%;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: var(--transition);
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: var(--transition);
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.data-management {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.data-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  background: var(--light-gray);
}

.data-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.data-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.data-info {
  flex: 1;
}

.data-info h4 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.data-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--white);
  border-radius: var(--border-radius);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.stat-value {
  font-weight: 600;
  color: var(--text-color);
}

.data-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-group {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  background: var(--light-gray);
}

.action-group h4 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.danger-zone {
  border-color: #f44336;
  background: rgba(244, 67, 54, 0.05);
}

.btn-danger {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.btn-danger:hover {
  background: #d32f2f;
}

.btn-warning {
  background: #ff9800;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.btn-warning:hover {
  background: #f57c00;
}

.system-info {
  background: var(--light-gray);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--white);
  border-radius: var(--border-radius);
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.info-value {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.875rem;
}

.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .data-stats {
    grid-template-columns: 1fr;
  }
  
  .data-actions {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .setting-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .data-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stat-item,
  .info-item {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
}
</style>