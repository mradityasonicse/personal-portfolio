import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CinematicThreeCanvas } from './components/3d/CinematicThreeCanvas';
import { CinematicHUD } from './components/hud/CinematicHUD';
import { CinematicAtmosphere } from './components/atmosphere/CinematicAtmosphere';
import { HeroSection } from './components/sections/HeroSection';
import { ArchitectureVisualizer } from './components/sections/ArchitectureVisualizer';
import { ProjectShowcase } from './components/sections/ProjectShowcase';
import { BenchmarkComparison } from './components/sections/BenchmarkComparison';
import { TerminalSection } from './components/sections/TerminalSection';
import { ContactSection } from './components/sections/ContactSection';
import { CommandPalette } from './components/modals/CommandPalette';
import { soundEngine } from './audio/soundEngine';
import { ChevronUp, ShieldCheck, Terminal, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Global Command Palette Shortcut (⌘K or Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  const handleNavigate = (targetId: string) => {
    soundEngine.playRadarPing();
    const element = document.getElementById(targetId);
    if (element) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(element, { offset: -40, duration: 1.4 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollToTop = () => {
    soundEngine.playMechanicalClick();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans">
      {/* 3D WebGL Background Canvas */}
      <CinematicThreeCanvas />

      {/* Atmospheric overlays (Film grain, Scanlines, Mouse Spotlight, Vignette) */}
      <CinematicAtmosphere />

      {/* HUD Telemetry Overlay (Vector readings, Audio Visualizer, Warp button, FPS counter) */}
      <CinematicHUD 
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} 
        onScrollToTerminal={() => handleNavigate('terminal')}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Main Narrative Flow */}
      <main className="relative z-10 space-y-12">
        <HeroSection 
          onExploreProjects={() => handleNavigate('projects')}
          onOpenTerminal={() => handleNavigate('terminal')}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
        <ArchitectureVisualizer />
        <ProjectShowcase />
        <BenchmarkComparison />
        <TerminalSection />
        <ContactSection />
      </main>

      {/* Cinematic Sci-Fi Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl py-12 px-4 sm:px-8 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-bold font-mono tracking-wider text-slate-100">
                ADITYA SONI // SYSTEMS ARCHITECT
              </span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-xs font-mono text-slate-400">
              BUILD: REV-2026.09-PROD • ALL SYSTEMS STABLE
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>SOC2 Type II • Zero Vulnerabilities</span>
            </div>

            <button
              onClick={handleScrollToTop}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-cyan-400 transition-all flex items-center gap-2 text-xs font-mono group"
              title="Return to Core"
            >
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>RETURN TO CORE</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900/90 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-3">
          <p>
            ENGINEERED WITH REACT 19, THREE.JS, TAILWIND V4, GSAP & WEB AUDIO API.
          </p>
          <div className="flex items-center gap-1.5">
            <span>Designed with precision</span>
            <span className="text-cyan-400">•</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
