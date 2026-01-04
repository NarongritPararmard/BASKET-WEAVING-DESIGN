"use client";

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { PatternState, RowStatus } from '../types';
import { createEmptyGrid } from '../logic/pattern';

interface PatternContextType {
    state: PatternState;
    setNumAxes: (num: number) => void;
    setNumRows: (num: number) => void;
    toggleCell: (row: number, col: number) => void;
    setCellColor: (row: number, col: number, color: string) => void;
    clearCell: (row: number, col: number) => void;
    setRowStatus: (row: number, status: RowStatus) => void;
    setCurrentRow: (row: number) => void;
    setWeavingMode: (enabled: boolean) => void;
    setSelectedColor: (color: string) => void;
    addToColorHistory: (color: string) => void;
}

const PatternContext = createContext<PatternContextType | undefined>(undefined);

const DEFAULT_AXES = 12;
const DEFAULT_ROWS = 8;

export function PatternProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<PatternState>({
        numAxes: DEFAULT_AXES,
        numRows: DEFAULT_ROWS,
        grid: createEmptyGrid(DEFAULT_ROWS, DEFAULT_AXES),
        rowStatuses: Array(DEFAULT_ROWS).fill('not-started'),
        currentRow: 0,
        isWeavingMode: false,
        selectedColor: '#6366F1',
        colorHistory: ['#6366F1'],
    });

    const setNumAxes = (num: number) => {
        setState(prev => {
            const newGrid = prev.grid.map(row => {
                const newRow = [...row];
                if (num > row.length) {
                    while (newRow.length < num) newRow.push(null);
                } else {
                    newRow.length = num;
                }
                return newRow;
            });
            return { ...prev, numAxes: num, grid: newGrid };
        });
    };

    const setNumRows = (num: number) => {
        setState(prev => {
            let newGrid = [...prev.grid];
            let newStatuses = [...prev.rowStatuses];
            if (num > prev.grid.length) {
                while (newGrid.length < num) {
                    newGrid.push(Array(prev.numAxes).fill(null));
                    newStatuses.push('not-started');
                }
            } else {
                newGrid.length = num;
                newStatuses.length = num;
            }
            return { ...prev, numRows: num, grid: newGrid, rowStatuses: newStatuses };
        });
    };

    const toggleCell = (row: number, col: number) => {
        setState(prev => {
            const newGrid = [...prev.grid];
            newGrid[row] = [...newGrid[row]];
            newGrid[row][col] = newGrid[row][col] ? null : prev.selectedColor;
            return { ...prev, grid: newGrid };
        });
    };

    const setCellColor = (row: number, col: number, color: string) => {
        setState(prev => {
            const newGrid = [...prev.grid];
            newGrid[row] = [...newGrid[row]];
            newGrid[row][col] = color;
            return { ...prev, grid: newGrid };
        });
    };

    const clearCell = (row: number, col: number) => {
        setState(prev => {
            const newGrid = [...prev.grid];
            newGrid[row] = [...newGrid[row]];
            newGrid[row][col] = null;
            return { ...prev, grid: newGrid };
        });
    };

    const setRowStatus = (row: number, status: RowStatus) => {
        setState(prev => {
            const newStatuses = [...prev.rowStatuses];
            newStatuses[row] = status;
            return { ...prev, rowStatuses: newStatuses };
        });
    };

    const setCurrentRow = (row: number) => {
        setState(prev => ({ ...prev, currentRow: row }));
    };

    const setWeavingMode = (enabled: boolean) => {
        setState(prev => ({ ...prev, isWeavingMode: enabled }));
    };

    const setSelectedColor = (color: string) => {
        setState(prev => ({ ...prev, selectedColor: color }));
    };

    const addToColorHistory = (color: string) => {
        setState(prev => {
            const newHistory = prev.colorHistory.includes(color) 
                ? prev.colorHistory 
                : [...prev.colorHistory.slice(-9), color];
            return { ...prev, colorHistory: newHistory };
        });
    };

    return (
        <PatternContext.Provider value={{
            state,
            setNumAxes,
            setNumRows,
            toggleCell,
            setCellColor,
            clearCell,
            setRowStatus,
            setCurrentRow,
            setWeavingMode,
            setSelectedColor,
            addToColorHistory
        }}>
            {children}
        </PatternContext.Provider>
    );
}

export function usePatternStore() {
    const context = useContext(PatternContext);
    if (context === undefined) {
        throw new Error('usePatternStore must be used within a PatternProvider');
    }
    return context;
}
