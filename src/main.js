import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Importar componentes de páginas
import HomePage from './views/HomePage.vue'
import LoginPage from './views/LoginPage.vue'
import RegisterPage from './views/RegisterPage.vue'
import ProfilePage from './views/ProfilePage.vue'
import AdminPanel from './views/AdminPanel.vue'
import AboutCAK from './views/AboutCAK.vue'
import TermsPage from './views/TermsPage.vue'
import ContactPage from './views/ContactPage.vue'
import StreamerProfile from './views/StreamerProfile.vue'

// Configuración de rutas
const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/profile', name: 'Profile', component: ProfilePage },
  { path: '/admin', name: 'Admin', component: AdminPanel },
  { path: '/about', name: 'About', component: AboutCAK },
  { path: '/terms', name: 'Terms', component: TermsPage },
  { path: '/contact', name: 'Contact', component: ContactPage },
  { path: '/streamer/:id', name: 'StreamerProfile', component: StreamerProfile, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Crear instancia de Pinia para manejo de estado
const pinia = createPinia()

// Crear y montar la aplicación
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')