<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        <div class="toast-icon">
          {{ getToastIcon(toast.type) }}
        </div>
        <div class="toast-content">
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button @click="removeToast(toast.id)" class="toast-close">
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const toasts = ref([])

const getToastIcon = (type) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type] || icons.info
}

const addToast = (message, type = 'info', duration = 5000) => {
  const id = Date.now() + Math.random()
  const toast = { id, message, type }
  
  toasts.value.push(toast)
  
  // Auto-remove después del tiempo especificado
  setTimeout(() => {
    removeToast(id)
  }, duration)
  
  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Exponer métodos globalmente
onMounted(() => {
  // Hacer disponible globalmente para usar desde cualquier componente
  window.showToast = addToast
})

// También exponer para uso directo
defineExpose({
  addToast,
  removeToast
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
}

.toast-success {
  border-left-color: var(--success-color);
  background: linear-gradient(135deg, var(--white), rgba(144, 238, 144, 0.1));
}

.toast-error {
  border-left-color: #ff4444;
  background: linear-gradient(135deg, var(--white), rgba(255, 68, 68, 0.1));
}

.toast-warning {
  border-left-color: #ffaa00;
  background: linear-gradient(135deg, var(--white), rgba(255, 170, 0, 0.1));
}

.toast-info {
  border-left-color: var(--primary-color);
  background: linear-gradient(135deg, var(--white), rgba(255, 182, 193, 0.1));
}

.toast-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-message {
  color: var(--text-color);
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.6;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: var(--transition);
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

/* Animaciones */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .toast-container {
    top: 80px;
    right: 10px;
    left: 10px;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
    margin-bottom: 0.75rem;
  }
}

@media (max-width: 480px) {
  .toast {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }
  
  .toast-message {
    font-size: 0.875rem;
  }
  
  .toast-icon {
    font-size: 1rem;
  }
}
</style>