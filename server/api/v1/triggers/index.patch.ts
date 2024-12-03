export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { triggerId } = await readBody(event)

  if (!triggerId) {
    throw createError({ statusCode: 400, message: 'Missing triggerId' })
  }

  const suppliesService = await getSuppliesService(event);
  return await suppliesService.toggleTriggerActive(user.id, triggerId)
}) 