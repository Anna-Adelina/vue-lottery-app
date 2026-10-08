<script setup lang="ts">
interface Props {
  variant?: 'info' | 'secondary' | 'danger' | 'outline-secondary'
  type?: 'button' | 'submit'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'info',
  type: 'button',
  disabled: false,
})
</script>

<template>
  <button :type="type" :disabled="disabled" class="btn" :class="`btn-${variant}`">
    <slot />
  </button>
</template>