<script lang="ts">
import { useLoginPageDataStore } from '@/stores/loginFormPersistData'
import { defineComponent } from 'vue'

interface PageData {
  username: string
  password: string
  loginDataStore: ReturnType<typeof useLoginPageDataStore>
}

export default defineComponent({
  data(): PageData {
    return {
      username: '',
      password: '',
      loginDataStore: useLoginPageDataStore()
    }
  },
  watch: {
    username() {
      this.saveFormData()
    },
    password() {
      this.saveFormData()
    }
  },
  methods: {
    saveFormData() {
      console.log('dane zostały zapisane!')
      this.loginDataStore.saveDataToStore(this.username, this.password)
    },
    clearData() {
      this.loginDataStore.clearData()
    }
  },
  mounted() {
    let formData = this.loginDataStore.getLoginPageData

    if (formData) {
      this.username = formData.username
      this.password = formData.password
    }
  }
})
</script>
<style></style>
<template>
  <div class="container">
    <div class="form">
      <input v-model="username" type="text" class="form-control m-3" />
      <input v-model="password" type="text" class="form-control m-3" />
    </div>
    <div class="float-end">
      <button class="btn btn-primary">Prześlij</button>
    </div>
  </div>
</template>
