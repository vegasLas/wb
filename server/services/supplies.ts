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
    const start = Math.min(Math.max(data.checkPeriodStart, 0), 14);
    const end = data.checkPeriodEnd 
      ? Math.min(Math.max(data.checkPeriodEnd, start), 14)
      : start;  // If no end provided, use same as start for single day

    return await prisma.supplyTrigger.create({
      data: {
        userId,
        warehouseIds: data.warehouseIds,
        boxTypes: data.boxTypes,
        coefficientThreshold: data.coefficientThreshold,
        checkPeriodStart: start,
        checkPeriodEnd: end,
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
    let end = trigger.checkPeriodEnd;

    if (data.checkPeriodStart !== undefined) {
      start = Math.min(Math.max(data.checkPeriodStart, 0), 14);
      // If start changes, ensure end is not less than start
      end = Math.max(end, start);
    }

    if (data.checkPeriodEnd !== undefined) {
      end = Math.min(Math.max(data.checkPeriodEnd, start), 14);
    }

    return await prisma.supplyTrigger.update({
      where: { id: data.triggerId },
      data: {
        warehouseIds: data.warehouseIds,
        boxTypes: data.boxTypes,
        coefficientThreshold: data.coefficientThreshold,
        isActive: data.isActive,
        checkPeriodStart: start,
        checkPeriodEnd: end,
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

  async checkTriggers(userId: number): Promise<void> {
    const triggers = await this.getUserTriggers(userId);
    const now = new Date();

    for (const trigger of triggers) {
      if (!trigger.isActive) continue;

      const coefficients = await this.getCoefficients(trigger.warehouseIds.join(','));
      
      for (const coef of coefficients) {
        const coefDate = new Date(coef.date);
        const daysDiff = Math.floor((now.getTime() - coefDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (
          daysDiff >= trigger.checkPeriodStart && 
          daysDiff <= trigger.checkPeriodEnd &&
          trigger.boxTypes.includes(coef.boxTypeName) &&
          coef.coefficient <= trigger.coefficientThreshold
        ) {
          // TODO: Implement notification logic here
          console.log(`Trigger ${trigger.id} activated for warehouse ${coef.warehouseID}`);
        }
      }
    }
  }
} 