"use client";

import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Truck } from "lucide-react";
import { useEffect, useState } from "react";

interface TruckAnimationProps {
  startPosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onComplete: () => void;
}

export function TruckAnimation({
  startPosition,
  targetPosition,
  onComplete,
}: TruckAnimationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Subtle backdrop pulse */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.03, 0] }}
        transition={{ duration: 1.5 }}
      />

      {/* Trail dots */}
      {[0.1, 0.2, 0.35, 0.5].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#009B3A]"
          style={{ width: 6 - i, height: 6 - i }}
          initial={{
            x: startPosition.x,
            y: startPosition.y,
            opacity: 0,
          }}
          animate={{
            x: startPosition.x + (targetPosition.x - startPosition.x) * (0.3 + i * 0.15),
            y: startPosition.y + (targetPosition.y - startPosition.y) * (0.3 + i * 0.15),
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 1,
            delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Moving truck */}
      <motion.div
        className="absolute"
        initial={{
          x: startPosition.x - 20,
          y: startPosition.y - 20,
          scale: 1,
          opacity: 1,
        }}
        animate={{
          x: [
            startPosition.x - 20,
            startPosition.x + (targetPosition.x - startPosition.x) * 0.3,
            targetPosition.x,
          ],
          y: [
            startPosition.y - 20,
            startPosition.y + (targetPosition.y - startPosition.y) * 0.5 - 30,
            targetPosition.y,
          ],
          scale: [1, 1.3, 0.4],
          opacity: [1, 1, 0],
          rotate: [0, -8, -5, 0],
        }}
        transition={{
          duration: 1.5,
          ease: [0.4, 0, 0.2, 1],
          times: [0, 0.5, 1],
        }}
        onAnimationComplete={onComplete}
      >
        <div className="relative">
          {/* Glow behind truck */}
          <div className="absolute inset-0 blur-lg bg-[#009B3A]/30 rounded-full scale-150" />
          <Truck className="h-10 w-10 text-[#009B3A] relative" />
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
