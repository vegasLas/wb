<template>
    <template v-if="!apiKeyStore.hasApiKey">
      <ApiKeyForm @back="stepsStore.setStep('list')" />
    </template>
    <template v-else>
      <div :class="[props.showMain ? 'visible' : 'invisible']" v-if="step === 'list'" class="triggers-container">
        <div class="triggers-header">
          <div class="triggers-stats">
            <span class="triggers-label">триггеров: </span>
            <span class="triggers-count">{{ triggerStore.triggers.length }}</span>
          </div>
          
          <div class="button-row">
            <UButton
              @click="stepsStore.setStep('api-key')"
              icon="i-heroicons-key"
              size="sm"
              color="primary"/>
            <UButton
              @click="stepsStore.setStep('form')"
              icon="i-heroicons-plus"
              size="sm"
              color="primary"
              trailing
            >
              Создать триггер
            </UButton>
          </div>
        </div>

        <TriggersList />
      </div>
      <TriggerForm v-else-if="step === 'form'" @back="stepsStore.setStep('list')" />
      <ApiKeyForm v-else-if="step === 'api-key'" @back="stepsStore.setStep('list')" />
    </template>
</template>

<script setup lang="ts">
const triggerStore = useTriggerStore()
const stepsStore = useSteps()
const { step } = storeToRefs(stepsStore)
const apiKeyStore = useApiKeyStore()
const props = defineProps<{
  showMain: boolean
}>()
onMounted(async () => {
  try {
    await apiKeyStore.checkApiKeyExists()
    if (apiKeyStore.hasApiKey) {
      await triggerStore.fetchTriggers()
    }
  } catch (error) {
    console.error('Failed to check API key:', error)
  }
})
</script>

<style scoped>
.triggers-container {
  padding: 1rem;
}

.triggers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.triggers-stats {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.button-row {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.triggers-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

.triggers-label {
  font-size: 1rem;
  color: var(--color-gray-600);
}
</style> 