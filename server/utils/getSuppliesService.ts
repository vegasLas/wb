import { H3Event } from 'h3'
import { getUserFromEvent } from './getUserFromEvent'
import { SuppliesService } from '../services/supplies'
import prisma from '../services/prisma'

export async function getSuppliesService(event: H3Event): Promise<SuppliesService> {
  const user = await getUserFromEvent(event)
	if (!user) {
		throw createError({
			statusCode: 401,
			message: 'Unauthorized'
		})
	}
  // Get full user data including wbApiKey from database
  const userData = await prisma.user.findUnique({
    where: {
      telegramId: user.telegramId
    },
    select: {
      wbApiKey: true
    }
  })

  if (!userData?.wbApiKey) {
    throw createError({
      statusCode: 400,
      message: 'Wildberries API key not found. Please set your API key first.'
    })
  }

  return SuppliesService.getInstance(userData.wbApiKey)
} 