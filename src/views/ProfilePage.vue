<template>
  <div class="profile-page">
    <div class="container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="header-content">
          <div class="profile-avatar-section">
            <div class="current-avatar">
              <img 
                v-if="authStore.user.profileImage" 
                :src="authStore.user.profileImage" 
                :alt="authStore.user.username"
                class="avatar-img"
              />
              <div v-else class="avatar-placeholder">
                {{ authStore.user.username.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="avatar-actions">
              <button @click="changeAvatar" class="btn btn-secondary btn-small">
                📷 Cambiar Foto
              </button>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
                style="display: none"
              />
            </div>
          </div>
          
          <div class="profile-info">
            <h1>{{ authStore.user.username }}</h1>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-icon">🍫</span>
                <span class="stat-value">{{ authStore.user.chococoins }}</span>
                <span class="stat-label">ChococCoins</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">📅</span>
                <span class="stat-value">{{ formatJoinDate(authStore.user.createdAt) }}</span>
                <span class="stat-label">Miembro desde</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">🎮</span>
                <span class="stat-value">{{ authStore.user.role }}</span>
                <span class="stat-label">Rol</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Tabs -->
      <div class="profile-tabs">
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

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Personal Info Tab -->
        <div v-if="activeTab === 'personal'" class="tab-panel">
          <div class="settings-section">
            <h2>👤 Información Personal</h2>
            
            <form @submit.prevent="updatePersonalInfo" class="settings-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nombre de Usuario</label>
                  <input
                    v-model="personalForm.username"
                    type="text"
                    class="form-input"
                    required
                    minlength="3"
                    maxlength="20"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input
                    v-model="personalForm.email"
                    type="email"
                    class="form-input"
                    required
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Biografía</label>
                <textarea
                  v-model="personalForm.bio"
                  class="form-textarea"
                  rows="4"
                  placeholder="Cuéntanos sobre ti..."
                  maxlength="500"
                ></textarea>
                <div class="character-count">
                  {{ personalForm.bio.length }}/500 caracteres
                </div>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                  💾 Guardar Cambios
                </button>
                <button type="button" @click="resetPersonalForm" class="btn btn-secondary">
                  🔄 Restablecer
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Social Links Tab -->
        <div v-if="activeTab === 'social'" class="tab-panel">
          <div class="settings-section">
            <h2>🔗 Enlaces Sociales</h2>
            <p class="section-description">
              Agrega tus enlaces de redes sociales para que otros puedan encontrarte
            </p>
            
            <form @submit.prevent="updateSocialLinks" class="settings-form">
              <div class="social-links-grid">
                <div class="social-input-group">
                  <div class="social-icon twitch">📺</div>
                  <div class="social-info">
                    <label class="form-label">Twitch</label>
                    <input
                      v-model="socialForm.twitch"
                      type="url"
                      class="form-input"
                      placeholder="https://twitch.tv/tu-usuario"
                    />
                  </div>
                </div>
                
                <div class="social-input-group">
                  <div class="social-icon youtube">📹</div>
                  <div class="social-info">
                    <label class="form-label">YouTube</label>
                    <input
                      v-model="socialForm.youtube"
                      type="url"
                      class="form-input"
                      placeholder="https://youtube.com/c/tu-canal"
                    />
                  </div>
                </div>
                
                <div class="social-input-group">
                  <div class="social-icon twitter">🐦</div>
                  <div class="social-info">
                    <label class="form-label">Twitter</label>
                    <input
                      v-model="socialForm.twitter"
                      type="url"
                      class="form-input"
                      placeholder="https://twitter.com/tu-usuario"
                    />
                  </div>
                </div>
                
                <div class="social-input-group">
                  <div class="social-icon instagram">📷</div>
                  <div class="social-info">
                    <label class="form-label">Instagram</label>
                    <input
                      v-model="socialForm.instagram"
                      type="url"
                      class="form-input"
                      placeholder="https://instagram.com/tu-usuario"
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                  💾 Guardar Enlaces
                </button>
                <button type="button" @click="resetSocialForm" class="btn btn-secondary">
                  🔄 Restablecer
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="tab-panel">
          <div class="settings-section">
            <h2>🔒 Seguridad</h2>
            
            <form @submit.prevent="changePassword" class="settings-form">
              <div class="form-group">
                <label class="form-label">Contraseña Actual</label>
                <div class="password-input-wrapper">
                  <input
                    v-model="securityForm.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="form-input"
                    required
                  />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="password-toggle"
                  >
                    {{ showCurrentPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Nueva Contraseña</label>
                <div class="password-input-wrapper">
                  <input
                    v-model="securityForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-input"
                    required
                    minlength="6"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="password-toggle"
                  >
                    {{ showNewPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Confirmar Nueva Contraseña</label>
                <div class="password-input-wrapper">
                  <input
                    v-model="securityForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-input"
                    required
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="password-toggle"
                  >
                    {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
              </div>
              
              <div class="password-requirements">
                <h4>Requisitos de la contraseña:</h4>
                <ul>
                  <li :class="{ valid: securityForm.newPassword.length >= 6 }">
                    Mínimo 6 caracteres
                  </li>
                  <li :class="{ valid: securityForm.newPassword === securityForm.confirmPassword && securityForm.confirmPassword }">
                    Las contraseñas deben coincidir
                  </li>
                </ul>
              </div>
              
              <div class="form-actions">
                <button 
                  type="submit" 
                  :disabled="!isPasswordFormValid"
                  class="btn btn-primary"
                >
                  🔒 Cambiar Contraseña
                </button>
                <button type="button" @click="resetSecurityForm" class="btn btn-secondary">
                  🔄 Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Preferences Tab -->
        <div v-if="activeTab === 'preferences'" class="tab-panel">
          <div class="settings-section">
            <h2>⚙️ Preferencias</h2>
            
            <div class="preferences-grid">
              <div class="preference-card">
                <div class="preference-header">
                  <div class="preference-icon">🔔</div>
                  <div class="preference-info">
                    <h4>Notificaciones</h4>
                    <p>Configurar qué notificaciones recibir</p>
                  </div>
                </div>
                <div class="preference-controls">
                  <label class="toggle-switch">
                    <input
                      v-model="preferences.notifications"
                      type="checkbox"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="preference-card">
                <div class="preference-header">
                  <div class="preference-icon">🔴</div>
                  <div class="preference-info">
                    <h4>Alertas de Stream</h4>
                    <p>Recibir notificaciones cuando streamers vayan en vivo</p>
                  </div>
                </div>
                <div class="preference-controls">
                  <label class="toggle-switch">
                    <input
                      v-model="preferences.streamAlerts"
                      type="checkbox"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="preference-card">
                <div class="preference-header">
                  <div class="preference-icon">👁️</div>
                  <div class="preference-info">
                    <h4>Perfil Público</h4>
                    <p>Permitir que otros vean tu perfil</p>
                  </div>
                </div>
                <div class="preference-controls">
                  <label class="toggle-switch">
                    <input
                      v-model="preferences.publicProfile"
                      type="checkbox"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="preference-card">
                <div class="preference-header">
                  <div class="preference-icon">🌙</div>
                  <div class="preference-info">
                    <h4>Modo Oscuro</h4>
                    <p>Cambiar a tema oscuro (próximamente)</p>
                  </div>
                </div>
                <div class="preference-controls">
                  <label class="toggle-switch">
                    <input
                      v-model="preferences.darkMode"
                      type="checkbox"
                      disabled
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button @click="savePreferences" class="btn btn-primary">
                💾 Guardar Preferencias
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('personal')
const avatarInput = ref(null)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const tabs = [
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'social', label: 'Redes Sociales', icon: '🔗' },
  { id: 'security', label: 'Seguridad', icon: '🔒' },
  { id: 'preferences', label: 'Preferencias', icon: '⚙️' }
]

const personalForm = reactive({
  username: '',
  email: '',
  bio: ''
})

const socialForm = reactive({
  twitch: '',
  youtube: '',
  twitter: '',
  instagram: ''
})

const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferences = reactive({
  notifications: true,
  streamAlerts: true,
  publicProfile: true,
  darkMode: false
})

const isPasswordFormValid = computed(() => {
  return securityForm.currentPassword &&
         securityForm.newPassword.length >= 6 &&
         securityForm.newPassword === securityForm.confirmPassword
})

const formatJoinDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const changeAvatar = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    window.showToast?.('Por favor selecciona una imagen válida', 'error')
    return
  }
  
  // Validar tamaño (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    window.showToast?.('La imagen debe ser menor a 5MB', 'error')
    return
  }
  
  // Crear URL de la imagen
  const reader = new FileReader()
  reader.onload = (e) => {
    const imageUrl = e.target.result
    
    // Actualizar perfil con nueva imagen
    authStore.updateProfile({ profileImage: imageUrl })
    window.showToast?.('Foto de perfil actualizada', 'success')
  }
  
  reader.readAsDataURL(file)
  event.target.value = '' // Reset input
}

const updatePersonalInfo = () => {
  try {
    authStore.updateProfile({
      username: personalForm.username,
      email: personalForm.email,
      bio: personalForm.bio
    })
    window.showToast?.('Información personal actualizada', 'success')
  } catch (error) {
    window.showToast?.(error.message, 'error')
  }
}

const updateSocialLinks = () => {
  try {
    authStore.updateProfile({
      socialLinks: {
        twitch: socialForm.twitch,
        youtube: socialForm.youtube,
        twitter: socialForm.twitter,
        instagram: socialForm.instagram
      }
    })
    window.showToast?.('Enlaces sociales actualizados', 'success')
  } catch (error) {
    window.showToast?.(error.message, 'error')
  }
}

const changePassword = () => {
  try {
    authStore.changePassword(securityForm.currentPassword, securityForm.newPassword)
    window.showToast?.('Contraseña cambiada exitosamente', 'success')
    resetSecurityForm()
  } catch (error) {
    window.showToast?.(error.message, 'error')
  }
}

const savePreferences = () => {
  // Guardar preferencias en localStorage
  localStorage.setItem('cak_user_preferences', JSON.stringify(preferences))
  window.showToast?.('Preferencias guardadas', 'success')
}

const resetPersonalForm = () => {
  personalForm.username = authStore.user.username
  personalForm.email = authStore.user.email
  personalForm.bio = authStore.user.bio || ''
}

const resetSocialForm = () => {
  const links = authStore.user.socialLinks || {}
  socialForm.twitch = links.twitch || ''
  socialForm.youtube = links.youtube || ''
  socialForm.twitter = links.twitter || ''
  socialForm.instagram = links.instagram || ''
}

const resetSecurityForm = () => {
  securityForm.currentPassword = ''
  securityForm.newPassword = ''
  securityForm.confirmPassword = ''
}

onMounted(() => {
  // Verificar que el usuario esté logueado
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  // Inicializar formularios
  resetPersonalForm()
  resetSocialForm()
  
  // Cargar preferencias guardadas
  const savedPreferences = localStorage.getItem('cak_user_preferences')
  if (savedPreferences) {
    try {
      Object.assign(preferences, JSON.parse(savedPreferences))
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }
})
</script>

<style scoped>
.profile-page {
  padding: 2rem 0;
  min-height: calc(100vh - 140px);
}

.profile-header {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.current-avatar {
  position: relative;
}

.avatar-img,
.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid var(--white);
  box-shadow: var(--shadow);
}

.avatar-img {
  object-fit: cover;
}

.avatar-placeholder {
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 2.5rem;
  color: var(--text-color);
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.user-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: var(--white);
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  min-width: 120px;
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

.profile-tabs {
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

.settings-section {
  max-width: 800px;
}

.settings-section h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 2rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.character-count {
  text-align: right;
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
  margin-top: 0.25rem;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: var(--transition);
}

.password-toggle:hover {
  opacity: 1;
}

.password-requirements {
  background: var(--light-gray);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.password-requirements h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.password-requirements ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0.25rem;
}

.password-requirements li::before {
  content: '❌';
  font-size: 0.7rem;
}

.password-requirements li.valid {
  opacity: 1;
  color: #4caf50;
}

.password-requirements li.valid::before {
  content: '✅';
}

.social-links-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.social-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--light-gray);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.social-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.social-icon.twitch {
  background: rgba(145, 70, 255, 0.1);
}

.social-icon.youtube {
  background: rgba(255, 0, 0, 0.1);
}

.social-icon.twitter {
  background: rgba(29, 161, 242, 0.1);
}

.social-icon.instagram {
  background: rgba(228, 64, 95, 0.1);
}

.social-info {
  flex: 1;
}

.social-info .form-label {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.preferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.preference-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--light-gray);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.preference-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.preference-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.preference-info h4 {
  color: var(--text-color);
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.preference-info p {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.875rem;
  margin-bottom: 0;
  line-height: 1.4;
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

input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  flex-wrap: wrap;
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
  .profile-page {
    padding: 1rem 0;
  }
}

  
  .profile-header {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .profile-info h1 {
    font-size: 2rem;
  }
  
  .user-stats {
    justify-content: center;
    gap: 1rem;
  }
  
  .stat-item {
    min-width: 100px;
    padding: 0.75rem;
  }
  
  .tab-panel {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .preferences-grid {
    grid-template-columns: 1fr;
  }
  
  .preference-card {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
.preference-header {
    width: 100%;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .social-input-group {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .social-info {
    width: 100%;
  }

@media (max-width: 480px) {
  .avatar-img,
  .avatar-placeholder {
    width: 80px;
    height: 80px;
  }
  
  .avatar-placeholder {
    font-size: 2rem;
  }
  
  .profile-info h1 {
    font-size: 1.5rem;
  }
  
  .tab-btn {
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .tab-label {
    font-size: 0.8rem;
  }
  
  .user-stats {
    gap: 0.5rem;
  }
  
  .stat-item {
    min-width: 80px;
    padding: 0.5rem;
  }
  
  .stat-icon {
    font-size: 1.2rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
}</style>