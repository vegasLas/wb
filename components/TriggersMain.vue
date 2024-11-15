<template>
  <div v-if="step === 'list'" class="triggers-container">
    <div class="triggers-header">
      <div class="triggers-stats">
        <span class="triggers-count">{{ triggerStore.triggers.length }}</span>
        <span class="triggers-label">Триггеры</span>
      </div>
      
      <UButton
	  	@click="step = 'form'"
        icon="i-heroicons-plus"
        size="sm"
        color="primary"
      >
        Создать триггер
      </UButton>
    </div>

    <TriggersList />
  </div>
  <TriggerForm v-else @back="step = 'list'" />
</template>

<script setup lang="ts">
const triggerStore = useTriggerStore()
triggerStore.fetchTriggers()
const step = ref<'list' | 'form'>('list')
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