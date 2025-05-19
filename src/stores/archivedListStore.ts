import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export interface ArchivedList {
  id: number
  title: string
  userId: number
  createdDate: string
  isDone: boolean
  isActive: boolean
}

export interface Task {
  id: number
  title: string
  description?: string
  isDone: boolean
  listId: number
  createdDate: string
}

export const useArchivedListStore = defineStore('archivedList', {
  state: () => ({
    archivedLists: [] as ArchivedList[],
    isLoading: false,
    error: null as string | null,
    listTasks: {} as Record<number, Task[]>,
    loadingTasks: [] as number[]
  }),
 
  actions: {
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

    async fetchTasksForList(listId: number) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return
      }

      
      this.loadingTasks.push(listId)
      
      try {
        const response = await fetch(`/api/task/all/${listId}`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          const tasks = await response.json()
          this.listTasks[listId] = tasks
          console.log(`Pobrano zadania dla listy ${listId}:`, tasks.length)
        } else {
          const errorText = await response.text()
          console.error(`Nie udało się pobrać zadań dla listy ${listId}:`, errorText)
        }
      } catch (error) {
        console.error(`Błąd podczas pobierania zadań dla listy ${listId}:`, error)
      } finally {
        this.loadingTasks = this.loadingTasks.filter(id => id !== listId)
      }
    }
  }
})