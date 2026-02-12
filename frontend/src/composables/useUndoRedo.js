import { ref, computed } from 'vue';

export function useUndoRedo(code) {
    const undoStack = ref([]);
    const redoStack = ref([]);
    const isUndoing = ref(false);
    const MAX_UNDO_STEPS = 50;

    const pushToUndo = (content) => {
        if (undoStack.value.length > 0 && undoStack.value[undoStack.value.length - 1] === content) return;
        undoStack.value.push(content);
        if (undoStack.value.length > MAX_UNDO_STEPS) undoStack.value.shift();
        if (!isUndoing.value) {
            redoStack.value = [];
        }
    };

    const undo = () => {
        if (undoStack.value.length <= 1) return;
        isUndoing.value = true;
        const current = undoStack.value.pop();
        redoStack.value.push(current);
        const prev = undoStack.value[undoStack.value.length - 1];
        code.value = prev;
        setTimeout(() => { isUndoing.value = false; }, 100);
    };

    const redo = () => {
        if (redoStack.value.length === 0) return;
        isUndoing.value = true;
        const next = redoStack.value.pop();
        undoStack.value.push(next);
        code.value = next;
        setTimeout(() => { isUndoing.value = false; }, 100);
    };

    const canUndo = computed(() => undoStack.value.length > 1);
    const canRedo = computed(() => redoStack.value.length > 0);

    const initUndo = (initialContent) => {
        undoStack.value = [initialContent];
    };

    return {
        undo,
        redo,
        canUndo,
        canRedo,
        pushToUndo,
        isUndoing,
        initUndo
    };
}
