# Strip Initialization Engine - Test Cases

This document describes test cases for the Strip Initialization Engine.

## Test Case 1: Includes Center Axis

**Input:**
- Colored Ranges: [{ startIndex: 6, endIndex: 10, isColored: true, color: "#8B4513", length: 5 }]
- Center Axis Index: 8
- Total Axes: 16

**Expected Output:**
```typescript
{
  type: "includesCenter",
  insertIndex: 6,  // Before leftmost (startIndex)
  exitIndex: 10,   // After rightmost (endIndex)
  description: "Insert strip before axis 7, exit after axis 11"
}
```

## Test Case 2: Excludes Center Axis (Left Side)

**Input:**
- Colored Ranges: [{ startIndex: 2, endIndex: 5, isColored: true, color: "#8B4513", length: 4 }]
- Center Axis Index: 8
- Total Axes: 16

**Expected Output:**
```typescript
{
  type: "excludesCenter",
  insertIndex: 5,      // Reference point (exit index)
  exitIndex: 5,        // After left colored axis (endIndex of leftmost range)
  reEnterIndex: 2,     // Before right colored axis (startIndex of rightmost range)
  description: "Start from inside basket. Exit after axis 6, re-enter before axis 3"
}
```

## Test Case 3: Excludes Center Axis (Right Side)

**Input:**
- Colored Ranges: [{ startIndex: 10, endIndex: 13, isColored: true, color: "#8B4513", length: 4 }]
- Center Axis Index: 8
- Total Axes: 16

**Expected Output:**
```typescript
{
  type: "excludesCenter",
  insertIndex: 13,
  exitIndex: 13,       // After left colored axis
  reEnterIndex: 10,    // Before right colored axis
  description: "Start from inside basket. Exit after axis 14, re-enter before axis 11"
}
```

## Test Case 4: Multiple Ranges - Includes Center

**Input:**
- Colored Ranges: [
    { startIndex: 2, endIndex: 4, isColored: true, color: "#8B4513", length: 3 },
    { startIndex: 7, endIndex: 10, isColored: true, color: "#8B4513", length: 4 }
  ]
- Center Axis Index: 8
- Total Axes: 16

**Expected Output:**
```typescript
{
  type: "includesCenter",
  insertIndex: 7,   // Start of the range that includes center
  exitIndex: 10,    // End of the range that includes center
  description: "Insert strip before axis 8, exit after axis 11"
}
```

## Test Case 5: Multiple Ranges - Excludes Center

**Input:**
- Colored Ranges: [
    { startIndex: 2, endIndex: 4, isColored: true, color: "#8B4513", length: 3 },
    { startIndex: 11, endIndex: 13, isColored: true, color: "#8B4513", length: 3 }
  ]
- Center Axis Index: 8
- Total Axes: 16

**Expected Output:**
```typescript
{
  type: "excludesCenter",
  insertIndex: 4,      // Exit index (after leftmost range)
  exitIndex: 4,        // After left colored axis (endIndex of leftmost range)
  reEnterIndex: 11,    // Before right colored axis (startIndex of rightmost range)
  description: "Start from inside basket. Exit after axis 5, re-enter before axis 12"
}
```

## Test Case 6: No Colored Ranges

**Input:**
- Colored Ranges: []
- Center Axis Index: 8
- Total Axes: 16

**Expected Output:**
```typescript
{
  type: "excludesCenter",
  insertIndex: 0,
  exitIndex: 0,
  description: "No colored cells in this row. No strip initialization needed."
}
```

## Test Case 7: Wrap-Around Range Includes Center

**Input:**
- Colored Ranges: [{ startIndex: 14, endIndex: 2, isColored: true, color: "#8B4513", length: 5 }]
  // This wraps around: 14, 15, 0, 1, 2
- Center Axis Index: 8
- Total Axes: 16

**Expected Output:**
```typescript
{
  type: "includesCenter",  // If center (8) is not in range, then excludesCenter
  // Actually, this range doesn't include center 8, so it should be excludesCenter
  // But if we have a range that wraps and includes center, it should work
}
```

## Test Case 8: Single Colored Cell at Center

**Input:**
- Colored Ranges: [{ startIndex: 8, endIndex: 8, isColored: true, color: "#8B4513", length: 1 }]
- Center Axis Index: 8
- Total Axes: 16

**Expected Output:**
```typescript
{
  type: "includesCenter",
  insertIndex: 8,
  exitIndex: 8,
  description: "Insert strip before axis 9, exit after axis 9"
}
```

