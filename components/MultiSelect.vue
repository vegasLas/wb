<template>
  <div class="w-full">
    <USelectMenu
      :model-value="selectedValue"
      :options="options"
      searchable
      by="value"
      :search-attributes="['label']"
      searchable-placeholder="Поиск"
      :placeholder="placeholder"
      @update:model-value="handleSelect"
    />
    
    <div v-if="modelValue.length" class="flex flex-wrap gap-2 mt-2">
      <UBadge
        v-for="value in modelValue"
        :key="value"
        color="gray"
        class="cursor-pointer"
        @click="removeItem(value)"
      >
        {{ getLabel(value) }}
        <UIcon
          name="i-heroicons-x-mark"
          class="ml-1 w-4 h-4"
        />
      </UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: (string | number)[]
  options: SelectOption[]
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])
const selectedValue = ref<string>('')

const handleSelect = (payload: { value: string, label: string }) => {
  if (!payload.value) return
  const selectedItem = props.options.find(option => 
    String(option.value) === String(payload.value)
  )
  
  if (selectedItem && !props.modelValue.includes(selectedItem.value)) {
    emit('update:modelValue', [...props.modelValue, selectedItem.value])
  }
  
  // Reset the select after selection
  selectedValue.value = payload.label
}

const removeItem = (valueToRemove: string | number) => {
  const updatedSelection = props.modelValue.filter(
    value => value !== valueToRemove
  )
  emit('update:modelValue', updatedSelection)
}

// Helper function to get label from value
const getLabel = (value: string | number) => {
  const option = props.options.find(opt => opt.value === value)
  return option?.label || value
}
</script> 