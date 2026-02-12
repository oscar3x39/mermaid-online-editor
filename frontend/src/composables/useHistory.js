import { ref } from 'vue';

export function useHistory(code) {
    const history = ref([]);
    const isHistoryOpen = ref(false);
    const HISTORY_KEY = 'mermaid_editor_history';
    const LATEST_CODE_KEY = 'mermaid_editor_latest';
    const MAX_HISTORY = 300;
    const EXPIRY_DAYS = 30;

    const saveHistory = () => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value));
    };

    const loadHistory = () => {
        const latest = localStorage.getItem(LATEST_CODE_KEY);
        if (latest) {
            code.value = latest;
        }

        const saved = localStorage.getItem(HISTORY_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const now = Date.now();
            history.value = parsed.filter(item => (now - item.timestamp) < EXPIRY_DAYS * 24 * 60 * 60 * 1000);

            if (!latest && history.value.length > 0) {
                code.value = history.value[0].content;
            }
        }
    };

    const addToHistory = (content) => {
        if (!content.trim()) return;
        if (history.value.length > 0 && history.value[0].content === content) return;

        const index = history.value.findIndex(item => item.content === content);
        if (index !== -1) history.value.splice(index, 1);

        history.value.unshift({ content, timestamp: Date.now() });
        if (history.value.length > MAX_HISTORY) history.value = history.value.slice(0, MAX_HISTORY);
        saveHistory();
    };

    const deleteHistoryItem = (timestamp) => {
        history.value = history.value.filter(item => item.timestamp !== timestamp);
        saveHistory();
    };

    const clearAllHistory = () => {
        if (confirm('確定要清空所有歷史紀錄嗎？')) {
            history.value = [];
            saveHistory();
        }
    };

    const persistLatest = (val) => {
        localStorage.setItem(LATEST_CODE_KEY, val);
    };

    return {
        history,
        isHistoryOpen,
        loadHistory,
        addToHistory,
        deleteHistoryItem,
        clearAllHistory,
        persistLatest
    };
}
