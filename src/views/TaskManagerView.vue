<template>
  <div class="container mt-4">
    <h2>Zarządzanie zadaniami</h2>

    <!-- Dodaj listę zadań -->
    <form @submit.prevent="handleAddList" class="mb-3">
      <input v-model="newListName" class="form-control mb-2" placeholder="Nazwa nowej listy" />
      <button class="btn btn-secondary">Dodaj listę</button>
    </form>

    <!-- Lista rozwijana dla każdej listy zadań -->
    <div v-for="list in lists" :key="list.id" class="mb-4 border p-3 rounded">
      <button class="btn btn-link" @click="toggleList(list.id)">
        <h4>
          {{ list.title }}
          <span v-if="expandedLists.includes(list.id)">▲</span>
          <span v-else>▼</span>
        </h4>
      </button>

      <div v-if="expandedLists.includes(list.id)">
        <!-- Zadania przypisane do listy -->
        <ul class="list-group mb-2">
          <li v-for="task in tasksForList(list.id)" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <input type="checkbox" :checked="task.isDone" @change="toggleTask(task)" />
              <strong :class="{ 'text-decoration-line-through': task.isDone }">{{ task.title }}</strong>
              <p class="mb-0 text-muted">{{ task.description }}</p>
              <span class="badge bg-info me-2">Status: {{ getStatusName(task.statusId) }}</span>
              <span class="badge bg-warning">Priorytet: {{ getPriorityName(task.priorityId) }}</span>
            </div>
            <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">Usuń</button>
          </li>
        </ul>

        <!-- Formularz dodania zadania -->
        <form @submit.prevent="addTaskToList(list.id)">
          <input v-model="newTaskTitle" class="form-control mb-2" placeholder="Tytuł zadania" />
          <textarea v-model="newTaskDescription" class="form-control mb-2" placeholder="Opis"></textarea>
          
          <!-- Status -->
          <select v-model="newTaskStatusId" class="form-control mb-2">
            <option disabled value="">Wybierz status</option>
            <option v-for="s in statuses" :value="s.id" :key="s.id">{{ s.name }}</option>
          </select>

          <!-- Priorytet -->
          <select v-model="newTaskPriorityId" class="form-control mb-2">
            <option disabled value="">Wybierz priorytet</option>
            <option v-for="p in priorities" :value="p.id" :key="p.id">{{ p.name }}</option>
          </select>

          <button class="btn btn-primary">Dodaj zadanie</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useListStore } from '@/stores/listStore'

export default defineComponent({
  setup() {
    const taskStore = useTaskStore()
    const listStore = useListStore()

    // Zmienne do formularza
    const newTaskTitle = ref('')
    const newTaskDescription = ref('')
    const newTaskStatusId = ref<number | string>('')
    const newTaskPriorityId = ref<number | string>('')
    const newListName = ref('')
    const expandedLists = ref<number[]>([])

    onMounted(async () => {
      // Pobieranie danych po załadowaniu komponentu
      await listStore.fetchLists()
      await taskStore.fetchStatuses()  // Załaduj statusy
      await taskStore.fetchPriorities()  // Załaduj priorytety
    })

    // Funkcja rozwijania listy
    const toggleList = async (listId: number) => {
      if (expandedLists.value.includes(listId)) {
        expandedLists.value = expandedLists.value.filter(id => id !== listId)
      } else {
        expandedLists.value.push(listId)
        await taskStore.fetchTasks(listId) // Pobierz zadania dla tej listy
      }
    }

    // Pobierz zadania przypisane do listy
    const tasksForList = (listId: number) =>
      taskStore.tasks.filter(t => t.taskListId === listId)

    // Funkcja dodawania zadania do listy
    const addTaskToList = async (listId: number) => {
      if (!newTaskTitle.value || !newTaskStatusId.value || !newTaskPriorityId.value) return

      await taskStore.addTask({
        title: newTaskTitle.value,
        description: newTaskDescription.value,
        taskListId: listId,
        statusId: Number(newTaskStatusId.value),
        priorityId: Number(newTaskPriorityId.value),
        isDone: false
      })

      // Resetowanie formularza po dodaniu zadania
      newTaskTitle.value = ''
      newTaskDescription.value = ''
      newTaskStatusId.value = ''
      newTaskPriorityId.value = ''
    }

    // Funkcja dodawania nowej listy
    const handleAddList = async () => {
      if (!newListName.value) return
      await listStore.addList(newListName.value)
      newListName.value = '' // Resetowanie formularza
    }

    // Funkcja usuwania zadania
    const deleteTask = async (id: number) => {
      await taskStore.deleteTask(id)
    }

    // Funkcja zmiany statusu zadania (znacznik ukończenia)
    const toggleTask = async (task: any) => {
      await taskStore.toggleTaskCompletion(task)
    }

    // Funkcja pobierania nazwy statusu
    const getStatusName = (id: number) =>
      taskStore.statuses.find(s => s.id === id)?.name || 'Nieznany'

    // Funkcja pobierania nazwy priorytetu
    const getPriorityName = (id: number) =>
      taskStore.priorities.find(p => p.id === id)?.name || 'Nieznany'

    return {
      lists: listStore.lists,
      statuses: taskStore.statuses,
      priorities: taskStore.priorities,
      newTaskTitle,
      newTaskDescription,
      newTaskStatusId,
      newTaskPriorityId,
      newListName,
      expandedLists,
      toggleList,
      addTaskToList,
      deleteTask,
      toggleTask,
      tasksForList,
      getStatusName,
      getPriorityName,
      handleAddList
    }
  }
})
</script>
