export interface SupplyTrigger {
  id: string
  userId: number
  warehouseIds: number[]
  boxTypes: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  isFree: boolean
  isActive: boolean
  checkPeriodStart: number  // start of range (0-14)
  checkInterval: number     // interval in minutes
  maxCoefficient: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateTriggerRequest {
  warehouseIds: number[]
  boxTypes: ("Короба" | "Суперсейф" | "Монопаллеты" | "QR-поставка с коробами")[]
  isFree: boolean
  checkPeriodStart: number
  checkInterval: number
  maxCoefficient: number
}

export interface UpdateTriggerRequest {
  triggerId: string
  warehouseIds?: number[]
  boxTypes?: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  isFree?: boolean
  isActive?: boolean
  checkPeriodStart?: number
  checkInterval?: number
  maxCoefficient: number
}

export interface CreateTriggerResponse {
  triggerId: string
  warehouseIds?: number[]
  boxTypes?: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  isFree?: boolean
  isActive?: boolean
  checkPeriodStart?: number
  checkInterval?: number
  maxCoefficient: number
}
