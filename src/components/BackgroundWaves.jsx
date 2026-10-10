import { useEffect, useRef } from 'react';

export default function BackgroundWaves() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let step = 0;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.015;
      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        const freq = 0.0025 + layer * 0.001;
        const amp = 30 + layer * 14;
        const offset = canvas.height * 0.68 + layer * 28;
        for (let x = 0; x <= canvas.width; x += 16) {
          const y = offset + Math.sin(x * freq + step + layer * 1.4) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(0, ${110 + layer * 35}, 255, ${0.12 + layer * 0.07})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="bg-canvas" aria-hidden />;
}
