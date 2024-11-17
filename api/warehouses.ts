import type { Warehouse } from "~/types/warehouses";

export async function getWarehouses() {
  const initData = (await import('vue-tg')).useWebApp().initData
  return await useFetch<Warehouse[]>('/api/v1/warehouses', {
    method: 'GET',
    headers: {
      'x-init-data': initData,
    },
  })
}