import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export interface Task {
  id: number
  title: string
  description: string
  taskListId: number
  statusId: number
  priorityId: number
  isDone: boolean
  createdDate?: string
  modifiedDate?: string
}

export interface Status {
  id: number
  name: string
}

export interface Priority {
  id: number
  name: string
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    statuses: [] as Status[],
    priorities: [] as Priority[]
  }),
  actions: {
    async fetchTasks(listId: number) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return
      }

      try {
        // Zaktualizowana ścieżka API, aby dopasować endpoint w kontrolerze
        const response = await fetch(`/api/task/all/${listId}`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          // Aktualizujemy lub dodajemy nowe zadania, zachowując istniejące dla innych list
          const existingTasksForOtherLists = this.tasks.filter(t => t.taskListId !== listId)
          this.tasks = [...existingTasksForOtherLists, ...data]
        } else {
          console.error(`Nie udało się pobrać zadań dla listy ID ${listId}:`, await response.text())
        }
      } catch (error) {
        console.error('Błąd podczas pobierania zadań:', error)
      }
    },

    async fetchStatuses() {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return
      }

      try {
        const response = await fetch('/api/task/statuses', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          this.statuses = await response.json()
        } else {
          console.error('Nie udało się pobrać statusów:', await response.text())
        }
      } catch (error) {
        console.error('Błąd podczas pobierania statusów:', error)
      }
    },

    async fetchPriorities() {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return
      }

      try {
        const response = await fetch('/api/task/priorities', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          this.priorities = await response.json()
        } else {
          console.error('Nie udało się pobrać priorytetów:', await response.text())
        }
      } catch (error) {
        console.error('Błąd podczas pobierania priorytetów:', error)
      }
    },

    async addTask(task: Omit<Task, 'id'>) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return
      }

      try {
        const response = await fetch('/api/task/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify(task)
        })
        
        if (response.ok) {
          // Po dodaniu odświeżamy listę zadań dla tej listy
          await this.fetchTasks(task.taskListId)
        } else {
          console.error('Nie udało się dodać zadania:', await response.text())
        }
      } catch (error) {
        console.error('Błąd podczas dodawania zadania:', error)
      }
    },

    async deleteTask(id: number) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return
      }

      // Znajdź task aby zapamiętać jego listId do późniejszego odświeżenia
      const task = this.tasks.find(t => t.id === id)
      if (!task) {
        console.error('Nie znaleziono zadania o ID:', id)
        return
      }

      try {
        const response = await fetch(`/api/task/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          // Po usunięciu odświeżamy listę zadań
          await this.fetchTasks(task.taskListId)
        } else {
          console.error('Nie udało się usunąć zadania:', await response.text())
        }
      } catch (error) {
        console.error('Błąd podczas usuwania zadania:', error)
      }
    },

    async toggleTaskCompletion(task: Task) {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.error('Brak tokena — użytkownik nie jest zalogowany')
        return
      }

      try {
        const updatedTask = { ...task, isDone: !task.isDone }
        
        // Zaktualizowana ścieżka API, aby używać endpoint edit zamiast update
        const response = await fetch(`/api/task/edit`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify(updatedTask)
        })
        
        if (response.ok) {
          // Aktualizujemy zadanie w tablicy
          const index = this.tasks.findIndex(t => t.id === task.id)
          if (index !== -1) {
            this.tasks[index] = updatedTask
          }
        } else {
          console.error('Nie udało się zaktualizować zadania:', await response.text())
        }
      } catch (error) {
        console.error('Błąd podczas aktualizacji zadania:', error)
      }
    }
  }
})