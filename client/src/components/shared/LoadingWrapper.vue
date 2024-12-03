<template>
  <div v-if="loading" class="text-center">
    <p>Chargement...</p>
  </div>
  <div v-else-if="error" class="text-center text-red-500">
    <p>Une erreur est survenue pendant le chargement des données.</p>
  </div>
  <div v-else-if="isEmpty" class="text-center">
    <p>Aucune tâche à afficher.</p>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'LoadingWrapper',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    isEmpty: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped></style>
