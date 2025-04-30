<script lang="ts">
import { useLoginPageDataStore } from '@/stores/loginFormPersistData'
import { defineComponent } from 'vue'

interface PageData {
  username: string
  password: string
  loginDataStore: ReturnType<typeof useLoginPageDataStore>
  loginFailed: false
}

export default defineComponent({
  data(): PageData {
    return {
      username: '',
      password: '',
      loginDataStore: useLoginPageDataStore(),
      loginFailed: false
    }
  },
  watch: {
    username() {
      this.saveFormData()
    },
    password() {
      this.saveFormData()
    }
  },
  methods: {
    saveFormData() {
      console.log('dane zostały zapisane!')
      this.loginDataStore.saveDataToStore(this.username, this.password)
    },
    clearData() {
      this.loginDataStore.clearData()
    },
    async postPageData() {
      this.loginFailed = false

      const response = await fetch('/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Username: this.username,
          Password: this.password
        })
      })

      if (!response.ok) {
        this.loginFailed = true
        return
      }

      this.$router.push('/')
    }
  },
  mounted() {
    let formData = this.loginDataStore.getLoginPageData

    if (formData) {
      this.username = formData.username
      this.password = formData.password
    }
  }
})
</script>
<style></style>

<template>
  <div class="d-flex justify-content-center align-items-center mt-5">
    <form
      class="w-100 card shadow-lg border-0"
      style="max-width: 500px; padding: 2rem"
      @submit.prevent="postPageData"
    >
      <div class="mb-3">
        <label for="usernameLogin" class="form-label">Nazwa użytkownika</label>
        <input v-model="username" type="text" id="usernameLogin" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="passwordLogin" class="form-label">Hasło</label>
        <input
          v-model="password"
          type="password"
          id="passwordLogin"
          class="form-control"
          required
        />
      </div>
      <p v-if="loginFailed" class="alert alert-danger" role="alert">Błędne dane logowania</p>
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary w-100">Zaloguj się</button>
      </div>
      <div class="d-flex justify-content-center mt-3">
        <RouterLink to="/register">Nie masz jeszcze konta? Zarejestruj się</RouterLink>
      </div>
    </form>
  </div>
</template>
