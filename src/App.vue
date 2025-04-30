<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<style scoped></style>

<template>
  <header>
    <div>
      <nav>
        <ul class="nav nav-tabs">
          <li class="nav-item"><RouterLink class="nav-link" to="/"> Strona główna</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/login">Zaloguj się</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>
