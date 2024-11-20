import prisma from '../services/prisma'
import { TBOT } from "../utils/TBOT";
import { SuppliesService } from '../services/supplies';
async function checkSupplies() {
	try {
		// Get all active triggers with their users
		const activeTriggers = await prisma.supplyTrigger.findMany({
			where: { 
				isActive: true,
				OR: [
					{ lastNotificationAt: null },
					{ lastNotificationAt: { lt: new Date(Date.now() - 60 * 60 * 1000) } } // Last hour
				]
			},
			include: { user: true }
		});

		// Group triggers by user's API key to reuse SuppliesService instances
		const triggersByApiKey = new Map<string, typeof activeTriggers>();
		for (const trigger of activeTriggers) {
			if (!trigger.user.wbApiKey) continue;
			
			if (!triggersByApiKey.has(trigger.user.wbApiKey)) {
				triggersByApiKey.set(trigger.user.wbApiKey, []);
			}
			triggersByApiKey.get(trigger.user.wbApiKey)?.push(trigger);
		}
		
		// Process triggers for each API key
		for (const [apiKey, triggers] of triggersByApiKey.entries()) {
			const suppliesService = SuppliesService.getInstance(apiKey);
			const allWarehouseIds = new Set<number>();
			for (const trigger of triggers) {
				trigger.warehouseIds.forEach(id => allWarehouseIds.add(id));
			}
			const supplies = await suppliesService.getCoefficients(Array.from(allWarehouseIds).join(','));

			for (const trigger of triggers) {
				// Skip if user has no chatId
				if (!trigger.user.chatId) continue;

				try {
					// Filter supplies based on trigger criteria
					const matchingSupplies = supplies.filter(supply => {
						// Check if box type matches
						if (!trigger.boxTypes.includes(supply.boxType)) {
							return false;
						}

						// Check if supply is free (if trigger requires free supplies)
						if (trigger.isFree && supply.coefficient !== 0) {
							return false;
						}

						// Check if date is within the allowed range based on checkPeriodStart
						if (trigger.checkPeriodStart !== null) {
							const supplyDate = new Date(supply.date);
							const today = new Date();
							const daysDifference = Math.floor(
								(supplyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
							);
							
							// Only include supplies that start from the specified day count
							if (daysDifference < trigger.checkPeriodStart) {
								return false;
							}
						}

						return true;
					});

					if (matchingSupplies.length > 0) {
						// Update lastNotificationAt before sending message
						await prisma.supplyTrigger.update({
							where: { id: trigger.id },
							data: { lastNotificationAt: new Date() }
						});

						// Send notification to user about available supplies
						const message = `🔔 Доступны слоты для поставки!\n\n` +
							matchingSupplies.map(supply => {
								const supplyDate = new Date(supply.date);
								const formattedDate = supplyDate.toLocaleDateString('ru-RU');
								return `Склад: ${supply.warehouseName}\n` +
									`Тип коробки: ${supply.boxType}\n` +
									`Дата: ${formattedDate}\n` +
									`${supply.coefficient === 0 ? '✅ Бесплатная поставка' : '💰 Платная поставка'}\n`;
							}).join('\n');

						await TBOT.sendMessage(trigger.user.chatId, message);
					}
				} catch (error) {
					console.error(`Error checking supplies for trigger ${trigger.id}:`, error);
				}
			}
		}
	} catch (error) {
		console.error('Error in supply monitoring:', error);
	}
}
async function processStart(msg: any) {
	if (!msg.from || msg.from?.is_bot) return
	try {
		const currentChatId = String(msg.chat.id);
		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: {
				telegramId: msg.from.id
			}
		});

		if (existingUser) {
			// Update chat ID if it's different
			if (existingUser.chatId !== currentChatId) {
				await prisma.user.update({
					where: {
						telegramId: msg.from.id
					},
					data: {
						chatId: currentChatId
					}
				});
			}
		} else {
			// Create new user if doesn't exist
			await prisma.user.create({
				data: {
					telegramId: msg.from.id,
					username: msg.from.username,
					languageCode: msg.from.language_code,
					chatId: currentChatId,
					name: msg.from.first_name + ' ' + msg.from.last_name,
				},
			});
		}

		// Send welcome message with instructions and an icon
		await TBOT.sendMessage(currentChatId, '✨ Нажмите кнопку "настройка", чтобы настроить ваши триггеры ✨');

	} catch (error: any) {
		console.error('Error handling user', error)
	}
}
export default defineNitroPlugin((event) => {
	TBOT.onText(/\/start/, processStart);

	// Add supply monitoring system
	
	// Start monitoring with 1-minute interval
	const monitoringInterval = setInterval(checkSupplies, 20000);

	// Clean up on server shutdown
	event.hooks.hookOnce('close', () => {
		clearInterval(monitoringInterval);
	});
})