"use client";

import React, { useEffect, useRef, useCallback } from "react";

const parseRgbColor = (colorString: string) => {
  const match = colorString.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
  );
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  }
  return null;
};

interface ArrowLabels {
  /** Mouse is to the left of button (arrow goes left → right) */
  left: string;
  /** Mouse is to the right of button (arrow goes right → left) */
  right: string;
  /** Mouse is below the button (arrow goes bottom → up) */
  bottom: string;
}

interface DynamicHeroProps {
  /** The element ref to point the arrow at */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Boundary element — arrow only draws when mouse is inside this */
  boundaryRef?: React.RefObject<HTMLElement | null>;
  /** Labels shown based on arrow direction — one at a time */
  arrowLabels?: ArrowLabels;
}

function getQuadraticPoint(
  x0: number, y0: number,
  cx: number, cy: number,
  x1: number, y1: number,
  t: number
) {
  const mt = 1 - t;
  return {
    x: mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
    y: mt * mt * y0 + 2 * mt * t * cy + t * t * y1,
  };
}

function DynamicHeroCanvas({
  targetRef,
  boundaryRef,
  arrowLabels = {
    left: "Entrega segura",
    right: "Entrega rápida",
    bottom: "Entrega garantida",
  },
}: DynamicHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameIdRef = useRef<number>(0);

  const resolvedCanvasColorsRef = useRef({
    strokeStyle: { r: 128, g: 128, b: 128 },
  });

  useEffect(() => {
    const tempElement = document.createElement("div");
    tempElement.style.display = "none";
    document.body.appendChild(tempElement);

    const updateResolvedColors = () => {
      tempElement.style.color = "var(--foreground)";
      const computedFgColor = getComputedStyle(tempElement).color;
      const parsedFgColor = parseRgbColor(computedFgColor);
      if (parsedFgColor) {
        resolvedCanvasColorsRef.current.strokeStyle = parsedFgColor;
      } else {
        resolvedCanvasColorsRef.current.strokeStyle = { r: 30, g: 30, b: 30 };
      }
    };

    updateResolvedColors();

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          updateResolvedColors();
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
      if (tempElement.parentNode) tempElement.parentNode.removeChild(tempElement);
    };
  }, []);

  const drawArrow = useCallback(() => {
    if (!canvasRef.current || !targetRef.current || !ctxRef.current) return;

    const targetEl = targetRef.current;
    const ctx = ctxRef.current;
    const mouse = mousePosRef.current;
    const x0 = mouse.x;
    const y0 = mouse.y;

    if (x0 === null || y0 === null) return;

    // Only draw when mouse is inside the hero boundary
    if (boundaryRef?.current) {
      const bounds = boundaryRef.current.getBoundingClientRect();
      if (y0 > bounds.bottom || y0 < bounds.top || x0 < bounds.left || x0 > bounds.right) {
        return;
      }
    }

    const rect = targetEl.getBoundingClientRect();
    const cxTarget = rect.left + rect.width / 2;
    const cyTarget = rect.top + rect.height / 2;
    const a = Math.atan2(cyTarget - y0, cxTarget - x0);
    const x1 = cxTarget - Math.cos(a) * (rect.width / 2 + 12);
    const y1 = cyTarget - Math.sin(a) * (rect.height / 2 + 12);

    const midX = (x0 + x1) / 2;
    const midY = (y0 + y1) / 2;
    const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5);
    const t = Math.max(-1, Math.min(1, (y0 - y1) / 200));
    const controlX = midX;
    const controlY = midY + offset * t;

    const dist = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
    const opacity = Math.min(1.0, (dist - Math.max(rect.width, rect.height) / 2) / 500);

    if (opacity <= 0.05) return;

    const arrowColor = resolvedCanvasColorsRef.current.strokeStyle;
    ctx.strokeStyle = `rgba(${arrowColor.r}, ${arrowColor.g}, ${arrowColor.b}, ${opacity})`;
    ctx.lineWidth = 2;

    // Draw dashed curve
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(controlX, controlY, x1, y1);
    ctx.setLineDash([10, 5]);
    ctx.stroke();
    ctx.restore();

    // Draw arrowhead
    const angle = Math.atan2(y1 - controlY, x1 - controlX);
    const headLength = 13;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(
      x1 - headLength * Math.cos(angle - Math.PI / 6),
      y1 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x1, y1);
    ctx.lineTo(
      x1 - headLength * Math.cos(angle + Math.PI / 6),
      y1 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Pick ONE label based on direction from mouse to button
    if (dist > 120) {
      const dx = cxTarget - x0;
      const dy = cyTarget - y0;

      let label: string;
      if (Math.abs(dy) > Math.abs(dx) && dy < 0) {
        // Mouse is below → arrow goes up
        label = arrowLabels.bottom;
      } else if (dx > 0) {
        // Mouse is to the left → arrow goes right
        label = arrowLabels.left;
      } else {
        // Mouse is to the right → arrow goes left
        label = arrowLabels.right;
      }

      const labelOpacity = Math.min(opacity, (dist - 120) / 250);
      if (labelOpacity > 0.05) {
        // Place label at midpoint of curve (t=0.5)
        const pt = getQuadraticPoint(x0, y0, controlX, controlY, x1, y1, 0.5);
        const tEps = 0.01;
        const ptNext = getQuadraticPoint(x0, y0, controlX, controlY, x1, y1, 0.5 + tEps);
        const tangentAngle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x);

        ctx.save();
        ctx.font = "600 13px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textWidth = ctx.measureText(label).width;
        const padX = 12;
        const boxW = textWidth + padX * 2;
        const boxH = 28;
        const floatOffset = -22;

        ctx.translate(pt.x, pt.y);

        // Keep text readable (flip if upside down)
        let rotAngle = tangentAngle;
        if (rotAngle > Math.PI / 2 || rotAngle < -Math.PI / 2) {
          rotAngle += Math.PI;
        }
        ctx.rotate(rotAngle);

        // Pill background
        ctx.fillStyle = `rgba(243, 112, 33, ${labelOpacity * 0.92})`;
        ctx.beginPath();
        ctx.roundRect(-boxW / 2, floatOffset - boxH / 2, boxW, boxH, boxH / 2);
        ctx.fill();

        // Text
        ctx.fillStyle = `rgba(255, 255, 255, ${labelOpacity})`;
        ctx.fillText(label, 0, floatOffset);

        ctx.restore();
      }
    }
  }, [arrowLabels, targetRef, boundaryRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !targetRef.current) return;

    ctxRef.current = canvas.getContext("2d");

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", updateCanvasSize);
    window.addEventListener("mousemove", handleMouseMove);
    updateCanvasSize();

    const animateLoop = () => {
      const ctx = ctxRef.current;
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawArrow();
      }
      animationFrameIdRef.current = requestAnimationFrame(animateLoop);
    };

    animateLoop();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [drawArrow, targetRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
    />
  );
}

export { DynamicHeroCanvas };
export type { DynamicHeroProps, ArrowLabels };
