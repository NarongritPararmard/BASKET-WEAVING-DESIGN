export interface WeavingRange {
    start: number;
    end: number;
}

/**
 * Finds continuous colored ranges in a row.
 */
export function getColoredRanges(row: boolean[]): WeavingRange[] {
    const ranges: WeavingRange[] = [];
    let currentRange: WeavingRange | null = null;

    for (let i = 0; i < row.length; i++) {
        if (row[i]) {
            if (currentRange === null) {
                currentRange = { start: i, end: i };
            } else {
                currentRange.end = i;
            }
        } else {
            if (currentRange !== null) {
                ranges.push(currentRange);
                currentRange = null;
            }
        }
    }

    if (currentRange !== null) {
        ranges.push(currentRange);
    }

    return ranges;
}

/**
 * Determines the center axis index.
 */
export function getCenterAxis(numAxes: number): number {
    return Math.floor(numAxes / 2);
}

/**
 * Strip Initialization Rule:
 * If the colored range includes the center axis, the strip must be inserted before the leftmost colored axis 
 * and exit after the rightmost colored axis of that range.
 * 
 * If the colored range does not include the center axis, the strip must start from inside the basket. 
 * In this case, the strip exits after the left colored axis and re-enters before the right colored axis.
 */
export function getInitializationRule(row: boolean[], centerAxis: number) {
    const ranges = getColoredRanges(row);
    const centerRange = ranges.find(r => centerAxis >= r.start && centerAxis <= r.end);

    if (centerRange) {
        return {
            type: 'INIT_CENTER',
            range: centerRange
        };
    } else {
        // If multiple ranges exist but none cover the center, we need to decide which one is "primary" 
        // or if the starting point is just "inside". 
        // The context says "the strip exits after the left colored axis and re-enters before the right colored axis"
        // This sounds like it's referring to the "first" colored range encountered?
        // Let's assume the rule applies to any range that doesn't cover the center?
        // "In this case, the strip exits after the left colored axis and re-enters before the right colored axis."
        // This implies a single range.
        return {
            type: 'INIT_INSIDE'
        };
    }
}
