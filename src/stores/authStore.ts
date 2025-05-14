import { defineStore } from 'pinia'
import { useListStore } from './listStore'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId') || '0') : null,
    username: localStorage.getItem('username') || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  
  actions: {
    async login(token: string, userId: number, username: string) {
      this.token = token
      this.userId = userId
      this.username = username
      
      // Zapisanie w localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId.toString())
      localStorage.setItem('username', username)
      
      // Wczytanie list zadań po zalogowaniu
      const listStore = useListStore()
      await listStore.fetchLists()
    },
    
   logout(router: ReturnType<typeof useRouter>) {
  this.token = null
  this.userId = null
  this.username = null

  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('username')

  router.push('/login')
},
    
        async initialize() {
      // Pobranie danych z localStorage
      this.token = localStorage.getItem('token') || null
      const storedUserId = localStorage.getItem('userId')
      this.userId = storedUserId && !isNaN(parseInt(storedUserId)) ? parseInt(storedUserId) : null
      this.username = localStorage.getItem('username') || null
      
      // Jeśli użytkownik jest zalogowany, pobierz listy zadań
      if (this.isAuthenticated && this.userId !== null) {
        const listStore = useListStore()
        await listStore.fetchLists()
      }
    }
  }
})