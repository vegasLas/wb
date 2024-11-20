import { updateApiKey as apiUpdateApiKey } from '~/api/apiKey'

export const useApiKeyStore = defineStore('apiKey', () => {
  // state
  const apiKey = ref<string>('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const showApiKey = ref(false)
  // getters
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const hasApiKey = computed(() => !!apiKey.value)

  // actions
  async function updateApiKey() {
    try {
      loading.value = true
      const response = await apiUpdateApiKey(apiKey.value)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response
    } catch (err) {
      error.value = 'Failed to update API key'
      throw err
    } finally {
      loading.value = false
    }
  }
  function toggleVisibility() {
    showApiKey.value = !showApiKey.value
  }
  return {
    // state
    apiKey,
    loading,
    error,
    showApiKey,
    // getters
    isLoading,
    hasError,
    hasApiKey,
    // actions
    updateApiKey,
    toggleVisibility,
  }
}) 