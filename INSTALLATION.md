# Guía de Instalación - CAK Streamers Platform

## Prerrequisitos del Sistema

### 1. Node.js y npm
La aplicación requiere Node.js versión 16 o superior.

**Windows:**
1. Descargar Node.js desde https://nodejs.org/
2. Ejecutar el instalador y seguir las instrucciones
3. Verificar instalación:
   ```cmd
   node --version
   npm --version
   ```

**macOS:**
```bash
# Usando Homebrew
brew install node

# O descargar desde https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
# Usando NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 2. Git (Opcional)
Para clonar el repositorio:
```bash
git --version
```

## Instalación del Proyecto

### Paso 1: Obtener el Código
```bash
# Si tienes Git instalado
git clone <repository-url>
cd cak-streamers-platform

# O descargar y extraer el ZIP del proyecto
```

### Paso 2: Instalar Dependencias
```bash
# Instalar todas las dependencias
npm install

# Si hay problemas, limpiar cache
npm cache clean --force
npm install
```

### Paso 3: Configuración (Opcional)
```bash
# Crear archivo de variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
# VITE_TWITCH_CLIENT_ID=tu_client_id
# VITE_API_BASE_URL=http://localhost:3000
```

### Paso 4: Ejecutar en Desarrollo
```bash
# Iniciar servidor de desarrollo


# La aplicación estará disponible en:
# http://localhost:5173
```

## Comandos Disponibles

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo
npm run preview      # Vista previa del build
```

### Calidad de Código
```bash
npm run lint         # Ejecutar ESLint y corregir errores
npm run lint:check   # Solo verificar errores sin corregir
npm run format       # Formatear código con Prettier
npm run format:check # Verificar formato sin cambios
```

### Producción
```bash
npm run build            # Build básico
npm run build:production # Build con verificaciones
npm run build:analyze    # Build con análisis de bundle
```

### Utilidades
```bash
npm run clean       # Limpiar archivos temporales
npm run reinstall   # Reinstalar dependencias
```

## Verificación de la Instalación

### 1. Verificar que el servidor inicia
```bash
npm run dev
```
Deberías ver:
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### 2. Verificar funcionalidades básicas
1. **Navegación:** Abrir http://localhost:5173
2. **Login:** Usar credenciales `dexo` / `123`
3. **Panel Admin:** Acceder desde el menú de usuario
4. **Búsqueda:** Probar la barra de búsqueda
5. **Responsive:** Redimensionar ventana

### 3. Verificar consola del navegador
- No debe haber errores críticos en la consola
- Las advertencias menores son normales

## Solución de Problemas Comunes

### Error: "npm no se reconoce como comando"
**Solución:** Instalar Node.js desde https://nodejs.org/

### Error: "Cannot resolve dependency"
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5173 is already in use"
```bash
# Usar puerto diferente
npm run dev -- --port 3000
```

### Error: "Permission denied" (Linux/macOS)
```bash
# Cambiar permisos
sudo chown -R $(whoami) ~/.npm
```

### Problemas de CORS con Twitch API
- La API de Twitch funciona con datos mock por defecto
- Para producción, configurar proxy en el backend

### Error: "Module not found"
```bash
# Verificar que todas las dependencias estén instaladas
npm install
npm run dev
```

## Configuración del Entorno de Desarrollo

### VS Code (Recomendado)
Extensiones recomendadas:
- Vue Language Features (Volar)
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

### Configuración de Git
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

## Estructura de Archivos Después de la Instalación

```
cak-streamers-platform/
├── node_modules/           # Dependencias (generado)
├── dist/                   # Build de producción (generado)
├── public/                 # Archivos estáticos
├── src/                    # Código fuente
├── .env                    # Variables de entorno (opcional)
├── package.json            # Configuración del proyecto
├── vite.config.js         # Configuración de Vite
├── .eslintrc.js           # Configuración de ESLint
├── .prettierrc            # Configuración de Prettier
├── .gitignore             # Archivos ignorados por Git
└── README.md              # Documentación principal
```

## Próximos Pasos

1. **Desarrollo:** Modificar archivos en `src/`
2. **Testing:** Probar funcionalidades en http://localhost:5173
3. **Build:** Ejecutar `npm run build` para producción
4. **Deploy:** Subir archivos de `dist/` al servidor

## Soporte

Si encuentras problemas durante la instalación:

1. **Verificar prerrequisitos:** Node.js 16+, npm
2. **Limpiar instalación:** `npm run clean && npm install`
3. **Revisar logs:** Buscar errores específicos en la consola
4. **Contactar soporte:** support@cak-streamers.com

---

**¡Listo para desarrollar! 🚀**