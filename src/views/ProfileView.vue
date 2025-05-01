<script lang="ts">
import { defineComponent } from 'vue'

interface ProfileData {
  id: number
  username: string
  email: string
  firstname: string
  lastname: string
  phone: string
}

export default defineComponent({
  data(): ProfileData {
    return {
      id: 0,
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      phone: ''
    }
  },
  methods: {
    async getProfileData() {
      const token = localStorage.getItem('token')

      if (!token) {
        console.log('Brak tokenu w localStorage')
        return
      }

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
    }
  },
  mounted() {
    this.getProfileData()
  }
})
</script>
<style></style>
<template>
  <div class="container">
    <h3>Profil użytkownika</h3>
    <div v-if="username">
      <p><strong>Username:</strong> {{ username }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
      <p v-if="firstname"><strong>First Name:</strong> {{ firstname }}</p>
      <p v-if="lastname"><strong>Last Name:</strong> {{ lastname }}</p>
      <p v-if="phone"><strong>Phone:</strong> {{ phone }}</p>
    </div>
    <div v-else>
      <p>Ładowanie profilu użytkownika...</p>
    </div>
  </div>
</template>
