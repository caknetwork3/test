<template>
  <div id="app">
    <!-- Navegación principal -->
    <NavigationBar v-if="!isAuthPage" />
    
    <!-- Contenido principal -->
    <main class="main-content" :class="{ 'auth-page': isAuthPage }">
      <router-view />
    </main>
    
    <!-- Footer -->
    <footer v-if="!isAuthPage" class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>CAK Streamers</h4>
            <p>La mejor plataforma para streamers</p>
          </div>
          <div class="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><router-link to="/about">Sobre CAK</router-link></li>
              <li><router-link to="/contact">Contacto</router-link></li>
              <li><router-link to="/terms">Términos y Condiciones</router-link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Redes Sociales</h4>
            <div class="social-links">
              <a href="#" target="_blank">Twitter</a>
              <a href="#" target="_blank">Instagram</a>
              <a href="#" target="_blank">YouTube</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 CAK Streamers. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
    
    <!-- Notificaciones -->
    <NotificationToast />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import NavigationBar from './components/NavigationBar.vue'
import NotificationToast from './components/NotificationToast.vue'

const route = useRoute()
const authStore = useAuthStore()

// Páginas que no necesitan navegación
const isAuthPage = computed(() => {
  return ['Login', 'Register'].includes(route.name)
})

// Inicializar la aplicación
onMounted(() => {
  authStore.initializeStore()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* Espacio para la navegación fija */
}

.main-content.auth-page {
  padding-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  padding: 2rem 0 1rem;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-section p {
  color: var(--text-color);
  opacity: 0.8;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: var(--text-color);
  text-decoration: none;
  opacity: 0.8;
  transition: var(--transition);
}

.footer-section ul li a:hover {
  opacity: 1;
  color: var(--accent-color);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  background: var(--white);
  border-radius: var(--border-radius);
  transition: var(--transition);
  opacity: 0.8;
}

.social-links a:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.footer-bottom p {
  color: var(--text-color);
  opacity: 0.6;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 70px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .social-links {
    flex-wrap: wrap;
  }
}
</style>