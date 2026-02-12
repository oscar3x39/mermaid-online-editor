<template>
  <header>
    <div class="logo-group">
      <div class="logo">
        <span class="logo-box"></span>
        {{ t.title }}
      </div>
      <GitHubStarButton repo="https://github.com/oscar3x39/mermaid-online-editor" />

      <div class="actions-divider"></div>

      <a 
        href="https://github.com/oscar3x39/mermaid-online-editor/issues" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="feedback-link"
        :title="t.feedback"
      >
        <MessageSquare :size="16" />
        <span class="feedback-text">{{ t.feedback }}</span>
      </a>
    </div>

    <div class="actions">
      <button class="btn btn-secondary" @click="$emit('undo')" :disabled="!canUndo" :title="`${t.undo} (Ctrl+Z)`">
        <Undo :size="16" />
      </button>
      <button class="btn btn-secondary" @click="$emit('redo')" :disabled="!canRedo" :title="`${t.redo} (Ctrl+Y)`">
        <Redo :size="16" />
      </button>
      <button class="btn btn-secondary" @click="$emit('reset-view')" :title="t.resetView">
        <Maximize :size="16" />
      </button>
      
      <div class="actions-divider"></div>

      <button class="btn btn-secondary" @click="$emit('share')" :title="t.share">
        <Share2 :size="16" /> {{ t.share }}
      </button>
      <button class="btn btn-primary" @click="$emit('download')">
        <Download :size="16" /> {{ t.download }}
      </button>
      
      <div class="lang-divider"></div>
      
      <button class="btn btn-secondary lang-btn" @click="$emit('toggle-lang')">
        <Languages :size="16" />
        {{ currentValueLang === 'zh' ? 'EN' : '中文' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { Undo, Redo, Maximize, Download, Languages, Share2, MessageSquare } from 'lucide-vue-next'
import { computed } from 'vue'
import GitHubStarButton from './GitHubStarButton.vue'

const props = defineProps({
  canUndo: Boolean,
  canRedo: Boolean,
  t: Object,
  currentLang: String
})

const currentValueLang = computed(() => props.currentLang)

defineEmits(['undo', 'redo', 'reset-view', 'download', 'toggle-lang', 'share'])
</script>

<style scoped>
.logo-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.feedback-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.6rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s;
  border-radius: 6px;
}

.feedback-link:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.05);
}

.actions-divider, .lang-divider {
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 0.25rem;
}
.lang-btn {
  min-width: 60px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .feedback-text {
    display: none;
  }
  .logo-group {
    gap: 0.5rem;
  }
}
</style>
