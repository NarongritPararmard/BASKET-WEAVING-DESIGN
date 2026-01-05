/**
 * General utilities for pattern grid manipulation.
 */

/**
 * Creates an empty grid of the given size.
 */
export function createEmptyGrid(rows: number, cols: number): boolean[][] {
    return Array(rows).fill(null).map(() => Array(cols).fill(false));
}

/**
 * Validates if a row index is within bounds.
 */
export function isRowValid(rowIndex: number, numRows: number): boolean {
    return rowIndex >= 0 && rowIndex < numRows;
}

/**
 * Deep clones a grid.
 */
export function cloneGrid(grid: boolean[][]): boolean[][] {
    return grid.map(row => [...row]);
}
