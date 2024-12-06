import { suppliesService } from '~/server/services/supplies'
import { cacheService } from '~/server/services/cache'

const CACHE_KEY = 'warehouses';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default defineEventHandler(async (event) => {
  try {
    // Try to get warehouses from cache
    const cachedWarehouses = cacheService.get(CACHE_KEY, CACHE_DURATION);
    if (cachedWarehouses) {
      return cachedWarehouses;
    }

    // If not in cache or expired, fetch fresh data
    const warehouses = await suppliesService.getWarehouses();
    
    // Store in cache
    cacheService.set(CACHE_KEY, warehouses);
    
    return warehouses;
  } catch (error: any) {
    throw createError({
      statusCode: error.message.includes('Rate limit') ? 429 : 500,
      message: error.message
    })
  }
}) 