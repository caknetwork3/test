// Servicio para integración con API de Twitch
class TwitchApiService {
  constructor() {
    // Configuración básica de la API de Twitch
    this.clientId = 'your_twitch_client_id' // Reemplazar con Client ID real
    this.baseUrl = 'https://api.twitch.tv/helix'
    this.tokenUrl = 'https://id.twitch.tv/oauth2/token'
    this.accessToken = null
    
    // Lista de streamers de CAK (usernames de Twitch)
    this.cakStreamers = [
      'dexo',
      'streamer1',
      'streamer2',
      'streamer3',
      'streamer4'
    ]
  }

  // Obtener token de acceso de la aplicación
  async getAppAccessToken() {
    try {
      // En un entorno real, esto se haría en el backend por seguridad
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: 'your_client_secret', // Esto NUNCA debe estar en el frontend
          grant_type: 'client_credentials'
        })
      })

      if (response.ok) {
        const data = await response.json()
        this.accessToken = data.access_token
        return data.access_token
      }
      throw new Error('Failed to get access token')
    } catch (error) {
      console.error('Error getting Twitch access token:', error)
      return null
    }
  }

  // Obtener información de usuarios por username
  async getUsersByLogin(usernames) {
    if (!this.accessToken) {
      await this.getAppAccessToken()
    }

    if (!this.accessToken) {
      return this.getMockUsers(usernames)
    }

    try {
      const params = new URLSearchParams()
      usernames.forEach(username => params.append('login', username))

      const response = await fetch(`${this.baseUrl}/users?${params}`, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        return data.data
      }
      throw new Error('Failed to fetch users')
    } catch (error) {
      console.error('Error fetching Twitch users:', error)
      return this.getMockUsers(usernames)
    }
  }

  // Obtener streams en vivo
  async getLiveStreams(userIds = null) {
    if (!this.accessToken) {
      await this.getAppAccessToken()
    }

    if (!this.accessToken) {
      return this.getMockLiveStreams()
    }

    try {
      let url = `${this.baseUrl}/streams`
      
      if (userIds && userIds.length > 0) {
        const params = new URLSearchParams()
        userIds.forEach(id => params.append('user_id', id))
        url += `?${params}`
      }

      const response = await fetch(url, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        return data.data
      }
      throw new Error('Failed to fetch streams')
    } catch (error) {
      console.error('Error fetching Twitch streams:', error)
      return this.getMockLiveStreams()
    }
  }

  // Obtener streamers de CAK que están en vivo
  async getCAKLiveStreamers() {
    try {
      // Primero obtenemos la información de los usuarios
      const users = await this.getUsersByLogin(this.cakStreamers)
      
      if (!users || users.length === 0) {
        return this.getMockLiveStreamers()
      }

      // Extraemos los IDs de usuario
      const userIds = users.map(user => user.id)
      
      // Obtenemos los streams en vivo
      const liveStreams = await this.getLiveStreams(userIds)
      
      // Combinamos la información de usuarios con streams
      const liveStreamers = liveStreams.map(stream => {
        const user = users.find(u => u.id === stream.user_id)
        return {
          id: stream.user_id,
          username: stream.user_login,
          displayName: stream.user_name,
          title: stream.title,
          game: stream.game_name,
          viewers: stream.viewer_count,
          thumbnail: stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180'),
          profileImage: user?.profile_image_url || '',
          isLive: true,
          startedAt: stream.started_at,
          language: stream.language,
          tags: stream.tag_ids || []
        }
      })

      return liveStreamers
    } catch (error) {
      console.error('Error getting CAK live streamers:', error)
      return this.getMockLiveStreamers()
    }
  }

  // Datos mock para desarrollo/fallback
  getMockUsers(usernames) {
    return usernames.map((username, index) => ({
      id: `${100000 + index}`,
      login: username,
      display_name: username.charAt(0).toUpperCase() + username.slice(1),
      profile_image_url: `https://via.placeholder.com/150/FF69B4/FFFFFF?text=${username.charAt(0).toUpperCase()}`,
      description: `Streamer de CAK - ${username}`,
      view_count: Math.floor(Math.random() * 100000),
      follower_count: Math.floor(Math.random() * 50000)
    }))
  }

  getMockLiveStreams() {
    const mockStreams = [
      {
        id: '1',
        user_id: '100000',
        user_login: 'dexo',
        user_name: 'Dexo',
        game_id: '21779',
        game_name: 'League of Legends',
        title: '🔥 RANKED SOLO/DUO - SUBIENDO A DIAMANTE | !discord !redes',
        viewer_count: Math.floor(Math.random() * 1000) + 100,
        started_at: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        language: 'es',
        thumbnail_url: 'https://via.placeholder.com/320x180/9146FF/FFFFFF?text=LIVE',
        tag_ids: ['6ea6bca4-4712-4ab9-a906-e3336a9d8039']
      },
      {
        id: '2',
        user_id: '100001',
        user_login: 'streamer1',
        user_name: 'Streamer1',
        game_id: '32982',
        game_name: 'Grand Theft Auto V',
        title: '🎮 GTA V RP - Aventuras en Los Santos | CAK Gaming',
        viewer_count: Math.floor(Math.random() * 500) + 50,
        started_at: new Date(Date.now() - Math.random() * 7200000).toISOString(),
        language: 'es',
        thumbnail_url: 'https://via.placeholder.com/320x180/FF6B6B/FFFFFF?text=LIVE',
        tag_ids: []
      }
    ]

    // Retornar solo algunos streams aleatorios para simular variabilidad
    return mockStreams.filter(() => Math.random() > 0.3)
  }

  getMockLiveStreamers() {
    const mockData = this.getMockLiveStreams()
    const mockUsers = this.getMockUsers(['dexo', 'streamer1', 'streamer2'])
    
    return mockData.map(stream => {
      const user = mockUsers.find(u => u.id === stream.user_id)
      return {
        id: stream.user_id,
        username: stream.user_login,
        displayName: stream.user_name,
        title: stream.title,
        game: stream.game_name,
        viewers: stream.viewer_count,
        thumbnail: stream.thumbnail_url,
        profileImage: user?.profile_image_url || '',
        isLive: true,
        startedAt: stream.started_at,
        language: stream.language,
        tags: stream.tag_ids || []
      }
    })
  }

  // Formatear número de viewers
  formatViewerCount(count) {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
  }

  // Calcular tiempo desde que empezó el stream
  getStreamDuration(startedAt) {
    const start = new Date(startedAt)
    const now = new Date()
    const diff = now - start
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Obtener URL del stream de Twitch
  getStreamUrl(username) {
    return `https://www.twitch.tv/${username}`
  }
}

// Instancia singleton del servicio
export const twitchApi = new TwitchApiService()
export default twitchApi