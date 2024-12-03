<template>
  <div v-if="error" class="error-message">
    <p>{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
    error: String,
  },
}
</script>

<style scoped>
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
}
p {
  margin: 0;
}
</style>
