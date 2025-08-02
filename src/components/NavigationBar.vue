<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo y marca -->
        <div class="navbar-brand">
          <router-link to="/" class="brand-link">
            <div class="logo">
              <span class="logo-text">CAK</span>
            </div>
            <span class="brand-name">Streamers</span>
          </router-link>
        </div>

        <!-- Enlaces de navegación -->
        <div class="navbar-nav">
          <router-link to="/about" class="nav-link">Sobre CAK</router-link>
          <router-link to="/contact" class="nav-link">Contacto</router-link>
          <router-link to="/terms" class="nav-link">Términos</router-link>
        </div>

        <!-- Barra de búsqueda -->
        <div class="navbar-search">
          <SearchBar />
        </div>

        <!-- Elementos de la derecha -->
        <div class="navbar-right">
          <!-- Balance de ChococCoins -->
          <div v-if="authStore.isLoggedIn" class="chococoins-display">
            <div class="coins-container">
              <span class="coins-icon">🍫</span>
              <span class="coins-amount">{{ authStore.userBalance }}</span>
              <span class="coins-label">ChococCoins</span>
            </div>
          </div>

          <!-- Campanita de notificaciones -->
          <div v-if="authStore.isLoggedIn" class="notification-bell">
            <NotificationBell />
          </div>

          <!-- Menú de usuario -->
          <div v-if="authStore.isLoggedIn" class="user-menu">
            <div class="dropdown" @click="toggleUserMenu">
              <div class="user-avatar">
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
              <span class="username">{{ authStore.user.username }}</span>
              <span class="dropdown-arrow">▼</span>
            </div>
            
            <div v-if="showUserMenu" class="dropdown-menu">
              <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
                <span class="item-icon">👤</span>
                Mi Perfil
              </router-link>
              <router-link 
                v-if="authStore.isAdmin" 
                to="/admin" 
                class="dropdown-item admin-item" 
                @click="closeUserMenu"
              >
                <span class="item-icon">⚙️</span>
                Panel Admin
              </router-link>
              <div class="dropdown-divider"></div>
              <button @click="logout" class="dropdown-item logout-item">
                <span class="item-icon">🚪</span>
                Cerrar Sesión
              </button>
            </div>
          </div>

          <!-- Botones de login/registro -->
          <div v-else class="auth-buttons">
            <router-link to="/login" class="btn btn-secondary btn-small">
              Iniciar Sesión
            </router-link>
            <router-link to="/register" class="btn btn-primary btn-small">
              Registrarse
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import SearchBar from './SearchBar.vue'
import NotificationBell from './NotificationBell.vue'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const logout = () => {
  authStore.logout()
  closeUserMenu()
  router.push('/')
}

// Cerrar menú al hacer click fuera
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu')) {
    showUserMenu.value = false
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
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--white) 0%, var(--secondary-color) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  z-index: 1000;
  height: 70px;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  gap: 2rem;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.75rem;
}

.logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
}

.logo-text {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text-color);
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  position: relative;
}

.nav-link:hover {
  background: var(--light-gray);
  color: var(--primary-color);
}

.nav-link.router-link-active {
  color: var(--primary-color);
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--primary-color);
  border-radius: 1px;
}

.navbar-search {
  flex: 1;
  max-width: 400px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.chococoins-display {
  background: var(--white);
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  box-shadow: var(--shadow);
}

.coins-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.coins-icon {
  font-size: 1.2rem;
}

.coins-amount {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1.1rem;
}

.coins-label {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.notification-bell {
  position: relative;
}

.user-menu {
  position: relative;
}

.dropdown {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--white);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.dropdown:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
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
}

.username {
  font-weight: 500;
  color: var(--text-color);
}

.dropdown-arrow {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  min-width: 200px;
  z-index: 1001;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--text-color);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: var(--transition);
}

.dropdown-item:hover {
  background: var(--light-gray);
}

.admin-item {
  color: var(--accent-color);
  font-weight: 500;
}

.logout-item {
  color: var(--error-color);
}

.item-icon {
  font-size: 1rem;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.5rem 0;
}

.auth-buttons {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .navbar {
    height: 60px;
  }
  
  .navbar-content {
    height: 60px;
    gap: 1rem;
  }
  
  .navbar-search {
    max-width: 200px;
  }
  
  .brand-name {
    display: none;
  }
  
  .coins-label {
    display: none;
  }
  
  .username {
    display: none;
  }
  
  .navbar-nav {
    display: none;
  }
  
  .auth-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .navbar-search {
    display: none;
  }
  
  .chococoins-display {
    padding: 0.25rem 0.5rem;
  }
  
  .coins-container {
    gap: 0.25rem;
  }
  
  .coins-amount {
    font-size: 1rem;
  }
}
</style>