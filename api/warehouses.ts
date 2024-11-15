import type { Warehouse } from "~/types/warehouses";
import { useWebApp } from 'vue-tg'

export async function getWarehouses(): Promise<Warehouse[]> {
  return await $fetch<Warehouse[]>('/api/v1/warehouses', {
    method: 'GET',
    headers: {
      'x-init-data': useWebApp().initData,
    },
  })
}