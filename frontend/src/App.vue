<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { EXAMPLES } from './constants/examples'
import { TRANSLATIONS } from './constants/translations'

// Composables
import { useHistory } from './composables/useHistory'
import { useUndoRedo } from './composables/useUndoRedo'
import { useMermaid } from './composables/useMermaid'
import { useUrlState } from './composables/useUrlState'

// Components
import Toolbar from './components/Toolbar.vue'
import CookieBanner from './components/CookieBanner.vue'
import ShareModal from './components/ShareModal.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import Toast from './components/Toast.vue'
import CodeEditor from './components/CodeEditor.vue'
import { History as HistoryIcon, X, Trash2, Clock } from 'lucide-vue-next'

const code = ref(EXAMPLES['流程圖'])
const toastRef = ref(null)

// 1. Language State
const currentLang = ref(localStorage.getItem('mermaid_lang') || 'zh')
const t = computed(() => TRANSLATIONS[currentLang.value])

const toggleLang = () => {
  currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('mermaid_lang', currentLang.value)
}

// 2. Initialize Composables
const { 
  history, isHistoryOpen, loadHistory, addToHistory, 
  deleteHistoryItem, clearAllHistory, persistLatest 
} = useHistory(code)

const { 
  undo, redo, canUndo, canRedo, pushToUndo, isUndoing, initUndo 
} = useUndoRedo(code)

const { syncUrl, loadFromUrl, getShareUrl } = useUrlState(code)

const currentTheme = ref('dark')
const { 
  mermaidContainer, error, renderDiagram, downloadPNG 
} = useMermaid(currentTheme)

// 3. UI State
const isShareModalOpen = ref(false)
const isConfirmOpen = ref(false)
const shareUrl = ref('')

const themes = [
  { id: 'dark', name: '深淵黑' },
  { id: 'sun', name: '陽光白' },
  { id: 'forest', name: '森林綠' },
  { id: 'cyber', name: '霓虹紫' }
]

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const editorWidth = ref(40)
const isResizing = ref(false)

// 4. Logic Functions
const loadExample = (type) => {
  code.value = EXAMPLES[type]
  resetView()
}

const setTheme = (themeId) => {
  currentTheme.value = themeId
  document.documentElement.setAttribute('data-theme', themeId)
  localStorage.setItem('mermaid_theme', themeId)
  renderDiagram(code.value)
}

const formatDate = (ts) => {
  const locale = currentLang.value === 'zh' ? 'zh-TW' : 'en-US'
  return new Date(ts).toLocaleString(locale, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const resetView = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

const startPan = (e) => {
  if (e.target.closest('.resizer') || e.button !== 0) return
  isDragging.value = true
  startX.value = e.clientX - translateX.value
  startY.value = e.clientY - translateY.value
}

const handleWheel = (e) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newScale = scale.value * delta
  if (newScale > 0.1 && newScale < 10) scale.value = newScale
}

const startResizing = () => { isResizing.value = true }

const handleGlobalMouseMove = (e) => {
  if (isResizing.value) {
    const width = (e.clientX / window.innerWidth) * 100
    if (width > 20 && width < 80) editorWidth.value = width
  }
  if (isDragging.value) {
    translateX.value = e.clientX - startX.value
    translateY.value = e.clientY - startY.value
  }
}

const handleGlobalMouseUp = () => {
  isResizing.value = false
  isDragging.value = false
}

const openShareModal = async () => {
  const url = getShareUrl()
  shareUrl.value = url
  
  // Directly copy to clipboard for better UX
  try {
    await navigator.clipboard.writeText(url)
    toastRef.value?.show(t.value.shareCopied)
  } catch (err) {
    console.warn('Silent clipboard fail', err)
  }
  
  isShareModalOpen.value = true
}

const confirmClearHistory = () => {
  isConfirmOpen.value = true
}

const handleClearHistory = () => {
  clearAllHistory()
  isConfirmOpen.value = false
  toastRef.value?.show(currentLang.value === 'zh' ? '已清空歷史紀錄' : 'History cleared')
}

// 5. Watchers & Shortcuts
let saveTimeout
let undoTimeout
watch(code, async (newVal) => {
  renderDiagram(newVal)
  persistLatest(newVal)
  await syncUrl(newVal) // Update URL hash in real-time

  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => addToHistory(newVal), 3000)

  clearTimeout(undoTimeout)
  if (!isUndoing.value) {
    undoTimeout = setTimeout(() => pushToUndo(newVal), 500)
  }
}, { immediate: false })

const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    if (e.shiftKey) redo()
    else undo()
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault()
    redo()
  }
}

// 6. Lifecycle
onMounted(async () => {
  const savedTheme = localStorage.getItem('mermaid_theme') || 'dark'
  setTheme(savedTheme)
  
  // 1. Load History/Local storage baseline
  loadHistory()
  
  // 2. Override with URL hash if present (Shared link logic)
  await loadFromUrl()

  window.addEventListener('mousemove', handleGlobalMouseMove)
  window.addEventListener('mouseup', handleGlobalMouseUp)
  window.addEventListener('keydown', handleKeydown)
  
  renderDiagram(code.value)
  initUndo(code.value)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleGlobalMouseMove)
  window.removeEventListener('mouseup', handleGlobalMouseUp)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="app-container">
    <Toolbar 
      :canUndo="canUndo" 
      :canRedo="canRedo"
      :t="t"
      :currentLang="currentLang"
      @undo="undo"
      @redo="redo"
      @reset-view="resetView"
      @share="openShareModal"
      @download="downloadPNG"
      @toggle-lang="toggleLang"
    />

    <main>
      <section class="editor-section" :style="{ width: editorWidth + '%' }">
        <div class="section-header">
          <div class="example-chips">
            <button 
              v-for="(v, k) in EXAMPLES" 
              :key="k" 
              class="chip" 
              @click="loadExample(k)"
            >
              {{ t.examples[k] || k }}
            </button>
          </div>
        </div>
        <div class="editor-container">
          <CodeEditor 
            v-model="code" 
            :placeholder="t.placeholder"
          />
        </div>
      </section>

      <div class="resizer" :class="{ dragging: isResizing }" @mousedown="startResizing"></div>

      <section class="preview-section">
        <div class="section-header">
          <span class="section-title">{{ t.previewTitle }}</span>
          <div v-if="error" class="error-msg">{{ t.syntaxError }}</div>
        </div>
        <div class="preview-container" @mousedown="startPan" @wheel="handleWheel">
          <div 
            ref="mermaidContainer" 
            class="mermaid-wrapper" 
            :style="{ transform: `translate(${translateX}px, ${translateY}px) scale(${scale})` }"
          ></div>
        </div>
        
        <div class="theme-selector">
          <div 
            v-for="t_opt in themes" 
            :key="t_opt.id" 
            class="theme-opt" 
            :class="[t_opt.id, { active: currentTheme === t_opt.id }]"
            :title="t_opt.name"
            @click="setTheme(t_opt.id)"
          ></div>
        </div>

        <div class="history-toggle" @click="isHistoryOpen = !isHistoryOpen" :title="t.historyTitle">
          <HistoryIcon :size="18" />
        </div>
      </section>

      <aside class="history-panel" :class="{ open: isHistoryOpen }">
        <div class="history-header">
          <span class="section-title"><Clock :size="14" style="margin-right:8px"/> {{ t.historyTitle }}</span>
          <div style="display:flex; gap: 8px">
            <Trash2 v-if="history.length" :size="16" class="text-muted_custom cursor-pointer" @click="confirmClearHistory" />
            <X :size="18" class="text-muted_custom cursor-pointer" @click="isHistoryOpen = false" />
          </div>
        </div>
        <div class="history-list">
          <div v-if="!history.length" class="empty-history">
            <HistoryIcon :size="40" style="opacity:0.2" />
            {{ t.noHistory }}
          </div>
          <div 
            v-for="item in history" 
            :key="item.timestamp" 
            class="history-item"
            @click="code = item.content; isHistoryOpen = false"
          >
            <span class="history-date">{{ formatDate(item.timestamp) }}</span>
            <div class="history-snippet">{{ item.content.substring(0, 50) }}...</div>
            <button class="delete-btn" @click.stop="deleteHistoryItem(item.timestamp)">
               <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </aside>
    </main>

    <CookieBanner :t="t" />
    <ShareModal 
      :isOpen="isShareModalOpen" 
      :url="shareUrl" 
      :t="t" 
      @close="isShareModalOpen = false"
      @copy="toastRef.value?.show(t.shareCopied)"
    />
    <ConfirmModal 
      :isOpen="isConfirmOpen"
      :message="t.confirmClear"
      @confirm="handleClearHistory"
      @cancel="isConfirmOpen = false"
    />
    <Toast ref="toastRef" />
  </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
.error-msg {
  font-size: 0.75rem;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.text-muted_custom { color: var(--text-muted); transition: color 0.2s; }
.text-muted_custom:hover { color: var(--text-main); }
</style>
