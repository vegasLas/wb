<template>
  <div class="api-key-form">
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">API ключ Wildberries</h2>
      </template>
      <form @submit.prevent class="space-y-4">
        <UFormGroup
          label="Введите ваш API ключ"
          name="apiKey"
        >
          <UInput
            v-model="apiKey"
            :type="showApiKey ? 'text' : 'password'"
            :disabled="isLoading"
            placeholder="Введите API ключ Wildberries"
            :trailing="(hasApiKey && apiKey) ? undefined : false"
            size="lg"
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
        </UFormGroup>
      </form>
    </UCard>
  </div>
  <MainButton 
    text="Сохранить API ключ" 
    @click="apiKeyStore.updateApiKey()"
    :progress="apiKeyStore.loading"
    :disabled="!apiKey"
  />
  <BackButton @click="$emit('back')" />
</template>

<script setup lang="ts">
import { MainButton, BackButton } from "vue-tg";
defineEmits(['back'])
const apiKeyStore = useApiKeyStore()
const {
  apiKey,
  isLoading,

  hasApiKey,
  showApiKey,
} = storeToRefs(apiKeyStore)

</script> 