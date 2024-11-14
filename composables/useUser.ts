import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'

export const useUser = () => {
  const store = useUserStore()
  const { currentUser, isLoading, error } = storeToRefs(store)
  
  return {
    // State
    currentUser,
    isLoading,
    error,
    
    // Getters
    isAuthenticated: computed(() => store.isAuthenticated),
    userName: computed(() => store.userName),
    userLanguage: computed(() => store.userLanguage),
    
    // Actions
    setUser: store.setUser,
    clearUser: store.clearUser,
    fetchUser: store.fetchUser
  }
} 