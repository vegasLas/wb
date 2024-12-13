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

        <UFormGroup 
          label="Через сколько после срабатывания триггера снова проверять склады" 
          name="checkInterval"
          required
        >
          <USelect
            v-model="triggerFormStore.form.checkInterval"
            :options="triggerFormStore.intervalOptions"
            placeholder="Интервал проверки"
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
            v-model.number="triggerFormStore.form.checkPeriodStart "
            type="number"
            min="0"
            max="14"
            placeholder="Введите начало периода (0-14)"
          />
        </UFormGroup>
        <UFormGroup name="isFree">
          <UCheckbox 
            v-model="triggerFormStore.form.isFree" 
            label="Бесплатная поставка"
            color="blue"
            :disabled="triggerFormStore.useMaxCoefficient"
            @update:model-value="(val) => {
              if (val) {
                console.log('val1', val)
                triggerFormStore.useMaxCoefficient = false
                triggerFormStore.form.maxCoefficient = 0
              }
            }"
          />
        </UFormGroup>
        <UFormGroup name="useMaxCoefficient">
          <UCheckbox 
            v-model="triggerFormStore.useMaxCoefficient" 
            label="Использовать максимальный коэффициент выгрузки"
            :disabled="triggerFormStore.form.isFree"
            @update:model-value="(val) => {
              if (val) {
                triggerFormStore.form.isFree = false
                triggerFormStore.form.maxCoefficient = 1
              } else {
                console.log('val2', val)
                triggerFormStore.form.maxCoefficient = 0
              }
            }"
          />
        </UFormGroup>

        <UFormGroup 
          v-if="triggerFormStore.useMaxCoefficient"
          label="Максимальный коэффициент выгрузки" 
          name="maxCoefficient"
        >
          <div class="flex items-center gap-4">
            <URange
              class="flex-1"
              v-model="triggerFormStore.form.maxCoefficient"
              :step="1"
              :min="1"
              :max="20"
              :disabled="!triggerFormStore.useMaxCoefficient"
            />
            <div class="min-w-[4rem] text-center">
              <UBadge size="lg" color="gray">
                {{ triggerFormStore.form.maxCoefficient }}
              </UBadge>
            </div>
          </div>
        </UFormGroup>
      </UForm>
    </UCard>
  </div>
  <MainButton
    v-if="triggerFormStore.validate"
    :disabled="triggerStore.isCreating"
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