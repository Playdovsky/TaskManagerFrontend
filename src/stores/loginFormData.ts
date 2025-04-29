import { defineStore } from 'pinia'

interface LoginPageData {
  username: string
  password: string
}

export const useLoginPageDataStore = defineStore('loginPageDataStore', {
  state: () => ({
    loginPageData: { username: '', password: '' } as LoginPageData
  }),
  getters: {
    getLoginPageData(): LoginPageData {
      return this.loginPageData
    }
  },
  actions: {
    saveDataToStore(username: string, password: string) {
      this.loginPageData.username = username
      this.loginPageData.password = password
    }
  }
})
