/**
 * @fileoverview Ambient Dynamic PlayStation Wave Canvas
 */
import React, { useEffect, useRef } from 'react';

export function BackgroundWaves() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    let rafId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.015;

      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        const freq = 0.0025 + layer * 0.001;
        const amp = 32 + layer * 14;
        const offset = canvas.height * 0.66 + layer * 28;

        for (let x = 0; x <= canvas.width; x += 16) {
          const y = offset + Math.sin(x * freq + step + layer * 1.45) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(0, ${110 + layer * 35}, 255, ${0.12 + layer * 0.07})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />;
}

