<template>
  <div class="coin-management">
    <div class="management-header">
      <h2>🍫 Gestión de ChococCoins</h2>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-label">Total en Circulación:</span>
          <span class="stat-value">{{ totalCoins }} ChococCoins</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Promedio por Usuario:</span>
          <span class="stat-value">{{ averageCoins }} ChococCoins</span>
        </div>
      </div>
    </div>

    <!-- Acciones Rápidas -->
    <div class="quick-actions-section">
      <h3>⚡ Acciones Rápidas</h3>
      <div class="quick-actions-grid">
        <div class="quick-action-card">
          <div class="action-icon">🎁</div>
          <h4>Bonificación Masiva</h4>
          <p>Otorgar ChococCoins a todos los usuarios</p>
          <div class="action-form">
            <input
              v-model.number="massBonus"
              type="number"
              min="1"
              placeholder="Cantidad"
              class="form-input"
            />
            <button @click="giveMassBonus" class="btn btn-primary btn-small">
              Otorgar a Todos
            </button>
          </div>
        </div>

        <div class="quick-action-card">
          <div class="action-icon">🏆</div>
          <h4>Premio por Streaming</h4>
          <p>Recompensar a streamers activos</p>
          <div class="action-form">
            <input
              v-model.number="streamingBonus"
              type="number"
              min="1"
              placeholder="Cantidad"
              class="form-input"
            />
            <button @click="giveStreamingBonus" class="btn btn-primary btn-small">
              Premiar Streamers
            </button>
          </div>
        </div>

        <div class="quick-action-card">
          <div class="action-icon">🔄</div>
          <h4>Rebalanceo</h4>
          <p>Establecer balance mínimo para todos</p>
          <div class="action-form">
            <input
              v-model.number="minimumBalance"
              type="number"
              min="0"
              placeholder="Balance mínimo"
              class="form-input"
            />
            <button @click="rebalanceUsers" class="btn btn-secondary btn-small">
              Rebalancear
            </button>
          </div>
        </div>

        <div class="quick-action-card">
          <div class="action-icon">📊</div>
          <h4>Estadísticas</h4>
          <p>Ver distribución de ChococCoins</p>
          <button @click="showStats = !showStats" class="btn btn-secondary btn-small">
            {{ showStats ? 'Ocultar' : 'Ver' }} Estadísticas
          </button>
        </div>
      </div>
    </div>

    <!-- Estadísticas Detalladas -->
    <div v-if="showStats" class="stats-section">
      <h3>📊 Estadísticas Detalladas</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">👑</span>
            <span class="stat-title">Usuario con Más Coins</span>
          </div>
          <div class="stat-content">
            <div class="stat-user">
              <span class="user-name">{{ richestUser?.username || 'N/A' }}</span>
              <span class="user-coins">{{ richestUser?.chococoins || 0 }} 🍫</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">📈</span>
            <span class="stat-title">Distribución</span>
          </div>
          <div class="stat-content">
            <div class="distribution-bars">
              <div class="distribution-item">
                <span class="range-label">0-100</span>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${getDistributionPercentage(0, 100)}%` }"
                  ></div>
                </div>
                <span class="range-count">{{ getUsersInRange(0, 100) }}</span>
              </div>
              <div class="distribution-item">
                <span class="range-label">101-500</span>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${getDistributionPercentage(101, 500)}%` }"
                  ></div>
                </div>
                <span class="range-count">{{ getUsersInRange(101, 500) }}</span>
              </div>
              <div class="distribution-item">
                <span class="range-label">500+</span>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${getDistributionPercentage(501, Infinity)}%` }"
                  ></div>
                </div>
                <span class="range-count">{{ getUsersInRange(501, Infinity) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">⏰</span>
            <span class="stat-title">Actividad Reciente</span>
          </div>
          <div class="stat-content">
            <div class="recent-activity">
              <div class="activity-item">
                <span class="activity-text">Usuarios registrados hoy</span>
                <span class="activity-count">{{ getUsersRegisteredToday() }}</span>
              </div>
              <div class="activity-item">
                <span class="activity-text">Streamers activos</span>
                <span class="activity-count">{{ activeStreamers }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Usuarios con Gestión Individual -->
    <div class="users-coins-section">
      <div class="section-header">
        <h3>👥 Gestión Individual</h3>
        <div class="search-sort">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar usuario..."
            class="search-input"
          />
          <select v-model="sortBy" class="sort-select">
            <option value="coins-desc">Más ChococCoins</option>
            <option value="coins-asc">Menos ChococCoins</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
          </select>
        </div>
      </div>

      <div class="users-coins-grid">
        <div
          v-for="user in sortedUsers"
          :key="user.id"
          class="user-coin-card"
        >
          <div class="user-card-header">
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
            <div class="current-coins">
              <span class="coins-icon">🍫</span>
              <span class="coins-amount">{{ user.chococoins }}</span>
            </div>
          </div>

          <div class="coin-actions">
            <div class="quick-amounts">
              <button
                v-for="amount in quickAmounts"
                :key="amount"
                @click="adjustCoins(user, amount)"
                class="quick-amount-btn add"
              >
                +{{ amount }}
              </button>
              <button
                v-for="amount in quickAmounts"
                :key="`minus-${amount}`"
                @click="adjustCoins(user, -amount)"
                class="quick-amount-btn subtract"
              >
                -{{ amount }}
              </button>
            </div>

            <div class="custom-amount">
              <input
                v-model.number="customAmounts[user.id]"
                type="number"
                placeholder="Cantidad personalizada"
                class="custom-input"
              />
              <button
                @click="setCustomAmount(user)"
                class="btn btn-primary btn-small"
              >
                Establecer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Transacciones (Simulado) -->
    <div class="transaction-history">
      <h3>📋 Historial Reciente</h3>
      <div class="history-list">
        <div
          v-for="transaction in recentTransactions"
          :key="transaction.id"
          class="transaction-item"
        >
          <div class="transaction-icon">
            {{ transaction.type === 'add' ? '➕' : transaction.type === 'subtract' ? '➖' : '🔄' }}
          </div>
          <div class="transaction-details">
            <div class="transaction-description">{{ transaction.description }}</div>
            <div class="transaction-time">{{ formatTime(transaction.timestamp) }}</div>
          </div>
          <div class="transaction-amount" :class="transaction.type">
            {{ transaction.type === 'subtract' ? '-' : '+' }}{{ transaction.amount }} 🍫
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const massBonus = ref(50)
const streamingBonus = ref(100)
const minimumBalance = ref(100)
const showStats = ref(false)
const searchQuery = ref('')
const sortBy = ref('coins-desc')
const customAmounts = reactive({})
const quickAmounts = [10, 50, 100]
const recentTransactions = ref([])

const totalCoins = computed(() => {
  return authStore.users.reduce((total, user) => total + (user.chococoins || 0), 0)
})

const averageCoins = computed(() => {
  const users = authStore.getAllUsers()
  if (users.length === 0) return 0
  return Math.round(users.reduce((total, user) => total + user.chococoins, 0) / users.length)
})

const richestUser = computed(() => {
  const users = authStore.getAllUsers()
  return users.reduce((richest, user) => 
    user.chococoins > (richest?.chococoins || 0) ? user : richest, null
  )
})

const activeStreamers = computed(() => {
  return authStore.users.filter(u => u.role === 'streamer' && u.isStreaming).length
})

const filteredUsers = computed(() => {
  let users = authStore.getAllUsers()
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(user => 
      user.username.toLowerCase().includes(query)
    )
  }
  
  return users
})

const sortedUsers = computed(() => {
  const users = [...filteredUsers.value]
  
  switch (sortBy.value) {
    case 'coins-desc':
      return users.sort((a, b) => b.chococoins - a.chococoins)
    case 'coins-asc':
      return users.sort((a, b) => a.chococoins - b.chococoins)
    case 'name-asc':
      return users.sort((a, b) => a.username.localeCompare(b.username))
    case 'name-desc':
      return users.sort((a, b) => b.username.localeCompare(a.username))
    default:
      return users
  }
})

const giveMassBonus = () => {
  if (!massBonus.value || massBonus.value <= 0) {
    window.showToast?.('Ingresa una cantidad válida', 'error')
    return
  }
  
  const users = authStore.getAllUsers()
  users.forEach(user => {
    authStore.updateUserBalance(user.id, user.chococoins + massBonus.value)
  })
  
  addTransaction('add', `Bonificación masiva de ${massBonus.value} ChococCoins a ${users.length} usuarios`, massBonus.value * users.length)
  window.showToast?.(`¡${massBonus.value} ChococCoins otorgados a ${users.length} usuarios!`, 'success')
}

const giveStreamingBonus = () => {
  if (!streamingBonus.value || streamingBonus.value <= 0) {
    window.showToast?.('Ingresa una cantidad válida', 'error')
    return
  }
  
  const streamers = authStore.users.filter(u => u.role === 'streamer')
  streamers.forEach(streamer => {
    authStore.updateUserBalance(streamer.id, streamer.chococoins + streamingBonus.value)
  })
  
  addTransaction('add', `Premio por streaming de ${streamingBonus.value} ChococCoins a ${streamers.length} streamers`, streamingBonus.value * streamers.length)
  window.showToast?.(`¡${streamingBonus.value} ChococCoins otorgados a ${streamers.length} streamers!`, 'success')
}

const rebalanceUsers = () => {
  if (minimumBalance.value < 0) {
    window.showToast?.('El balance mínimo no puede ser negativo', 'error')
    return
  }
  
  const users = authStore.getAllUsers()
  let rebalancedCount = 0
  
  users.forEach(user => {
    if (user.chococoins < minimumBalance.value) {
      authStore.updateUserBalance(user.id, minimumBalance.value)
      rebalancedCount++
    }
  })
  
  if (rebalancedCount > 0) {
    addTransaction('set', `Rebalanceo: ${rebalancedCount} usuarios ajustados al mínimo de ${minimumBalance.value}`, 0)
    window.showToast?.(`${rebalancedCount} usuarios rebalanceados`, 'success')
  } else {
    window.showToast?.('Todos los usuarios ya tienen el balance mínimo', 'info')
  }
}

const adjustCoins = (user, amount) => {
  const newBalance = Math.max(0, user.chococoins + amount)
  authStore.updateUserBalance(user.id, newBalance)
  
  const action = amount > 0 ? 'add' : 'subtract'
  addTransaction(action, `${amount > 0 ? 'Agregados' : 'Removidos'} ${Math.abs(amount)} ChococCoins ${amount > 0 ? 'a' : 'de'} ${user.username}`, Math.abs(amount))
  
  window.showToast?.(`${amount > 0 ? '+' : ''}${amount} ChococCoins para ${user.username}`, 'success')
}

const setCustomAmount = (user) => {
  const amount = customAmounts[user.id]
  if (amount === undefined || amount < 0) {
    window.showToast?.('Ingresa una cantidad válida', 'error')
    return
  }
  
  authStore.updateUserBalance(user.id, amount)
  addTransaction('set', `Balance de ${user.username} establecido en ${amount} ChococCoins`, amount)
  window.showToast?.(`Balance de ${user.username} establecido en ${amount} ChococCoins`, 'success')
  
  customAmounts[user.id] = 0
}

const getUsersInRange = (min, max) => {
  const users = authStore.getAllUsers()
  return users.filter(user => user.chococoins >= min && user.chococoins <= max).length
}

const getDistributionPercentage = (min, max) => {
  const users = authStore.getAllUsers()
  if (users.length === 0) return 0
  const usersInRange = getUsersInRange(min, max)
  return (usersInRange / users.length) * 100
}

const getUsersRegisteredToday = () => {
  const today = new Date().toDateString()
  return authStore.getAllUsers().filter(user => 
    new Date(user.createdAt).toDateString() === today
  ).length
}

const addTransaction = (type, description, amount) => {
  const transaction = {
    id: Date.now(),
    type,
    description,
    amount,
    timestamp: new Date().toISOString()
  }
  
  recentTransactions.value.unshift(transaction)
  if (recentTransactions.value.length > 10) {
    recentTransactions.value = recentTransactions.value.slice(0, 10)
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Inicializar custom amounts
  authStore.getAllUsers().forEach(user => {
    customAmounts[user.id] = user.chococoins
  })
  
  // Agregar algunas transacciones de ejemplo
  addTransaction('add', 'Bonificación de bienvenida otorgada', 100)
  addTransaction('set', 'Balance inicial establecido', 50)
})
</script>

<style scoped>
.coin-management {
  width: 100%;
}

.management-header {
  margin-bottom: 2rem;
}

.management-header h2 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.header-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.quick-actions-section {
  margin-bottom: 2rem;
}

.quick-actions-section h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.quick-action-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  text-align: center;
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.quick-action-card h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.quick-action-card p {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.action-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-form .form-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
}

.stats-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--light-gray);
  border-radius: var(--border-radius);
}

.stats-section h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--white);
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-title {
  font-weight: 600;
  color: var(--text-color);
}

.stat-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-weight: 600;
  color: var(--text-color);
}

.user-coins {
  font-weight: 600;
  color: var(--accent-color);
}

.distribution-bars {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-label {
  width: 60px;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.range-count {
  width: 30px;
  text-align: right;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-color);
}

.recent-activity {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-text {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.8;
}

.activity-count {
  font-weight: 600;
  color: var(--text-color);
}

.users-coins-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h3 {
  color: var(--text-color);
  margin-bottom: 0;
}

.search-sort {
  display: flex;
  gap: 0.5rem;
}

.search-input,
.sort-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
}

.users-coins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
}

.user-coin-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.user-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--light-gray);
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

.current-coins {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.coins-icon {
  font-size: 1.2rem;
}

.coin-actions {
  padding: 1rem;
}

.quick-amounts {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.quick-amount-btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;
  transition: var(--transition);
}

.quick-amount-btn.add {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.quick-amount-btn.add:hover {
  background: rgba(76, 175, 80, 0.2);
}

.quick-amount-btn.subtract {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.quick-amount-btn.subtract:hover {
  background: rgba(244, 67, 54, 0.2);
}

.custom-amount {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.custom-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
}

.transaction-history {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.transaction-history h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--light-gray);
  border-radius: var(--border-radius);
}

.transaction-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.transaction-details {
  flex: 1;
}

.transaction-description {
  font-size: 0.875rem;
  color: var(--text-color);
}

.transaction-time {
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
}

.transaction-amount {
  font-weight: 600;
  font-size: 0.875rem;
}

.transaction-amount.add {
  color: #4caf50;
}

.transaction-amount.subtract {
  color: #f44336;
}

.transaction-amount.set {
  color: var(--text-color);
}

@media (max-width: 768px) {
  .header-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-sort {
    justify-content: center;
  }
  
  .users-coins-grid {
    grid-template-columns: 1fr;
  }
  
  .user-card-header {
    flex-wrap: wrap;
  }
  
  .quick-amounts {
    justify-content: center;
  }
}
</style>