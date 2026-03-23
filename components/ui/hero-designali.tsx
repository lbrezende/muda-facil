"use client";
import { cn } from "@/lib/utils";

/* ── Canvas animation engine (rainbow cursor trails) ── */

class Oscillator {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  _val: number;

  constructor(opts: { phase?: number; offset?: number; frequency?: number; amplitude?: number }) {
    this.phase = opts.phase || 0;
    this.offset = opts.offset || 0;
    this.frequency = opts.frequency || 0.001;
    this.amplitude = opts.amplitude || 1;
    this._val = 0;
  }

  update() {
    this.phase += this.frequency;
    this._val = this.offset + Math.sin(this.phase) * this.amplitude;
    return this._val;
  }
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const E = {
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

let ctx: any;
let f: Oscillator;
const pos = { x: 0, y: 0 };
let lines: TrailLine[] = [];

class TrailLine {
  spring: number;
  friction: number;
  nodes: NodePoint[];

  constructor(opts: { spring: number }) {
    this.spring = opts.spring + 0.1 * Math.random() - 0.05;
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    for (let i = 0; i < E.size; i++) {
      this.nodes.push({ x: pos.x, y: pos.y, vx: 0, vy: 0 });
    }
  }

  update() {
    let e = this.spring;
    let t = this.nodes[0];
    t.vx += (pos.x - t.x) * e;
    t.vy += (pos.y - t.y) * e;
    for (let i = 0; i < this.nodes.length; i++) {
      t = this.nodes[i];
      if (i > 0) {
        const prev = this.nodes[i - 1];
        t.vx += (prev.x - t.x) * e;
        t.vy += (prev.y - t.y) * e;
        t.vx += prev.vx * E.dampening;
        t.vy += prev.vy * E.dampening;
      }
      t.vx *= this.friction;
      t.vy *= this.friction;
      t.x += t.vx;
      t.y += t.vy;
      e *= E.tension;
    }
  }

  draw() {
    let ex: NodePoint, tx: NodePoint;
    let nx = this.nodes[0].x;
    let ny = this.nodes[0].y;
    ctx.beginPath();
    ctx.moveTo(nx, ny);
    let a: number;
    for (a = 1; a < this.nodes.length - 2; a++) {
      ex = this.nodes[a];
      tx = this.nodes[a + 1];
      nx = 0.5 * (ex.x + tx.x);
      ny = 0.5 * (ex.y + tx.y);
      ctx.quadraticCurveTo(ex.x, ex.y, nx, ny);
    }
    ex = this.nodes[a];
    tx = this.nodes[a + 1];
    ctx.quadraticCurveTo(ex.x, ex.y, tx.x, tx.y);
    ctx.stroke();
    ctx.closePath();
  }
}

function onMousemove(e: MouseEvent | TouchEvent) {
  function initLines() {
    lines = [];
    for (let i = 0; i < E.trails; i++)
      lines.push(new TrailLine({ spring: 0.45 + (i / E.trails) * 0.025 }));
  }
  function handleMove(ev: MouseEvent | TouchEvent) {
    const canvas = document.getElementById("canvas");
    const rect = canvas?.getBoundingClientRect();
    if ("touches" in ev) {
      pos.x = ev.touches[0].clientX - (rect?.left || 0);
      pos.y = ev.touches[0].clientY - (rect?.top || 0);
    } else {
      pos.x = ev.clientX - (rect?.left || 0);
      pos.y = ev.clientY - (rect?.top || 0);
    }
    ev.preventDefault();
  }
  function handleTouchStart(ev: TouchEvent) {
    if (ev.touches.length === 1) {
      pos.x = ev.touches[0].pageX;
      pos.y = ev.touches[0].pageY;
    }
  }
  document.removeEventListener("mousemove", onMousemove as EventListener);
  document.removeEventListener("touchstart", onMousemove as EventListener);
  document.addEventListener("mousemove", handleMove as EventListener);
  document.addEventListener("touchmove", handleMove as EventListener);
  document.addEventListener("touchstart", handleTouchStart as EventListener);
  handleMove(e);
  initLines();
  render();
}

function render() {
  if (ctx && ctx.running) {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "lighter";
    // Clamp hue to 280-370 range (purple → magenta → orange)
    const rawHue = Math.round(f.update());
    const hue = rawHue > 360 ? rawHue - 360 : rawHue < 0 ? rawHue + 360 : rawHue;
    ctx.strokeStyle = "hsla(" + hue + ",90%,55%,0.03)";
    ctx.lineWidth = 10;
    for (let t = 0; t < E.trails; t++) {
      lines[t].update();
      lines[t].draw();
    }
    ctx.frame++;
    window.requestAnimationFrame(render);
  }
}

function resizeCanvas() {
  if (ctx && ctx.canvas) {
    ctx.canvas.width = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight;
  }
}

const renderCanvas = function () {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.running = true;
  ctx.frame = 1;
  // Hue range: 280 (purple) ↔ 370/10 (orange) via magenta
  f = new Oscillator({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 45,
    frequency: 0.0015,
    offset: 325,
  });
  document.addEventListener("mousemove", onMousemove as EventListener);
  document.addEventListener("touchstart", onMousemove as EventListener);
  document.body.addEventListener("orientationchange", resizeCanvas);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("focus", () => {
    if (!ctx.running) {
      ctx.running = true;
      render();
    }
  });
  window.addEventListener("blur", () => {
    ctx.running = true;
  });
  resizeCanvas();
};

/* ── TypeWriter effect ── */

import { ReactTyped } from "react-typed";

interface TypeWriterProps {
  strings: string[];
}

const TypeWriter = ({ strings }: TypeWriterProps) => {
  return (
    <ReactTyped
      loop
      typeSpeed={80}
      backSpeed={20}
      strings={strings}
      smartBackspace
      backDelay={1000}
      loopCount={0}
      showCursor
      cursorChar="|"
    />
  );
};

/* ── Shine Border effect ── */

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={{ "--border-radius": `${borderRadius}px` } as React.CSSProperties}
      className={cn(
        "relative grid h-full w-full place-items-center rounded-3xl bg-white p-3 text-black dark:bg-black dark:text-white",
        className
      )}
    >
      <div
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--border-radius": `${borderRadius}px`,
            "--shine-pulse-duration": `${duration}s`,
            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            "--background-radial-gradient": `radial-gradient(transparent,transparent, ${color instanceof Array ? color.join(",") : color},transparent,transparent)`,
          } as React.CSSProperties
        }
        className={`before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-3xl before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:![mask-composite:exclude] before:[mask:--mask-linear-gradient] motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]`}
      />
      {children}
    </div>
  );
}

export { renderCanvas, TypeWriter, ShineBorder };
