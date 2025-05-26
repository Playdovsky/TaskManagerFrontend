import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export interface List {
  id: number
  title: string
  userId: number
  createdDate: string
  isDone: boolean
  isActive: boolean
}

export const useListStore = defineStore('list', {
  state: () => ({
    lists: [] as List[],
    archivedLists: [] as List[], 
    isLoading: false,
    error: null as string | null
  }),
  
  actions: {
    async fetchLists() {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return
      }

      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('/api/tasklist/all', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          this.lists = await response.json()
          console.log('Pobrano listy zadań:', this.lists.length)
        } else {
          const errorText = await response.text()
          console.error('Nie udało się pobrać list zadań:', errorText)
          this.error = `Błąd: ${response.status} - ${errorText}`
        }
      } catch (error) {
        console.error('Błąd podczas pobierania list zadań:', error)
        this.error = error instanceof Error ? error.message : 'Nieznany błąd'
      } finally {
        this.isLoading = false
      }
    },

    async fetchArchivedLists() {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return
      }

      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('/api/tasklist/archived', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          this.archivedLists = await response.json()
          console.log('Pobrano zarchiwizowane listy zadań:', this.archivedLists.length)
        } else {
          const errorText = await response.text()
          console.error('Nie udało się pobrać zarchiwizowanych list zadań:', errorText)
          this.error = `Błąd: ${response.status} - ${errorText}`
        }
      } catch (error) {
        console.error('Błąd podczas pobierania zarchiwizowanych list zadań:', error)
        this.error = error instanceof Error ? error.message : 'Nieznany błąd'
      } finally {
        this.isLoading = false
      }
    },

    async addList(title: string) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return false
      }
     
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('/api/tasklist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify({ title })
        })
       
        if (response.ok) {
          await this.fetchLists()
          return true
        } else {
          const errorText = await response.text()
          console.error('Nie udało się dodać listy zadań:', errorText)
          this.error = `Błąd: ${response.status} - ${errorText}`
          return false
        }
      } catch (error) {
        console.error('Błąd podczas dodawania listy zadań:', error)
        this.error = error instanceof Error ? error.message : 'Nieznany błąd'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async editList(id: number, title: string) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return false
      }

      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('/api/tasklist/edit', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify({ id, title })
        })
        
        if (response.ok) {
          await this.fetchLists()
          return true
        } else {
          const errorText = await response.text()
          console.error('Nie udało się edytować listy zadań:', errorText)
          this.error = `Błąd: ${response.status} - ${errorText}`
          return false
        }
      } catch (error) {
        console.error('Błąd podczas edytowania listy zadań:', error)
        this.error = error instanceof Error ? error.message : 'Nieznany błąd'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async deleteList(id: number) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return false
      }

      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch(`/api/tasklist/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          await this.fetchLists()
          return true
        } else {
          const errorText = await response.text()
          console.error('Nie udało się usunąć listy zadań:', errorText)
          this.error = `Błąd: ${response.status} - ${errorText}`
          return false
        }
      } catch (error) {
        console.error('Błąd podczas usuwania listy zadań:', error)
        this.error = error instanceof Error ? error.message : 'Nieznany błąd'
        return false
      } finally {
        this.isLoading = false
      }
    },

    // funkcja do oznaczania listy jako ukończonej
    async markListAsCompleted(id: number) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return false
      }

      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('/api/tasklist/complete', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify({ id })
        })
        
        if (response.ok) {
          await this.fetchLists()
          await this.fetchArchivedLists()
          return true
        } else {
          const errorText = await response.text()
          console.error('Nie udało się oznaczyć listy jako ukończonej:', errorText)
          this.error = `Błąd: ${response.status} - ${errorText}`
          return false
        }
      } catch (error) {
        console.error('Błąd podczas oznaczania listy jako ukończonej:', error)
        this.error = error instanceof Error ? error.message : 'Nieznany błąd'
        return false
      } finally {
        this.isLoading = false
      }
    }
  }
})