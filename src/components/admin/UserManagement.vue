<template>
  <div class="user-management">
    <div class="management-header">
      <h2>👥 Gestión de Usuarios</h2>
      <div class="header-actions">
        <div class="search-filter">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar usuarios..."
            class="search-input"
          />
          <select v-model="filterRole" class="filter-select">
            <option value="">Todos los roles</option>
            <option value="streamer">Streamers</option>
          </select>
        </div>
        <button @click="refreshUsers" class="btn btn-secondary btn-small">
          🔄 Actualizar
        </button>
      </div>
    </div>

    <div class="users-table-container">
      <div v-if="filteredUsers.length === 0" class="no-users">
        <div class="no-users-icon">👤</div>
        <h3>No se encontraron usuarios</h3>
        <p>No hay usuarios que coincidan con los filtros aplicados</p>
      </div>

      <div v-else class="users-table">
        <div class="table-header">
          <div class="header-cell">Usuario</div>
          <div class="header-cell">Email</div>
          <div class="header-cell">ChococCoins</div>
          <div class="header-cell">Estado</div>
          <div class="header-cell">Fecha Registro</div>
          <div class="header-cell">Acciones</div>
        </div>

        <div
          v-for="user in paginatedUsers"
          :key="user.id"
          class="table-row"
        >
          <div class="cell user-cell">
            <div class="user-avatar">
              <img 
                v-if="user.profileImage" 
                :src="user.profileImage" 
                :alt="user.username"
                class="avatar-img"
              />
              <div v-else class="avatar-placeholder">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="user-info">
              <div class="username">{{ user.username }}</div>
              <div class="user-role">{{ user.role }}</div>
            </div>
          </div>

          <div class="cell email-cell">
            <span class="email">{{ user.email }}</span>
          </div>

          <div class="cell coins-cell">
            <div class="coins-display">
              <span class="coins-icon">🍫</span>
              <span class="coins-amount">{{ user.chococoins }}</span>
            </div>
          </div>

          <div class="cell status-cell">
            <div class="status-badges">
              <span v-if="user.isStreaming" class="status-badge live">
                🔴 En Vivo
              </span>
              <span class="status-badge online">
                🟢 Activo
              </span>
            </div>
          </div>

          <div class="cell date-cell">
            <span class="date">{{ formatDate(user.createdAt) }}</span>
          </div>

          <div class="cell actions-cell">
            <div class="action-buttons">
              <button
                @click="editUser(user)"
                class="action-btn edit-btn"
                title="Editar usuario"
              >
                ✏️
              </button>
              <button
                @click="manageCoins(user)"
                class="action-btn coins-btn"
                title="Gestionar ChococCoins"
              >
                🍫
              </button>
              <button
                @click="deleteUser(user)"
                class="action-btn delete-btn"
                title="Eliminar usuario"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          ← Anterior
        </button>
        <span class="pagination-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de Edición -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>✏️ Editar Usuario</h3>
          <button @click="closeEditModal" class="modal-close">✕</button>
        </div>
        
        <form @submit.prevent="saveUserChanges" class="edit-form">
          <div class="form-group">
            <label class="form-label">Nombre de Usuario</label>
            <input
              v-model="editingUser.username"
              type="text"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              v-model="editingUser.email"
              type="email"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Nueva Contraseña (opcional)</label>
            <input
              v-model="editingUser.newPassword"
              type="password"
              class="form-input"
              placeholder="Dejar vacío para mantener actual"
            />
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Gestión de Monedas -->
    <div v-if="showCoinsModal" class="modal-overlay" @click="closeCoinsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🍫 Gestionar ChococCoins</h3>
          <button @click="closeCoinsModal" class="modal-close">✕</button>
        </div>
        
        <div class="coins-management">
          <div class="current-balance">
            <h4>Balance Actual</h4>
            <div class="balance-display">
              <span class="balance-icon">🍫</span>
              <span class="balance-amount">{{ coinsUser?.chococoins || 0 }}</span>
            </div>
          </div>
          
          <form @submit.prevent="updateCoins" class="coins-form">
            <div class="form-group">
              <label class="form-label">Nuevo Balance</label>
              <input
                v-model.number="newCoinsAmount"
                type="number"
                min="0"
                class="form-input"
                required
              />
            </div>
            
            <div class="quick-actions">
              <button
                type="button"
                @click="addCoins(100)"
                class="quick-btn add-btn"
              >
                +100
              </button>
              <button
                type="button"
                @click="addCoins(500)"
                class="quick-btn add-btn"
              >
                +500
              </button>
              <button
                type="button"
                @click="addCoins(1000)"
                class="quick-btn add-btn"
              >
                +1000
              </button>
              <button
                type="button"
                @click="setCoins(0)"
                class="quick-btn reset-btn"
              >
                Reset
              </button>
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeCoinsModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                Actualizar Balance
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const searchQuery = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const showEditModal = ref(false)
const showCoinsModal = ref(false)
const editingUser = reactive({})
const coinsUser = ref(null)
const newCoinsAmount = ref(0)

const filteredUsers = computed(() => {
  let users = authStore.getAllUsers()
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }
  
  if (filterRole.value) {
    users = users.filter(user => user.role === filterRole.value)
  }
  
  return users
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const refreshUsers = () => {
  window.showToast?.('Lista de usuarios actualizada', 'success')
}

const editUser = (user) => {
  Object.assign(editingUser, {
    id: user.id,
    username: user.username,
    email: user.email,
    newPassword: ''
  })
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  Object.keys(editingUser).forEach(key => delete editingUser[key])
}

const saveUserChanges = () => {
  try {
    const updateData = {
      username: editingUser.username,
      email: editingUser.email
    }
    
    if (editingUser.newPassword) {
      updateData.password = editingUser.newPassword
    }
    
    authStore.updateUserCredentials(editingUser.id, updateData)
    window.showToast?.('Usuario actualizado correctamente', 'success')
    closeEditModal()
  } catch (error) {
    window.showToast?.(error.message, 'error')
  }
}

const manageCoins = (user) => {
  coinsUser.value = user
  newCoinsAmount.value = user.chococoins
  showCoinsModal.value = true
}

const closeCoinsModal = () => {
  showCoinsModal.value = false
  coinsUser.value = null
  newCoinsAmount.value = 0
}

const addCoins = (amount) => {
  newCoinsAmount.value = (coinsUser.value?.chococoins || 0) + amount
}

const setCoins = (amount) => {
  newCoinsAmount.value = amount
}

const updateCoins = () => {
  try {
    authStore.updateUserBalance(coinsUser.value.id, newCoinsAmount.value)
    window.showToast?.(`Balance actualizado a ${newCoinsAmount.value} ChococCoins`, 'success')
    closeCoinsModal()
  } catch (error) {
    window.showToast?.(error.message, 'error')
  }
}

const deleteUser = (user) => {
  if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.username}"?`)) {
    try {
      authStore.deleteUser(user.id)
      window.showToast?.('Usuario eliminado correctamente', 'success')
    } catch (error) {
      window.showToast?.(error.message, 'error')
    }
  }
}
</script>

<style scoped>
.user-management {
  width: 100%;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.management-header h2 {
  color: var(--text-color);
  margin-bottom: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-filter {
  display: flex;
  gap: 0.5rem;
}

.search-input,
.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 0.875rem;
}

.search-input {
  min-width: 200px;
}

.users-table-container {
  background: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.no-users {
  text-align: center;
  padding: 4rem 2rem;
}

.no-users-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.users-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: var(--light-gray);
  font-weight: 600;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.table-row:hover {
  background: var(--light-gray);
}

.cell {
  display: flex;
  align-items: center;
  min-height: 60px;
}

.user-cell {
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
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

.user-info {
  flex: 1;
}

.username {
  font-weight: 600;
  color: var(--text-color);
}

.user-role {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  text-transform: capitalize;
}

.email {
  color: var(--text-color);
  opacity: 0.8;
  word-break: break-all;
}

.coins-display {
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
}

.status-badges {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
}

.status-badge.live {
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
}

.status-badge.online {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.date {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.edit-btn {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.edit-btn:hover {
  background: rgba(33, 150, 243, 0.2);
}

.coins-btn {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.coins-btn:hover {
  background: rgba(255, 193, 7, 0.2);
}

.delete-btn {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.delete-btn:hover {
  background: rgba(244, 67, 54, 0.2);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--light-gray);
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--white);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-color);
  opacity: 0.7;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  opacity: 0.7;
  transition: var(--transition);
}

.modal-close:hover {
  opacity: 1;
}

.edit-form,
.coins-management {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.current-balance {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--light-gray);
  border-radius: var(--border-radius);
}

.balance-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.balance-icon {
  font-size: 2rem;
}

.balance-amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.add-btn {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.add-btn:hover {
  background: rgba(76, 175, 80, 0.2);
}

.reset-btn {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.reset-btn:hover {
  background: rgba(244, 67, 54, 0.2);
}

@media (max-width: 768px) {
  .management-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .search-filter {
    flex-direction: column;
  }

  .search-input {
    min-width: auto;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .cell {
    min-height: auto;
    padding: 0.5rem 0;
  }

  .action-buttons {
    justify-content: center;
  }

  .modal-content {
    margin: 1rem;
    max-width: none;
  }

  .quick-actions {
    justify-content: center;
  }
}
</style>