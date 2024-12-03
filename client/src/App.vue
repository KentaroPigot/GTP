<template>
  <app-header />
  <router-view></router-view>
  <app-auth />
</template>

<script>
import AppHeader from './layouts/Header.vue'
import AppAuth from './components/auth/AuthModal.vue'
import useAuthStore from '@/stores/auth'
import { mapStores } from 'pinia'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
  },
  computed: {
    ...mapStores(useAuthStore),
  },
  async created() {
    const cachedState = localStorage.getItem('isAuthenticated')
    this.authStore.isAuthenticated = cachedState === 'true'

    await this.authStore.checkAuth()
  },
}
</script>
