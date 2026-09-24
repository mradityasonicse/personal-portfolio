import React, { useState } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { Network, Server, Database, Shield, Zap, Radio, CheckCircle, RefreshCw } from 'lucide-react';

interface TopologyPreset {
  id: string;
  name: string;
  tagline: string;
  p99Latency: string;
  throughput: string;
  consensus: string;
  nodes: {
    id: string;
    label: string;
    role: string;
    status: string;
    latency: string;
    load: string;
    tech: string;
  }[];
}

const PRESETS: TopologyPreset[] = [
  {
    id: 'active-active',
    name: 'Multi-Region Active-Active Mesh',
    tagline: 'Dual-datacenter synchronization with Raft quorum and zero downtime failover',
    p99Latency: '1.2ms',
    throughput: '120k req/sec',
    consensus: 'Raft Log Quorum',
    nodes: [
      { id: 'gw-us', label: 'Edge Envoy Gateway (US-East)', role: 'Ingress & TLS Termination', status: 'HEALTHY', latency: '0.4ms', load: '42%', tech: 'Rust / Envoy' },
      { id: 'gw-eu', label: 'Edge Envoy Gateway (EU-West)', role: 'Ingress & TLS Termination', status: 'HEALTHY', latency: '0.6ms', load: '38%', tech: 'Rust / Envoy' },
      { id: 'raft-leader', label: 'Consensus Coordinator (Node 1)', role: 'Leader Election & Heartbeat', status: 'LEADER', latency: '0.2ms', load: '65%', tech: 'Go / gRPC' },
      { id: 'raft-f1', label: 'Consensus Replicator (Node 2)', role: 'Follower Quorum State', status: 'REPLICATING', latency: '0.5ms', load: '51%', tech: 'Go / Raft' },
      { id: 'db-cluster', label: 'Distributed Sharded Storage', role: 'CockroachDB Raft Engine', status: 'SYNCHRONIZED', latency: '1.2ms', load: '58%', tech: 'CockroachDB' },
    ],
  },
  {
    id: 'streaming',
    name: 'Event-Driven Streaming Lakehouse',
    tagline: 'High-throughput append-only distributed log with Protobuf serialization',
    p99Latency: '0.8ms',
    throughput: '350k events/sec',
    consensus: 'Kafka KRaft Cluster',
    nodes: [
      { id: 'stream-ingest', label: 'Binary Socket Ingestion Gate', role: 'Protobuf Byte Deserializer', status: 'ACTIVE', latency: '0.2ms', load: '72%', tech: 'Go / WebSockets' },
      { id: 'kafka-broker-1', label: 'Kafka Log Partition Broker 01', role: 'Leader Partition Ingestion', status: 'PARTITION LEADER', latency: '0.8ms', load: '68%', tech: 'Apache Kafka' },
      { id: 'kafka-broker-2', label: 'Kafka Log Partition Broker 02', role: 'Replicated ISR Follower', status: 'IN-SYNC', latency: '0.9ms', load: '64%', tech: 'Apache Kafka' },
      { id: 'flink-engine', label: 'Stateful Stream Processing Engine', role: 'Windowed Aggregations & CEP', status: 'PROCESSING', latency: '1.4ms', load: '80%', tech: 'Apache Flink' },
      { id: 'storage-sink', label: 'Real-Time Columnar Vector Sink', role: 'Parquet / Iceberg Storage', status: 'COMMITTED', latency: '2.1ms', load: '45%', tech: 'Apache Iceberg' },
    ],
  },
  {
    id: 'trading-mesh',
    name: 'Sub-10ms High-Frequency Trading Mesh',
    tagline: 'Zero-GC memory pooling and kernel-bypass network blitting for instant execution',
    p99Latency: '0.04ms',
    throughput: '500k orders/sec',
    consensus: 'LMAX Disruptor Ring',
    nodes: [
      { id: 'fix-parser', label: 'FIX 4.4 Protocol Engine', role: 'Zero-Allocation Byte Unpacker', status: 'ULTRA-LOW LATENCY', latency: '0.02ms', load: '32%', tech: 'C++ / SIMD' },
      { id: 'order-book', label: 'In-Memory Limit Order Book', role: 'Lock-Free Ring Buffer Matching', status: 'CORE MATCH', latency: '0.04ms', load: '54%', tech: 'Rust / Atomic' },
      { id: 'risk-engine', label: 'Pre-Trade Risk Validator', role: 'Deterministic Bounds Verification', status: 'CHECK VERIFIED', latency: '0.03ms', load: '48%', tech: 'Rust' },
      { id: 'drop-copy', label: 'Multicast Drop Copy Broadcaster', role: 'UDP Multicast Market Data', status: 'STREAMING', latency: '0.05ms', load: '60%', tech: 'Solarflare OpenOnload' },
    ],
  },
];

export const ArchitectureVisualizer: React.FC = () => {
  const [activePresetId, setActivePresetId] = useState<string>('active-active');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('raft-leader');

  const activePreset = PRESETS.find(p => p.id === activePresetId) || PRESETS[0];
  const selectedNode = activePreset.nodes.find(n => n.id === selectedNodeId) || activePreset.nodes[0];

  const handleSelectPreset = (id: string) => {
    setActivePresetId(id);
    const preset = PRESETS.find(p => p.id === id);
    if (preset && preset.nodes.length > 0) {
      setSelectedNodeId(preset.nodes[0].id);
    }
    soundEngine.playRadarPing();
  };

  const handleSelectNode = (id: string) => {
    setSelectedNodeId(id);
    soundEngine.playKeyClick();
  };

  return (
    <section id="architecture" className="relative py-28 px-6 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>DISTRIBUTED SYSTEMS VISUALIZER</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Topology <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Sandbox</span>
          </h2>
        </div>
        <p className="font-body text-slate-300 text-sm sm:text-base max-w-md font-light leading-relaxed">
          Inspect production-proven distributed network topologies, consensus engines, and real-time latency bottlenecks.
        </p>
      </div>

      {/* Preset Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-8 p-1.5 rounded-2xl glass-panel border border-white/10 w-fit">
        {PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset.id)}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activePresetId === preset.id
                ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-bold shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Topology Canvas & Node Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Node Map */}
        <div className="lg:col-span-7 glass-panel-glow p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-1">
                  {activePreset.name}
                </h3>
                <p className="font-mono text-xs text-slate-400">
                  {activePreset.tagline}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider bg-rose-500/15 border border-rose-500/30 text-rose-400 font-semibold">
                {activePreset.consensus}
              </span>
            </div>

            {/* Interactive Node List */}
            <div className="space-y-3">
              {activePreset.nodes.map((node, index) => {
                const isSelected = node.id === selectedNode.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleSelectNode(node.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-white/10 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/10 text-white/70'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {node.label}
                        </div>
                        <div className="font-mono text-xs text-slate-400">
                          {node.role}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {node.latency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10 font-mono text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">P99 TARGET:</span>
              <span className="text-rose-400 font-bold text-base">{activePreset.p99Latency}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">PEAK THROUGHPUT:</span>
              <span className="text-emerald-400 font-bold text-base">{activePreset.throughput}</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Node Telemetry Inspector */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-rose-400 uppercase tracking-widest mb-4">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>NODE TELEMETRY INSPECTOR</span>
            </div>

            <h4 className="font-display text-2xl font-bold text-white mb-2">
              {selectedNode.label}
            </h4>
            <p className="font-mono text-xs text-slate-400 mb-6">
              Assigned Function: {selectedNode.role}
            </p>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">STATUS:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {selectedNode.status}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">LATENCY BUDGET:</span>
                <span className="text-rose-400 font-bold">{selectedNode.latency}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">CPU UTILIZATION:</span>
                <span className="text-cyan-400 font-bold">{selectedNode.load}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">TECHNOLOGY STACK:</span>
                <span className="text-white font-semibold">{selectedNode.tech}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300">
            <span className="font-bold block mb-1">ARCHITECTURAL GUARANTEE:</span>
            Sub-millisecond serialization, atomic memory alignment, and automatic failover isolation tested under peak chaos injection.
          </div>
        </div>
      </div>
    </section>
  );
};
