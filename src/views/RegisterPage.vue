<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="logo">
            <span class="logo-text">CAK</span>
          </div>
          <h1>Crear Cuenta</h1>
          <p>Únete a la comunidad de streamers de CAK</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="username" class="form-label">Nombre de Usuario</label>
            <input
              id="username"
              v-model="registerForm.username"
              type="text"
              class="form-input"
              placeholder="Elige tu nombre de usuario"
              required
              minlength="3"
              maxlength="20"
            />
            <small class="form-help">Entre 3 y 20 caracteres</small>
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="registerForm.email"
              type="email"
              class="form-input"
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Crea una contraseña segura"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <small class="form-help">Mínimo 6 caracteres</small>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
            <div class="password-input-wrapper">
              <input
                id="confirmPassword"
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Repite tu contraseña"
                required
              />
              <button
                type="button"
                @click="toggleConfirmPassword"
                class="password-toggle"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="registerForm.acceptTerms"
                type="checkbox"
                required
              />
              <span class="checkmark"></span>
              Acepto los 
              <router-link to="/terms" target="_blank" class="terms-link">
                términos y condiciones
              </router-link>
            </label>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="btn btn-primary register-btn"
          >
            <span v-if="loading" class="loading"></span>
            {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </form>
        
        <div class="register-footer">
          <p>¿Ya tienes una cuenta?</p>
          <router-link to="/login" class="login-link">
            Inicia sesión aquí
          </router-link>
        </div>
        
        <!-- Beneficios de registrarse -->
        <div class="benefits-info">
          <h4>🎮 Beneficios de unirte a CAK</h4>
          <ul>
            <li>💰 100 ChococCoins de bienvenida</li>
            <li>📊 Perfil personalizable</li>
            <li>🔔 Notificaciones de streams</li>
            <li>🌟 Comunidad de streamers</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const isFormValid = computed(() => {
  return registerForm.username.length >= 3 &&
         registerForm.email.includes('@') &&
         registerForm.password.length >= 6 &&
         registerForm.password === registerForm.confirmPassword &&
         registerForm.acceptTerms
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleRegister = async () => {
  if (loading.value || !isFormValid.value) return
  
  error.value = ''
  
  // Validar que las contraseñas coincidan
  if (registerForm.password !== registerForm.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  
  loading.value = true
  
  try {
    await authStore.register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password
    })
    
    // Auto-login después del registro
    await authStore.login({
      username: registerForm.username,
      password: registerForm.password
    })
    
    // Mostrar mensaje de éxito
    window.showToast?.('¡Cuenta creada exitosamente! Bienvenido a CAK', 'success')
    
    // Redirigir a la página principal
    router.push('/')
  } catch (err) {
    error.value = err.message
    window.showToast?.(err.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background-color) 0%, var(--secondary-color) 50%, var(--primary-color) 100%);
  padding: 2rem 1rem;
}

.register-container {
  width: 100%;
  max-width: 450px;
}

.register-card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: var(--shadow);
}

.logo-text {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--text-color);
}

.register-header h1 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.register-header p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.register-form {
  margin-bottom: 2rem;
}

.form-help {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
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

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.4;
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
  margin-top: 2px;
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

.terms-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

.error-message {
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 68, 68, 0.3);
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

.register-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.register-footer p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.login-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.login-link:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

.benefits-info {
  margin-top: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  border-radius: var(--border-radius);
}

.benefits-info h4 {
  color: var(--text-color);
  margin-bottom: 0.75rem;
  font-size: 1rem;
  text-align: center;
}

.benefits-info ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.benefits-info li {
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.benefits-info li:last-child {
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .register-page {
    padding: 1rem;
  }
  
  .register-card {
    padding: 1.5rem;
  }
  
  .register-header h1 {
    font-size: 1.5rem;
  }
  
  .logo {
    width: 50px;
    height: 50px;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .checkbox-label {
    font-size: 0.8rem;
  }
}
</style>