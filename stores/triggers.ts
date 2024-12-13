import { 
  createTrigger as apiCreateTrigger,
  updateTrigger as apiUpdateTrigger,
  deleteTrigger as apiDeleteTrigger,
  getTriggers as apiGetTriggers,
  toggleTrigger as apiToggleTrigger
} from '~/api/triggers'
import type { 
  CreateTriggerRequest, 
  UpdateTriggerRequest,
  SupplyTrigger
} from '~/types/triggers'

export const useTriggerStore = defineStore('triggers', () => {
  // state
  const triggers = ref<SupplyTrigger[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const deletingId = ref<string | null>(null)
  const searchQuery = ref('')
  const isCreating = ref(false)
  // getters
  const getTriggerById = computed(() => {
    return (triggerId: string) => triggers.value.find(t => t.id === triggerId)
  })
  
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  const filteredTriggers = computed(() => {
    if (!searchQuery.value) return triggers.value
    
    const query = searchQuery.value.toLowerCase()
    const warehouseStore = useWarehouses()
    return triggers.value.filter(trigger => 
      trigger.warehouseIds.some(warehouseId => {
        const name = warehouseStore.getWarehouseName(warehouseId)
        return typeof name === 'string' && name.toLowerCase().includes(query)
      })
    )
  })

  // actions
  async function createTrigger(data: CreateTriggerRequest) {
    try {
      isCreating.value = true
      loading.value = true
      const trigger = await apiCreateTrigger(data)
      if (trigger) {
        triggers.value.unshift(trigger)
      }
      useSteps().setStep('list')
      return trigger
    } catch (err) {
      error.value = 'Failed to create trigger'
      throw err
    } finally {
      loading.value = false
      isCreating.value = false
    }
  }

  async function updateTrigger(data: UpdateTriggerRequest) {
    try {
      loading.value = true
      const trigger = await apiUpdateTrigger(data)
      // Update the trigger in the state
      const index = triggers.value.findIndex(t => t.id === data.triggerId)
      if (index !== -1 && trigger) {
        triggers.value[index] = trigger
      }
      return trigger
    } catch (err) {
      error.value = 'Failed to update trigger'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTriggers() {
    try {
      loading.value = true
      const response = await apiGetTriggers()
      if (response.data.value) {
        triggers.value = response.data.value
      }
      return response
    } catch (err) {
      error.value = 'Failed to fetch triggers'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTrigger(triggerId: string) {
    try {
      deletingId.value = triggerId
      const doActionResult = await doAction({
        title: 'Удалить триггер',
        message: 'Хотите удалить триггер?',
        buttonText: 'Удалить',
      })
      if (!doActionResult) {
        return
      }
      loading.value = true
      await apiDeleteTrigger(triggerId)
      // Remove the trigger from the state
      triggers.value = triggers.value.filter(t => t.id !== triggerId)
    } catch (err) {
      error.value = 'Failed to delete trigger'
      throw err
    } finally {
      loading.value = false
      deletingId.value = null
    }
  }

  async function toggleTrigger(triggerId: string): Promise<void> {
    try {
      loading.value = true
      const updatedTrigger = await apiToggleTrigger(triggerId)
      const index = triggers.value.findIndex(t => t.id === triggerId)
      if (index !== -1 && updatedTrigger) {
        triggers.value[index] = updatedTrigger
      }
    } catch (err) {
      error.value = 'Failed to toggle trigger'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    triggers,
    loading,
    deletingId,
    error,
    isCreating,
    // getters
    getTriggerById,
    isLoading,
    hasError,
    // actions
    createTrigger,
    updateTrigger,
    fetchTriggers,
    deleteTrigger,
    toggleTrigger,
    // add new returns
    searchQuery,
    filteredTriggers,
  }
})