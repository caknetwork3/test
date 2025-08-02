import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    users: [],
    notifications: []
  }),

  getters: {
    isAdmin: (state) => {
      return state.user && state.user.role === 'admin'
    },
    currentUser: (state) => state.user,
    userBalance: (state) => {
      return state.user ? state.user.chococoins : 0
    },
    unreadNotifications: (state) => {
      return state.notifications.filter(n => !n.read).length
    }
  },

  actions: {
    // Inicializar datos desde localStorage
    initializeStore() {
      const savedUsers = localStorage.getItem('cak_users')
      const savedCurrentUser = localStorage.getItem('cak_current_user')
      const savedNotifications = localStorage.getItem('cak_notifications')

      if (savedUsers) {
        this.users = JSON.parse(savedUsers)
      } else {
        // Crear usuario admin por defecto
        this.createDefaultAdmin()
      }

      if (savedCurrentUser) {
        this.user = JSON.parse(savedCurrentUser)
        this.isLoggedIn = true
      }

      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications)
      }
    },

    // Crear usuario administrador por defecto
    createDefaultAdmin() {
      const adminUser = {
        id: 'admin_dexo',
        username: 'dexo',
        email: 'dexo@cak.com',
        password: '123',
        role: 'admin',
        chococoins: 10000,
        profileImage: null,
        bio: 'Administrador principal de CAK',
        socialLinks: {
          twitch: '',
          youtube: '',
          twitter: '',
          instagram: ''
        },
        isStreaming: false,
        createdAt: new Date().toISOString()
      }

      this.users.push(adminUser)
      this.saveUsers()
    },

    // Registrar nuevo usuario
    register(userData) {
      const existingUser = this.users.find(u => 
        u.username === userData.username || u.email === userData.email
      )

      if (existingUser) {
        throw new Error('El usuario o email ya existe')
      }

      const newUser = {
        id: `user_${Date.now()}`,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: 'streamer',
        chococoins: 100, // Balance inicial
        profileImage: null,
        bio: '',
        socialLinks: {
          twitch: '',
          youtube: '',
          twitter: '',
          instagram: ''
        },
        isStreaming: false,
        createdAt: new Date().toISOString()
      }

      this.users.push(newUser)
      this.saveUsers()
      return newUser
    },

    // Iniciar sesión
    login(credentials) {
      const user = this.users.find(u => 
        (u.username === credentials.username || u.email === credentials.username) &&
        u.password === credentials.password
      )

      if (!user) {
        throw new Error('Credenciales incorrectas')
      }

      this.user = user
      this.isLoggedIn = true
      localStorage.setItem('cak_current_user', JSON.stringify(user))
      return user
    },

    // Cerrar sesión
    logout() {
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('cak_current_user')
    },

    // Actualizar perfil del usuario actual
    updateProfile(profileData) {
      if (!this.user) return

      const userIndex = this.users.findIndex(u => u.id === this.user.id)
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...profileData }
        this.user = this.users[userIndex]
        localStorage.setItem('cak_current_user', JSON.stringify(this.user))
        this.saveUsers()
      }
    },

    // Cambiar contraseña
    changePassword(oldPassword, newPassword) {
      if (!this.user) throw new Error('No hay usuario logueado')
      
      if (this.user.password !== oldPassword) {
        throw new Error('Contraseña actual incorrecta')
      }

      const userIndex = this.users.findIndex(u => u.id === this.user.id)
      if (userIndex !== -1) {
        this.users[userIndex].password = newPassword
        this.user.password = newPassword
        localStorage.setItem('cak_current_user', JSON.stringify(this.user))
        this.saveUsers()
      }
    },

    // Funciones de administrador
    getAllUsers() {
      return this.users.filter(u => u.role !== 'admin')
    },

    updateUserBalance(userId, newBalance) {
      if (!this.isAdmin) throw new Error('No tienes permisos de administrador')
      
      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        this.users[userIndex].chococoins = newBalance
        this.saveUsers()
        
        // Si es el usuario actual, actualizar también
        if (this.user && this.user.id === userId) {
          this.user.chococoins = newBalance
          localStorage.setItem('cak_current_user', JSON.stringify(this.user))
        }
      }
    },

    deleteUser(userId) {
      if (!this.isAdmin) throw new Error('No tienes permisos de administrador')
      
      this.users = this.users.filter(u => u.id !== userId)
      this.saveUsers()
    },

    updateUserCredentials(userId, newData) {
      if (!this.isAdmin) throw new Error('No tienes permisos de administrador')
      
      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...newData }
        this.saveUsers()
      }
    },

    // Sistema de notificaciones
    addNotification(notification) {
      const newNotification = {
        id: `notif_${Date.now()}`,
        message: notification.message,
        type: notification.type || 'info',
        read: false,
        createdAt: new Date().toISOString(),
        targetUsers: notification.targetUsers || 'all'
      }

      this.notifications.unshift(newNotification)
      this.saveNotifications()
    },

    markNotificationAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
        this.saveNotifications()
      }
    },

    markAllNotificationsAsRead() {
      this.notifications.forEach(n => n.read = true)
      this.saveNotifications()
    },

    getUserNotifications() {
      if (!this.user) return []
      
      return this.notifications.filter(n => 
        n.targetUsers === 'all' || 
        (Array.isArray(n.targetUsers) && n.targetUsers.includes(this.user.id))
      )
    },

    // Funciones de almacenamiento
    saveUsers() {
      localStorage.setItem('cak_users', JSON.stringify(this.users))
    },

    saveNotifications() {
      localStorage.setItem('cak_notifications', JSON.stringify(this.notifications))
    },

    // Buscar streamers
    searchStreamers(query) {
      if (!query) return this.users.filter(u => u.role === 'streamer')
      
      const searchTerm = query.toLowerCase()
      return this.users.filter(u => 
        u.role === 'streamer' && 
        (u.username.toLowerCase().includes(searchTerm) ||
         u.bio.toLowerCase().includes(searchTerm))
      )
    },

    // Obtener streamer por ID
    getStreamerById(id) {
      return this.users.find(u => u.id === id && u.role === 'streamer')
    }
  }
})