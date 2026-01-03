# Range Extraction Engine - Test Cases

This document describes test cases for the Range Extraction Engine.

## Test Case 1: Simple Continuous Range

**Input:**
- Cells: [uncolored, colored, colored, colored, uncolored]
- Total Axes: 5

**Expected Output:**
```typescript
{
  rowIndex: 0,
  coloredRanges: [{
    startIndex: 1,
    endIndex: 3,
    isColored: true,
    color: "#8B4513",
    length: 3
  }]
}
```

## Test Case 2: Multiple Ranges

**Input:**
- Cells: [colored, colored, uncolored, colored, uncolored, colored, colored]
- Total Axes: 7

**Expected Output:**
```typescript
{
  rowIndex: 0,
  coloredRanges: [
    { startIndex: 0, endIndex: 1, isColored: true, color: "#8B4513", length: 2 },
    { startIndex: 3, endIndex: 3, isColored: true, color: "#8B4513", length: 1 },
    { startIndex: 5, endIndex: 6, isColored: true, color: "#8B4513", length: 2 }
  ]
}
```

## Test Case 3: Wrap-Around (Circular)

**Input:**
- Cells: [colored, uncolored, uncolored, colored, colored]
- Total Axes: 5

**Expected Output:**
```typescript
{
  rowIndex: 0,
  coloredRanges: [{
    startIndex: 3,  // or 0, depending on implementation
    endIndex: 0,   // wraps around
    isColored: true,
    color: "#8B4513",
    length: 3  // (5-3) + (0+1) = 3
  }]
}
```

## Test Case 4: All Colored

**Input:**
- Cells: [colored, colored, colored, colored, colored]
- Total Axes: 5

**Expected Output:**
```typescript
{
  rowIndex: 0,
  coloredRanges: [{
    startIndex: 0,
    endIndex: 4,
    isColored: true,
    color: "#8B4513",
    length: 5
  }]
}
```

## Test Case 5: No Colored Cells

**Input:**
- Cells: [uncolored, uncolored, uncolored]
- Total Axes: 3

**Expected Output:**
```typescript
{
  rowIndex: 0,
  coloredRanges: []
}
```

## Test Case 6: Single Colored Cell

**Input:**
- Cells: [uncolored, colored, uncolored]
- Total Axes: 3

**Expected Output:**
```typescript
{
  rowIndex: 0,
  coloredRanges: [{
    startIndex: 1,
    endIndex: 1,
    isColored: true,
    color: "#8B4513",
    length: 1
  }]
}
```

## Test Case 7: Different Colors

**Input:**
- Cells: [colored(red), colored(red), colored(blue), colored(blue)]
- Total Axes: 4

**Expected Output:**
```typescript
{
  rowIndex: 0,
  coloredRanges: [
    { startIndex: 0, endIndex: 1, isColored: true, color: "red", length: 2 },
    { startIndex: 2, endIndex: 3, isColored: true, color: "blue", length: 2 }
  ]
}
```

