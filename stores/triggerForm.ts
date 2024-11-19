import { defineStore } from 'pinia'
import * as yup from 'yup'
import type { CreateTriggerRequest } from '~/types/triggers'

export const useTriggerFormStore = defineStore('triggerForm', () => {
  const warehouseStore = useWarehouses()
  const useCoefficient = ref(false)
  const useCheckPeriod = ref(false)
  
  const form = ref<CreateTriggerRequest>({
    warehouseIds: [],
    boxTypes: [],
    coefficientThreshold: null,
    checkPeriodStart: null
  })

  const boxTypeOptions = [
    {label: 'Короба', value: 'Короба'},
    {label: 'Суперсейф', value: 'Суперсейф'},
    {label: 'Монопаллеты', value: 'Монопаллеты'},
    {label: 'QR-поставка с коробами', value: 'QR-поставка с коробами'},
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
      
      coefficientThreshold: yup
        .number()
        .nullable()
        .transform(value => (isNaN(value) ? undefined : value))
        .when('$useCoefficient', {
          is: true,
          then: (schema) => schema
            .required('Введите пороговый коэффициент')
            .min(0, 'Коэффициент не может быть отрицательнм'),
          otherwise: (schema) => schema.notRequired(),
        }),
      
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
    })
  })

  const validationContext = computed(() => ({
    useCoefficient: useCoefficient.value,
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

  watch(useCoefficient, (newValue) => {
    if (!newValue) {
      form.value.coefficientThreshold = 0
    }
    else {
      form.value.coefficientThreshold = null
    }
  })

  watch(useCheckPeriod, (newValue) => {
    if (!newValue) {
      form.value.checkPeriodStart = 0
    }
    else {
      form.value.checkPeriodStart = null
    }
  })

  async function initializeWarehouses() {
    if (warehouseStore.warehouses.length === 0) {
      await warehouseStore.fetchWarehouses()
    }
  }

  function resetForm() {
    form.value = {
      warehouseIds: [],
      boxTypes: [],
      coefficientThreshold: 0,
      checkPeriodStart: 0,
    }
    useCoefficient.value = false
    useCheckPeriod.value = false
  }

  return {
    form,
    useCoefficient,
    useCheckPeriod,
    boxTypeOptions,
    warehouseOptions,
    schema,
    validationContext,
    validate,
    initializeWarehouses,
    resetForm
  }
}) 