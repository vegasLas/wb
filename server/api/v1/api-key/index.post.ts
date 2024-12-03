import prisma from '~/server/services/prisma'
import { SuppliesService } from '~/server/services/supplies'

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

  // Check API key validity by making a test request to WB API
  try {
    const suppliesService = SuppliesService.getInstance(apiKey)
    await suppliesService.getWarehouses()
  } catch (error) {
    return {
      success: false,
      message: 'Не валидный ключ, убедитесь что он корректный, следуйте инструкции в описании'
    }
  }

  // If we reach here, the API key is valid
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
    message: 'API key successfully updated'
  }
}) 