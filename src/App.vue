<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await auth.initialize()
})

function handleLogout() {
  auth.logout(router)
}
</script>

<template>
  <header>
    <div>
      <nav>
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Strona główna</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login" v-if="!auth.isAuthenticated">
              Zaloguj się
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/profile" v-if="auth.isAuthenticated">
              Twój profil
            </RouterLink>
          </li>
          <li class="nav-item" v-if="auth.isAuthenticated">
            <a href="#" class="nav-link" @click.prevent="handleLogout">Wyloguj się</a>
          </li>
          <li class="nav-item" v-if="auth.isAuthenticated">
            <RouterLink class="nav-link" to="/tasks">Zadania</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
