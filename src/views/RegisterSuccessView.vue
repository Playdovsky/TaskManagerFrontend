<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style></style>

<template>
  <div class="d-flex justify-content-center align-items-center mt-5">
    <div class="card shadow-lg border-0" style="max-width: 500px; padding: 2rem">
      <div class="text-center">
        <h3 class="mt-3">Rejestracja zakończona sukcesem!</h3>
        <p class="text-muted">Możesz już zalogować się na swoje konto</p>
        <RouterLink to="/login" class="btn btn-primary mt-3">Przejdź do logowania</RouterLink>
      </div>
    </div>
  </div>
</template>
