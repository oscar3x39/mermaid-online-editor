<template>
  <Transition name="fade">
    <div v-if="!hasAccepted" class="cookie-banner">
      <div class="cookie-content">
        <div class="cookie-text">
          <Cookie :size="20" class="cookie-icon" />
          <p>{{ t.cookieText }}</p>
        </div>
        <div class="cookie-actions">
          <button class="btn btn-primary" @click="accept">
            {{ t.cookieAccept }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Cookie } from 'lucide-vue-next'

const props = defineProps({
  t: Object
})

const hasAccepted = ref(true) // Default to true to avoid flash

onMounted(() => {
  hasAccepted.value = localStorage.getItem('mermaid_cookie_accepted') === 'true'
})

const accept = () => {
  localStorage.setItem('mermaid_cookie_accepted', 'true')
  hasAccepted.value = true
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 600px;
}

.cookie-content {
  background: var(--bg-card);
  border: 1px solid var(--primary);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
}

.cookie-text {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-main);
  font-size: 0.9rem;
  line-height: 1.4;
}

.cookie-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.cookie-actions {
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

@media (max-width: 640px) {
  .cookie-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
