import React, { useEffect, useState, useRef } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import type { TelemetryData } from '../3d/CinematicThreeCanvas';
import { Radio, Zap, Volume2, VolumeX, Terminal as TerminalIcon, Cpu, Activity, ShieldCheck } from 'lucide-react';

interface CinematicHUDProps {
  onOpenCommandPalette: () => void;
  onScrollToTerminal: () => void;
}

export const CinematicHUD: React.FC<CinematicHUDProps> = ({
  onOpenCommandPalette,
  onScrollToTerminal,
}) => {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    fps: 60,
    cameraCoords: [0, 0, 8.8],
    entityCount: 2214,
    activePhase: 'QUANTUM CORE',
    isWarping: false,
  });

  const [isDroneOn, setIsDroneOn] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Listen for telemetry broadcast from Three.js scene
  useEffect(() => {
    const handleTelemetry = (e: Event) => {
      const customEvent = e as CustomEvent<TelemetryData>;
      if (customEvent.detail) {
        setTelemetry(customEvent.detail);
      }
    };

    window.addEventListener('cinematic-telemetry', handleTelemetry);
    return () => window.removeEventListener('cinematic-telemetry', handleTelemetry);
  }, []);

  // Track scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setScrollProgress(total > 0 ? Math.min(Math.max(current / total, 0), 1) : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live 10-Band Equalizer Canvas connected to Web Audio AnalyserNode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const buffer = new Uint8Array(32);

    const renderEq = () => {
      animId = requestAnimationFrame(renderEq);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const analyser = soundEngine.getAnalyser();
      if (analyser && isDroneOn) {
        analyser.getByteFrequencyData(buffer);
      } else {
        // Idle ambient subtle movement
        for (let i = 0; i < 10; i++) {
          buffer[i] = 12 + Math.sin(Date.now() * 0.003 + i) * 8;
        }
      }

      const barCount = 10;
      const barWidth = 3;
      const barGap = 2;
      const totalWidth = barCount * barWidth + (barCount - 1) * barGap;
      const startX = (canvas.width - totalWidth) / 2;

      for (let i = 0; i < barCount; i++) {
        const val = buffer[i] || 0;
        const norm = isDroneOn ? Math.min(val / 255, 1) : Math.min(val / 100, 0.4);
        const barHeight = Math.max(3, norm * canvas.height);
        const x = startX + i * (barWidth + barGap);
        const y = canvas.height - barHeight;

        // Gradient: cyan to rose
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(1, '#f43f5e');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    };

    animId = requestAnimationFrame(renderEq);
    return () => cancelAnimationFrame(animId);
  }, [isDroneOn]);

  const toggleDrone = () => {
    const nextState = soundEngine.toggleReactorDrone();
    setIsDroneOn(nextState);
    soundEngine.playRadarPing();
  };

  const triggerWarpSpeed = () => {
    soundEngine.playWarpSurge();
    window.dispatchEvent(new CustomEvent('trigger-warp-surge'));
  };

  return (
    <aside aria-label="Flight Telemetry & System HUD" className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* ================= TOP-LEFT DIAGNOSTICS ================= */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel border border-white/10 backdrop-blur-xl text-xs font-mono shadow-2xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white/60 font-semibold uppercase tracking-wider">CORE:</span>
          <span className="text-emerald-400 font-bold">{telemetry.fps} FPS</span>
          <span className="text-white/20">|</span>
          <span className="text-cyan-400 font-semibold">{telemetry.activePhase}</span>
        </div>

        {/* Camera Coordinates Vector Ticker */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-black/40 border border-white/5 font-mono text-[10px] text-white/50 tracking-wider">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>CAM:</span>
          <span className="text-white/80 font-medium">[{telemetry.cameraCoords.join(', ')}]</span>
          <span className="text-white/20">•</span>
          <Cpu className="w-3 h-3 text-rose-400" />
          <span>NODES:</span>
          <span className="text-rose-400 font-medium">{telemetry.entityCount}</span>
        </div>
      </div>

      {/* ================= TOP-RIGHT SYNTHESIZER CONTROLS ================= */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2.5 pointer-events-auto">
        {/* Animated 10-Band Equalizer Canvas */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel border border-white/10">
          <canvas ref={canvasRef} width={50} height={18} className="block opacity-90" />
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
            {isDroneOn ? '55Hz' : 'IDLE'}
          </span>
        </div>

        {/* Ambient Reactor Drone Toggle */}
        <button
          onClick={toggleDrone}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
            isDroneOn
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
              : 'glass-panel text-white/70 border-white/10 hover:text-white hover:border-white/30'
          }`}
          title="Toggle 55Hz Sub-Bass Reactor Drone"
        >
          {isDroneOn ? <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{isDroneOn ? 'DRONE: ON' : 'DRONE: OFF'}</span>
        </button>

        {/* WARP SPEED Trigger Button */}
        <button
          onClick={triggerWarpSpeed}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,63,94,0.4)] border border-white/20 cursor-pointer"
          title="Trigger Hyperdrive Jump Acceleration"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-bounce" />
          <span>WARP</span>
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass-panel border border-white/10 font-mono text-xs text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer"
          title="Open Command Palette (⌘K)"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">⌘K</kbd>
        </button>
      </div>

      {/* ================= BOTTOM-LEFT MISSION TELEMETRY ================= */}
      <div className="absolute bottom-6 left-6 hidden lg:flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl glass-panel border border-white/10 font-mono text-xs backdrop-blur-xl">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold">99.999% SLA</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>RAFT: QUORUM</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="text-white/70">
            P99: <span className="text-rose-400 font-bold">&lt; 0.8ms</span>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM-RIGHT RADIAL GAUGE ================= */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3 pointer-events-auto">
        <button
          onClick={onScrollToTerminal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel border border-white/15 font-mono text-xs text-white/90 hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer group shadow-xl"
          title="Jump to UNIX CLI Shell"
        >
          <TerminalIcon className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">RUN SHELL</span>
        </button>

        {/* Circular SVG Scroll Progress Ring */}
        <div className="relative w-11 h-11 flex items-center justify-center glass-panel rounded-full border border-white/10 shadow-xl">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="18"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              stroke="#f43f5e"
              strokeWidth="3"
              strokeDasharray="113.1"
              strokeDashoffset={113.1 * (1 - scrollProgress)}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-150"
            />
          </svg>
          <span className="absolute font-mono text-[9px] font-bold text-white">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </aside>
  );
};
