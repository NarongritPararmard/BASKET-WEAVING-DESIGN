import { WeavingRange, getColoredRanges, getCenterAxis } from './weaving';

export interface InstructionStep {
    action: 'cover' | 'skip';
    count: number;
}

export interface RowInstructions {
    initialization: string;
    leftSide: InstructionStep[];
    rightSide: InstructionStep[];
    isEmpty: boolean;
}

/**
 * Helper to get the display label of an axis.
 * Labels count outwards from the center axis (C).
 */
export function getAxisLabel(index: number, centerAxis: number): string {
    if (index === centerAxis) return 'C';
    if (index < centerAxis) {
        return `ซ้ายที่ ${centerAxis - index}`;
    } else {
        return `ขวาที่ ${index - centerAxis}`;
    }
}

export function generateRowInstructions(row: boolean[]): RowInstructions {
    const numAxes = row.length;
    const centerAxis = getCenterAxis(numAxes);
    const ranges = getColoredRanges(row);

    if (ranges.length === 0) {
        return {
            initialization: "รอบนี้ไม่ได้เลือกเครื่องหมาย (ไม่มีการสานทับแกนตั้ง)",
            leftSide: [],
            rightSide: [],
            isEmpty: true
        };
    }

    const centerRange = ranges.find(r => centerAxis >= r.start && centerAxis <= r.end);

    let initialization = '';
    let leftStart = centerAxis - 1;
    let rightStart = centerAxis + 1;

    if (centerRange) {
        initialization = `สอดเส้นสานผ่านหน้าแกน ${getAxisLabel(centerRange.start, centerAxis)} และออกหลังแกน ${getAxisLabel(centerRange.end, centerAxis)}`;
        leftStart = centerRange.start - 1;
        rightStart = centerRange.end + 1;
    } else {
        initialization = `เริ่มสานจากด้านในตะกร้า`;

        // Find ranges neighboring the center gap
        const leftOfCenter = ranges.filter(r => r.end < centerAxis).sort((a, b) => b.end - a.end)[0];
        const rightOfCenter = ranges.filter(r => r.start > centerAxis).sort((a, b) => a.start - b.start)[0];

        if (leftOfCenter && rightOfCenter) {
            initialization += ` ออกหลังแกน ${getAxisLabel(leftOfCenter.end, centerAxis)} และออกหน้าแกน ${getAxisLabel(rightOfCenter.start, centerAxis)}`;
            leftStart = leftOfCenter.end;
            rightStart = rightOfCenter.start;
        } else if (leftOfCenter) {
            initialization += ` ออกหลังแกน ${getAxisLabel(leftOfCenter.end, centerAxis)}`;
            leftStart = leftOfCenter.end;
        } else if (rightOfCenter) {
            initialization += ` ออกหน้าแกน ${getAxisLabel(rightOfCenter.start, centerAxis)}`;
            rightStart = rightOfCenter.start;
        }
    }

    const leftSide = generateSideInstructions(row, leftStart, 0, 'left');
    const rightSide = generateSideInstructions(row, rightStart, numAxes - 1, 'right');

    return {
        initialization,
        leftSide,
        rightSide,
        isEmpty: false
    };
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
