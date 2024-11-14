import TelegramBot from 'node-telegram-bot-api'
import prisma from '../services/prisma'

export default defineNitroPlugin((nitroApp) => {
  const token = process.env.TELEGRAM_BOT_TOKEN
  
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables')
    return
  }

  const bot = new TelegramBot(token, { polling: true })

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id
    const userId = msg.from?.id

    if (!userId) {
      await bot.sendMessage(chatId, 'Could not identify user')
      return
    }

    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { telegramId: BigInt(userId) }
      })

      if (existingUser) {
        await bot.sendMessage(chatId, `Welcome back, ${existingUser.name}!`)
        return
      }

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          telegramId: BigInt(userId),
          chatId: String(chatId),
          username: msg.from?.username ?? null,
          languageCode: msg.from?.language_code ?? null,
          name: msg.from?.first_name || 'Unknown User'
        }
      })

      await bot.sendMessage(
        chatId,
        `Hello ${newUser.name}! Thanks for starting the bot.`
      )
    } catch (error) {
      console.error('Error handling /start command:', error)
      await bot.sendMessage(
        chatId,
        'Sorry, there was an error processing your request.'
      )
    }
  })

  // Handle errors
  bot.on('error', (error) => {
    console.error('Telegram bot error:', error)
  })

  // Cleanup on app close
  nitroApp.hooks.hook('close', () => {
    bot.stopPolling()
  })
}) 