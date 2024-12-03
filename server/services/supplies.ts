import axios, { AxiosInstance } from 'axios'
import { AcceptanceCoefficient, CreateTriggerRequest, Good, OptionsResponse, SupplyTrigger, UpdateTriggerRequest, Warehouse } from '../types/supplies'
import prisma from './prisma'

// Rate limiting configuration
const COEFFICIENTS_LIMIT = 6 // 6 requests per minute
const OPTIONS_LIMIT = 30 // 30 requests per minute
const WAREHOUSES_LIMIT = 6 // 6 requests per minute

export class SuppliesService {
  private api: AxiosInstance
  private static instances: Map<string, SuppliesService> = new Map()
  private coefficientsCounter = 0
  private optionsCounter = 0
  private warehousesCounter = 0
  private lastResetTime = Date.now()

  private constructor(apiKey: string) {
    this.api = axios.create({
      baseURL: 'https://supplies-api.wildberries.ru',
      headers: {
        'Authorization': apiKey,
      }
    })
  }

  static getInstance(apiKey: string): SuppliesService {
    if (!this.instances.has(apiKey)) {
      this.instances.set(apiKey, new SuppliesService(apiKey))
    }
    return this.instances.get(apiKey)!
  }

  private resetCountersIfNeeded() {
    const now = Date.now()
    if (now - this.lastResetTime >= 60000) { // Reset counters every minute
      this.coefficientsCounter = 0
      this.optionsCounter = 0
      this.warehousesCounter = 0
      this.lastResetTime = now
    }
  }

  async getCoefficients(warehouseIDs?: string): Promise<AcceptanceCoefficient[]> {
    this.resetCountersIfNeeded()
    
    if (this.coefficientsCounter >= COEFFICIENTS_LIMIT) {
      throw new Error('Rate limit exceeded for coefficients endpoint')
    }
    
    this.coefficientsCounter++

    try {
      const params = warehouseIDs ? { warehouseIDs } : {}
      const response = await this.api.get<AcceptanceCoefficient[]>('/api/v1/acceptance/coefficients', { params })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch coefficients')
      }
      throw error
    }
  }

  async getOptions(goods: Good[]): Promise<OptionsResponse> {
    this.resetCountersIfNeeded()
    
    if (this.optionsCounter >= OPTIONS_LIMIT) {
      throw new Error('Rate limit exceeded for options endpoint')
    }
    
    this.optionsCounter++

    try {
      const response = await this.api.post<OptionsResponse>('/api/v1/acceptance/options', goods)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch options')
      }
      throw error
    }
  }

  async getWarehouses(): Promise<Warehouse[]> {
    this.resetCountersIfNeeded()
    
    if (this.warehousesCounter >= WAREHOUSES_LIMIT) {
      throw new Error('Rate limit exceeded for warehouses endpoint')
    }
    
    this.warehousesCounter++

    try {
      const response = await this.api.get<Warehouse[]>('/api/v1/warehouses')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch warehouses')
      }
      throw error
    }
  }

  async createTrigger(userId: number, data: CreateTriggerRequest) {
    return await prisma.supplyTrigger.create({
      data: {
        userId,
        warehouseIds: data.warehouseIds,
        boxTypes: data.boxTypes,
        isFree: data.isFree,
        checkInterval: data.checkInterval,
        checkPeriodStart: data.checkPeriodStart ? Math.min(Math.max(data.checkPeriodStart, 0), 14) : null,
      },
    }) as SupplyTrigger;
  }

  async updateTrigger(userId: number, data: UpdateTriggerRequest) {
    const trigger = await prisma.supplyTrigger.findFirst({
      where: {
        id: data.triggerId,
        userId,
      },
    });

    if (!trigger) {
      throw new Error('Trigger not found');
    }

    let start = trigger.checkPeriodStart;

    if (data.checkPeriodStart !== undefined) {
      start = Math.min(Math.max(data.checkPeriodStart, 0), 14);
    }

    return await prisma.supplyTrigger.update({
      where: { id: data.triggerId },
      data: {
        warehouseIds: data.warehouseIds,
        boxTypes: data.boxTypes,
        isFree: data.isFree,
        isActive: data.isActive,
        checkPeriodStart: start,
      },
    }) as SupplyTrigger;
  }

  async deleteTrigger(userId: number, triggerId: string): Promise<void> {
    const trigger = await prisma.supplyTrigger.findFirst({
      where: {
        id: triggerId,
        userId,
      },
    });

    if (!trigger) {
      throw new Error('Trigger not found');
    }

    await prisma.supplyTrigger.delete({
      where: { id: triggerId },
    });
  }

  async getUserTriggers(userId: number): Promise<SupplyTrigger[]> {
    return await prisma.supplyTrigger.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }) as SupplyTrigger[];
  }

  async toggleTriggerActive(userId: number, triggerId: string): Promise<SupplyTrigger> {
    const trigger = await prisma.supplyTrigger.findFirst({
      where: {
        id: triggerId,
        userId,
      },
    });

    if (!trigger) {
      throw new Error('Trigger not found');
    }

    return await prisma.supplyTrigger.update({
      where: { id: triggerId },
      data: {
        isActive: !trigger.isActive,
      },
    }) as SupplyTrigger;
  }
} 