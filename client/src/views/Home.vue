<template>
  <main class="container bg-light py-4 h-100">
    <tasks-table :actionClick="removeTask" />
  </main>
</template>

<script>
import TasksTable from '@/components/tasks/TasksTable.vue'
import { mapActions } from 'pinia'
import useTaskStore from '@/stores/tasks'

export default {
  name: 'HomePage',
  components: { TasksTable },
  methods: {
    ...mapActions(useTaskStore, ['removeTask']),
  },
}
</script>
