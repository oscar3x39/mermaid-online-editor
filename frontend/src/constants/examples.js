export const EXAMPLES = {
  '流程圖': `graph TD
    A[Start] --> B{Working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]`,
  '時序圖': `sequenceDiagram
    autonumber
    Alice->>John: "Hello John, how are you?"
    John-->>Alice: Great!`,
  '心智圖': `mindmap
  root((mermaid))
    Flowcharts
    Sequence`,
  '甘特圖': `gantt
    title Gantt
    dateFormat YYYY-MM-DD
    section S1
    T1 :a1, 2024-01-01, 30d`,
  '類別圖': `classDiagram
    Animal <|-- Duck`,
  '實體關聯圖': `erDiagram
    CUSTOMER ||--o{ ORDER : places`
};
