import { fetchAllUsers } from '@/api/user'
import { defineStore } from 'pinia'

export default defineStore('userStore', {
  state: () => ({
    users: [],
    selectedUserId: null,
    loading: false,
    error: null,
    sort: {
      key: 'name',
      order: 'asc',
    },
  }),

  getters: {
    // sortedUsers: (state) => {
    //   return [...state.users].sort((a, b) => {
    //     const key = state.sort.key
    //     const orderMultiplier = state.sort.order === 'asc' ? 1 : -1
    //     return (a[key] > b[key] ? 1 : -1) * orderMultiplier
    //   })
    // },
    selectedUser: (state) => {
      return state.users.find((user) => user.id === state.selectedUserId)
    },
  },

  actions: {
    selectUser(userId) {
      this.selectedUserId = userId
    },

    setSort(key, order) {
      this.sort.key = key
      this.sort.order = order
      this.loadUsers()
    },

    async loadUsers() {
      this.loading = true
      try {
        const response = await fetchAllUsers()
        // console.log(response)
        this.users = response.data
      } catch (error) {
        console.log(error)
        this.error = 'Erreur lors du chargement des utilisateurs.'
      } finally {
        this.loading = false
      }
    },
  },
})
