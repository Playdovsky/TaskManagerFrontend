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
    lists: [] as List[]
  }),
  actions: {
    async fetchLists() {
      const response = await fetch('/api/tasklist/all')
      if (response.ok) {
        this.lists = await response.json()
      } else {
        console.error('Nie udało się pobrać list zadań')
      }
    },
async addList(title: string) {
  const authStore = useAuthStore()

  if (!authStore.token) {
    console.error('Brak tokena — użytkownik nie jest zalogowany')
    return
  }

  const response = await fetch('/api/tasklist/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
     
    },
    body: JSON.stringify({ title })
  })

  if (response.ok) {
    await this.fetchLists()
  } else {
    console.error('Nie udało się dodać listy zadań')
  }
}

  }
})