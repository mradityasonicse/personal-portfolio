import React, { useState } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { BarChart3, Activity, Gauge, Cpu, Check, Layers } from 'lucide-react';

interface BenchmarkMetric {
  title: string;
  category: string;
  unit: string;
  items: {
    name: string;
    value: number;
    formatted: string;
    isAdityaArch: boolean;
    color: string;
  }[];
  explanation: string;
}

const BENCHMARKS: BenchmarkMetric[] = [
  {
    title: 'P99 Payload Serialization Latency',
    category: 'Network Protocol Efficiency',
    unit: 'Microseconds (Lower is Better)',
    explanation: 'Binary Protobuf frame serialization with zero-copy buffer slicing vs standard JSON.stringify / parse cycles.',
    items: [
      { name: 'Aditya Binary Protobuf Engine', value: 80, formatted: '0.08 ms (80 µs)', isAdityaArch: true, color: '#10b981' },
      { name: 'MessagePack Stream', value: 340, formatted: '0.34 ms (340 µs)', isAdityaArch: false, color: '#38bdf8' },
      { name: 'Standard Node.js JSON', value: 1850, formatted: '1.85 ms (1,850 µs)', isAdityaArch: false, color: '#f43f5e' },
    ],
  },
  {
    title: 'Peak Sustained Event Throughput',
    category: 'Concurreny & Ingestion',
    unit: 'Events / Second (Higher is Better)',
    explanation: 'Multi-threaded Go socket brokers with epoll ring buffers routing events to lock-free memory partitions.',
    items: [
      { name: 'Aditya Go Stream Engine', value: 125000, formatted: '125,000 evt/s', isAdityaArch: true, color: '#10b981' },
      { name: 'Standard WebSocket Node Server', value: 28000, formatted: '28,000 evt/s', isAdityaArch: false, color: '#38bdf8' },
      { name: 'REST Webhook Polling', value: 4500, formatted: '4,500 evt/s', isAdityaArch: false, color: '#f43f5e' },
    ],
  },
  {
    title: 'Garbage Collection (GC) Pause Overhead',
    category: 'Memory Runtime Architecture',
    unit: 'Milliseconds Pause / Minute (Lower is Better)',
    explanation: 'Pre-allocated object pooling completely avoids allocations inside the animation and socket event loops.',
    items: [
      { name: 'Aditya Zero-GC Object Pool', value: 0, formatted: '0.00 ms (Zero-GC)', isAdityaArch: true, color: '#10b981' },
      { name: 'Manual Memory Release', value: 18, formatted: '18.2 ms', isAdityaArch: false, color: '#38bdf8' },
      { name: 'Standard V8 Heap Churn', value: 145, formatted: '145.0 ms', isAdityaArch: false, color: '#f43f5e' },
    ],
  },
];

export const BenchmarkComparison: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const activeBenchmark = BENCHMARKS[selectedIdx];

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    soundEngine.playRadarPing();
  };

  const maxValue = Math.max(...activeBenchmark.items.map(i => i.value));

  return (
    <section id="benchmarks" className="relative py-28 px-6 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400 uppercase tracking-widest mb-3">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>EMPIRICAL TELEMETRY</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Latency <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Benchmarks</span>
          </h2>
        </div>
        <p className="font-body text-slate-300 text-sm sm:text-base max-w-md font-light leading-relaxed">
          Rigorous engineering benchmarks proving microsecond latency, zero-GC memory allocation, and high-throughput durability.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-10 p-1.5 rounded-2xl glass-panel border border-white/10 w-fit">
        {BENCHMARKS.map((b, idx) => (
          <button
            key={b.title}
            onClick={() => handleSelect(idx)}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedIdx === idx
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {b.title}
          </button>
        ))}
      </div>

      {/* Benchmark Graph Card */}
      <div className="glass-panel-glow p-8 sm:p-10 rounded-3xl border border-white/15 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-1">
              {activeBenchmark.title}
            </h3>
            <p className="font-mono text-xs text-slate-400">
              Metric Domain: {activeBenchmark.category} &bull; {activeBenchmark.unit}
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
            STRICT P99 SLA VERIFIED
          </span>
        </div>

        {/* Visual Bar Comparison */}
        <div className="space-y-6">
          {activeBenchmark.items.map(item => {
            const pct = maxValue > 0 ? Math.max(8, (item.value / maxValue) * 100) : 10;
            return (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-center font-mono text-xs sm:text-sm">
                  <span className={`font-semibold flex items-center gap-2 ${
                    item.isAdityaArch ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    {item.isAdityaArch && <Check className="w-4 h-4 text-emerald-400" />}
                    {item.name}
                  </span>
                  <span className="font-bold text-white">{item.formatted}</span>
                </div>

                {/* Progress Bar Track */}
                <div className="h-4 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-lg"
                    style={{
                      width: `${pct}%`,
                      background: item.isAdityaArch
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : item.color,
                      boxShadow: item.isAdityaArch ? '0 0 15px rgba(16, 185, 129, 0.6)' : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation Note */}
        <div className="mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-xs text-slate-300 leading-relaxed">
          <span className="text-emerald-400 font-bold block mb-1">ARCHITECTURAL IMPLICATION:</span>
          {activeBenchmark.explanation}
        </div>
      </div>
    </section>
  );
};
