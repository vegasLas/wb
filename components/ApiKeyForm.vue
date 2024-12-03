<template>
  <div class="api-key-form">
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">API ключ Wildberries для поставок</h2>
      </template>
      <form @submit.prevent class="space-y-4">
        <UFormGroup
          :label="hasApiKey ? 'Обновить API ключ' : 'Сохраните API ключ чтобы начать работу'"
          name="apiKey"
        >
          <UInput
            v-model="apiKey"
            :type="showApiKey ? 'text' : 'password'"
            :disabled="isLoading"
            placeholder="Введите API ключ Wildberries"
            :trailing="(hasApiKey && apiKey) ? undefined : false"
            size="lg"
            :state="error ? 'error' : undefined"
          >
            <template #trailing>
              <UButton
                v-if="hasApiKey"
                color="gray"
                variant="ghost"
                icon="i-heroicons-eye"
                :loading="isLoading"
                @click="apiKeyStore.toggleVisibility"
              />
            </template>
          </UInput>
          <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
        </UFormGroup>
        <div class="description">
          Чтобы взять ключ перейдите по <a style="color: #0088ff; text-decoration: none; text-underline-offset: 2px;" href="https://seller.wildberries.ru/supplier-settings/access-to-api" target="_blank">ссылке</a>, выберите поставки, скопируйте ключ и вставьте его.
          Обратите внимание, что если вы введете не корректный ключ, то бот не будет работать.
        </div>
      </form>
    </UCard>
  </div>
  <MainButton 
    v-if="apiKey"
    :text="hasApiKey ? 'Обновить' : 'Сохранить'"
    @click="apiKeyStore.updateApiKey"
    :progress="apiKeyStore.loading"
    :disabled="!apiKey"
  />
  <BackButton v-if="hasApiKey" @click="$emit('back')" />
</template>

<script setup lang="ts">
import { MainButton, BackButton } from "vue-tg";
defineEmits(['back'])
const apiKeyStore = useApiKeyStore()
const {
  apiKey,
  isLoading,
  error,
  hasApiKey,
  showApiKey,
} = storeToRefs(apiKeyStore)

</script> 

<style scoped>
.description {
  font-size: 16px;
  color: white;
  margin-top: 10px;
}
</style> 