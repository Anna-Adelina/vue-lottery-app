<script setup lang="ts">
import spriteUrl from 'bootstrap-icons/bootstrap-icons.svg'

withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  { size: 16 },
)
</script>

<template>
  <svg :width="size" :height="size" fill="currentColor" aria-hidden="true">
    <use :href="`${spriteUrl}#${name}`" />
  </svg>
</template>