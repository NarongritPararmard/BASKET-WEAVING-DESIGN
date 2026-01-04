"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { usePatternStore } from '../../store/patternStore';
import { getCenterAxis } from '../../logic/weaving';
import BasketAxes from './BasketAxes';
import WeaveRowMesh from './WeaveRowMesh';

export default function BasketScene() {
    const { state } = usePatternStore();

    // ---------------------------------------------------------
    // ให้ปรับขนาดเส้นผ่านศูนย์กลาง (รัศมี) ตรงนี้ครับ:
    const bottomRadius = 2.0; // รัศมีด้านล่าง (ก้น)
    const topRadius = 2.3;    // รัศมีด้านบน (ปาก) - ลองปรับเป็น 2.5 หรือ 3.0 เพื่อให้ปากกว้างขึ้น
    // ---------------------------------------------------------

    const rowHeight = 0.3;
    const totalHeight = state.numRows * rowHeight;
    const centerAxis = getCenterAxis(state.numAxes);
    const containerHeight = Math.max(500, state.numRows * 30 + 150);

    return (
        <div
            style={{ height: `${containerHeight}px` }}
            className="w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative transition-all duration-500"
        >
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[8, totalHeight / 2 + 2, 8]} fov={40} />

                {/* Professional Studio Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={1} />

                <Suspense fallback={null}>
                    <group position={[0, -totalHeight / 2 - 0.5, 0]}>
                        {/* Vertical Stakes */}
                        <BasketAxes
                            numAxes={state.numAxes}
                            centerAxis={centerAxis}
                            bottomRadius={bottomRadius}
                            topRadius={topRadius}
                            height={totalHeight + 1}
                        />

                        {/* Weaving Rounds */}
                        {state.grid.map((row, idx) => (
                            <WeaveRowMesh
                                key={idx}
                                row={row}
                                rowIndex={idx}
                                totalRows={state.numRows}
                                numAxes={state.numAxes}
                                bottomRadius={bottomRadius}
                                topRadius={topRadius}
                                heightOffset={idx * rowHeight + 0.2}
                                isActive={state.isWeavingMode && state.currentRow === idx}
                                isDimmed={state.isWeavingMode && state.currentRow !== idx}
                            />
                        ))}
                    </group>

                    <ContactShadows
                        position={[0, -totalHeight / 2, 0]}
                        opacity={0.4}
                        scale={15}
                        blur={2}
                        far={10}
                    />
                    <Environment preset="city" />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    autoRotate={!state.isWeavingMode}
                    autoRotateSpeed={0.1}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                />
            </Canvas>

            {/* Label Overlay */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-500/30">
                    3D Preview (เรียลไทม์)
                </span>
            </div>
        </div>
    );
}
