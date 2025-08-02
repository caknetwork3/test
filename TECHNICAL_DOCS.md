# Documentación Técnica - CAK Streamers Platform

## Arquitectura del Sistema

### Stack Tecnológico
- **Frontend Framework:** Vue 3 con Composition API
- **Build Tool:** Vite 7.x
- **State Management:** Pinia
- **Routing:** Vue Router 4
- **HTTP Client:** Axios
- **Styling:** CSS3 con variables personalizadas
- **Code Quality:** ESLint + Prettier

### Arquitectura de Componentes

```
App.vue (Root)
├── NavigationBar.vue
│   ├── SearchBar.vue
│   └── NotificationBell.vue
├── Router Views
│   ├── HomePage.vue
│   │   ├── StreamerGrid.vue
│   │   │   └── StreamerCard.vue
│   │   └── LiveStreamers.vue
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   ├── ProfilePage.vue
│   ├── StreamerProfile.vue
│   ├── AdminPanel.vue
│   │   ├── UserManagement.vue
│   │   ├── CoinManagement.vue
│   │   ├── NotificationSender.vue
│   │   └── SystemSettings.vue
│   ├── AboutCAK.vue
│   ├── ContactPage.vue
│   └── TermsPage.vue
└── NotificationToast.vue
```

## Gestión de Estado (Pinia)

### Store Principal: `auth.js`

```javascript
// Estado principal de la aplicación
const state = {
  user: null,              // Usuario actual
  users: [],               // Lista de todos los usuarios
  notifications: [],       // Notificaciones del usuario
  systemNotifications: [], // Notificaciones del sistema
  isLoggedIn: false       // Estado de autenticación
}

// Getters computados
const getters = {
  isAdmin: () => user?.role === 'admin',
  userBalance: () => user?.chococoins || 0,
  unreadNotifications: () => notifications.filter(n => !n.read).length
}

// Acciones principales
const actions = {
  login(credentials),
  logout(),
  register(userData),
  updateProfile(data),
  addChococoins(userId, amount),
  sendNotification(notification),
  saveUsers(),
  loadUsers()
}
```

### Persistencia de Datos

```javascript
// LocalStorage Keys
const STORAGE_KEYS = {
  USERS: 'cak_users',
  CURRENT_USER: 'cak_current_user',
  NOTIFICATIONS: 'cak_notifications',
  SYSTEM_NOTIFICATIONS: 'cak_system_notifications'
}

// Estructura de Usuario
const UserSchema = {
  id: String,
  username: String,
  email: String,
  password: String, // Hash en producción
  role: 'admin' | 'streamer' | 'viewer',
  chococoins: Number,
  profileImage: String,
  bio: String,
  socialLinks: Object,
  isStreaming: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

## Servicios Externos

### Twitch API Service (`twitchApi.js`)

```javascript
class TwitchApiService {
  // Configuración
  clientId: String
  baseUrl: 'https://api.twitch.tv/helix'
  cakStreamers: Array<String>
  
  // Métodos principales
  async getAppAccessToken()
  async getUsersByLogin(usernames)
  async getLiveStreams(userIds)
  async getCAKLiveStreamers()
  
  // Utilidades
  formatViewerCount(count)
  getStreamDuration(startedAt)
  getStreamUrl(username)
}
```

### Integración con APIs

```javascript
// Configuración de Axios
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptores
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Componentes Principales

### NavigationBar.vue
**Responsabilidades:**
- Navegación principal
- Búsqueda global
- Balance de ChococCoins
- Notificaciones
- Menú de usuario

**Props:** Ninguna
**Emits:** Ninguno
**Stores:** `useAuthStore()`

### SearchBar.vue
**Responsabilidades:**
- Búsqueda en tiempo real
- Filtrado de streamers
- Navegación a resultados

**Props:**
```javascript
{
  placeholder: String,
  showResults: Boolean
}
```

**Emits:**
```javascript
{
  'search': String,
  'select': Object
}
```

### StreamerCard.vue
**Responsabilidades:**
- Mostrar información del streamer
- Estado en vivo
- Navegación al perfil

**Props:**
```javascript
{
  streamer: {
    type: Object,
    required: true,
    validator: (streamer) => {
      return streamer.id && streamer.username
    }
  },
  showLiveStatus: {
    type: Boolean,
    default: true
  }
}
```

### AdminPanel.vue
**Responsabilidades:**
- Gestión de usuarios
- Control de ChococCoins
- Envío de notificaciones
- Configuración del sistema

**Guards:**
```javascript
// Router guard
beforeEnter: (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isAdmin) {
    next('/login')
  } else {
    next()
  }
}
```

## Sistema de Routing

### Configuración de Rutas

```javascript
const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/streamer/:id', component: StreamerProfile },
  { path: '/admin', component: AdminPanel, meta: { requiresAdmin: true } },
  { path: '/about', component: AboutCAK },
  { path: '/contact', component: ContactPage },
  { path: '/terms', component: TermsPage }
]
```

### Navigation Guards

```javascript
// Global guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})
```

## Sistema de Estilos

### Variables CSS Globales

```css
:root {
  /* Colores principales */
  --primary-color: #FF69B4;      /* Rosa principal */
  --secondary-color: #FFB6C1;    /* Rosa claro */
  --accent-color: #9370DB;       /* Púrpura */
  --success-color: #98FB98;      /* Verde claro */
  --warning-color: #FFE4B5;      /* Amarillo claro */
  --error-color: #FFA07A;        /* Salmón */
  
  /* Colores de texto y fondo */
  --text-color: #2C3E50;         /* Azul oscuro */
  --white: #FFFFFF;
  --light-gray: #F8F9FA;
  --border-color: #E9ECEF;
  
  /* Espaciado y tipografía */
  --border-radius: 12px;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
  
  /* Breakpoints */
  --mobile: 480px;
  --tablet: 768px;
  --desktop: 1024px;
}
```

### Clases Utilitarias

```css
/* Botones */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.btn-primary { background: var(--primary-color); }
.btn-secondary { background: var(--secondary-color); }
.btn-small { padding: 0.5rem 1rem; font-size: 0.9rem; }

/* Layout */
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.loading { /* Spinner animation */ }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
```

## Sistema de Notificaciones

### Tipos de Notificaciones

```javascript
const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Estructura de notificación
const NotificationSchema = {
  id: String,
  type: NotificationTypes,
  title: String,
  message: String,
  userId: String,
  read: Boolean,
  createdAt: Date,
  expiresAt: Date
}
```

### Toast Notifications

```javascript
// Global toast function
window.showToast = (message, type = 'info', duration = 3000) => {
  // Implementación del toast
}

// Uso en componentes
window.showToast('Usuario creado exitosamente', 'success')
```

## Optimizaciones de Rendimiento

### Code Splitting

```javascript
// Lazy loading de rutas
const AdminPanel = () => import('./views/AdminPanel.vue')
const StreamerProfile = () => import('./views/StreamerProfile.vue')

// Chunk splitting en vite.config.js
manualChunks: {
  vendor: ['vue', 'vue-router', 'pinia'],
  admin: ['./src/views/AdminPanel.vue', './src/components/admin/'],
  ui: ['./src/components/NavigationBar.vue', './src/components/SearchBar.vue']
}
```

### Optimización de Imágenes

```javascript
// Lazy loading de imágenes
const useImageLazyLoad = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        observer.unobserve(img)
      }
    })
  })
  
  return { observer }
}
```

### Caching Strategies

```javascript
// Service Worker para cache (futuro)
const CACHE_NAME = 'cak-streamers-v1'
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
]
```

## Testing Strategy

### Unit Tests (Futuro)

```javascript
// Ejemplo de test con Vitest
import { mount } from '@vue/test-utils'
import StreamerCard from '@/components/StreamerCard.vue'

describe('StreamerCard', () => {
  test('renders streamer information', () => {
    const streamer = {
      id: '1',
      username: 'teststreamer',
      isStreaming: true
    }
    
    const wrapper = mount(StreamerCard, {
      props: { streamer }
    })
    
    expect(wrapper.text()).toContain('teststreamer')
    expect(wrapper.find('.live-badge').exists()).toBe(true)
  })
})
```

### E2E Tests (Futuro)

```javascript
// Ejemplo con Cypress
describe('User Authentication', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    cy.get('[data-cy=username]').type('dexo')
    cy.get('[data-cy=password]').type('123')
    cy.get('[data-cy=login-btn]').click()
    cy.url().should('eq', '/')
  })
})
```

## Seguridad

### Validación de Datos

```javascript
// Validación de formularios
const validateUser = (userData) => {
  const errors = {}
  
  if (!userData.username || userData.username.length < 3) {
    errors.username = 'Username debe tener al menos 3 caracteres'
  }
  
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.email = 'Email inválido'
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}
```

### Sanitización

```javascript
// Sanitizar HTML
const sanitizeHtml = (html) => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}
```

## Deployment

### Build de Producción

```bash
# Build optimizado
npm run build:production

# Archivos generados en dist/
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
└── img/
```

### Variables de Entorno

```bash
# .env.production
VITE_API_BASE_URL=https://api.cak-streamers.com
VITE_TWITCH_CLIENT_ID=production_client_id
VITE_ENVIRONMENT=production
```

### Configuración del Servidor

```nginx
# nginx.conf
server {
  listen 80;
  server_name cak-streamers.com;
  root /var/www/cak-streamers/dist;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://localhost:3000;
  }
}
```

## Monitoreo y Analytics

### Error Tracking (Futuro)

```javascript
// Sentry integration
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_ENVIRONMENT
})
```

### Performance Monitoring

```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## Contribución al Código

### Workflow de Desarrollo

1. **Fork** del repositorio
2. **Branch** para nueva feature: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollo** siguiendo estándares
4. **Testing** local
5. **Commit** con mensaje descriptivo
6. **Push** y crear **Pull Request**

### Estándares de Código

```javascript
// Naming conventions
// Components: PascalCase
// Variables: camelCase
// Constants: UPPER_SNAKE_CASE
// Files: kebab-case

// Ejemplo de componente bien estructurado
<template>
  <div class="component-name">
    <!-- Template content -->
  </div>
</template>

<script setup>
// Imports
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  propName: {
    type: String,
    required: true,
    validator: (value) => value.length > 0
  }
})

// Emits
const emit = defineEmits(['event-name'])

// Reactive data
const reactiveData = ref('')

// Computed
const computedValue = computed(() => {
  return reactiveData.value.toUpperCase()
})

// Methods
const methodName = () => {
  // Method implementation
}

// Lifecycle
onMounted(() => {
  // Initialization
})
</script>

<style scoped>
.component-name {
  /* Component styles */
}
</style>
```

---

**Documentación actualizada:** Enero 2025  
**Versión:** 1.0.0  
**Mantenido por:** CAK Development Team