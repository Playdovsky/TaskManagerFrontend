import { defineStore } from 'pinia'

interface LoginPageData {
  username: string
  password: string
}

export const useLoginPageDataStore = defineStore('loginPageDataStore', {
  state: () => ({
    loginPageData: JSON.parse(localStorage.getItem('loginPageDataStore') || '{}')
  }),
  getters: {
    getLoginPageData(): LoginPageData {
      return this.loginPageData
    }
  },
  actions: {
    saveDataToStore(username: string, password: string) {
      const data: string = JSON.stringify({ username: username, password: password })
      localStorage.setItem('loginPageDataStore', data)
    },
    clearData() {
      localStorage.clear()
    }
  }
})
