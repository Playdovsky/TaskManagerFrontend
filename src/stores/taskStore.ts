import { defineStore } from 'pinia'

export interface Task {
  id: number
  taskListId: number
  title: string
  description?: string
  statusId: number
  priorityId: number
  addedDate: string
  isDone: boolean
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
    priorities: [] as Priority[],
    currentListId: 0
  }),
  actions: {
    async fetchTasks(listId: number) {
      this.currentListId = listId
      const response = await fetch(`/api/task/all/${listId}`)
      if (response.ok) {
        this.tasks = await response.json()
      } else {
        console.error('Błąd podczas pobierania zadań')
      }
    },
    async addTask(task: Omit<Task, 'id' | 'addedDate' | 'isActive'>) {
      const response = await fetch('/api/task/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...task,
          addedDate: new Date().toISOString(),
          isActive: true
        })
      })

      if (response.ok) {
        await this.fetchTasks(this.currentListId) // odśwież listę
      } else {
        console.error('Nie udało się dodać zadania')
      }
    },
    async deleteTask(id: number) {
      const response = await fetch(`/api/task/delete/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        this.tasks = this.tasks.filter(t => t.id !== id)
      } else {
        console.error('Nie udało się usunąć zadania')
      }
    },
    async toggleTaskCompletion(task: Task) {
      const updatedTask = { ...task, isDone: !task.isDone }
      const response = await fetch('/api/task/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      })

      if (response.ok) {
        task.isDone = !task.isDone
      } else {
        console.error('Nie udało się zaktualizować zadania')
      }
    },
    async fetchStatuses() {
      const response = await fetch('/api/status/all')
      if (response.ok) {
        this.statuses = await response.json()
      } else {
        console.error('Nie udało się pobrać statusów')
      }
    },
    async fetchPriorities() {
      const response = await fetch('/api/priority/all')
      if (response.ok) {
        this.priorities = await response.json()
      } else {
        console.error('Nie udało się pobrać priorytetów')
      }
    }
  }
})
