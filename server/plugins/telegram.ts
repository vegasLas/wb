import prisma from '../services/prisma'
import { TBOT } from "../utils/TBOT";
import { suppliesService } from '../services/supplies';
async function checkSupplies() {
	try {
		// Get all active triggers with their users
		const activeTriggers = await prisma.supplyTrigger.findMany({
			where: { 
				isActive: true,
			},
			include: { user: true }
		});

		// No need to group by API key anymore since we use a single instance
		
		// Get all unique warehouse IDs from all triggers
		const allWarehouseIds = new Set<number>();
		for (const trigger of activeTriggers) {
			trigger.warehouseIds.forEach(id => allWarehouseIds.add(id));
		}

		// Get supplies for all warehouses at once
		const supplies = await suppliesService.getCoefficients(Array.from(allWarehouseIds).join(','));

		// Process each trigger
		for (const trigger of activeTriggers) {
			// Skip if user has no chatId
			if (!trigger.user.chatId) continue;

			// Check if enough time has passed since last notification
			if (trigger.lastNotificationAt) {
				const timeSinceLastNotification = Date.now() - trigger.lastNotificationAt.getTime();
				const minimumInterval = trigger.checkInterval * 60 * 1000; // Convert minutes to milliseconds
				
				if (timeSinceLastNotification < minimumInterval) {
					continue; // Skip this trigger if not enough time has passed
				}
			}

			try {
				// Filter supplies based on trigger criteria
				const matchingSupplies = supplies.filter(supply => {
					// Skip if coefficient is -1 and no trigger
					// Check if supply is available based on coefficient and allowUnload
					if (!supply.allowUnload || (supply.coefficient === -1)) {
						return false;
					}


					// Skip if warehouse not in trigger's warehouse list
					if (!trigger.warehouseIds.includes(supply.warehouseID)) {
						return false;
					}

					// Check if box type matches
					if (!trigger.boxTypes.includes(supply.boxTypeName)) {
						return false;
					}

					// Check if supply is free (if trigger requires free supplies)
					if (trigger.isFree && supply.coefficient !== 0) {
						return false;
					}

					// Check maxCoefficient if it's set (not 0)
					if (trigger.maxCoefficient > 0) {
						// Skip if supply coefficient is higher than max allowed
						// Don't apply this check to free supplies (coefficient === 0)
						if (supply.coefficient !== 0 && supply.coefficient > trigger.maxCoefficient) {
							return false;
						}
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

					// Group supplies by warehouse and box type
					const suppliesByWarehouseAndBox = matchingSupplies.reduce((acc, supply) => {
						if (!acc[supply.warehouseName]) {
							acc[supply.warehouseName] = {};
						}
						if (!acc[supply.warehouseName][supply.boxTypeName]) {
							acc[supply.warehouseName][supply.boxTypeName] = [];
						}
						acc[supply.warehouseName][supply.boxTypeName].push(supply);
						return acc;
					}, {} as Record<string, Record<string, typeof matchingSupplies>>);

					// Create message with each warehouse and box type on new lines
					const message = `🔔 Доступные слоты:\n` + 
						Object.entries(suppliesByWarehouseAndBox).map(([warehouseName, boxTypes]) => {
							const boxTypeInfo = Object.entries(boxTypes).map(([boxType, supplies]) => {
								const dates = supplies.map(supply => {
									const date = new Date(supply.date).toLocaleDateString('ru-RU');
									return `${date} 📅`;
								}).join(' | ');
								const coefficient = supplies[0].coefficient; // Assuming all supplies have the same coefficient
								return `${coefficient === 0 ? 'Бесплатно 🎉' : `Коэффициент: ${coefficient} 💰`}\n\n${boxType} :\n${dates}`;
							}).join('\n');
							return `${warehouseName} 🏢:\n${boxTypeInfo}`;
						}).join('\n\n');
					if (trigger.user.id === 1) {
						const detailedMessage = `${message}\n\n${JSON.stringify(matchingSupplies[0], null, 2)}`;
						await TBOT.sendMessage(trigger.user.chatId, detailedMessage);
					}
					else {
						await TBOT.sendMessage(trigger.user.chatId, message);
					}
				}
			} catch (error) {
				console.error(`Error checking supplies for trigger ${trigger.id}:`, error);
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

	const monitoringInterval = setInterval(checkSupplies, 20000);

	// Clean up on server shutdown
	event.hooks.hookOnce('close', () => {
		clearInterval(monitoringInterval);
	});
})