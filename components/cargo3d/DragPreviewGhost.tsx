"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import type { Mesh } from "three";
import type { DragPreview } from "@/lib/cargo3d/cargo-types";

interface DragPreviewGhostProps {
  preview: DragPreview | null;
}

export function DragPreviewGhost({ preview }: DragPreviewGhostProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.03;
    meshRef.current.scale.set(pulse, pulse, pulse);
  });

  if (!preview) return null;

  const { gx, gy, gz, gw, gh, gd, valid } = preview;
  const color = valid ? "#22c55e" : "#ef4444";
  const edgeColor = valid ? "#16a34a" : "#dc2626";

  const posX = gx + gw / 2;
  const posY = gy + gh / 2;
  const posZ = gz + gd / 2;

  return (
    <mesh
      ref={meshRef}
      position={[posX, posY, posZ]}
    >
      <boxGeometry args={[gw * 0.98, gh * 0.98, gd * 0.98]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
      <Edges color={edgeColor} lineWidth={2} />
    </mesh>
  );
}
