<script lang="ts">
import { defineComponent } from 'vue'

interface PageData {
  username: string
  password: string
  passwordNew: string
  passwordConfirm: string
  editSuccess: boolean
  editFailed: boolean
}

export default defineComponent({
  data(): PageData {
    return {
      username: localStorage.getItem('username') || '',
      password: '',
      passwordNew: '',
      passwordConfirm: '',
      editSuccess: false,
      editFailed: false
    }
  },
  methods: {
    async putPageData() {
      const token = localStorage.getItem('token')
      this.username = localStorage.getItem('username') || ''
      const response = await fetch('/api/Password/changePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          passwordNew: this.passwordNew
        })
      })

      if (response.ok) {
        this.editSuccess = true
        console.log('Dane zostały zaktualizowane')
      } else {
        this.editFailed = true
        console.log('Wystąpił błąd podczas przesyłania żądania:', response.status)
      }
    }
  },
  computed: {
    passwordMismatch() {
      return this.passwordNew !== this.passwordConfirm
    }
  }
})
</script>

<style></style>

<template>
  <div class="d-flex justify-content-center align-items-center mt-5">
    <form
      class="w-100 card shadow-lg border-0"
      style="max-width: 500px; padding: 2%"
      @submit.prevent="putPageData"
    >
      <div class="mb-3">
        <label for="passwordOld" class="form-label">Hasło</label>
        <input v-model="password" type="password" id="passwordOld" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="passwordNew" class="form-label">Nowe hasło</label>
        <input
          v-model="passwordNew"
          type="password"
          id="passwordNew"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="passwordConfirm" class="form-label">Powtórz hasło</label>
        <input
          v-model="passwordConfirm"
          type="password"
          id="passwordConfirm"
          class="form-control"
          required
        />
      </div>
      <p v-if="editSuccess" class="alert alert-success" role="alert">Hasło zostało zmienione!</p>
      <p v-if="editFailed" class="alert alert-danger" role="alert">Błędne hasło</p>
      <p v-if="passwordMismatch" class="alert alert-danger" role="alert">Hasła nie są takie same</p>
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-dark w-100" :disabled="passwordMismatch">
          Zmień hasło
        </button>
      </div>
    </form>
  </div>
</template>
