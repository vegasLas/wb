import { H3Event } from 'h3'
import { getSuppliesService } from '~/server/utils/getSuppliesService'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const suppliesService = await getSuppliesService(event)
    const warehouses = await suppliesService.getWarehouses()
    return warehouses
  } catch (error: any) {
    throw createError({
      statusCode: error.message.includes('Rate limit') ? 429 : 500,
      message: error.message
    })
  }
}) 