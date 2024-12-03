import type { 
  CreateTriggerRequest, 
  UpdateTriggerRequest, 
  SupplyTrigger 
} from '~/types/triggers'
export async function createTrigger(data: CreateTriggerRequest): Promise<SupplyTrigger> {
  const initData = (await import('vue-tg')).useWebApp().initData
  return await $fetch<SupplyTrigger>('/api/v1/triggers', {
    method: 'POST',
    body: data,
    headers: {
      'x-init-data': initData,
    },
  })
}

export async function updateTrigger(data: UpdateTriggerRequest): Promise<SupplyTrigger> {
  const initData = (await import('vue-tg')).useWebApp().initData
  return await $fetch<SupplyTrigger>('/api/v1/triggers', {
    method: 'PUT',
    body: data,
    headers: {
      'x-init-data': initData,
    },
  })
}

export async function getTriggers() {
  const initData = (await import('vue-tg')).useWebApp().initData
  return await useFetch<SupplyTrigger[]>('/api/v1/triggers', {
    method: 'GET',
    headers: {
      'x-init-data': initData,
    },
  })
}

export async function deleteTrigger(triggerId: string): Promise<void> {
  const initData = (await import('vue-tg')).useWebApp().initData
  return await $fetch('/api/v1/triggers', {
    method: 'DELETE',
    body: { triggerId },
    headers: {
      'x-init-data': initData,
    },
  })
}

export async function toggleTrigger(triggerId: string): Promise<SupplyTrigger> {
  const initData = (await import('vue-tg')).useWebApp().initData
  return await $fetch<SupplyTrigger>('/api/v1/triggers', {
    method: 'PATCH',
    body: { triggerId },
    headers: {
      'x-init-data': initData,
    },
  })
} 