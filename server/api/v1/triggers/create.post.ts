import { CreateTriggerRequest } from '~/server/types/supplies';

export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromEvent(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    const body = await readBody<CreateTriggerRequest>(event);
    
    const suppliesService = await getSuppliesService(event);
    const trigger = await suppliesService.createTrigger(user.id, body);

    return {
      trigger,
      requestId: event.context.requestId,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      data: {
        status: 400,
        title: 'Failed to create trigger',
        detail: error.message,
        requestId: event.context.requestId,
      },
    });
  }
}); 