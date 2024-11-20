export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  return {
    hasApiKey: !!user.wbApiKey
  }
}) 