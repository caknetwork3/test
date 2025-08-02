# CAK Streamers Platform 🎮

Una plataforma web completa para la agencia de streamers CAK, desarrollada con Vue 3 y tecnologías modernas.

## 🌟 Características Principales

### 🔐 Sistema de Autenticación
- Registro e inicio de sesión de usuarios
- Usuario administrador por defecto (`dexo` / `123`)
- Gestión de perfiles personalizados
- Roles de usuario (admin, streamer, viewer)

### 💰 Sistema ChococCoins
- Moneda virtual de la plataforma
- Balance visible en la navegación
- Gestión administrativa de monedas
- Sistema de transacciones

### 🎯 Panel de Administración
- Gestión completa de usuarios
- Control de ChococCoins
- Sistema de notificaciones
- Configuración del sistema
- Estadísticas y métricas

### 👥 Perfiles de Streamers
- Perfiles públicos personalizables
- Información detallada de cada streamer
- Enlaces a redes sociales
- Estado en vivo en tiempo real

### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real
- Campanita de notificaciones
- Mensajes toast informativos
- Gestión administrativa de avisos

### 🔍 Búsqueda Avanzada
- Búsqueda en tiempo real
- Filtros por categorías
- Resultados instantáneos
- Navegación intuitiva

### 📺 Integración con Twitch
- API básica de Twitch integrada
- Detección de streamers en vivo
- Información de streams en tiempo real
- Enlaces directos a Twitch

### 📱 Diseño Responsive
- Interfaz adaptable a todos los dispositivos
- Colores pastel llamativos pero agradables
- Animaciones y transiciones suaves
- Experiencia de usuario optimizada

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Vue 3** - Framework principal con Composition API
- **Vue Router** - Navegación entre páginas
- **Pinia** - Gestión de estado global
- **Vite** - Herramienta de desarrollo y build
- **CSS3** - Estilos personalizados con variables CSS

### Servicios
- **Axios** - Cliente HTTP para APIs
- **Twitch API** - Integración con servicios de streaming
- **LocalStorage** - Persistencia de datos local

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Git** - Control de versiones

## 📁 Estructura del Proyecto

```
cak-streamers/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── admin/         # Componentes del panel admin
│   │   ├── NavigationBar.vue
│   │   ├── SearchBar.vue
│   │   ├── NotificationBell.vue
│   │   ├── StreamerGrid.vue
│   │   └── LiveStreamers.vue
│   ├── views/             # Páginas principales
│   │   ├── HomePage.vue
│   │   ├── LoginPage.vue
│   │   ├── AdminPanel.vue
│   │   ├── StreamerProfile.vue
│   │   ├── ContactPage.vue
│   │   └── AboutCAK.vue
│   ├── stores/            # Gestión de estado
│   │   └── auth.js
│   ├── services/          # Servicios externos
│   │   └── twitchApi.js
│   ├── App.vue           # Componente raíz
│   ├── main.js           # Punto de entrada
│   └── style.css         # Estilos globales
├── package.json          # Dependencias y scripts
├── vite.config.js       # Configuración de Vite
└── README.md            # Documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd cak-streamers
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional)
   ```bash
   # Crear archivo .env para configuración de Twitch API
   VITE_TWITCH_CLIENT_ID=your_client_id
   VITE_TWITCH_CLIENT_SECRET=your_client_secret
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación**
   - Abrir navegador en `http://localhost:5173`
   - Usuario admin: `dexo` / `123`

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm run lint         # Linting del código
npm run format       # Formateo del código
```

## 🔧 Configuración de la API de Twitch

Para habilitar la funcionalidad completa de Twitch:

1. **Crear aplicación en Twitch Developers**
   - Ir a https://dev.twitch.tv/console
   - Crear nueva aplicación
   - Obtener Client ID y Client Secret

2. **Configurar credenciales**
   ```javascript
   // src/services/twitchApi.js
   this.clientId = 'your_twitch_client_id'
   // Nota: Client Secret debe manejarse en el backend
   ```

3. **Configurar streamers de CAK**
   ```javascript
   // src/services/twitchApi.js
   this.cakStreamers = [
     'dexo',
     'streamer1',
     'streamer2'
     // Agregar usernames reales de Twitch
   ]
   ```

## 👤 Usuarios por Defecto

### Administrador
- **Usuario:** `dexo`
- **Contraseña:** `123`
- **Permisos:** Acceso completo al panel de administración

### Streamers de Ejemplo
- **dexo** - Administrador y streamer principal
- **streamer1** - Streamer de ejemplo
- **streamer2** - Streamer de ejemplo

## 🎨 Personalización de Estilos

### Variables CSS Principales
```css
:root {
  --primary-color: #FF69B4;      /* Rosa principal */
  --secondary-color: #FFB6C1;    /* Rosa claro */
  --accent-color: #9370DB;       /* Púrpura */
  --success-color: #98FB98;      /* Verde claro */
  --warning-color: #FFE4B5;      /* Amarillo claro */
  --error-color: #FFA07A;        /* Salmón */
  --text-color: #2C3E50;         /* Azul oscuro */
  --white: #FFFFFF;
  --light-gray: #F8F9FA;
  --border-color: #E9ECEF;
}
```

### Componentes Personalizables
- Colores de la paleta pastel
- Animaciones y transiciones
- Espaciado y tipografía
- Componentes de UI

## 🔒 Seguridad

### Medidas Implementadas
- Validación de formularios
- Sanitización de datos
- Gestión segura de tokens
- Protección de rutas administrativas

### Recomendaciones para Producción
- Implementar autenticación JWT
- Usar HTTPS en producción
- Configurar CORS apropiadamente
- Manejar secretos en el backend

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos
- Desktop (1920x1080+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de dependencias**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Puerto ocupado**
   ```bash
   npm run dev -- --port 3000
   ```

3. **Problemas de CORS con Twitch API**
   - Verificar configuración de la aplicación en Twitch
   - Implementar proxy en el backend

## 🤝 Contribución

### Proceso de Desarrollo
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- Usar ESLint y Prettier
- Seguir convenciones de Vue 3
- Documentar componentes complejos
- Escribir tests para funcionalidades críticas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

### Equipo de Desarrollo
- **Email:** dev@cak-streamers.com
- **Discord:** CAK Development Server
- **GitHub:** @cak-streamers

### Soporte
- **Email:** support@cak-streamers.com
- **Documentación:** https://docs.cak-streamers.com
- **Issues:** GitHub Issues

---

**Desarrollado con ❤️ para la comunidad CAK**

*Última actualización: Enero 2025*