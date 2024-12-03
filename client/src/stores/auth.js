import { defineStore } from 'pinia'
import { getMe, login, logout, refreshToken, signup } from '@/api/auth'

export default defineStore('auth', {
  state: () => ({
    loading: null,
    error: null,
    isAuthenticated: localStorage.getItem('isAuthenticated') || false,
  }),
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        await login(credentials)
        localStorage.setItem('isAuthenticated', true)
        window.location.reload()
      } catch (error) {
        console.error('Login failed:', error.response?.data?.message || error.message)
        this.error = error.response?.data?.message || error.message
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      try {
        await logout()
        localStorage.setItem('isAuthenticated', false)
        window.location.reload()
      } catch (error) {
        console.error('Logout failed:', error.response?.data?.message || error.message)
        this.error = error.response?.data?.message || error.message
      } finally {
        this.loading = false
      }
    },

    async signup(formData) {
      this.loading = true
      this.error = null

      try {
        await signup(formData)
        localStorage.setItem('isAuthenticated', true)
        window.location.reload()
      } catch (error) {
        console.error('Signup failed:', error.response?.data?.message || error.message)
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      this.loading = true
      this.error = null
      try {
        console.log('Check login')
        await getMe()
        localStorage.setItem('isAuthenticated', true)
        this.isAuthenticated = true
      } catch (error) {
        console.log(error)
        localStorage.setItem('isAuthenticated', false)
        this.isAuthenticated = false
      } finally {
        this.loading = false
      }
    },

    async refreshToken() {
      try {
        await refreshToken()
      } catch (error) {
        console.error('Refresh token failed:', error.response?.data?.message || error.message)
      }
    },
  },
})
