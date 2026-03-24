"use client";

import { OrbitControls } from "@react-three/drei";

interface CameraControlsProps {
  truckCenterX: number;
  truckCenterY: number;
  truckCenterZ: number;
}

export function CameraControls({
  truckCenterX,
  truckCenterY,
  truckCenterZ,
}: CameraControlsProps) {
  return (
    <OrbitControls
      target={[truckCenterX, truckCenterY, truckCenterZ]}
      enableDamping
      dampingFactor={0.08}
      minDistance={5}
      maxDistance={80}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minPolarAngle={0.1}
      enablePan
      makeDefault
    />
  );
}
