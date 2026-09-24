import React from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { Terminal, Shield, ArrowRight, Zap, Copy, ExternalLink, Cpu } from 'lucide-react';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onOpenTerminal: () => void;
  onOpenCommandPalette: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onOpenTerminal,
  onOpenCommandPalette,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mradityasoni.cse@gmail.com');
    setCopied(true);
    soundEngine.playRadarPing();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWarp = () => {
    soundEngine.playWarpSurge();
    window.dispatchEvent(new CustomEvent('trigger-warp-surge'));
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 z-10"
    >
      {/* Top Telemetry Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-rose-500/30 text-xs font-mono text-rose-300 mb-6 backdrop-blur-xl shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-fade-in">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <span className="font-semibold uppercase tracking-widest text-[11px]">
          HIGH-CONCURRENCY SYSTEMS &bull; THREE.JS 3D
        </span>
      </div>

      {/* Hero Display Typography */}
      <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white mb-6 leading-[0.92]">
        ADITYA <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-400 to-cyan-400 text-glow-rose">SONI</span>
      </h1>

      <p className="font-mono text-xs sm:text-sm text-cyan-300 uppercase tracking-[0.25em] mb-6 flex items-center justify-center gap-2">
        <span className="text-rose-500">&lt;/&gt;</span>
        <span>Systems Architect &bull; Full-Stack Builder &bull; 3D Graphics</span>
      </p>

      {/* Subtitle Description */}
      <p className="font-body text-base sm:text-lg text-slate-300/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
        Engineering resilient microsecond-latency distributed backends, WebSocket stream engines, and GPU-accelerated spatial interfaces with mathematical rigor.
      </p>

      {/* Main Action CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-xl mx-auto mb-14">
        <button
          onClick={onExploreProjects}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <span>EXPLORE ARCHITECTURE</span>
          <ArrowRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleWarp}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-mono text-xs font-semibold uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(244,63,94,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          <span>ENGAGE WARP JUMP</span>
        </button>

        <button
          onClick={onOpenTerminal}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl glass-pill text-white font-mono text-xs uppercase tracking-widest hover:border-white/30 transition-all cursor-pointer"
        >
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>LAUNCH CLI</span>
        </button>

        <button
          onClick={handleCopyEmail}
          className="flex items-center gap-2 px-4 py-3.5 rounded-xl glass-pill text-white font-mono text-xs uppercase tracking-widest hover:border-emerald-400/50 transition-all cursor-pointer"
          title="Copy Email Address"
        >
          <Copy className="w-4 h-4 text-emerald-400" />
          <span>{copied ? 'COPIED!' : 'COPY EMAIL'}</span>
        </button>
      </div>

      {/* System Benchmarks KPI Dock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl w-full mx-auto pt-8 border-t border-white/10">
        <div className="glass-panel p-4 rounded-xl text-center border border-white/5 hover:border-rose-500/40 transition-all group">
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-rose-500 mb-1 group-hover:scale-105 transition-transform">
            3+
          </div>
          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
            Years Production
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl text-center border border-white/5 hover:border-cyan-400/40 transition-all group">
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1 group-hover:scale-105 transition-transform">
            99.999%
          </div>
          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
            Uptime SLA
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl text-center border border-white/5 hover:border-emerald-400/40 transition-all group">
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1 group-hover:scale-105 transition-transform">
            120 FPS
          </div>
          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
            WebGL Lock
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl text-center border border-white/5 hover:border-purple-400/40 transition-all group">
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-purple-400 mb-1 group-hover:scale-105 transition-transform">
            &lt; 0.8ms
          </div>
          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
            P99 Latency
          </div>
        </div>
      </div>
    </section>
  );
};
