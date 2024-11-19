export type TriggerStep = 'list' | 'form' | 'api-key'

export const useSteps = defineStore('steps', () => {
  const step = ref<TriggerStep>('list')

  const setStep = (newStep: TriggerStep) => {
    step.value = newStep
  }

  return {
    step,
    setStep
  }
})
