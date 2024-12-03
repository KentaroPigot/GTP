<template>
  <main class="container-fluid bg-light py-4 d-flex justify-content-center flex-wrap flex-grow-1">
    <users-table />
    <tasks-table class="flex-grow-1" :hasActionCol="false" :rowClick="modifyTaskAssignment" />
    <user-calendar class="flex-grow-1" />
  </main>
</template>

<script>
import UsersTable from '@/components/users/UsersTable.vue'
import TasksTable from '@/components/tasks/TasksTable.vue'
import UserCalendar from '@/components/users/UserCalendar.vue'
import { mapActions } from 'pinia'
import useTaskStore from '@/stores/tasks'

export default {
  name: 'ManagePage',
  components: { TasksTable, UsersTable, UserCalendar },
  methods: {
    ...mapActions(useTaskStore, ['modifyTaskAssignment']),
  },
}
</script>
