import prisma from '../services/prisma'


export default defineNitroPlugin(async (event) => {
	// TBOT.onText(/\/start/, async (msg) => {
	// 	if (!msg.from || msg.from?.is_bot) return
	// 	try {
	// 		const currentChatId = String(msg.chat.id);
	// 		// Check if user exists
	// 		const existingUser = await prisma.user.findUnique({
	// 			where: {
	// 				telegramId: msg.from.id
	// 			}
	// 			// If user doesn't exist, create new user
	// 			// If user doesn't exist, create new user
	// 		});

	// 		if (existingUser) {
	// 			// Update chat ID if it's different
	// 			if (existingUser.chatId !== currentChatId) {
	// 				await prisma.user.update({
	// 					where: {
	// 						telegramId: msg.from.id
	// 					},
	// 					data: {
	// 						chatId: currentChatId
	// 					}
	// 				});
	// 			}
	// 		} else {
	// 			// Create new user if doesn't exist
	// 			await prisma.user.create({
	// 				data: {
	// 					telegramId: msg.from.id,
	// 					username: msg.from.username,
	// 					languageCode: msg.from.language_code,
	// 					chatId: currentChatId,
	// 					name: msg.from.first_name + ' ' + msg.from.last_name,
	// 				},
	// 			});
	// 		}

	// 		// Send welcome message with instructions and an icon
	// 		await TBOT.sendMessage(currentChatId, '✨ Нажмите кнопку "настройка", чтобы настроить ваши триггеры ✨');

	// 	} catch (error: any) {
	// 		console.error('Error handling user', error)
	// 	}
	// });
	
})