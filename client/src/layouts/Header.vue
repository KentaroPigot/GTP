<template>
  <header id="header" class="app-header">
    <nav class="container d-flex justify-content-between align-items-center">
      <router-link class="app-name" :to="{ name: 'home' }" exact-active-class="no-active">
        PlaneteOnline
      </router-link>

      <div>
        <ul class="nav">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'home' }">Home</router-link>
          </li>

          <template v-if="authStore.isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'manage' }">Gérer</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'addTask' }">Créer</router-link>
            </li>
          </template>

          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="toggleAuthModal"> Connexion </a>
          </li>

          <template v-else>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="authStore.logout">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from 'pinia'
import useModalStore from '@/stores/modal'
import useAuthStore from '@/stores/auth'

export default {
  name: 'AppHeader',
  computed: {
    ...mapStores(useModalStore, useAuthStore),
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
    },
  },
}
</script>

<style scoped>
.app-header {
  background-color: #1d3557;
  color: #f1faee;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.app-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f1faee;
  text-decoration: none;
  transition: color 0.3s ease;
}

.app-name:hover {
  color: #a8dadc;
}

.nav {
  padding: 0;
  margin: 0;
  list-style: none;
  flex-wrap: nowrap !important;
}

.nav-item {
  position: relative;
  z-index: 1;
  border-radius: 100vw 100vw 0 0;

  padding-top: 1rem;
}

.nav-link {
  font-size: 1rem;
  color: #f1faee;
  text-decoration: none;
  padding: 0.5rem 1rem 1.5rem;
  border-radius: 1.5rem 1.5rem 0 0;

  transition: color 0.5s ease !important;
}

.nav-link:hover {
  color: #7aa4df;
}

@media (max-width: 768px) {
  .app-name {
    font-size: 1.25rem;
  }

  .nav-item {
    margin: 0 0.5rem;
  }

  .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
