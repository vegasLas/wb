export interface SupplyTrigger {
  id: string
  userId: number
  warehouseIds: number[]
  boxTypes: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  isFree: boolean
  isActive: boolean
  checkPeriodStart: number  // start of range (0-14)
  checkInterval: number     // interval in minutes
  createdAt: Date
  updatedAt: Date
}

export interface CreateTriggerRequest {
  warehouseIds: number[]
  boxTypes: ("Короба" | "Суперсейф" | "Монопаллеты" | "QR-поставка с коробами")[]
  isFree: boolean
  checkPeriodStart: number
  checkInterval: number
}

export interface UpdateTriggerRequest {
  triggerId: string
  warehouseIds?: number[]
  boxTypes?: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  isFree?: boolean
  isActive?: boolean
  checkPeriodStart?: number
  checkInterval?: number
}

export interface CreateTriggerResponse {
  triggerId: string
  warehouseIds?: number[]
  boxTypes?: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  isFree?: boolean
  isActive?: boolean
  checkPeriodStart?: number
  checkInterval?: number
}
