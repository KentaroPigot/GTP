<template>
  <tr
    :class="{ selected: isSelected }"
    class="table-row align-middle"
    @click="onRowClick"
    title="Selectionnez un employé"
  >
    <td>{{ user.firstname }}</td>
    <td class="text-center">{{ totalDuration }}</td>
    <td class="text-center">{{ user.tasks.length }}</td>
  </tr>
</template>

<script>
import { floatToTime } from '@/utils/dateUtils'
import { mapState } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'UserItem',
  props: {
    user: { type: Object, required: true },
    onClick: { type: Function, default: null },
  },
  computed: {
    ...mapState(useUserStore, ['selectedUserId']),
    totalDuration() {
      return floatToTime(
        this.user.tasks.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.duration
        }, 0),
      )
    },
    isSelected() {
      return this.selectedUserId === this.user.id
    },
  },
  methods: {
    onRowClick() {
      if (this.onClick) this.onClick(this.user.id)
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

.table-row.selected > * {
  background-color: #007bff !important;
  color: white !important;
}
</style>
