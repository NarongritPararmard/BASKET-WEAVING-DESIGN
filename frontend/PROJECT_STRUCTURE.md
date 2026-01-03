src/
├─ app/
│  ├─ page.tsx              # Home / Pattern Designer
│  ├─ weave/
│  │  └─ page.tsx           # Weaving Mode
│  └─ layout.tsx
│
├─ components/
│  ├─ Grid/
│  │  ├─ PatternGrid.tsx
│  │  ├─ GridCell.tsx
│  │  └─ GridHeader.tsx
│  │
│  ├─ Controls/
│  │  ├─ AxisSelector.tsx
│  │  └─ RowSelector.tsx
│  │
│  └─ Weaving/
│     ├─ InstructionPanel.tsx
│     └─ RowNavigator.tsx
│
├─ logic/
│  ├─ pattern.ts            # Pattern utilities
│  ├─ weaving.ts            # Weaving rules (หัวใจ)
│  └─ instruction.ts        # แปลง logic → ภาษา
│
├─ store/
│  └─ patternStore.ts       # State กลาง
│
└─ types/
   └─ index.ts