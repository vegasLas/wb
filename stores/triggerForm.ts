import { defineStore } from 'pinia'
import * as yup from 'yup'
import type { CreateTriggerRequest } from '~/types/triggers'

export const useTriggerFormStore = defineStore('triggerForm', () => {
  const warehouseStore = useWarehouses()
  const useCheckPeriod = ref(false)
  
  const form = ref<CreateTriggerRequest>({
    warehouseIds: [],
    boxTypes: [],
    isFree: false,
    checkPeriodStart: null,
    checkInterval: 180
  })

  const boxTypeOptions = [
    {label: 'Короба', value: 'Короба'},
    {label: 'Суперсейф', value: 'Суперсейф'},
    {label: 'Монопаллеты', value: 'Монопаллеты'},
    {label: 'QR-поставка с коробами', value: 'QR-поставка с коробами'}
  ]

  const intervalOptions = [
    { label: '30 минут', value: 30 },
    { label: '1 час', value: 60 },
    { label: '3 часа', value: 180 },
    { label: '6 часов', value: 360 },
    { label: '12 часов', value: 720 },
    { label: '24 часа', value: 1440 },
  ]

  const warehouseOptions = computed(() => {
    return warehouseStore.warehouses.map(warehouse => ({
      label: warehouse.name,
      value: warehouse.ID,
    }))
  })

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
      
      isFree: yup.boolean(),
      
      checkPeriodStart: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .when('$useCheckPeriod', {
          is: true,
          then: (schema) => schema
            .required('Введите период проверки')
            .min(0, 'Период не может быть отрицательным')
            .max(14, 'Период не может быть больше 14 дней'),
          otherwise: (schema) => schema.notRequired(),
        }),
      
      checkInterval: yup
        .number()
        .required('Выберите интервал проверки')
        .min(30, 'Минимальный интервал 30 минут')
        .max(1440, 'Максимальный интервал 24 часа'),
    })
  })

  const validationContext = computed(() => ({
    useCheckPeriod: useCheckPeriod.value
  }))

  const validate = computed(() => {
    try {
      schema.value.validateSync(form.value, {
        context: validationContext.value,
        abortEarly: false
      })
      return true
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return false
      }
      throw error
    }
  })

  function resetForm() {
    form.value = {
      warehouseIds: [],
      boxTypes: [],
      isFree: true,
      checkPeriodStart: 0,
      checkInterval: 180,
    }
    useCheckPeriod.value = false
  }

  async function initializeWarehouses() {
    if (warehouseStore.warehouses.length === 0) {
      await warehouseStore.fetchWarehouses()
    }
  }

  return {
    form,
    useCheckPeriod,
    boxTypeOptions,
    warehouseOptions,
    schema,
    validationContext,
    validate,
    initializeWarehouses,
    resetForm,
    intervalOptions,
  }
}) 