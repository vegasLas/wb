export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromEvent(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    const suppliesService = await getSuppliesService(event);
    const triggers = await suppliesService.getUserTriggers(user.id);

    return triggers
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      data: {
        status: 400,
        title: 'Failed to fetch triggers',
        detail: error.message,
        requestId: event.context.requestId,
      },
    });
  }
}); 