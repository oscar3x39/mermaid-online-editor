<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ t.shareTitle }}</h3>
          <button class="close-icon" @click="$emit('close')">
            <X :size="20" />
          </button>
        </div>
        
        <div class="modal-body">
          <p class="share-desc">{{ t.shareDesc }}</p>
          
          <div class="share-input-group">
            <input 
              type="text" 
              readonly 
              :value="url" 
              ref="urlInput"
              class="share-url-input"
              @click="selectText"
            />
            <button class="btn btn-primary share-copy-btn" @click="copy">
              <Check v-if="copied" :size="16" />
              <Copy v-else :size="16" />
              {{ copied ? t.shareCopied : t.copy }}
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">{{ t.close }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { X, Copy, Check } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  url: String,
  t: Object
})

const emit = defineEmits(['close'])

const copied = ref(false)
const urlInput = ref(null)

const selectText = () => {
  urlInput.value?.select()
}

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy!', err)
  }
}
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
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  width: 90%;
  max-width: 550px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  animation: modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-main);
}

.close-icon {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s;
}

.close-icon:hover {
  color: var(--text-main);
}

.modal-body {
  padding: 1.5rem;
}

.share-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.share-input-group {
  display: flex;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.share-url-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-main);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-family: var(--font-mono);
  outline: none;
}

.share-copy-btn {
  white-space: nowrap;
  min-width: 120px;
  justify-content: center;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
