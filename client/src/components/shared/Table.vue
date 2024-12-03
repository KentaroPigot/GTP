<template>
  <div class="table-wrapper table-responsive bg-white rounded shadow-sm h-100">
    <table class="table table-striped mb-0">
      <thead class="sticky-top table-header">
        <tr>
          <th v-for="column in columns" :key="column.key" class="text-center align-middle">
            <div class="d-flex align-items-center justify-content-center">
              {{ column.label }}
              <button
                v-if="column.sortable"
                @click="$emit('sort', column.key)"
                class="btn btn-link btn-sm ms-2"
                title="Trier"
              >
                <i :class="getSortIcon(column.key)"></i>
              </button>
            </div>
          </th>
          <th v-if="hasActions" class="text-center align-middle">Actions</th>
        </tr>
      </thead>
      <tbody>
        <slot name="rows" :items="items"></slot>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    items: { type: Array, required: true },
    columns: { type: Array, required: true },
    sortKey: { type: String, default: null },
    sortOrder: { type: String, default: 'asc' },
    hasActions: { type: Boolean, default: false },
  },
  methods: {
    getSortIcon(key) {
      if (this.sortKey === key) {
        return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
      }
      return 'fas fa-sort'
    },
  },
}
</script>

<style scoped>
.table-wrapper {
  max-height: 100%;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.table-header {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table th {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  padding: 12px;
}

.table td {
  font-size: 0.85rem;
  padding: 10px;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f8f9fa;
}

.table td,
.table th {
  text-align: center;
}

.btn-link {
  color: #007bff;
  text-decoration: none;
  padding: 0;
  border: none;
}

.btn-link:hover {
  color: #0056b3;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.rounded {
  border-radius: 0.5rem;
}

@media (max-width: 887px) {
  .table-wrapper {
    max-height: 25dvh;
  }
}
</style>
