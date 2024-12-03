<template>
  <div class="table-wrapper table-responsive bg-white rounded shadow-sm">
    <div class="position-relative" style="height: 100%; overflow-y: auto">
      <div class="table calendar-table">
        <!-- Colonnes horaires -->
        <div
          class="calendar-row"
          v-for="hour in hours"
          :key="hour.label"
          :style="{ height: `${hourHeight}px` }"
        >
          <div class="calendar-time">{{ hour.label }}</div>
          <div class="calendar-slot"></div>
        </div>

        <!-- Tâches -->
        <div
          class="task rounded text-white text-center"
          v-for="task in userTasks"
          :key="task.libelle"
          :style="getTaskStyle(task)"
        >
          <strong>{{ task.libelle }}</strong>
          <div>{{ task.startTime }} - {{ task.endTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import useTaskStore from '@/stores/tasks'

export default {
  data() {
    return {
      hours: Array.from({ length: 11 }, (_, i) => {
        const hour = i + 8 // Plage horaire : 8h à 18h
        return {
          label: `${hour.toString().padStart(2, '0')}:00`,
          value: hour,
        }
      }),
      hourHeight: 60, // Hauteur d'une heure en pixels
    }
  },
  computed: {
    ...mapState(useTaskStore, ['userTasks']),
  },
  methods: {
    /**
     * Calcule le style CSS d'une tâche
     */
    getTaskStyle(task) {
      const [startHour, startMinute] = task.startTime.split(':').map(Number)
      const [endHour, endMinute] = task.endTime.split(':').map(Number)
      const startInMinutes = startHour * 60 + startMinute
      const endInMinutes = endHour * 60 + endMinute

      // Calculer la position dans la plage horaire (8h à 18h)
      const dayStartInMinutes = 8 * 60
      const top = ((startInMinutes - dayStartInMinutes) / 60) * this.hourHeight
      const height = ((endInMinutes - startInMinutes) / 60) * this.hourHeight

      return {
        position: 'absolute',
        top: `${top}px`,
        height: `${height}px`,
        right: '0',
        width: '75%',
        backgroundColor: '#007bff',
        zIndex: 10,
      }
    },
  },
}
</script>

<style scoped>
.table {
  margin-bottom: 0 !important;
}

.calendar-table {
  position: relative;
  min-width: 250px;
  border-left: 2px solid #dee2e6;
}

.calendar-row {
  display: flex;
  align-items: center;
  border-top: 1px solid #dee2e6;
  position: relative;
}

.calendar-time {
  position: absolute;
  left: 0;
  top: 0;
  padding: 5px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #495057;
}

.calendar-slot {
  flex: 1;
  height: 100%;
}

.task {
  position: absolute;
  padding: 10px;
  font-size: 0.85rem;
  line-height: 1.2;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
