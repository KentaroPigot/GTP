import apiClient from './index'

export async function getUser(id) {
  try {
    const response = await apiClient.get(`/api/v1/users/${id}`)
    return response
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error)
    throw error
  }
}

export async function createUser(data) {
  try {
    const response = await apiClient.post('/api/v1/users', data)
    return response
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error)
    throw error
  }
}

export async function updateUser(id, data) {
  try {
    const response = await apiClient.put(`/api/v1/users/${id}`, data)
    return response
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error)
    throw error
  }
}

export async function deleteUser(id) {
  try {
    const response = await apiClient.delete(`/api/v1/users/${id}`)
    return response
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error)
    throw error
  }
}

export async function fetchAllUsers() {
  try {
    const response = await apiClient.get('/api/v1/users')
    return response
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error)
    throw error
  }
}

export async function fetchTasksByUser(id) {
  const response = await apiClient.get(`/api/v1/users/${id}/tasks`)
  return response
}
