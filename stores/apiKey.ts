import { updateApiKey as apiUpdateApiKey, checkApiKeyExists as apiCheckApiKeyExists } from '~/api/apiKey'

export const useApiKeyStore = defineStore('apiKey', () => {
  // state
  const apiKey = ref<string>('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const showApiKey = ref(false)
  const hasApiKey = ref(false)

  // getters
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // actions
  async function updateApiKey() {
    try {
      loading.value = true
      const response = await apiUpdateApiKey(apiKey.value)
      
      if (!response.success) {
        error.value = response.message
        return response
      }
      
      hasApiKey.value = true
      useSteps().setStep('list')
      return response
    } catch (err) {
      error.value = 'Failed to update API key'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkApiKeyExists() {
    try {
      loading.value = true
      const { hasApiKey: exists } = await apiCheckApiKeyExists()
      hasApiKey.value = exists
    } catch (err) {
      error.value = 'Failed to check API key'
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
    hasApiKey,
    // getters
    isLoading,
    hasError,
    // actions
    updateApiKey,
    checkApiKeyExists,
    toggleVisibility,
  }
}) 