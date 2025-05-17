<template>
  <div class="container mt-4">
    <h2>Zarządzanie zadaniami</h2>

    <!-- Dodaj listę zadań -->
    <form @submit.prevent="confirmAddList" class="mb-3">
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
              <!-- Usuń checkbox i dodaj przycisk zmiany statusu -->
              <select 
                class="form-select form-select-sm d-inline-block me-2" 
                style="width: auto;" 
                :value="task.statusId"
                @change="changeTaskStatus(task, $event)"
              >
                <option v-for="s in statuses" :value="s.id" :key="s.id">{{ s.name }}</option>
              </select>
              
              <strong :class="{ 'text-decoration-line-through': task.isDone }">{{ task.title }}</strong>
              <p class="mb-0 text-muted">{{ task.description }}</p>
              <span class="badge bg-warning">Priorytet: {{ getPriorityName(task.priorityId) }}</span>
            </div>
            <button class="btn btn-sm btn-danger" @click="confirmDeleteTask(task)">Usuń</button>
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

    <!-- Modal potwierdzenia dla usuwania zadania -->
    <div class="modal fade" ref="deleteTaskModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Potwierdzenie usunięcia</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p>Czy na pewno chcesz usunąć zadanie "{{ taskToDelete?.title }}"?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Anuluj</button>
            <button type="button" class="btn btn-danger" @click="deleteTask">Usuń</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal potwierdzenia dla dodawania listy -->
    <div class="modal fade" ref="addListModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Potwierdzenie dodania</h5>
            <button type="button" class="btn-close" @click="closeAddListModal"></button>
          </div>
          <div class="modal-body">
            <p>Czy na pewno chcesz dodać nową listę "{{ newListName }}"?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAddListModal">Anuluj</button>
            <button type="button" class="btn btn-primary" @click="handleAddList">Dodaj</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useListStore } from '@/stores/listStore'


// Import z bootstrap
import { Modal } from 'bootstrap'

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
    
    // Zmienne dla modali
    const deleteTaskModal = ref<HTMLElement | null>(null)
    const addListModal = ref<HTMLElement | null>(null)
    const taskToDelete = ref<any>(null)
    let deleteModal: Modal | null = null
    let addModal: Modal | null = null

    onMounted(async () => {
      // Pobieranie danych po załadowaniu komponentu
      await listStore.fetchLists()
      await taskStore.fetchStatuses()
      await taskStore.fetchPriorities()
      
      // Inicjalizacja modali
      if (deleteTaskModal.value) {
        deleteModal = new Modal(deleteTaskModal.value)
      }
      
      if (addListModal.value) {
        addModal = new Modal(addListModal.value)
      }
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

    // Funkcja zmiany statusu zadania
    const changeTaskStatus = async (task: any, event: Event) => {
      const selectElement = event.target as HTMLSelectElement;
      const newStatusId = Number(selectElement.value);
      
      // Sprawdź czy status się zmienił
      if (task.statusId === newStatusId) return;
      
      // Utwórz zaktualizowane zadanie
      const updatedTask = { 
        ...task, 
        statusId: newStatusId,
        isDone: newStatusId === 3, // Ustaw isDone na true tylko jeśli status = 3
        isActive: newStatusId === 1 || newStatusId === 2 // Zgodnie z regułą biznesową
      };
      
      await taskStore.updateTask(updatedTask);
    }

    // Funkcja dodawania zadania do listy
    const addTaskToList = async (listId: number) => {
      if (!newTaskTitle.value || !newTaskStatusId.value || !newTaskPriorityId.value) return

      await taskStore.addTask({
        title: newTaskTitle.value,
        description: newTaskDescription.value,
        taskListId: listId,
        statusId: Number(newTaskStatusId.value),
        priorityId: Number(newTaskPriorityId.value),
        isDone: false,
        isActive: true
      })

      // Resetowanie formularza po dodaniu zadania
      newTaskTitle.value = ''
      newTaskDescription.value = ''
      newTaskStatusId.value = ''
      newTaskPriorityId.value = ''
    }

    // Funkcje dla potwierdzenia usunięcia zadania
    const confirmDeleteTask = (task: any) => {
      taskToDelete.value = task
      deleteModal?.show()
    }

    const closeDeleteModal = () => {
      deleteModal?.hide()
      taskToDelete.value = null
    }

    const deleteTask = async () => {
      if (taskToDelete.value) {
        await taskStore.deleteTask(taskToDelete.value.id)
        closeDeleteModal()
      }
    }

    // Funkcje dla potwierdzenia dodania listy
    const confirmAddList = () => {
      if (!newListName.value) return
      addModal?.show()
    }

    const closeAddListModal = () => {
      addModal?.hide()
    }

    const handleAddList = async () => {
      await listStore.addList(newListName.value)
      newListName.value = '' // Resetowanie formularza
      closeAddListModal()
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
      deleteTaskModal,
      addListModal,
      taskToDelete,
      toggleList,
      addTaskToList,
      tasksForList,
      getStatusName,
      getPriorityName,
      changeTaskStatus,
      // Funkcje dla modali
      confirmDeleteTask,
      closeDeleteModal,
      deleteTask,
      confirmAddList,
      closeAddListModal,
      handleAddList
    }
  }
})
</script>
