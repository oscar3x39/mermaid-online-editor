/**
 * Mermaid 語法高亮定義
 * 支援：flowchart, sequenceDiagram, classDiagram, stateDiagram, erDiagram, gantt, pie, journey, gitGraph, mindmap
 */
export const mermaid = {
    startState: () => ({
        inComment: false,
        inString: false
    }),

    token(stream, state) {
        // 處理註釋 (%% 開頭)
        if (stream.match(/^%%.*$/)) {
            return 'comment'
        }

        // 處理字串 (引號包圍)
        if (stream.match(/^"[^"]*"/)) {
            return 'string'
        }
        if (stream.match(/^'[^']*'/)) {
            return 'string'
        }

        // 圖表類型關鍵字
        if (stream.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|stateDiagram-v2|erDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment)\b/)) {
            return 'keyword'
        }

        // 方向關鍵字
        if (stream.match(/^(TD|TB|BT|RL|LR)\b/)) {
            return 'keyword'
        }

        // Sequence Diagram 關鍵字
        if (stream.match(/^(participant|actor|activate|deactivate|note|loop|alt|else|opt|par|and|rect|end|autonumber|over|left of|right of)\b/)) {
            return 'keyword'
        }

        // Class Diagram 關鍵字
        if (stream.match(/^(class|namespace|interface|enum|annotation|direction|link|click|callback|call)\b/)) {
            return 'keyword'
        }

        // State Diagram 關鍵字
        if (stream.match(/^(state|fork|join|choice|concurrency)\b/)) {
            return 'keyword'
        }

        // ER Diagram 關鍵字
        if (stream.match(/^(entity|relationship|attribute|key|weak)\b/)) {
            return 'keyword'
        }

        // Gantt 關鍵字
        if (stream.match(/^(title|dateFormat|axisFormat|section|excludes|includes|todayMarker|active|done|crit|milestone|after)\b/)) {
            return 'keyword'
        }

        // Journey 關鍵字
        if (stream.match(/^(journey|section|task)\b/)) {
            return 'keyword'
        }

        // Git Graph 關鍵字
        if (stream.match(/^(commit|branch|checkout|merge|cherry-pick|reset|revert|tag)\b/)) {
            return 'keyword'
        }

        // 通用關鍵字
        if (stream.match(/^(subgraph|end|style|classDef|class|click|callback|linkStyle|direction)\b/)) {
            return 'keyword'
        }

        // 箭頭和連接符 (各種箭頭樣式)
        if (stream.match(/^(-->|---|-\.-|===>|===|-\.\->|<-->|<-\.-|<===>|o--o|x--x|\|--\||o\.\.|x\.\.|<\|--\|>)/)) {
            return 'operator'
        }

        // 單向箭頭
        if (stream.match(/^(->|->>|-->>|->|-->)/)) {
            return 'operator'
        }

        // 關係符號
        if (stream.match(/^(\|\||o\{|\}\||o\||\|\{|\}o|\|o|o--|\|<|\|>)/)) {
            return 'operator'
        }

        // 數字
        if (stream.match(/^[0-9]+(\.[0-9]+)?/)) {
            return 'number'
        }

        // 節點形狀標記
        if (stream.match(/^[\[\]\(\)\{\}<>]/)) {
            return 'bracket'
        }

        // 特殊符號
        if (stream.match(/^[:|;,]/)) {
            return 'punctuation'
        }

        // 標籤文字 (在 | | 之間)
        if (stream.match(/^\|[^|]+\|/)) {
            return 'string'
        }

        // 節點 ID 和標籤
        if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) {
            return 'variableName'
        }

        // 其他字符
        stream.next()
        return null
    }
}
