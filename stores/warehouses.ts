import { getWarehouses } from "~/api/warehouses"
import type { Warehouse } from "~/types/warehouses"

export const useWarehouses = defineStore('warehouses', () => {
  const warehouses = ref<Warehouse[]>([])
  function getWarehouseName(warehouseId: number) {
    return warehouses.value.find(w => w.ID === warehouseId)?.name ?? warehouseId
  }
  async function fetchWarehouses() {
    if (warehouses.value.length > 0) return
    const response = await getWarehouses()
    if (response.data.value) {
      warehouses.value = response.data.value
    }
  }

  return { warehouses, fetchWarehouses, getWarehouseName }
})