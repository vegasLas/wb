import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  createTrigger as apiCreateTrigger,
  updateTrigger as apiUpdateTrigger,
  deleteTrigger as apiDeleteTrigger,
  getTriggers as apiGetTriggers
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

  // getters
  const getTriggerById = computed(() => {
    return (triggerId: string) => triggers.value.find(t => t.id === triggerId)
  })
  
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // actions
  async function createTrigger(data: CreateTriggerRequest) {
    try {
      loading.value = true
      const trigger = await apiCreateTrigger(data)
      if (trigger) {
        triggers.value.push(trigger)
      }
      return trigger
    } catch (err) {
      error.value = 'Failed to create trigger'
      throw err
    } finally {
      loading.value = false
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
      if (response) {
        triggers.value = response
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
      loading.value = true
      await apiDeleteTrigger(triggerId)
      // Remove the trigger from the state
      triggers.value = triggers.value.filter(t => t.id !== triggerId)
    } catch (err) {
      error.value = 'Failed to delete trigger'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    triggers,
    loading,
    error,
    // getters
    getTriggerById,
    isLoading,
    hasError,
    // actions
    createTrigger,
    updateTrigger,
    fetchTriggers,
    deleteTrigger,
  }
})