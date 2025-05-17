<template>
  <div class="container mt-4">
    <h2>Zarządzanie zadaniami</h2>

    <!-- Dodaj listę zadań -->
    <form @submit.prevent="confirmAddList" class="mb-3">
      <input v-model="newListName" class="form-control mb-2" placeholder="Nazwa nowej listy" />
      <button class="btn btn-secondary">Dodaj listę</button>
    </form>

    <!-- Lista rozwijana dla każdej aktywnej listy zadań -->
    <div v-for="list in activeLists" :key="list.id" class="mb-4 border p-3 rounded">
      <div class="d-flex justify-content-between align-items-center">
        <button class="btn btn-link" @click="toggleList(list.id)">
          <h4>
            {{ list.title }}
            <span v-if="expandedLists.includes(list.id)">▲</span>
            <span v-else>▼</span>
          </h4>
        </button>
        <!-- Nowe przyciski do edycji/usunięcia listy -->
        <div>
          <button class="btn btn-sm btn-primary me-2" @click="startEditList(list)">
            Edytuj
          </button>
          <button class="btn btn-sm btn-danger" @click="confirmDeleteList(list)">
            Usuń
          </button>
        </div>
      </div>

      <div v-if="expandedLists.includes(list.id)">
        <!-- Zadania przypisane do listy -->
        <ul class="list-group mb-2">
          <li v-for="task in tasksForList(list.id)" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <select 
                class="form-select form-select-sm d-inline-block me-2" 
                style="width: auto;" 
                :value="task.statusId"
                @change="(event) => checkLastTaskCompletion(task, event)"
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
    
    <!-- pop up potwierdzenia dla usuwania zadania -->
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

    <!-- pop up potwierdzenia dla dodawania listy -->
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
    
    <!-- Potwierdzenie ukończenia ostatniego zadania -->
    <div class="modal fade" ref="lastTaskModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Ukończenie listy zadań</h5>
            <button type="button" class="btn-close" @click="closeLastTaskModal"></button>
          </div>
          <div class="modal-body">
            <p>To jest ostatnie nieukończone zadanie na tej liście. Czy chcesz oznaczyć zadanie "{{ taskToComplete?.title }}" jako wykonane?</p>
            <p class="fw-bold">Zrobienie tego spowoduje zakończenie całej listy zadań oraz przeniesienie jej do archiwum.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeLastTaskModal">Anuluj</button>
            <button type="button" class="btn btn-success" @click="completeLastTask">Zakończ zadanie i archiwizuj listę</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edycja listy zadań -->
    <div class="modal fade" ref="editListModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edytuj listę zadań</h5>
            <button type="button" class="btn-close" @click="closeEditListModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleEditList">
              <div class="mb-3">
                <label for="editListName" class="form-label">Nazwa listy</label>
                <input type="text" class="form-control" id="editListName" v-model="editListName" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditListModal">Anuluj</button>
            <button type="button" class="btn btn-primary" @click="handleEditList">Zapisz zmiany</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Potwierdzenie usunięcia listy -->
    <div class="modal fade" ref="deleteListModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Potwierdzenie usunięcia</h5>
            <button type="button" class="btn-close" @click="closeDeleteListModal"></button>
          </div>
          <div class="modal-body">
            <p>Czy na pewno chcesz usunąć listę "{{ listToDelete?.title }}"?</p>
            <p class="text-danger fw-bold">Uwaga: Spowoduje to również usunięcie wszystkich zadań przypisanych do tej listy!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteListModal">Anuluj</button>
            <button type="button" class="btn btn-danger" @click="deleteList">Usuń</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
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
    const lastTaskModal = ref<HTMLElement | null>(null)
    const editListModal = ref<HTMLElement | null>(null) // ref dla modalu edycji
    const deleteListModal = ref<HTMLElement | null>(null) // ref dla modalu usuwania listy
    
    const taskToDelete = ref<any>(null)
    const taskToComplete = ref<any>(null)
    const listToEdit = ref<any>(null) //  zmienna dla listy do edycji
    const listToDelete = ref<any>(null) //  zmienna dla listy do usunięcia
    const editListName = ref('') //  zmienna dla nowej nazwy listy
    
    const pendingStatusChange = ref<{ task: any; newStatusId: number } | null>(null)
    
    // Instancje modali
    let deleteModal: Modal | null = null
    let addModal: Modal | null = null
    let lastTaskCompletionModal: Modal | null = null
    let editModal: Modal | null = null // instancja modalu edycji
    let deleteListConfirmModal: Modal | null = null // instancja modalu usuwania listy

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
      
      if (lastTaskModal.value) {
        lastTaskCompletionModal = new Modal(lastTaskModal.value)
      }

      // Inicjalizacja nowych modali
      if (editListModal.value) {
        editModal = new Modal(editListModal.value)
      }

      if (deleteListModal.value) {
        deleteListConfirmModal = new Modal(deleteListModal.value)
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
    
    //Inicjuje edycję listy
    const startEditList = (list: any) => {
      listToEdit.value = list
      editListName.value = list.title
      editModal?.show()
    }

    // Zamyka pop up edycji listy
    const closeEditListModal = () => {
      editModal?.hide()
      listToEdit.value = null
      editListName.value = ''
    }

    // Obsługa zapisania zmian w liście
    const handleEditList = async () => {
      if (listToEdit.value && editListName.value.trim()) {
        const success = await listStore.editList(listToEdit.value.id, editListName.value.trim())
        if (success) {
          closeEditListModal()
        }
      }
    }

    //Inicjuje usunięcie listy
    const confirmDeleteList = (list: any) => {
      listToDelete.value = list
      deleteListConfirmModal?.show()
    }

    // Zamyka pop up usuwania listy
    const closeDeleteListModal = () => {
      deleteListConfirmModal?.hide()
      listToDelete.value = null
    }

    // Obsługa usunięcia listy
    const deleteList = async () => {
      if (listToDelete.value) {
        const success = await listStore.deleteList(listToDelete.value.id)
        if (success) {
          closeDeleteListModal()
        }
      }
    }

    // Funkcja sprawdzająca, czy to ostatnie zadanie do ukończenia w liście
    const checkLastTaskCompletion = (task: any, event: Event) => {
      const selectElement = event.target as HTMLSelectElement;
      const newStatusId = Number(selectElement.value);
      
      // Jeśli zmiana nie jest na status "Zakończone" (id=3), przeprocesuj normalnie
      if (newStatusId !== 3 || task.statusId === 3) {
        changeTaskStatus(task, event);
        return;
      }
      
      // Sprawdzenie, czy to ostatnie nieukończone zadanie na liście
      const tasksInList = tasksForList(task.taskListId);
      const uncompletedTasks = tasksInList.filter(t => !t.isDone && t.id !== task.id);
      
      if (uncompletedTasks.length === 0) {
        // Zapisanie szczegółów i wyświetlenie okienka pop up
        taskToComplete.value = task;
        pendingStatusChange.value = { task, newStatusId };
        lastTaskCompletionModal?.show();
      } else {
        // Nie jest to ostatnie zadanie, obsłuż normalnie
        changeTaskStatus(task, event);
      }
    }
    
    // zamyaknie okna pop up
    const closeLastTaskModal = () => {
      lastTaskCompletionModal?.hide();
      taskToComplete.value = null;
      pendingStatusChange.value = null;
    }
    
    // archiwizacja listy
    const completeLastTask = async () => {
      if (pendingStatusChange.value) {
        const { task, newStatusId } = pendingStatusChange.value;
        
        // Aktualizacja zadania
        const updatedTask = { 
          ...JSON.parse(JSON.stringify(task)), 
          statusId: newStatusId,
          isDone: true,
          isActive: false
        };
        
        await taskStore.updateTask(updatedTask);
        
        // odświeżenie danych
        await listStore.fetchLists();
        if (expandedLists.value.includes(task.taskListId)) {
          await taskStore.fetchTasks(task.taskListId);
        }
        
        closeLastTaskModal();
      }
    }

    // zmiana statusu zadania
    const changeTaskStatus = async (task: any, event: Event) => {
      const selectElement = event.target as HTMLSelectElement;
      const newStatusId = Number(selectElement.value);
      
      // Sprawdzenie czy status się zmienił
      if (task.statusId === newStatusId) return;
      
      // kopia zadania, aby uniknąć modyfikacji oryginalnego obiektu
      const updatedTask = { 
        ...JSON.parse(JSON.stringify(task)), 
        statusId: newStatusId,
        isDone: newStatusId === 3, // Ustaw isDone na true tylko jeśli status = 3
        isActive: newStatusId !== 3 // Jeśli status = 3 (Zakończone), oznacz zadanie jako nieaktywne
      };

      console.log('Przed aktualizacją:', task);
      console.log('Po aktualizacji:', updatedTask);
      
      await taskStore.updateTask(updatedTask);
      
      // odświeżenie danych
      await taskStore.fetchTasks(task.taskListId);
    }

    // Funkcja dodawania zadania do listy
    const addTaskToList = async (listId: number) => {
      if (!newTaskTitle.value || !newTaskStatusId.value || !newTaskPriorityId.value) return

      const statusIdValue = Number(newTaskStatusId.value)

      await taskStore.addTask({
        title: newTaskTitle.value,
        description: newTaskDescription.value,
        taskListId: listId,
        statusId: statusIdValue,
        priorityId: Number(newTaskPriorityId.value),
        isDone: statusIdValue === 3,
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

    const getStatusName = (id: number) =>
      taskStore.statuses.find(s => s.id === id)?.name || 'Nieznany'

    const getPriorityName = (id: number) =>
      taskStore.priorities.find(p => p.id === id)?.name || 'Nieznany'

    return {
      lists: listStore.lists,
      // Filtrowanie list - tylko aktywne
      activeLists: computed(() => listStore.lists.filter(list => list.isActive)),
      // Filtrowanie list - tylko ukończone
      completedLists: computed(() => listStore.lists.filter(list => list.isDone && !list.isActive)),
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
      lastTaskModal,
      editListModal,
      deleteListModal,
      taskToDelete,
      taskToComplete,
      listToEdit,
      listToDelete,
      editListName,
      toggleList,
      addTaskToList,
      tasksForList,
      getStatusName,
      getPriorityName,
      changeTaskStatus,
      confirmDeleteTask,
      closeDeleteModal,
      deleteTask,
      confirmAddList,
      closeAddListModal,
      handleAddList,
      checkLastTaskCompletion,
      closeLastTaskModal,
      completeLastTask,
      startEditList,
      closeEditListModal,
      handleEditList,
      confirmDeleteList,
      closeDeleteListModal,
      deleteList
    }
  }
})
</script>