<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="currentUser">
      <h2>Welcome, {{ userName }}!</h2>
      <p>Language: {{ userLanguage || 'Not set' }}</p>
    </div>
    <div v-else>
      Please start the bot to view your profile
    </div>
  </div>
</template>

<script setup lang="ts">
const { currentUser, isLoading, error, userName, userLanguage } = useUser()
</script> 