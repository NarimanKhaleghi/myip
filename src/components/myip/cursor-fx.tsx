"use client";

import { useEffect, useRef } from "react";

/**
 * Custom monochrome cursor — design-system rule 11.
 * Dot + ring with mix-blend-mode: difference so it stays pure
 * black/white on any surface. Desktop pointers only, honors
 * prefers-reduced-motion. Renders nothing on touch devices.
 */
export function CursorFx() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const hover = !!target?.closest?.("a, button, input, [role='button'], .chip, [data-slot='tabs-trigger']");
      ring.classList.toggle("is-hover", hover);
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <style>{`
        .cursor-dot, .cursor-ring {
          position: fixed; top: 0; left: 0;
          z-index: 100; pointer-events: none;
          border-radius: 50%; opacity: 0;
          mix-blend-mode: difference;
        }
        .cursor-dot {
          width: 7px; height: 7px; margin: -3.5px; background: #fff;
        }
        .cursor-ring {
          width: 36px; height: 36px; margin: -18px;
          border: 1.5px solid #fff;
          transition: width .3s cubic-bezier(.22,.7,.16,1), height .3s cubic-bezier(.22,.7,.16,1), margin .3s cubic-bezier(.22,.7,.16,1);
        }
        .cursor-ring.is-hover { width: 58px; height: 58px; margin: -29px; }
        body.has-cursor .cursor-dot, body.has-cursor .cursor-ring { opacity: 1; }
        body.has-cursor, body.has-cursor a, body.has-cursor button { cursor: none; }
        @media (prefers-reduced-motion: reduce) {
          .cursor-dot, .cursor-ring { display: none; }
        }
      `}</style>
    </>
  );
}
