"use client";

import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraControlsProps {
  truckCenterX: number;
  truckCenterY: number;
  truckCenterZ: number;
  truckWidth: number;
  truckHeight: number;
  truckDepth: number;
}

function CameraFitter({
  truckCenterX,
  truckCenterY,
  truckCenterZ,
  truckWidth,
  truckHeight,
  truckDepth,
}: CameraControlsProps) {
  const { camera, size } = useThree();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;
    fitted.current = true;

    // Calculate distance to fit entire truck in view
    const maxDim = Math.max(truckWidth, truckHeight, truckDepth);
    const fov = (camera as THREE.PerspectiveCamera).fov;
    const aspect = size.width / size.height;
    const vFov = (fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const fitFov = Math.min(vFov, hFov);
    const distance = (maxDim * 1.4) / (2 * Math.tan(fitFov / 2));

    // Position camera at isometric angle showing full truck
    camera.position.set(
      truckCenterX + distance * 0.5,
      truckCenterY + distance * 0.6,
      truckCenterZ + distance * 0.7,
    );
    camera.lookAt(truckCenterX, truckCenterY * 0.3, truckCenterZ);
    camera.updateProjectionMatrix();
  }, [camera, size, truckCenterX, truckCenterY, truckCenterZ, truckWidth, truckHeight, truckDepth]);

  return null;
}

export function CameraControls(props: CameraControlsProps) {
  const {
    truckCenterX,
    truckCenterY,
    truckCenterZ,
    truckWidth,
    truckDepth,
  } = props;

  // Max distance proportional to truck size so you can't zoom too far
  const maxDist = Math.max(truckWidth, truckDepth) * 3;
  const minDist = Math.max(truckWidth, truckDepth) * 0.5;

  return (
    <>
      <CameraFitter {...props} />
      <OrbitControls
        target={[truckCenterX, truckCenterY * 0.3, truckCenterZ]}
        enableDamping
        dampingFactor={0.08}
        minDistance={minDist}
        maxDistance={maxDist}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={0.1}
        enablePan
        makeDefault
      />
    </>
  );
}
