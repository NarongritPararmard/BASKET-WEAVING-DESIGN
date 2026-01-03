# Core Data Models - Phase 2

This document describes the core TypeScript interfaces and types for the basket weaving pattern design system.

## Overview

The data models are designed around the core concept that:
- **Columns = vertical axes** (circular in reality, linear in UI)
- **Rows = weaving rounds** (bottom → top)
- **Pattern is defined by continuous ranges**, not individual cells

## Core Interfaces

### VerticalAxisConfig

Configuration for vertical axes (stakes) that form the basket structure.

```typescript
interface VerticalAxisConfig {
  count: number;              // Total number of vertical axes
  centerAxisIndex: number;    // Index of center axis (0-based)
  evenlySpaced: boolean;       // Always true for this application
}
```

### PatternGrid

Complete pattern grid representing the entire basket weaving pattern.

```typescript
interface PatternGrid {
  axisConfig: VerticalAxisConfig;
  totalRows: number;
  rows: WeavingRow[];
  availableColors: string[];
  isConfirmed: boolean;
}
```

### WeavingRow

A single weaving row (round) in the pattern, ordered from bottom to top.

```typescript
interface WeavingRow {
  index: number;              // 0-based, 0 = bottom row
  cells: CellState[];         // One per vertical axis
  status: RowStatus;          // Execution status
  ranges: ColoredRange[];     // Continuous ranges derived from cells
  instructions?: RowWeavingInstructions;
}
```

### ColoredRange

Represents a continuous range of colored or uncolored vertical axes.

```typescript
interface ColoredRange {
  startIndex: number;         // Start index (0-based, inclusive)
  endIndex: number;           // End index (0-based, inclusive)
  isColored: boolean;         // Covered by strip or passes behind
  color?: string;             // Color if colored
  length: number;             // Number of axes in range
}
```

### StripInitializationRule

Rule that determines how the weaving strip enters and exits.

```typescript
interface StripInitializationRule {
  type: "includesCenter" | "excludesCenter";
  insertIndex: number;        // Where strip enters
  exitIndex: number;          // Where strip exits
  reEnterIndex?: number;      // Where strip re-enters (excludesCenter only)
  description: string;        // Human-readable description
}
```

### WeavingInstruction

Weaving instruction for one direction (left or right).

```typescript
interface WeavingInstruction {
  direction: "left" | "right";
  steps: InstructionStep[];
  formattedText?: string;
}
```

### RowStatus

Status of a weaving row during execution.

```typescript
type RowStatus = "notStarted" | "inProgress" | "completed" | "reworked";
```

## Key Concepts

### Continuous Ranges

Patterns are defined by continuous ranges, not individual cells. A group of adjacent colored cells means the weaving strip must cover the entire range in a single insertion.

### Center Axis

The center axis (C) is a conceptual reference used to:
- Divide left and right directions
- Determine strip initialization rules

### Strip Initialization Rules

**If colored range includes center axis:**
- Strip inserted before leftmost colored axis
- Exits after rightmost colored axis

**If colored range does not include center axis:**
- Strip starts from inside the basket
- Exits after left colored axis
- Re-enters before right colored axis

### Left and Right Directions

After strip initialization, weaving proceeds in two independent directions:
- **Left**: Processed continuously from center toward left end
- **Right**: Processed continuously from center toward right end

Each side is processed independently without alternating.

