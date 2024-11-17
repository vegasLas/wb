<template>
  <div class="w-full">
    <USelect
      v-model="selectedValue"
      :options="options"
      :placeholder="placeholder"
      @update:model-value="handleSelect"
    />
    
    <div v-if="modelValue.length" class="flex flex-wrap gap-2 mt-2">
      <UBadge
        v-for="item in modelValue"
        :key="item.value"
        color="primary"
        class="cursor-pointer"
        @click="removeItem(item)"
      >
        {{ item.label }}
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
  modelValue: SelectOption[]
  options: SelectOption[]
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

// Change to single string value instead of array
const selectedValue = ref<string>('')

// Keep selectedValue in sync with the last selected item
watch(() => props.modelValue, (newVal) => {
  selectedValue.value = newVal.length ? String(newVal[newVal.length - 1].value) : ''
}, { immediate: true })

const handleSelect = (value: string) => {
  if (!value) return
  
  const selectedItem = props.options.find(option => 
    String(option.value) === value
  )
  
  if (selectedItem && !props.modelValue.some(item => item.value === selectedItem.value)) {
    emit('update:modelValue', [...props.modelValue, selectedItem])
  }
  
  // Reset the select after selection
  selectedValue.value = ''
}

const removeItem = (itemToRemove: SelectOption) => {
  const updatedSelection = props.modelValue.filter(
    item => item.value !== itemToRemove.value
  )
  emit('update:modelValue', updatedSelection)
}
</script> 