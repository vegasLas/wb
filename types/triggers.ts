export interface SupplyTrigger {
  id: string
  userId: number
  warehouseIds: number[]
  boxTypes: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  coefficientThreshold: number | null
  isActive: boolean
  checkPeriodStart: number  // start of range (0-14)
  checkPeriodEnd: number    // end of range (0-14)
  createdAt: Date
  updatedAt: Date
}

export interface CreateTriggerRequest {
  warehouseIds: number[]
  boxTypes: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  coefficientThreshold: number | null
  checkPeriodStart: number  // start of range (0-14)
  checkPeriodEnd?: number   // optional end of range (0-14)
}
export interface UpdateTriggerRequest {
  triggerId: string
  warehouseIds?: number[]
  boxTypes?: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  coefficientThreshold?: number | null
  isActive?: boolean
  checkPeriodStart?: number
  checkPeriodEnd?: number
}
export interface CreateTriggerResponse {
  triggerId: string
  warehouseIds?: number[]
  boxTypes?: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  coefficientThreshold?: number | null
  isActive?: boolean
  checkPeriodStart?: number
  checkPeriodEnd?: number
}