<template>
  <div ref="editorContainer" class="code-editor"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle, HighlightStyle, StreamLanguage } from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { tags } from '@lezer/highlight'
import { mermaid } from '../utils/mermaidLanguage'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editorContainer = ref(null)
let editorView = null

// Mermaid 關鍵字自動完成
const mermaidKeywords = [
  'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 
  'erDiagram', 'gantt', 'pie', 'journey', 'gitGraph', 'mindmap',
  'TD', 'TB', 'BT', 'RL', 'LR',
  'participant', 'actor', 'note', 'activate', 'deactivate',
  'loop', 'alt', 'opt', 'par', 'and', 'rect',
  'title', 'dateFormat', 'section', 'active', 'done', 'crit',
  'class', 'state', 'direction'
]

function mermaidCompletions(context) {
  const word = context.matchBefore(/\w*/)
  if (!word || (word.from === word.to && !context.explicit)) return null
  
  return {
    from: word.from,
    options: mermaidKeywords.map(keyword => ({
      label: keyword,
      type: 'keyword',
      boost: 1
    }))
  }
}

// Mermaid 專屬語法高亮配色 (Dracula 風格 - 固定深色)
const mermaidHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#ff79c6', fontWeight: 'bold' },
  { tag: tags.string, color: '#f1fa8c' },
  { tag: tags.comment, color: '#6272a4', fontStyle: 'italic' },
  { tag: tags.variableName, color: '#8be9fd' },
  { tag: tags.number, color: '#bd93f9' },
  { tag: tags.operator, color: '#ff79c6' },
  { tag: tags.bracket, color: '#f8f8f2' },
  { tag: tags.punctuation, color: '#f8f8f2' },
])

// 編輯器主題 - 固定深色主題
const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '14px',
    fontFamily: 'var(--font-mono)',
    backgroundColor: '#1b1b1b',  // 固定深色背景
    color: '#e5e7eb'              // 固定淺色文字
  },
  '.cm-content': {
    caretColor: 'var(--primary)',
    padding: '10px 0'
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--primary)',
    borderLeftWidth: '2px'
  },
  '&.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: 'rgba(168, 85, 247, 0.3)'
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  '.cm-gutters': {
    backgroundColor: '#131313',   // 固定深色行號背景
    color: '#9ca3af',             // 固定灰色行號
    border: 'none',
    paddingRight: '8px'
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: 'var(--primary)'
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 5px',
    minWidth: '40px'
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'var(--font-mono)'
  }
}, { dark: true })

// 移除主題檢測函數，始終使用深色主題

onMounted(() => {
  const startState = EditorState.create({
    doc: props.modelValue,
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      syntaxHighlighting(mermaidHighlightStyle),
      bracketMatching(),
      closeBrackets(),
      autocompletion({
        override: [mermaidCompletions]
      }),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab
      ]),
      StreamLanguage.define(mermaid),  // 使用自訂 Mermaid 語法解析器
      editorTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString())
        }
      })
    ]
  })

  editorView = new EditorView({
    state: startState,
    parent: editorContainer.value
  })
})

// 監聽外部變更
watch(() => props.modelValue, (newValue) => {
  if (editorView && newValue !== editorView.state.doc.toString()) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: newValue
      }
    })
  }
})

onUnmounted(() => {
  editorView?.destroy()
})
</script>

<style scoped>
.code-editor {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.code-editor :deep(.cm-editor) {
  height: 100%;
}
</style>
