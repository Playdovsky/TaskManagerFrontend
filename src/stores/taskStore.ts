import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import { useListStore } from './listStore'

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
  isActive: boolean
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
        const response = await fetch(`/api/task/all/${listId}`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          const existingTasksForOtherLists = this.tasks.filter(t => t.taskListId !== listId)
          this.tasks = [...existingTasksForOtherLists, ...data]
          
          this.checkListCompletion(listId)
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

      
      const task = this.tasks.find(t => t.id === id)
      if (!task) {
        console.error('Nie znaleziono zadania o ID:', id)
        return
      }

      const listId = task.taskListId

      try {
        const response = await fetch(`/api/task/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (response.ok) {
          await this.fetchTasks(listId)
          this.checkListCompletion(listId)
        } else {
          console.error('Nie udało się usunąć zadania:', await response.text())
        }
      } catch (error) {
        console.error('Błąd podczas usuwania zadania:', error)
      }
    },
    
async updateTask(task: Task) {
  const authStore = useAuthStore()
  if (!authStore.token) {
    console.error('Brak tokena — użytkownik nie jest zalogowany')
    return
  }

  try {
    console.log('Aktualizacja zadania:', task) 
    
    const response = await fetch(`/api/task/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(task)
    })
    
    if (response.ok) {
      const updatedTask = await response.json()
      const index = this.tasks.findIndex(t => t.id === task.id)
      if (index !== -1) {
        this.tasks[index] = updatedTask
      } else {
        console.error('Nie znaleziono zadania o ID:', task.id)
      }
      
      this.checkListCompletion(task.taskListId)
    } else {
      console.error('Nie udało się zaktualizować zadania:', await response.text())
    }
  } catch (error) {
    console.error('Błąd podczas aktualizacji zadania:', error)
  }
},

    async checkListCompletion(listId: number) {
      const tasksInList = this.tasks.filter(t => t.taskListId === listId)
      
      if (tasksInList.length === 0) return
      
      const allTasksCompleted = tasksInList.every(task => task.isDone === true)
      
      if (allTasksCompleted) {
        const listStore = useListStore()
        await listStore.markListAsCompleted(listId)
      }
    }
  }
})