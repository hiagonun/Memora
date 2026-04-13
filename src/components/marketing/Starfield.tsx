"use client";

import { useEffect, useRef } from "react";

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number;
    let height: number;
    let stars: Array<{ x: number; y: number; s: number; v: number; a: number }> = [];
    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      const count = Math.floor((width * height) / 4000);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          s: Math.random() * 1.5 + 0.5,
          v: Math.random() * 0.2 + 0.05,
          a: Math.random() * 0.5 + 0.1,
        });
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.a})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.s, 0, Math.PI * 2);
        ctx.fill();

        // Move up and slightly left
        star.y -= star.v;
        star.x -= star.v * 0.5;

        // Reset
        if (star.y < -10) star.y = height + 10;
        if (star.x < -10) star.x = width + 10;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40 z-[0]"
      aria-hidden="true"
    />
  );
}
