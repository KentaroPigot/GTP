<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h2 class="h5 mb-0">Créer une nouvelle tâche</h2>
      </div>
      <div class="card-body">
        <Form :validation-schema="schema" @submit="createTask">
          <!-- Libellé -->
          <div class="mb-3">
            <label for="libelle" class="form-label">Libelle</label>
            <Field
              id="libelle"
              name="libelle"
              type="text"
              class="form-control"
              placeholder="Entrez un libelle"
            />
            <ErrorMessage name="libelle" class="text-danger mt-1" />
          </div>
          <!-- Heure de début -->
          <div class="mb-3">
            <label for="startTime" class="form-label">Heure de début</label>
            <Field id="startTime" name="startTime" type="time" class="form-control" />
            <ErrorMessage name="startTime" class="text-danger mt-1" />
          </div>
          <!-- Heure de fin -->
          <div class="mb-3">
            <label for="endTime" class="form-label">Heure de fin</label>
            <Field id="endTime" name="endTime" type="time" class="form-control" />
            <ErrorMessage name="endTime" class="text-danger mt-1" />
          </div>

          <!-- Notifications -->
          <div v-if="loading" class="alert alert-primary" role="alert">
            Veuillez patienter, la tâche est en cours de création.
          </div>
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
          </div>

          <!-- Bouton -->
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" :disabled="loading">Enregistrer</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import newTaskSchema from '@/schemas/newTaskSchema'
import useTaskStore from '@/stores/tasks'
import { mapActions, mapState } from 'pinia'

export default {
  name: 'CreateTaskForm',
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      schema: newTaskSchema,
    }
  },
  computed: {
    ...mapState(useTaskStore, ['loading', 'error', 'successMessage']),
  },
  methods: {
    ...mapActions(useTaskStore, ['addTask']),
    async createTask(values, { resetForm }) {
      await this.addTask(values)
      resetForm()
    },
  },
}
</script>
