<template>
  <task-table
    :items="tasks"
    :columns="columns"
    :sortKey="sortKey"
    :sortOrder="sortOrder"
    :hasActions="hasActionCol && isAuthenticated"
    @sort="sortBy"
  >
    <template #rows="{ items }">
      <td v-if="loading" :colspan="tableSpan">
        <error :error="error" />
        <loader :loading="loading" />
      </td>
      <task-item
        v-else
        v-for="task in items"
        :key="task.id"
        :task="task"
        :show-actions="hasActionCol && isAuthenticated"
        :onClick="rowClick"
        @action-click="actionClick"
      />
    </template>
  </task-table>
</template>

<script>
import TaskTable from '@/components/shared/Table.vue'
import TaskItem from '@/components/tasks/TaskItem.vue'
import { mapActions, mapState } from 'pinia'
import useTaskStore from '@/stores/tasks'
import useAuthStore from '@/stores/auth'
import Loader from '@/components/shared/Loader.vue'
import Error from '@/components/shared/Error.vue'

export default {
  name: 'TasksTableComponent',
  components: { TaskTable, TaskItem, Loader, Error },
  props: {
    hasActionCol: { type: Boolean, default: true },
    rowClick: { type: Function },
    actionClick: { type: Function },
  },
  data() {
    return {
      columns: [
        { key: 'libelle', label: 'Libelle', sortable: true },
        { key: 'startTime', label: 'Début', sortable: true },
        { key: 'endTime', label: 'Fin', sortable: true },
        { key: 'assignedTo', label: 'Responsable', sortable: true },
      ],
    }
  },
  computed: {
    ...mapState(useTaskStore, ['tasks', 'sortKey', 'sortOrder', 'loading', 'error']),
    ...mapState(useAuthStore, ['isAuthenticated']),
    tableSpan() {
      return this.isAuthenticated ? this.columns.length + 1 : this.columns.length
    },
  },
  methods: {
    ...mapActions(useTaskStore, ['loadTasks', 'setSort']),
    sortBy(key) {
      const newOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      this.setSort(key, newOrder)
    },
  },
  created() {
    this.loadTasks()
  },
}
</script>
