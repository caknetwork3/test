<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <span class="logo-text">CAK</span>
          </div>
          <h1>Iniciar Sesión</h1>
          <p>Bienvenido de vuelta a la plataforma de streamers</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">Usuario o Email</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              class="form-input"
              placeholder="Ingresa tu usuario o email"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary login-btn"
          >
            <span v-if="loading" class="loading"></span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
        
        <div class="login-footer">
          <p>¿No tienes una cuenta?</p>
          <router-link to="/register" class="register-link">
            Regístrate aquí
          </router-link>
        </div>
        
        <!-- Información de admin para demo -->
        <div class="demo-info">
          <h4>🔧 Información de Demo</h4>
          <p><strong>Admin:</strong> dexo / 123</p>
          <p><strong>O crea tu cuenta de streamer</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (loading.value) return
  
  error.value = ''
  loading.value = true
  
  try {
    await authStore.login(loginForm)
    
    // Mostrar mensaje de éxito
    window.showToast?.('¡Bienvenido de vuelta!', 'success')
    
    // Redirigir según el rol
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (err) {
    error.value = err.message
    window.showToast?.(err.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background-color) 0%, var(--secondary-color) 50%, var(--primary-color) 100%);
  padding: 2rem 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

.login-header {
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

.login-header h1 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.login-header p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0;
}

.login-form {
  margin-bottom: 2rem;
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

.login-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.login-footer p {
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.register-link:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

.demo-info {
  margin-top: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  border-radius: var(--border-radius);
  text-align: center;
}

.demo-info h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.demo-info p {
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.demo-info p:last-child {
  margin-bottom: 0;
  font-weight: 500;
}

@media (max-width: 480px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-card {
    padding: 1.5rem;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
  
  .logo {
    width: 50px;
    height: 50px;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
}
</style>