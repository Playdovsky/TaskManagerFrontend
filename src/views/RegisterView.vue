<script lang="ts">
import { defineComponent } from 'vue'

interface PageData {
  username: string
  email: string
  firstname: string
  lastname: string
  phone: string
  password: string
}

export default defineComponent({
  data(): PageData {
    return {
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      phone: '',
      password: '',
      passwordConfirm: ''
    }
  },
  methods: {
    async postPageData() {
      const response = await fetch('/api/Register/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Username: this.username,
          Email: this.email,
          Firstname: this.firstname,
          Lastname: this.lastname,
          Phone: this.phone,
          Password: this.password
        })
      })

      if (response.ok) {
        this.$router.push('/register-success')
      } else {
        console.log('Wystąpił błąd podczas przesyłania żądania')
      }
    }
  },
  computed: {
    passwordMismatch() {
      return this.password !== this.passwordConfirm
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
        <label for="usernameRegister" class="form-label">Nazwa użytkownika*</label>
        <input v-model="username" type="text" id="usernameRegister" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="emailRegister" class="form-label">Email*</label>
        <input v-model="email" type="email" id="emailRegister" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="firstnameRegister" class="form-label">Imię</label>
        <input v-model="firstname" type="text" id="firstnameRegister" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="lastnameRegister" class="form-label">Nazwisko</label>
        <input v-model="lastname" type="text" id="lastnameRegister" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="phoneRegister" class="form-label">Telefon</label>
        <input v-model="phone" type="phone" id="phoneRegister" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="passwordRegister" class="form-label">Hasło*</label>
        <input
          v-model="password"
          type="password"
          id="passwordRegister"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="passwordConfirm" class="form-label">Powtórz hasło*</label>
        <input
          v-model="passwordConfirm"
          type="password"
          id="passwordConfirm"
          class="form-control"
          required
        />
        <small id="requiredFields" class="form-text text-muted"
          >Pola oznaczone * są obowiązkowe</small
        >
      </div>
      <p v-if="passwordMismatch" class="alert alert-danger" role="alert">Hasła nie są takie same</p>
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary w-100" :disabled="passwordMismatch">
          Zarejestruj się
        </button>
      </div>
      <div class="d-flex justify-content-center mt-3">
        <RouterLink to="/login">Masz już konto? Zaloguj się</RouterLink>
      </div>
    </form>
  </div>
</template>
