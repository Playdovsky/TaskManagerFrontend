<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
<style></style>
<template>
  <div class="container px-4 py-5">
    <div class="container px-4 py-5"></div>
    <div class="row row-cols-1 row-cols-md-2 align-items-md-center g-5 py-5">
      <div class="col d-flex flex-column align-items-start gap-2">
        <h2 class="fw-bold text-primary">Uporządkuj swoje życie razem z nami!</h2>
        <p class="text-body-secondary">
          Task Manager to aplikacja, która pomoże Ci w organizacji codziennych zadań. Dzięki
          intuicyjnemu interfejsowi i zaawansowanym funkcjom zarządzania zadaniami, będziesz mógł
          skupić się na tym, co naprawdę ważne.
        </p>
      </div>
      <div class="col">
        <div class="row row-cols-1 row-cols-sm-2 g-4">
          <div class="col d-flex flex-column gap-2">
            <h4 class="fw-semibold mb-0 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor "
                class="bi bi-journal-bookmark-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"
                />
                <path
                  d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"
                />
                <path
                  d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"
                />
              </svg>
              Listy zadań
            </h4>
            <p class="text-body-secondary">
              Twórz i zarządzaj swoimi listami zadań. Dodawaj, edytuj i usuwaj zadania w prosty
              sposób.
            </p>
          </div>
          <div class="col d-flex flex-column gap-2">
            <h4 class="fw-semibold mb-0 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                class="bi bi-eye-fill"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                <path
                  d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"
                />
              </svg>
              Śledź postęp zadań
            </h4>
            <p class="text-body-secondary">
              Monitoruj postęp swoich zadań i osiągaj cele szybciej niż kiedykolwiek wcześniej.
            </p>
          </div>
          <div class="col d-flex flex-column gap-2">
            <h4 class="fw-semibold mb-0 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                class="bi bi-inboxes-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4.98 1a.5.5 0 0 0-.39.188L1.54 5H6a.5.5 0 0 1 .5.5 1.5 1.5 0 0 0 3 0A.5.5 0 0 1 10 5h4.46l-3.05-3.812A.5.5 0 0 0 11.02 1zM3.81.563A1.5 1.5 0 0 1 4.98 0h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 10H1.883A1.5 1.5 0 0 1 .394 8.686l-.39-3.124a.5.5 0 0 1 .106-.374zM.125 11.17A.5.5 0 0 1 .5 11H6a.5.5 0 0 1 .5.5 1.5 1.5 0 0 0 3 0 .5.5 0 0 1 .5-.5h5.5a.5.5 0 0 1 .496.562l-.39 3.124A1.5 1.5 0 0 1 14.117 16H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .121-.393z"
                />
              </svg>
              Nielimitowane miejsce
            </h4>
            <p class="text-body-secondary">
              Nie martw się o miejsce na swoje zadania. Nasza aplikacja oferuje nielimitowaną ilość
              miejsca na Twoje listy zadań.
            </p>
          </div>
          <div class="col d-flex flex-column gap-2">
            <h4 class="fw-semibold mb-0 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                class="bi bi-lightning-charge-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
                />
              </svg>
              Responsywność
            </h4>
            <p class="text-body-secondary">
              Nasza aplikacja działa na wszystkich urządzeniach. Korzystaj z niej na komputerze,
              tablecie lub telefonie.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
