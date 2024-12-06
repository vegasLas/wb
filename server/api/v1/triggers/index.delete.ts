import { suppliesService } from "~/server/services/supplies";

export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromEvent(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    const { triggerId } = await readBody<{ triggerId: string }>(event);
    
    await suppliesService.deleteTrigger(user.id, triggerId);

    return {
      success: true,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      data: {
        status: 400,
        title: 'Failed to delete trigger',
        detail: error.message,
        requestId: event.context.requestId,
      },
    });
  }
}); 