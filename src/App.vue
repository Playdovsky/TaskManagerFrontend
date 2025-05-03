<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
</script>

<style scoped></style>

<template>
  <header>
    <div>
      <nav>
        <ul class="nav nav-tabs">
          <li class="nav-item"><RouterLink class="nav-link" to="/"> Strona główna</RouterLink></li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login" v-if="!auth.isAuthenticated"
              >Zaloguj się</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/profile" v-if="auth.isAuthenticated"
              >Profil użytkownika</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" v-if="auth.isAuthenticated" to="/" @click="auth.logout()">
              Wyloguj się
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>
