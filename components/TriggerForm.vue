<template>
  <UCard>
    <UForm 
      ref="formRef"
      :state="form" 
      :schema="schema"
      :context="validationContext"
    >
      <UFormGroup 
        label="Склады" 
        name="warehouseIds"
        required
      >
        <USelect
          v-model="form.warehouseIds"
          :options="warehouseOptions"
          multiple
          placeholder="Выберите склады"
        />
      </UFormGroup>

      <UFormGroup 
        label="Типы коробов" 
        name="boxTypes"
        required
      >
        <USelect
          v-model="form.boxTypes"
          :options="boxTypeOptions"
          multiple
          placeholder="Выберите типы коробов"
        />
      </UFormGroup>

      <UFormGroup name="useCoefficient">
        <UCheckbox v-model="useCoefficient" label="Использовать пороговый коэффициент" />
      </UFormGroup>

      <UFormGroup 
        v-if="useCoefficient"
        label="Коэффициент" 
        name="coefficientThreshold"
        required
      >
        <UInput
          v-model="form.coefficientThreshold"
          type="number"
          step="1"
          placeholder="Введите пороговый коэффициент"
        />
      </UFormGroup>
	  
      <UFormGroup 
        label="Триггер будет учитывать отступ дней при проверке складов" 
        name="checkPeriodStart"
        required
      >
        <UInput
          v-model="form.checkPeriodStart"
          type="number"
          min="0"
          max="14"
          placeholder="Введите начало периода (0-14)"
        />
      </UFormGroup>
    </UForm>
  </UCard>
  <MainButton 
    text="Создать триггер" 
    @click="triggerStore.createTrigger(form)"
    :progress="triggerStore.loading"
    :disabled="!isFormValid"
  />
  <BackButton @click="$emit('back')" />
</template>

<script setup lang="ts">
import type { CreateTriggerRequest } from '~/types/triggers'
import { BackButton, MainButton } from "vue-tg";
import yup from 'yup'

const triggerStore = useTriggerStore()
const warehouseStore = useWarehouses()
const useCoefficient = ref(false)
const formRef = ref<any>(null)
const isFormValid = computed(async () => {
  try {
    const { valid } = await formRef.value?.validate() || { valid: false }
    return valid
  } catch (error) {
    return false
  }
})

onMounted(async () => {
  if (warehouseStore.warehouses.length === 0) {
    await warehouseStore.fetchWarehouses()
  }
})

const boxTypeOptions = [
  { label: 'Короба', value: 'Короба' },
  { label: 'Суперсейф', value: 'Суперсейф' },
  { label: 'Монопаллеты', value: 'Монопаллеты' },
  { label: 'QR-поставка с коробами', value: 'QR-поставка с коробами' },
]

const warehouseOptions = computed(() => {
  return warehouseStore.warehouses.map(warehouse => ({
    label: warehouse.name,
    value: warehouse.ID,
  }))
})

const form = ref<CreateTriggerRequest>({
  warehouseIds: [],
  boxTypes: [],
  coefficientThreshold: 0,
  checkPeriodStart: 0,
})

// Yup validation schema
const schema = computed(() => {
  return yup.object({
    warehouseIds: yup
      .array()
      .of(yup.number())
      .min(1, 'Выберите хотя бы один склад')
      .required('Выберите хотя бы один склад'),
    
    boxTypes: yup
      .array()
      .of(yup.string())
      .min(1, 'Выберите хотя бы один тип короба')
      .required('Выберите хотя бы один тип короба'),
    
    coefficientThreshold: yup
      .number()
      .transform(value => (isNaN(value) ? undefined : value))
      .when('$useCoefficient', {
        is: true,
        then: (schema) => schema
          .required('Введите пороговый коэффициент')
          .min(0, 'Коэффициент не может быть отрицательн��м'),
        otherwise: (schema) => schema.notRequired(),
      }),
    
    checkPeriodStart: yup
      .number()
      .transform(value => (isNaN(value) ? undefined : value))
      .required('Введите период проверки')
      .min(0, 'Период не может быть отрицательным')
      .max(14, 'Период не может быть больше 14 дней'),
  })
})


watch(useCoefficient, (newValue) => {
  if (!newValue) {
    form.value.coefficientThreshold = 0
  }
})


// Provide useCoefficient value to Yup context
const validationContext = computed(() => ({
  useCoefficient: useCoefficient.value
}))
</script> 