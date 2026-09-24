import React, { useState } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { Code2, ExternalLink, Terminal, Cpu, Layers, Sparkles, Server, Activity } from 'lucide-react';

interface Project {
  id: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  githubUrl: string;
  accentColor: string;
}

const PROJECTS: Project[] = [
  {
    id: 'nexus',
    category: 'Full-Stack & Cloud Architecture',
    title: 'Nexus Cloud Developer Workspace',
    tagline: 'Browser-based cloud IDE with containerized sandbox runtimes',
    description: 'Real-time collaborative developer workspace featuring sub-35ms bi-directional CRDT synchronization via WebSockets, isolated Docker micro-sandboxes, and zero-stutter Monaco multi-file AST parsing.',
    metrics: [
      { label: 'Sync Latency', value: '< 35ms CRDT' },
      { label: 'Sandbox Isolation', value: 'Docker Linux' },
      { label: 'Concurrency', value: '1,000+ rooms' },
    ],
    stack: ['React 19', 'Next.js 15', 'TypeScript', 'WebSockets', 'Docker', 'PostgreSQL'],
    githubUrl: 'https://github.com/mradityasonicse',
    accentColor: '#10b981',
  },
  {
    id: 'pulsestream',
    category: 'Distributed Systems & Telemetry',
    title: 'PulseStream Real-Time Telemetry Engine',
    tagline: 'High-throughput event streaming handling 100,000+ msg/sec',
    description: 'Distributed event streaming pipeline serializing binary Protobuf payloads through Go socket brokers and offloading UI chart rendering to multi-threaded Web Workers for a locked 120 FPS frame budget.',
    metrics: [
      { label: 'Throughput', value: '100,000+ msg/s' },
      { label: 'P99 Latency', value: '0.8ms' },
      { label: 'Frame Consistency', value: 'Locked 120 FPS' },
    ],
    stack: ['Go (Golang)', 'WebSockets', 'Web Workers', 'Redis PubSub', 'Protobuf', 'Canvas 2D'],
    githubUrl: 'https://github.com/mradityasonicse',
    accentColor: '#38bdf8',
  },
  {
    id: 'hyperion',
    category: '3D Graphics & GLSL Shaders',
    title: 'Hyperion Volumetric 3D Raymarcher',
    tagline: 'Procedural raymarched volumetric atmosphere and terrain in pure GLSL',
    description: 'Hardware-accelerated mathematical sphere-tracing raymarcher computing volumetric clouds, signed distance fields (SDF), and Rayleigh/Mie atmospheric scattering without loading external 3D polygon meshes.',
    metrics: [
      { label: 'Asset Footprint', value: '0 MB Mesh' },
      { label: 'GPU Budget', value: '120 FPS 1080p' },
      { label: 'Math Engine', value: 'Pure GLSL SDF' },
    ],
    stack: ['WebGL 2.0', 'Three.js', 'GLSL Shaders', 'Raymarching', 'Linear Algebra'],
    githubUrl: 'https://github.com/mradityasonicse',
    accentColor: '#fbbf24',
  },
  {
    id: 'aura',
    category: 'Distributed Systems & Consensus',
    title: 'Aura Distributed Task Orchestrator',
    tagline: 'Fault-tolerant asynchronous job queue with Raft consensus',
    description: 'High-availability distributed job scheduler implementing Raft leader election, heartbeats, automated node failover, and strict exactly-once task execution guarantees under network partitions.',
    metrics: [
      { label: 'Consensus', value: 'Raft Log Quorum' },
      { label: 'Fault Tolerance', value: '99.999%' },
      { label: 'Protocol', value: 'gRPC / Protobuf' },
    ],
    stack: ['Rust', 'Go', 'gRPC', 'Protobuf', 'Raft Algorithm', 'PostgreSQL'],
    githubUrl: 'https://github.com/mradityasonicse',
    accentColor: '#f43f5e',
  },
  {
    id: 'vector-calligraphy',
    category: 'Web Math & Calligraphy',
    title: 'Vector Calligraphy & Identity Synthesizer',
    tagline: 'Dynamic cubic bezier curve synthesizer with pen-nib physics',
    description: 'Mathematical vector stroke generator animating smooth cursive signatures with dynamic velocity curves, multi-ink shaders, and cryptographic verification seals rendered on hardware-accelerated 2D canvas.',
    metrics: [
      { label: 'Curve Model', value: 'Cubic Bezier' },
      { label: 'Stroke Smoothing', value: 'Quadratic Interpolation' },
      { label: 'Seal Verification', value: 'Cryptographic SVG' },
    ],
    stack: ['SVG Geometry', 'Canvas 2D', 'Bezier Math', 'TypeScript'],
    githubUrl: 'https://github.com/mradityasonicse',
    accentColor: '#c084fc',
  },
  {
    id: 'maritime',
    category: 'Physics & Simulation',
    title: 'Hydrodynamic Maritime Fleet Simulator',
    tagline: 'Zero-GC particle pooling fluid engine with procedural boat wakes',
    description: 'Physics-driven nautical vessel animation engine with pre-allocated object memory pools, procedural dissipative boat wakes, and touch-decoupled 120Hz native momentum scrolling sync.',
    metrics: [
      { label: 'GC Stutter', value: '0ms (Zero-GC)' },
      { label: 'Frame Budget', value: '8.33ms (120 FPS)' },
      { label: 'Particle Pool', value: 'Pre-allocated 500' },
    ],
    stack: ['HTML5 Canvas', 'Object Pooling', 'Fluid Wakes', 'Vector Physics'],
    githubUrl: 'https://github.com/mradityasonicse',
    accentColor: '#60a5fa',
  },
];

export const ProjectShowcase: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => {
        if (filter === 'systems') return p.category.includes('Distributed') || p.category.includes('Consensus');
        if (filter === 'fullstack') return p.category.includes('Full-Stack') || p.category.includes('Calligraphy');
        if (filter === 'graphics') return p.category.includes('Graphics') || p.category.includes('Physics');
        return true;
      });

  const handleFilterChange = (f: string) => {
    setFilter(f);
    soundEngine.playRadarPing();
  };

  return (
    <section id="projects" className="relative py-28 px-6 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-rose-400 uppercase tracking-widest mb-3">
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            <span>PRODUCTION ARTIFACTS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-cyan-400">Masterpieces</span>
          </h2>
        </div>
        <p className="font-body text-slate-300 text-sm sm:text-base max-w-md font-light leading-relaxed">
          High-performance distributed systems, real-time streaming engines, and WebGL raymarchers built with zero-compromise architectural standards.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-10 p-1.5 rounded-2xl glass-panel border border-white/10 w-fit">
        {[
          { id: 'all', label: 'All Artifacts' },
          { id: 'systems', label: 'Distributed Systems' },
          { id: 'fullstack', label: 'Full-Stack Cloud' },
          { id: 'graphics', label: '3D & Graphics' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleFilterChange(tab.id)}
            className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-rose-500 text-white font-bold shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bento Grid (3-column on large displays) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="glass-panel p-7 rounded-3xl border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 shadow-2xl relative overflow-hidden"
          >
            {/* Top Glow Accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-1 opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ background: project.accentColor }}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                  {project.category}
                </span>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  title="View Source Code"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {project.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-6">
                {project.description}
              </p>
            </div>

            <div>
              {/* Metrics Pill Grid */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3.5 mb-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-[10px]">
                {project.metrics.map(m => (
                  <div key={m.label} className="text-center">
                    <span className="text-slate-400 block mb-0.5 truncate">{m.label}</span>
                    <span className="text-white font-bold truncate block">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Stack Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                {project.stack.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded font-mono text-[10px] text-white/80 bg-white/5 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
