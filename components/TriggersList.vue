<template>
  <div class="space-y-4">
    <UInput
      v-model="triggerStore.searchQuery"
      icon="i-heroicons-magnifying-glass"
      placeholder="Поиск по названию склада..."
      size="lg"
      color="gray"
    />

    <UCard v-for="trigger in triggerStore.filteredTriggers" :key="trigger.id" class="p-4">
      <div class="flex justify-between items-start">
        <div class="space-y-2">
          <!-- Warehouses -->
          <div>
            <div class="font-medium">Склады:</div>
            <div class="flex flex-wrap gap-1">
              <UBadge
                v-for="warehouseId in trigger.warehouseIds"
                :key="warehouseId"
                size="sm"
                color="gray"
              >
                {{ warehouseStore.getWarehouseName(warehouseId) }}
              </UBadge>
            </div>
          </div>

          <!-- Box Types -->
          <div>
            <div class="font-medium">Типы коробов:</div>
            <div class="flex flex-wrap gap-1">
              <UBadge
                size="sm"
                v-for="boxType in trigger.boxTypes"
                :key="boxType"
                color="gray"
              >
                {{ boxType }}
              </UBadge>
            </div>
          </div>

          <!-- Coefficient -->
          <div>
            <span class="font-medium">Бесплатная приемка: </span>
            <span>{{ trigger.isFree ? 'Да' : 'Нет' }}</span>
          </div>

          <!-- Check Period -->
          <div v-if="trigger.checkPeriodStart">
            <span class="font-medium">Отступ в днях: </span>
            <span>{{ trigger.checkPeriodStart }}</span>
          </div>

          <!-- Check Interval -->
          <div>
            <span class="font-medium">Интервал проверки: </span>
            <span>{{ formatInterval(trigger.checkInterval) }}</span>
          </div>

          <!-- Max Coefficient -->
          <div v-if="trigger.maxCoefficient > 0">
            <span class="font-medium">Макс. коэффициент: </span>
            <span>{{ trigger.maxCoefficient }}</span>
          </div>

          <!-- Created Date -->
          <div class="text-sm">
            Создан: {{ formatDate(trigger.createdAt) }}
          </div>
        </div>

        <div class="flex gap-2">
          <UButton
          color="blue"
          variant="soft"
          @click="triggerStore.toggleTrigger(trigger.id)"
          >
          {{ trigger.isActive ? 'стоп' : 'запуск' }}
        </UButton>

          <UButton
            color="red"
            variant="soft"
            icon="i-heroicons-trash"
            :loading="triggerStore.deletingId === trigger.id"
            @click="triggerStore.deleteTrigger(trigger.id)"
          />
        </div>
      </div>
    </UCard>

    <div v-if="triggerStore.filteredTriggers.length === 0" class="text-center py-8">
      {{ triggerStore.searchQuery ? 'Триггеры не найдены' : 'Триггеры не созданы' }}
    </div>
  </div>
</template>

<script setup lang="ts">
const triggerStore = useTriggerStore()
const warehouseStore = useWarehouses()

if (triggerStore.triggers.length === 0) {
  await triggerStore.fetchTriggers()
}
if (warehouseStore.warehouses.length === 0) {
  await warehouseStore.fetchWarehouses()
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script> 