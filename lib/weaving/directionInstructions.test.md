# Left & Right Weaving Generation - Test Cases

This document describes test cases for the Left & Right Weaving Generation.

## Test Case 1: Simple Left Direction

**Input:**
- Cells: [uncolored, colored, colored, colored, uncolored, uncolored, colored, colored]
- Center Axis Index: 4 (0-based, so axis 5)

**Left Direction (from center-1 to 0):**
- Process: 3, 2, 1, 0
- Cells: [uncolored, colored, colored, colored]

**Expected Output:**
```typescript
{
  direction: "left",
  steps: [
    { type: "cover", count: 3 },  // axes 3, 2, 1
    { type: "skip", count: 1 }     // axis 0
  ],
  formattedText: "Cover 3 axes, Skip 1 axis"
}
```

## Test Case 2: Simple Right Direction

**Input:**
- Cells: [colored, colored, uncolored, uncolored, colored, colored, colored, uncolored]
- Center Axis Index: 3 (0-based, so axis 4)

**Right Direction (from center+1 to end):**
- Process: 4, 5, 6, 7
- Cells: [colored, colored, colored, uncolored]

**Expected Output:**
```typescript
{
  direction: "right",
  steps: [
    { type: "cover", count: 3 },  // axes 4, 5, 6
    { type: "skip", count: 1 }     // axis 7
  ],
  formattedText: "Cover 3 axes, Skip 1 axis"
}
```

## Test Case 3: Complex Pattern

**Input:**
- Cells: [colored, uncolored, colored, colored, uncolored, colored, uncolored, uncolored]
- Center Axis Index: 3 (0-based)

**Left Direction (indices 2, 1, 0):**
- Process: 2, 1, 0
- Cells: [colored, colored, colored]

**Right Direction (indices 4, 5, 6, 7):**
- Process: 4, 5, 6, 7
- Cells: [uncolored, colored, uncolored, uncolored]

**Expected Output:**
```typescript
{
  leftInstruction: {
    direction: "left",
    steps: [
      { type: "cover", count: 3 }  // axes 2, 1, 0
    ],
    formattedText: "Cover 3 axes"
  },
  rightInstruction: {
    direction: "right",
    steps: [
      { type: "skip", count: 1 },   // axis 4
      { type: "cover", count: 1 },  // axis 5
      { type: "skip", count: 2 }    // axes 6, 7
    ],
    formattedText: "Skip 1 axis, Cover 1 axis, Skip 2 axes"
  }
}
```

## Test Case 4: All Colored on Left

**Input:**
- Cells: [colored, colored, colored, colored, uncolored, uncolored, uncolored, uncolored]
- Center Axis Index: 3 (0-based)

**Left Direction:**
- Process: 2, 1, 0
- Cells: [colored, colored, colored]

**Expected Output:**
```typescript
{
  direction: "left",
  steps: [
    { type: "cover", count: 3 }
  ],
  formattedText: "Cover 3 axes"
}
```

## Test Case 5: All Uncolored on Right

**Input:**
- Cells: [colored, colored, colored, colored, uncolored, uncolored, uncolored, uncolored]
- Center Axis Index: 3 (0-based)

**Right Direction:**
- Process: 4, 5, 6, 7
- Cells: [uncolored, uncolored, uncolored, uncolored]

**Expected Output:**
```typescript
{
  direction: "right",
  steps: [
    { type: "skip", count: 4 }
  ],
  formattedText: "Skip 4 axes"
}
```

## Test Case 6: No Cells on Left

**Input:**
- Cells: [colored, colored, colored, colored]
- Center Axis Index: 0 (0-based)

**Left Direction:**
- Process: (no cells, center is at 0)

**Expected Output:**
```typescript
{
  direction: "left",
  steps: [],
  formattedText: "none"
}
```

## Test Case 7: No Cells on Right

**Input:**
- Cells: [colored, colored, colored, colored]
- Center Axis Index: 3 (0-based, last axis)

**Right Direction:**
- Process: (no cells, center is at last index)

**Expected Output:**
```typescript
{
  direction: "right",
  steps: [],
  formattedText: "none"
}
```

## Test Case 8: Alternating Pattern

**Input:**
- Cells: [colored, uncolored, colored, uncolored, colored, uncolored, colored, uncolored]
- Center Axis Index: 3 (0-based)

**Left Direction (indices 2, 1, 0):**
- Process: 2, 1, 0
- Cells: [colored, uncolored, colored]

**Right Direction (indices 4, 5, 6, 7):**
- Process: 4, 5, 6, 7
- Cells: [colored, uncolored, colored, uncolored]

**Expected Output:**
```typescript
{
  leftInstruction: {
    steps: [
      { type: "cover", count: 1 },  // axis 2
      { type: "skip", count: 1 },   // axis 1
      { type: "cover", count: 1 }   // axis 0
    ],
    formattedText: "Cover 1 axis, Skip 1 axis, Cover 1 axis"
  },
  rightInstruction: {
    steps: [
      { type: "cover", count: 1 },  // axis 4
      { type: "skip", count: 1 },   // axis 5
      { type: "cover", count: 1 },  // axis 6
      { type: "skip", count: 1 }    // axis 7
    ],
    formattedText: "Cover 1 axis, Skip 1 axis, Cover 1 axis, Skip 1 axis"
  }
}
```

