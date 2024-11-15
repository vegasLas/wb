import type { 
  CreateTriggerRequest, 
  UpdateTriggerRequest, 
  SupplyTrigger 
} from '~/types/triggers'
import { useWebApp } from 'vue-tg'

export async function createTrigger(data: CreateTriggerRequest): Promise<SupplyTrigger> {
  return await $fetch<SupplyTrigger>('/api/v1/triggers', {
    method: 'POST',
    body: data,
    headers: {
      'x-init-data': useWebApp().initData,
    },
  })
}

export async function updateTrigger(data: UpdateTriggerRequest): Promise<SupplyTrigger> {
  return await $fetch<SupplyTrigger>('/api/v1/triggers', {
    method: 'PUT',
    body: data,
    headers: {
      'x-init-data': useWebApp().initData,
    },
  })
}

export async function getTriggers(): Promise<SupplyTrigger[]> {
  return await $fetch<SupplyTrigger[]>('/api/v1/triggers', {
    method: 'GET',
    headers: {
      'x-init-data': useWebApp().initData,
    },
  })
}

export async function deleteTrigger(triggerId: string): Promise<void> {
  return await $fetch('/api/v1/triggers', {
    method: 'DELETE',
    body: { triggerId },
    headers: {
      'x-init-data': useWebApp().initData,
    },
  })
} 