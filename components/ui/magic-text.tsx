"use client";
import * as React from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { useRef, createContext, useContext, useState, useEffect } from "react";

/* ── Context for article-wide scroll tracking ── */

interface MagicArticleContextType {
  scrollYProgress: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const MagicArticleContext = createContext<MagicArticleContextType | null>(null);

/**
 * Wrap an entire article/section so all nested <MagicText> components
 * animate based on the FULL container scroll — not per-paragraph.
 */
export function MagicArticle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <MagicArticleContext.Provider value={{ scrollYProgress, containerRef }}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </MagicArticleContext.Provider>
  );
}

/* ── Word component ── */

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: number[];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative mt-3 mr-1.5 inline-block">
      <span className="opacity-10">{children}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
};

/* ── MagicText ── */

export interface MagicTextProps {
  text: string;
  className?: string;
}

export const MagicText: React.FC<MagicTextProps> = ({ text, className }) => {
  const ctx = useContext(MagicArticleContext);
  const localRef = useRef<HTMLParagraphElement>(null);
  const [range, setRange] = useState<[number, number]>([0, 1]);

  // Always call useScroll (rules of hooks) — only used in standalone mode
  const { scrollYProgress: localProgress } = useScroll({
    target: localRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const isArticleMode = !!ctx;
  const progress = isArticleMode ? ctx.scrollYProgress : localProgress;

  // In article mode, calculate this element's fractional range within the parent
  useEffect(() => {
    if (!isArticleMode || !localRef.current || !ctx.containerRef.current) return;

    const calculate = () => {
      const container = ctx.containerRef.current!;
      const el = localRef.current!;

      const scrollableHeight = container.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const elTop = el.offsetTop - container.offsetTop;
      const elHeight = el.offsetHeight;

      // Start revealing when element is ~80% viewport below
      const start = Math.max(0, (elTop - window.innerHeight * 0.8) / scrollableHeight);
      // Finish when element's midpoint has scrolled past
      const end = Math.min(1, (elTop + elHeight * 0.3) / scrollableHeight);

      setRange([start, end]);
    };

    // Wait for layout
    const timer = setTimeout(calculate, 100);
    window.addEventListener("resize", calculate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculate);
    };
  }, [isArticleMode, ctx]);

  const words = text.split(" ");

  return (
    <p ref={localRef} className={`flex flex-wrap leading-relaxed ${className ?? ""}`}>
      {words.map((word, i) => {
        let wordRange: [number, number];
        if (isArticleMode) {
          const wordStart = range[0] + (i / words.length) * (range[1] - range[0]);
          const wordEnd = range[0] + ((i + 1) / words.length) * (range[1] - range[0]);
          wordRange = [wordStart, wordEnd];
        } else {
          const start = i / words.length;
          const end = start + 1 / words.length;
          wordRange = [start, end];
        }
        return (
          <Word key={i} progress={progress} range={wordRange}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};
