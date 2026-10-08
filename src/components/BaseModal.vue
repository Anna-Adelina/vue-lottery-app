<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const open = defineModel<boolean>({ required: true })

const modalRoot = ref<HTMLElement | null>(null)

function close(): void {
  open.value = false
}

// Фокус на модалці, щоб вона ловила події клавіатури (Esc)
watch(open, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  modalRoot.value?.focus()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        ref="modalRoot"
        class="modal d-block modal-overlay"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
        @click.self="close"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <slot name="header" />
              </h5>
              <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
            </div>

            <div class="modal-body">
              <slot />
            </div>

            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.5);

  &:focus {
    outline: none;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;

  .modal-dialog {
    transition: transform 0.25s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-dialog {
    transform: translateY(-30px);
  }
}
</style>