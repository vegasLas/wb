<template>
  <div class="max-w-3xl mx-auto p-5">
    <UCard class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-200 text-center mb-6">
        Создание триггера
      </h2>
      
      <UForm 
        ref="formRef"
        :state="triggerFormStore.form" 
        :schema="triggerFormStore.schema"
        :context="triggerFormStore.validationContext"
        class="space-y-5"
      >
        <UFormGroup 
          label="Склады"
          name="warehouseIds"
          required
        >
          <MultiSelect
            v-model="triggerFormStore.form.warehouseIds"
            :options="triggerFormStore.warehouseOptions"
            placeholder="Выберите склады"
          />
        </UFormGroup>

        <UFormGroup 
          label="Типы коробов" 
          name="boxTypes"
          required
        >
          <MultiSelect
            v-model="triggerFormStore.form.boxTypes"
            :options="triggerFormStore.boxTypeOptions"
            placeholder="Выберите типы коробов"
          />
        </UFormGroup>

        <UFormGroup name="useCoefficient">
          <UCheckbox 
            v-model="triggerFormStore.useCoefficient" 
            label="Использовать пороговый коэффициент"
            color="blue"
          />
        </UFormGroup>

        <UFormGroup 
          v-if="triggerFormStore.useCoefficient"
          label="Коэффициент" 
          name="coefficientThreshold"
          required
        >
          <UInput
            v-model="triggerFormStore.form.coefficientThreshold"
            type="number"
            step="1"
            placeholder="Введите пороговый коэффициент"
          />
        </UFormGroup>
        <UFormGroup name="useCheckPeriod">
          <UCheckbox 
            v-model="triggerFormStore.useCheckPeriod" 
            label="Использовать отступ дней при проверке складов"
          />
        </UFormGroup>
        <UFormGroup 
          v-if="triggerFormStore.useCheckPeriod"
          label="Триггер будет учитывать отступ дней при проверке складов" 
          name="checkPeriodStart"
          required
        >
          <UInput
            v-model="triggerFormStore.form.checkPeriodStart"
            type="number"
            min="0"
            max="14"
            placeholder="Введите начало периода (0-14)"
          />
        </UFormGroup>
      </UForm>
    </UCard>
  </div>
  <MainButton
    v-if="triggerFormStore.validate"
    :loading="triggerStore.loading" 
    @click="triggerStore.createTrigger(triggerFormStore.form)" 
    text="Создать триггер" 
  />
  <BackButton @click="$emit('back')" />
</template>

<script setup lang="ts">
import { BackButton, MainButton } from 'vue-tg'
import MultiSelect from '~/components/MultiSelect.vue'

const triggerStore = useTriggerStore()
const triggerFormStore = useTriggerFormStore()

onMounted(() => {
  triggerFormStore.initializeWarehouses()
})

onUnmounted(() => {
  triggerFormStore.resetForm()
})
</script>

<style scoped>
/* All custom styles can be removed since we're using:
 * 1. Nuxt UI's built-in styling (configured in app.config.ts)
 * 2. Tailwind utility classes in the template
 */
</style> 