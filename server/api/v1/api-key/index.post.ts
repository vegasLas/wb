import { getUserFromEvent } from '~/server/utils/getUserFromEvent'
import { encryptApiKey } from '~/server/utils/apiKeyEncryption'
import prisma from '~/server/services/prisma'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  
  const body: { apiKey: string } = await readBody(event)
  const { apiKey } = body
  if (!apiKey) {
    throw createError({
      statusCode: 400,
      message: 'API key is required'
    })
  }

  // Encrypt the API key before storing
  const encryptedApiKey = encryptApiKey(apiKey)

  await prisma.user.update({
    where: {
      telegramId: user.telegramId
    },
    data: {
      wbApiKey: encryptedApiKey
    },
    select: {
      wbApiKey: true
    }
  })

  return {
    success: true,
  }
}) 