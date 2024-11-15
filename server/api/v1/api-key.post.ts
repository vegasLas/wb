import { getUserFromEvent } from '~/server/utils/getUserFromEvent'
import prisma from '~/server/services/prisma'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  // Get the API key from request body
  const body: { apiKey: string } = await readBody(event)
  const { apiKey } = body

  if (!apiKey) {
    throw createError({
      statusCode: 400,
      message: 'API key is required'
    })
  }

  // Update the user's API key in the database
  const updatedUser = await prisma.user.update({
    where: {
      telegramId: user.telegramId
    },
    data: {
      wbApiKey: apiKey
    },
    select: {
      wbApiKey: true
    }
  })

  return {
    success: true,
    data: {
      wbApiKey: updatedUser.wbApiKey
    }
  }
}) 