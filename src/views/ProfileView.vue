<script lang="ts">
import { defineComponent } from 'vue'

interface ProfileData {
  id: number
  username: string
  email: string
  firstname: string
  lastname: string
  phone: string
  editSuccess: boolean
  editFailed: boolean
  errorPhone: boolean
}

export default defineComponent({
  data(): ProfileData {
    return {
      id: 0,
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      phone: '',
      editSuccess: false,
      editFailed: false,
      errorPhone: false
    }
  },
  methods: {
    async getProfileData() {
      const token = localStorage.getItem('token')

      console.log(`Bearer ${token}`)

      const response = await fetch('/api/User/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      try {
        if (response.ok) {
          const profile = await response.json()
          this.id = profile.id
          this.username = profile.username
          this.email = profile.email
          this.firstname = profile.firstname
          this.lastname = profile.lastname
          this.phone = profile.phone
        } else {
          console.log('Wystąpił błąd podczas przesyłania żądania:', response.status)
          console.log(await response.text())
        }
      } catch (error) {
        console.error('Wystąpił błąd:', error)
      }
    },
    async putProfileData() {
      this.errorPhone = this.phoneValidation()
      if (this.errorPhone) {
        return
      }

      const token = localStorage.getItem('token')
      const response = await fetch('/api/EditProfile/editProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: this.id,
          username: this.username,
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          phone: this.phone
        })
      })

      if (response.ok) {
        this.editSuccess = true
        console.log('Dane zostały zaktualizowane')
      } else {
        console.log('Wystąpił błąd podczas przesyłania żądania:', response.status)
      }
    },
    async deleteAccount() {
      const confirmDelete = confirm(
        'Czy na pewno chcesz usunąć konto? Efekt ten jest nieodwracalny.'
      )

      if (!confirmDelete) {
        return
      }

      const token = localStorage.getItem('token')
      const response = await fetch('/api/DeleteAccount/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        console.log('Konto zostało usunięte')
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        this.$router.push('/login')
      } else {
        console.log('Wystąpił błąd podczas przesyłania żądania:', response.status)
      }
    },
    phoneValidation() {
      var phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/
      if (this.phone.match(phonePattern) || this.phone === '') {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    this.getProfileData()
  }
})
</script>
<style></style>
<template>
  <div class="d-flex justify-content-center align-items-center mt-5">
    <form
      class="w-100 card shadow-lg border-0"
      style="max-width: 500px; padding: 2%"
      @submit.prevent="putProfileData"
    >
      <h3 class="text-primary">Witaj {{ username }}</h3>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" v-model="email" required />
      </div>
      <div class="mb-3">
        <label for="firstname" class="form-label">Imię</label>
        <input type="text" class="form-control" id="firstname" v-model="firstname" />
      </div>
      <div class="mb-3">
        <label for="lastname" class="form-label">Nazwisko</label>
        <input type="text" class="form-control" id="lastname" v-model="lastname" />
      </div>
      <div class="mb-3">
        <label for="phone" class="form-label">Telefon</label>
        <input type="text" class="form-control" id="phone" v-model="phone" />
      </div>
      <p v-if="editSuccess" class="alert alert-success" role="alert">Zmiany zostały zapisane!</p>
      <p class="alert alert-danger" role="alert" v-if="errorPhone">Błędny numer telefonu</p>
      <p v-if="editFailed" class="alert alert-danger" role="alert">Błędne dane</p>

      <div class="mb-3">
        <button type="submit" class="btn btn-success" style="margin-right: 1%">
          Zapisz zmiany
        </button>
        <RouterLink class="btn btn-danger" to="/change-password" style="margin-right: 1%">
          Zmień hasło
        </RouterLink>
        <button type="button" class="btn btn-dark" style="margin-right: 1%" @click="deleteAccount">
          Usuń konto
        </button>
      </div>
    </form>
  </div>
</template>
