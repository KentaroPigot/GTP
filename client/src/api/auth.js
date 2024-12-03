import apiClient from './index'

export async function login(data) {
  console.log(data)
  const response = await apiClient.post(`/api/v1/users/login`, data)
  console.log(response)
  return response
}

export async function logout() {
  const response = await apiClient.post('/api/v1/users/logout')
  return response
}

export async function signup(data) {
  const response = await apiClient.post(`/api/v1/users/signup`, data)
  return response
}

export async function getMe() {
  const response = await apiClient.get(`/api/v1/users/getMe`)
  return response
}

export async function refreshToken() {
  const response = await apiClient.post(`/api/v1/users/refresh-token`)
  return response
}
