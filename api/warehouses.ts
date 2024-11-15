import type { Warehouse } from "~/types/warehouses";
import { useWebApp } from 'vue-tg'

export async function getWarehouses() {
  return await useFetch<Warehouse[]>('/api/v1/warehouses', {
    method: 'GET',
    headers: {
      'x-init-data': useWebApp().initData,
    },
  })
}