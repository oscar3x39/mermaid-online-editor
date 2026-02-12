<template>
  <TransitionGroup name="toast">
    <div v-for="toast in toasts" :key="toast.id" class="toast-item">
      <div class="toast-content">
        <component :is="toast.icon" :size="18" class="toast-icon" />
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { ref } from 'vue'
import { CheckCircle } from 'lucide-vue-next'

const toasts = ref([])
let nextId = 0

const show = (message, icon = CheckCircle) => {
  const id = nextId++
  toasts.value.push({ id, message, icon })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}

defineExpose({ show })
</script>

<style scoped>
.toast-item {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  margin-bottom: 0.75rem;
}

.toast-content {
  background: var(--bg-card);
  border: 1px solid var(--primary);
  color: var(--text-main);
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  font-size: 0.9rem;
  font-weight: 500;
}

.toast-icon {
  color: var(--primary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.9);
}
</style>
