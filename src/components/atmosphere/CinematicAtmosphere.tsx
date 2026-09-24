import React, { useEffect, useState } from 'react';

export const CinematicAtmosphere: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none">
      {/* 1. Specular Cursor Spotlight */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 pointer-events-none"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(244, 63, 94, 0.03) 45%, transparent 70%)',
          willChange: 'left, top',
        }}
      />

      {/* 2. Procedural SVG Film Grain Filter */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none mix-blend-overlay">
        <filter id="cinematic-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cinematic-grain)" />
      </svg>

      {/* 3. CRT Phosphor Scanlines */}
      <div className="absolute inset-0 w-full h-full crt-scanlines opacity-40 pointer-events-none" />

      {/* 4. Cinematic Vignette (Edge falloff) */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_45%,rgba(2,4,10,0.85)_100%)] pointer-events-none" />
    </div>
  );
};
