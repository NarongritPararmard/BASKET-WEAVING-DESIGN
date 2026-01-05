"use client";

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface BasketAxesProps {
    numAxes: number;
    centerAxis: number;
    bottomRadius: number;
    topRadius: number;
    height: number;
}

export default function BasketAxes({ numAxes, centerAxis, bottomRadius, topRadius, height }: BasketAxesProps) {
    const axesData = useMemo(() => {
        const data = [];
        for (let i = 0; i < numAxes; i++) {
            const theta = (i / numAxes) * Math.PI * 2;

            // Bottom point
            const x1 = Math.cos(theta) * bottomRadius;
            const z1 = -Math.sin(theta) * bottomRadius;

            // Top point
            const x2 = Math.cos(theta) * topRadius;
            const z2 = -Math.sin(theta) * topRadius;

            data.push({ x1, z1, x2, z2 });
        }
        return data;
    }, [numAxes, bottomRadius, topRadius, height]);

    return (
        <group>
            {/* Vertical Stakes (ตอกยืน) */}
            {axesData.map((axis, idx) => {
                const start = new THREE.Vector3(axis.x1, 0, axis.z1);
                const end = new THREE.Vector3(axis.x2, height, axis.z2);
                const direction = new THREE.Vector3().subVectors(end, start);
                const midway = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

                const quaternion = new THREE.Quaternion().setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    direction.clone().normalize()
                );

                return (
                    <mesh key={idx} position={midway} quaternion={quaternion}>
                        <cylinderGeometry args={[0.12, 0.12, direction.length(), 8]} />
                        <meshStandardMaterial
                            color={idx === centerAxis ? "#FFB3CA" : "#E85783"}
                            emissive={idx === centerAxis ? "#64748b" : "#000000"}
                            emissiveIntensity={idx === centerAxis ? 0.4 : 0}
                            metalness={0.4}
                            roughness={0.6}
                        />
                    </mesh>
                );
            })}

            {/* Basket Base (ฐานตะกร้า) */}
            <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[bottomRadius + 0.3, bottomRadius + 0.3, 0.2, 32]} />
                <meshStandardMaterial
                    color="#DBAE75"
                    metalness={0.1}
                    roughness={0.9}
                />
            </mesh>
        </group>
    );
}
