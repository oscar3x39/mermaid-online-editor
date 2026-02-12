<template>
  <header>
    <div class="logo">
      <span class="logo-box"></span>
      {{ t.title }}
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
import { Undo, Redo, Maximize, Download, Languages, Share2 } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  canUndo: Boolean,
  canRedo: Boolean,
  t: Object,
  currentLang: String
})

// Rename to avoid conflict if any, but let's keep it simple
const currentValueLang = computed(() => props.currentLang)

defineEmits(['undo', 'redo', 'reset-view', 'download', 'toggle-lang', 'share'])
</script>

<style scoped>
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
</style>
