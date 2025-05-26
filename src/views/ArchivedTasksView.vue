<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useArchivedListStore } from '@/stores/archivedListStore'

const archivedListStore = useArchivedListStore()

const archivedLists = computed(() => archivedListStore.archivedLists)
const loading = computed(() => archivedListStore.isLoading)
const error = computed(() => archivedListStore.error)

// stan do kontroli rozwinietych list
const expandedLists = ref<number[]>([])

// funkcja do przelaczania widocznosci zadan dla listy
function toggleListTasks(listId: number) {
  if (expandedLists.value.includes(listId)) {
    expandedLists.value = expandedLists.value.filter(id => id !== listId)
  } else {
    expandedLists.value.push(listId)
    if (!archivedListStore.listTasks[listId]) {
      archivedListStore.fetchTasksForList(listId)
    }
  }
}

// sprawdzenie czy zadania dla danej listy są pobierane
function isLoadingTasks(listId: number) {
  return archivedListStore.loadingTasks?.includes(listId) || false
}

// formatowanie danych zeby wyswietlaly sie bez godziny
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

onMounted(async () => {
  await archivedListStore.fetchArchivedLists()
})
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Archiwum zakończonych list</h1>
   
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
    </div>
   
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
   
    <div v-else-if="archivedLists.length === 0" class="alert alert-info">
      Nie masz żadnych zakończonych list zadań w archiwum.
    </div>
   
    <div v-else class="archived-lists">
      <div class="archived-list-item mb-4" v-for="list in archivedLists" :key="list.id">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ list.title }}</h5>
            <button 
              class="btn btn-sm" 
              :class="expandedLists.includes(list.id) ? 'btn-secondary' : 'btn-outline-secondary'"
              @click="toggleListTasks(list.id)"
            >
              {{ expandedLists.includes(list.id) ? 'Ukryj zadania' : 'Pokaż zadania' }}
            </button>
          </div>
          <div class="card-body">
            <p class="card-text text-muted small">
              Data utworzenia: {{ formatDate(list.createdDate) }}
            </p>
            
            <div v-if="expandedLists.includes(list.id)" class="mt-3">
              <h6 class="border-bottom pb-2">Zadania w tej liście:</h6>
              
              <div v-if="isLoadingTasks(list.id)" class="text-center my-3">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Ładowanie zadań...</span>
                </div>
              </div>
              
              <div v-else-if="!archivedListStore.listTasks[list.id] || archivedListStore.listTasks[list.id].length === 0" 
                   class="alert alert-info py-2">
                Ta lista nie zawiera żadnych zadań.
              </div>
              
              <ul v-else class="list-group task-list mt-2">
                <li v-for="task in archivedListStore.listTasks[list.id]" 
                    :key="task.id"
                    class="list-group-item">
                  <div class="task-content">
                    <span class="task-title">{{ task.title }}</span>
                    <p v-if="task.description" class="task-description mb-0 mt-1">{{ task.description }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.card:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.card-header {
  background-color: #f8f9fa;
}

.task-list .list-group-item {
  border-left: none;
  border-right: none;
  padding: 0.75rem 1rem;
}

.task-list .list-group-item:first-child {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
}

.task-title {
  font-weight: 500;
}

.task-description {
  color: #6c757d;
  font-size: 0.875rem;
}
</style>