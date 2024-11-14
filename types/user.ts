export interface User {
  id: number
  telegramId: bigint
  chatId?: string
  username?: string
  languageCode?: string
  name: string
}

export type CreateUserInput = Omit<User, 'id'> 