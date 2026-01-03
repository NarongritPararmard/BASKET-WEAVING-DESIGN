import { WeavingRange, getColoredRanges, getCenterAxis } from './weaving';

export interface InstructionStep {
    action: 'cover' | 'skip';
    count: number;
}

export interface RowInstructions {
    initialization: string;
    leftSide: InstructionStep[];
    rightSide: InstructionStep[];
}

export function generateRowInstructions(row: boolean[]): RowInstructions {
    const numAxes = row.length;
    const centerAxis = getCenterAxis(numAxes);
    const ranges = getColoredRanges(row);
    const centerRange = ranges.find(r => centerAxis >= r.start && centerAxis <= r.end);

    let initialization = '';
    let leftStart = centerAxis - 1;
    let rightStart = centerAxis + 1;

    if (centerRange) {
        initialization = `Insert strip before axis ${centerRange.start + 1} and exit after axis ${centerRange.end + 1}.`;
        leftStart = centerRange.start - 1;
        rightStart = centerRange.end + 1;
    } else {
        initialization = `Start strip from inside the basket.`;
        // If no center range, we might need more specific logic from the user, 
        // but follow the context: "the strip exits after the left colored axis and re-enters before the right colored axis."
        // This implies there's a range to "exit and re-enter".
        const nearestRange = findNearestRange(ranges, centerAxis);
        if (nearestRange) {
            initialization += ` Exit after axis ${nearestRange.start + 1} and re-enter before axis ${nearestRange.end + 1}.`;
        }
    }

    const leftSide = generateSideInstructions(row, leftStart, 0, 'left');
    const rightSide = generateSideInstructions(row, rightStart, numAxes - 1, 'right');

    return {
        initialization,
        leftSide,
        rightSide
    };
}

function findNearestRange(ranges: WeavingRange[], center: number): WeavingRange | null {
    if (ranges.length === 0) return null;
    return ranges.reduce((prev, curr) => {
        const prevDist = Math.min(Math.abs(prev.start - center), Math.abs(prev.end - center));
        const currDist = Math.min(Math.abs(curr.start - center), Math.abs(curr.end - center));
        return currDist < prevDist ? curr : prev;
    });
}

function generateSideInstructions(
    row: boolean[],
    startIndex: number,
    endIndex: number,
    direction: 'left' | 'right'
): InstructionStep[] {
    if (startIndex < 0 || startIndex >= row.length) return [];
    if (endIndex < 0 || endIndex >= row.length) return [];

    const steps: InstructionStep[] = [];
    let currentCount = 0;
    let currentType: 'cover' | 'skip' | null = null;

    const step = direction === 'right' ? 1 : -1;

    for (let i = startIndex; direction === 'right' ? i <= endIndex : i >= endIndex; i += step) {
        const isCover = row[i];
        const type = isCover ? 'cover' : 'skip';

        if (currentType === null) {
            currentType = type;
            currentCount = 1;
        } else if (currentType === type) {
            currentCount++;
        } else {
            steps.push({ action: currentType, count: currentCount });
            currentType = type;
            currentCount = 1;
        }
    }

    if (currentType !== null) {
        steps.push({ action: currentType, count: currentCount });
    }

    return steps;
}
