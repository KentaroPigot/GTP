import { defineStore } from 'pinia'
import { fetchAllTasks, createTask, updateTask, updateTaskAssignment, deleteTask } from '@/api/task'
// import { fetchTasksByUser } from '@/api/user'
import { dateToTime, timeToDate } from '@/utils/dateUtils'
import useUserStore from './user'

export default defineStore('taskStore', {
  state: () => ({
    tasks: [], // Liste de toutes les tâches
    userTasks: [], // Liste des tâches d'un utilisateur spécifique
    sortKey: 'libelle',
    sortOrder: 'asc',
    loading: false,
    error: null,
    successMessage: null,
  }),

  actions: {
    setLoading(state) {
      this.loading = state
    },
    setError(message) {
      this.error = message
    },
    setSuccess(message) {
      this.successMessage = message
    },
    clearNotifications() {
      this.error = null
      this.successMessage = null
    },

    async loadTasks() {
      this.setLoading(true)
      this.clearNotifications()
      try {
        const response = await fetchAllTasks(this.sortKey, this.sortOrder)

        // Formater les dates en HH:mm
        this.tasks = response.data.map((task) => ({
          ...task,
          startTime: dateToTime(new Date(task.startTime)),
          endTime: dateToTime(new Date(task.endTime)),
        }))
      } catch (error) {
        this.setError('Erreur lors du chargement des tâches.')
        console.error(error)
      } finally {
        this.setLoading(false)
      }
    },

    async tasksByUser(userId) {
      if (!userId) {
        this.error = 'Aucun utilisateur sélectionné.'
        return
      }
      this.userTasks = this.tasks.filter((task) => task.assignedTo?.id === userId)
      // this.sortTasks()
    },

    async addTask(taskData) {
      this.setLoading(true)
      this.clearNotifications()
      try {
        // Convertir HH:mm en Date avant l'envoi
        const formattedTask = {
          ...taskData,
          startTime: timeToDate(taskData.startTime),
          endTime: timeToDate(taskData.endTime),
        }

        const response = await createTask(formattedTask)

        // Formater la réponse pour l'affichage
        const newTask = {
          ...response.data,
          startTime: dateToTime(new Date(response.data.startTime)),
          endTime: dateToTime(new Date(response.data.endTime)),
        }

        this.tasks.push(newTask)
        this.setSuccess('Tâche ajoutée avec succès.')
      } catch (error) {
        this.setError('Erreur lors de la création de la tâche.')
        console.error(error)
      } finally {
        this.setLoading(false)
      }
    },

    async modifyTask(id, updates) {
      this.loading = true
      this.error = null
      try {
        // Convertir HH:mm en Date avant la mise à jour
        const formattedUpdates = {
          ...updates,
          startTime: timeToDate(updates.startTime),
          endTime: timeToDate(updates.endTime),
        }

        await updateTask(id, formattedUpdates)

        // Recharger les tâches après mise à jour
        await this.loadTasks()
      } catch (error) {
        this.error = `Erreur lors de la mise à jour de la tâche ${id}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async modifyTaskAssignment(taskId) {
      this.loading = true
      this.error = null

      const userStore = useUserStore()
      const userId = userStore.selectedUserId
      try {
        await updateTaskAssignment(userId, taskId)
        await this.loadTasks() // Recharger les tâches après mise à jour
        await userStore.loadUsers()
        this.tasksByUser(userId)
      } catch (error) {
        this.error = `Erreur lors de l'assignation de la tâche ${taskId}`
        console.error(error.message)
      } finally {
        this.loading = false
      }
    },

    async removeTask(id) {
      this.loading = true
      this.error = null
      try {
        await deleteTask(id)
        this.tasks = this.tasks.filter((task) => task.id !== id)
      } catch (error) {
        this.error = `Erreur lors de la suppression de la tâche ${id}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    setSort(key, order) {
      console.log(key, order)
      this.sortKey = key
      this.sortOrder = order
      this.loadTasks()
    },
  },
})
