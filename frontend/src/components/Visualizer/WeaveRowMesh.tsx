"use client";

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface WeaveRowMeshProps {
    row: boolean[];
    rowIndex: number;
    totalRows: number;
    numAxes: number;
    bottomRadius: number;
    topRadius: number;
    heightOffset: number;
    isActive: boolean;
    isDimmed: boolean;
}

export default function WeaveRowMesh({
    row,
    rowIndex,
    totalRows,
    numAxes,
    bottomRadius,
    topRadius,
    heightOffset,
    isActive,
    isDimmed
}: WeaveRowMeshProps) {
    const isDesigned = useMemo(() => row.some(cell => cell === true), [row]);
    const weaveOffset = 0.18;
    const materialRef = React.useRef<THREE.MeshStandardMaterial>(null);

    // Calculate current radius based on height (tapered effect)
    const baseRadiusAtHeight = useMemo(() => {
        const t = totalRows > 1 ? (rowIndex / (totalRows - 1)) : 0;
        return THREE.MathUtils.lerp(bottomRadius, topRadius, t);
    }, [rowIndex, totalRows, bottomRadius, topRadius]);

    useFrame((state) => {
        if (isActive && materialRef.current) {
            const time = state.clock.getElapsedTime();
            materialRef.current.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.2;
        }
    });

    const points = useMemo(() => {
        if (!isDesigned) return [];
        const curvePoints = [];
        const samples = numAxes * 6;
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            const theta = t * Math.PI * 2;

            const axisIndex = t * numAxes;
            const idx1 = Math.floor(axisIndex) % numAxes;
            const idx2 = Math.ceil(axisIndex) % numAxes;
            const frac = axisIndex % 1;

            const offset1 = row[idx1] ? weaveOffset : -weaveOffset;
            const offset2 = row[idx2] ? weaveOffset : -weaveOffset;
            const currentOffset = THREE.MathUtils.lerp(offset1, offset2, THREE.MathUtils.smoothstep(frac, 0, 1));

            const currentRadius = baseRadiusAtHeight + currentOffset;

            curvePoints.push(new THREE.Vector3(
                Math.cos(theta) * currentRadius,
                0,
                -Math.sin(theta) * currentRadius
            ));
        }
        return curvePoints;
    }, [row, numAxes, baseRadiusAtHeight, isDesigned]);

    const curve = useMemo(() => {
        if (points.length === 0) return null;
        return new THREE.CatmullRomCurve3(points, true);
    }, [points]);

    if (!isDesigned || !curve) return null;

    return (
        <mesh position={[0, heightOffset, 0]} scale={[1, 5, 1]}>
            <tubeGeometry args={[curve, 300, 0.04, 8, true]} />
            <meshStandardMaterial
                ref={materialRef}
                color={isActive ? "#f59e0b" : "#fcd34d"}
                emissive={isActive ? "#d97706" : "#000000"}
                emissiveIntensity={isActive ? 0.5 : 0}
                transparent={isDimmed}
                opacity={isDimmed ? 0.3 : 1}
                metalness={0.05}
                roughness={0.7}
            />
        </mesh>
    );
}
