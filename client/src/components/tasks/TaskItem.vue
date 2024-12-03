<template>
  <tr class="table-row align-middle" @click="onRowClick" title="Cliquez pour plus de détails">
    <td>{{ task.libelle }}</td>
    <td class="text-center">{{ task.startTime }}</td>
    <td class="text-center">{{ task.endTime }}</td>
    <td class="text-center">{{ task?.assignedTo?.firstname || 'Non assigné' }}</td>
    <td v-if="showActions" class="text-center">
      <button
        v-if="authStore.isAuthenticated"
        class="btn-action text-danger"
        @click.stop="actionClick"
        title="Supprimer la tâche"
      >
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TaskItem',
  inject: ['authStore'],
  props: {
    task: { type: Object, required: true },
    showActions: { type: Boolean, default: false },
    onClick: { type: Function, default: null },
  },
  methods: {
    actionClick() {
      this.$emit('action-click', this.task.id)
    },
    onRowClick() {
      if (this.onClick) this.onClick(this.task.id)
    },
  },
}
</script>

<style scoped>
.table-row {
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.table-row:hover {
  background-color: #f1f3f5;
  transform: translateY(-2px);
}

.table-row td {
  padding: 12px;
  font-size: 0.85rem;
  color: #495057;
}

.table-row td:first-child {
  font-weight: 600;
}

.btn-action {
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.btn-action:hover {
  background-color: #f8d7da;
  color: #dc3545;
}

.text-danger {
  color: #dc3545;
}

.text-danger:hover {
  color: #b02a37;
}
</style>
