import apiClient from './index'

export async function fetchAllTasks(sortKey = '', sortOrder = 'asc') {
  try {
    const response = await apiClient.get('/api/v1/tasks', {
      params: {
        sort: sortKey ? (sortOrder === 'asc' ? sortKey : `-${sortKey}`) : '',
      },
    })
    return response
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error)
    throw error
  }
}

export async function fetchTasksByUser(userId) {
  const response = await apiClient.get(`/api/v1/users/${userId}/tasks`) // Route plus spécifique pour l'utilisateur
  return response
}

export async function createTask(taskData) {
  const response = await apiClient.post('/api/v1/tasks', taskData)
  return response
}

export async function updateTask(id, updates) {
  const response = await apiClient.patch(`/api/v1/tasks/${id}`, updates)
  return response
}

export async function updateTaskAssignment(userId, taskId) {
  const response = await apiClient.patch(`/api/v1/tasks/${taskId}/assignment/${userId}`) // Route spécifique pour l'assignation
  return response
}

export async function deleteTask(id) {
  const response = await apiClient.delete(`/api/v1/tasks/${id}`)
  return response
}
