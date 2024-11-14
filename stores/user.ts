import type { User } from '~/types/user'

interface UserState {
  currentUser: User | null
  isLoading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    userName: (state) => state.currentUser?.name ?? 'Guest',
    userLanguage: (state) => state.currentUser?.languageCode
  },

  actions: {
    setUser(user: User) {
      this.currentUser = user
      this.error = null
    },

    clearUser() {
      this.currentUser = null
    },

    setError(error: string) {
      this.error = error
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    async fetchUser(telegramId: bigint) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await $fetch<User>('/api/user', {
          params: { telegramId: telegramId.toString() }
        })
        this.currentUser = response
      } catch (error) {
        this.error = 'Failed to fetch user'
        console.error('Error fetching user:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}) 