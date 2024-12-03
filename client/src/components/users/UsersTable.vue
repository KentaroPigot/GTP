<template>
  <users-table :items="users" :columns="columns" :sortKey="sort.key" :sortOrder="sort.order">
    <template #rows="{ items }">
      <user-item v-for="user in items" :key="user.id" :user="user" :onClick="selectEmployee" />
    </template>
  </users-table>
</template>

<script>
import UserItem from './UserItem.vue'
import UsersTable from '../shared/Table.vue'
import { mapActions, mapState } from 'pinia'
import useTaskStore from '@/stores/tasks'
import useUserStore from '@/stores/user'

export default {
  name: 'UsersTableComponent',
  components: { UsersTable, UserItem },
  data() {
    return {
      columns: [
        { key: 'user', label: 'User', sortable: true },
        { key: 'durée', label: 'Durée', sortable: true },
        { key: 'nb', label: 'Nb', sortable: true },
      ],
    }
  },
  computed: {
    ...mapState(useTaskStore, ['tasks', 'sortKey', 'sortOrder', 'loading', 'error']),
    ...mapState(useUserStore, ['users', 'sort']),
  },
  methods: {
    ...mapActions(useTaskStore, ['tasksByUser']),
    ...mapActions(useUserStore, ['loadUsers', 'selectUser']),
    selectEmployee(id) {
      this.selectUser(id)
      this.tasksByUser(id)
    },
  },
  created() {
    if (this.users.length === 0) {
      this.loadUsers()
    }
  },
}
</script>
