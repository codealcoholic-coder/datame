"use client";

import { useEffect } from "react";

export default function CursorProvider() {
  useEffect(() => {
    // Create cursor elements via DOM (not React) to avoid re-render issues
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    document.body.appendChild(cursor);

    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    let raf: number;
    function animCursor() {
      cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      raf = requestAnimationFrame(animCursor);
    }
    animCursor();

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      cursor.remove();
      ring.remove();
    };
  }, []);

  return null;
}