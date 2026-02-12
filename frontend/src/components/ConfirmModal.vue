<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-content confirm-dialog">
        <div class="modal-body">
          <div class="confirm-icon">
            <AlertTriangle :size="32" />
          </div>
          <p class="confirm-text">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('cancel')">{{ cancelText }}</button>
          <button class="btn btn-danger" @click="$emit('confirm')">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean,
  message: String,
  confirmText: { type: String, default: '確認' },
  cancelText: { type: String, default: '取消' }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content.confirm-dialog {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.modal-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.confirm-icon {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 1rem;
  border-radius: 50%;
}

.confirm-text {
  color: var(--text-main);
  font-weight: 500;
  line-height: 1.5;
}

.modal-footer {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  justify-content: center;
  gap: 1rem;
  border-top: 1px solid var(--border);
}

.btn-danger {
  background: #dc2626;
  color: white;
}
.btn-danger:hover {
  background: #b91c1c;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
