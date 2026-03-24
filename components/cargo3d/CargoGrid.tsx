"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import type { TruckGridDims } from "@/lib/cargo3d/cargo-types";

interface CargoGridProps {
  truck: TruckGridDims;
}

export function CargoGrid({ truck }: CargoGridProps) {
  const lines = useMemo(() => {
    const points: [number, number, number][][] = [];
    const Y = 0.01; // slightly above floor to avoid z-fighting

    // Lines along X axis (parallel to width)
    for (let z = 0; z <= truck.gd; z++) {
      points.push([
        [0, Y, z],
        [truck.gw, Y, z],
      ]);
    }

    // Lines along Z axis (parallel to depth)
    for (let x = 0; x <= truck.gw; x++) {
      points.push([
        [x, Y, 0],
        [x, Y, truck.gd],
      ]);
    }

    return points;
  }, [truck.gw, truck.gd]);

  return (
    <>
      {lines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#94a3b8"
          lineWidth={0.5}
          transparent
          opacity={0.5}
        />
      ))}
    </>
  );
}
