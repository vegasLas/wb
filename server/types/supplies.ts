export interface AcceptanceCoefficient {
  date: string
  coefficient: number | null
  warehouseID: number
  warehouseName: string
  boxTypeName: 'Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами'
  boxTypeID?: 1 | 2 | 5 | 6
}

export interface Warehouse {
  ID: number
  name: string
  address: string
  workTime: string
  acceptsQr: boolean
}

export interface Good {
  quantity: number
  barcode: string
}

export interface ErrorModel {
  status: number
  title: string
  detail: string
  requestId: string
  origin: string
}

export interface WarehouseOption {
  warehouseID: number
  canBox: boolean
  canMonopallet: boolean
  canSupersafe: boolean
}

export interface GoodOption {
  barcode: string
  error?: {
    title: string
    detail: string
  }
  isError?: boolean
  warehouses: WarehouseOption[] | null
}

export interface OptionsResponse {
  result: GoodOption[]
  requestId?: string
}

export interface SupplyTrigger {
  id: string
  userId: number
  warehouseIds: number[]
  boxTypes: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  coefficientThreshold: number | null
  isActive: boolean
  checkPeriodStart: number  // start of range (0-14)
  createdAt: Date
  updatedAt: Date
}

export interface CreateTriggerRequest {
  warehouseIds: number[]
  boxTypes: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  coefficientThreshold: number | null
  checkPeriodStart: number | null  // start of range (0-14)
}

export interface UpdateTriggerRequest {
  triggerId: string
  warehouseIds?: number[]
  boxTypes?: ('Короба' | 'Суперсейф' | 'Монопаллеты' | 'QR-поставка с коробами')[]
  coefficientThreshold?: number | null
  isActive?: boolean
  checkPeriodStart?: number
}

export interface TriggerResponse {
  triggers: SupplyTrigger[]
  requestId?: string
}

export interface TriggerError {
  status: number
  message: string
  triggerId?: string
} 