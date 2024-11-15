import { getWarehouses } from "~/api/warehouses"
import type { Warehouse } from "~/types/warehouses"

export const useWarehouses = defineStore('warehouses', () => {
  const warehouses = ref<Warehouse[]>([])

  async function fetchWarehouses() {
    const response = await getWarehouses()
    if (response) {
      warehouses.value = response
    }
  }

  return { warehouses, fetchWarehouses }
})