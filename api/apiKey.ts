export async function updateApiKey(apiKey: string) {
  const initData = (await import('vue-tg')).useWebApp().initData
  return await $fetch('/api/v1/api-key', {
    method: 'POST',
    headers: {
      'x-init-data': initData,
	},
	  body: {
      apiKey
    }
  })
}

export async function checkApiKeyExists() {
  const initData = (await import('vue-tg')).useWebApp().initData
  return await $fetch<{ hasApiKey: boolean }>('/api/v1/api-key/exists', {
    headers: {
      'x-init-data': initData,
    }
  })
} 