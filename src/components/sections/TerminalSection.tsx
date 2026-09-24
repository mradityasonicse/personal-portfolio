import React, { useState, useRef, useEffect } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { Terminal as TerminalIcon, Sparkles, CornerDownLeft, Maximize2, Minimize2 } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  content: string | React.ReactNode;
}

export const TerminalSection: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      content: 'Kernel v6.12.4-aditya-rt initialized. Microsecond clock lock: OK [0.000000]',
    },
    {
      id: 'init-2',
      type: 'system',
      content: 'Welcome to Aditya Soni UNIX System Shell. Type "help" for executable directives.',
    },
  ]);

  const [commandIndex, setCommandIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const executeCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    soundEngine.playKeyClick();
    const parts = raw.split(' ');
    const command = parts[0].toLowerCase();

    const newHistory: TerminalLine[] = [
      ...history,
      { id: `${Date.now()}-in`, type: 'input', content: raw },
    ];

    setCommandHistory(prev => [...prev, raw]);
    setCommandIndex(-1);

    switch (command) {
      case 'help':
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          content: (
            <div className="space-y-1 font-mono text-xs">
              <div className="text-cyan-400 font-bold">AVAILABLE SYSTEM COMMANDS:</div>
              <div><span className="text-emerald-400 font-bold">help</span> — Display this directive directory</div>
              <div><span className="text-emerald-400 font-bold">cat bio.md</span> — Print engineering biography &amp; education history</div>
              <div><span className="text-emerald-400 font-bold">architecture</span> — Output distributed topology specs</div>
              <div><span className="text-emerald-400 font-bold">benchmarks</span> — Inspect real-time P99 latency guarantees</div>
              <div><span className="text-emerald-400 font-bold">skills</span> — Enumerate technical capabilities matrix</div>
              <div><span className="text-emerald-400 font-bold">projects</span> — List production repository artifacts</div>
              <div><span className="text-emerald-400 font-bold">curl /metrics</span> — Query Prometheus Prometheus telemetry frame</div>
              <div><span className="text-emerald-400 font-bold">warp</span> — Trigger WebGL 3D hyperdrive jump</div>
              <div><span className="text-emerald-400 font-bold">clear</span> — Purge terminal history</div>
            </div>
          ),
        });
        break;

      case 'cat':
        if (parts[1] === 'bio.md') {
          newHistory.push({
            id: `${Date.now()}-out`,
            type: 'output',
            content: (
              <div className="space-y-2 font-mono text-xs text-slate-200">
                <div className="text-rose-400 font-bold">ADITYA SONI // PRINCIPAL SYSTEMS ARCHITECT</div>
                <p>
                  High-concurrency systems engineer and full-stack developer specializing in microsecond-latency network protocols, distributed consensus algorithms (Raft), reactive TypeScript frontends, and GPU-driven WebGL interfaces.
                </p>
                <div className="pt-2 text-cyan-300 font-semibold">ACADEMIC &amp; ENGINEERING CREDENTIALS:</div>
                <div>&bull; <strong className="text-white">B.Tech CSE Core (2026–2030)</strong> at Rungta International Skills University (RISU)</div>
                <div>&bull; <strong className="text-white">Class 12th Senior Secondary</strong>: 80% Overall Aggregate (PCM Specialization)</div>
                <div>&bull; <strong className="text-white">Class 10th Secondary</strong>: 92% Overall Aggregate (Academic Distinction)</div>
              </div>
            ),
          });
        } else {
          newHistory.push({
            id: `${Date.now()}-err`,
            type: 'error',
            content: `cat: ${parts[1] || ''}: File not found. Try "cat bio.md"`,
          });
        }
        break;

      case 'architecture':
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          content: (
            <div className="space-y-1 font-mono text-xs text-cyan-300">
              <div>[TOPOLOGY]: Multi-Region Active-Active Envoy Mesh</div>
              <div>[CONSENSUS]: Raft State Machine Quorum (3 Nodes)</div>
              <div>[PROTOCOL]: gRPC + Protobuf binary frames</div>
              <div>[FAILOVER]: Automatic heartbeat election (&lt; 200ms)</div>
              <div>[ISOLATION]: Docker micro-sandboxes with cgroups v2</div>
            </div>
          ),
        });
        break;

      case 'benchmarks':
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          content: (
            <div className="space-y-1 font-mono text-xs">
              <div>&bull; Binary Protobuf Serialization: <span className="text-emerald-400 font-bold">0.08ms</span></div>
              <div>&bull; Go Event Socket Throughput: <span className="text-emerald-400 font-bold">125,000 evt/s</span></div>
              <div>&bull; Zero-GC Memory Pool Pause: <span className="text-emerald-400 font-bold">0.00ms</span></div>
              <div>&bull; WebGL Render Loop Budget: <span className="text-emerald-400 font-bold">8.33ms (120 FPS)</span></div>
            </div>
          ),
        });
        break;

      case 'skills':
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          content: (
            <div className="space-y-1 font-mono text-xs text-slate-300">
              <div><strong className="text-rose-400">Distributed Systems:</strong> Go, Rust, Raft Consensus, gRPC, Protobuf, Kafka, Redis</div>
              <div><strong className="text-cyan-400">Web Core:</strong> React 19, TypeScript, Next.js 15, WebSockets, Web Workers, Vite</div>
              <div><strong className="text-amber-400">3D Graphics:</strong> WebGL 2.0, Three.js, GLSL Shaders, Raymarching, Linear Algebra</div>
              <div><strong className="text-emerald-400">Infrastructure:</strong> Docker, PostgreSQL, CockroachDB, Linux, CI/CD, Git</div>
            </div>
          ),
        });
        break;

      case 'projects':
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          content: (
            <div className="space-y-1 font-mono text-xs">
              <div>1. <span className="text-white font-bold">Nexus Cloud Workspace</span> — Containerized multi-file browser IDE</div>
              <div>2. <span className="text-white font-bold">PulseStream Engine</span> — 100k msg/s binary WebSocket broker</div>
              <div>3. <span className="text-white font-bold">Hyperion 3D Raymarcher</span> — Volumetric atmosphere rendered in GLSL</div>
              <div>4. <span className="text-white font-bold">Aura Orchestrator</span> — Distributed job queue with Raft consensus</div>
            </div>
          ),
        });
        break;

      case 'curl':
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          content: (
            <div className="font-mono text-xs text-slate-400 space-y-0.5">
              <div># HELP http_requests_total Total number of HTTP requests made.</div>
              <div># TYPE http_requests_total counter</div>
              <div>http_requests_total&#123;handler="/ws/stream",status="200"&#125; 14829104</div>
              <div># HELP p99_latency_seconds Latency percentile 99.</div>
              <div>p99_latency_seconds&#123;cluster="us-east-1"&#125; 0.0008</div>
              <div># HELP active_websocket_connections Active bi-directional sockets.</div>
              <div>active_websocket_connections 10240</div>
            </div>
          ),
        });
        break;

      case 'warp':
        soundEngine.playWarpSurge();
        window.dispatchEvent(new CustomEvent('trigger-warp-surge'));
        newHistory.push({
          id: `${Date.now()}-out`,
          type: 'output',
          content: <span className="text-yellow-400 font-bold">HYPERDRIVE WARP ACCELERATION ENGAGED [16.0x SPEED]</span>,
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({
          id: `${Date.now()}-err`,
          type: 'error',
          content: `Command not recognized: "${raw}". Type "help" for system directives.`,
        });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    soundEngine.playKeyClick();

    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = commandIndex === -1 ? commandHistory.length - 1 : Math.max(0, commandIndex - 1);
        setCommandIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandIndex !== -1) {
        const nextIdx = commandIndex + 1;
        if (nextIdx >= commandHistory.length) {
          setCommandIndex(-1);
          setInputVal('');
        } else {
          setCommandIndex(nextIdx);
          setInputVal(commandHistory[nextIdx]);
        }
      }
    }
  };

  return (
    <section id="terminal" className="relative py-28 px-6 max-w-5xl mx-auto z-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-rose-400 uppercase tracking-widest mb-3">
          <TerminalIcon className="w-3.5 h-3.5 text-rose-500" />
          <span>UNIX CLI SHELL</span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-cyan-400">Sandbox</span>
        </h2>
      </div>

      {/* Terminal Window Frame */}
      <div
        className="glass-panel-glow rounded-3xl border border-white/20 shadow-2xl overflow-hidden cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Title Bar */}
        <div className="bg-black/60 px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 font-mono text-xs text-slate-400 font-semibold">
              guest@aditya-systems:~ (x86_64)
            </span>
          </div>
          <div className="font-mono text-[10px] text-slate-500">
            TTY: /dev/pts/0 &bull; UTF-8
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-xs sm:text-sm min-h-[360px] max-h-[480px] overflow-y-auto space-y-3 bg-black/75">
          {history.map(line => (
            <div key={line.id} className="leading-relaxed">
              {line.type === 'input' && (
                <div className="flex items-center gap-2 text-white">
                  <span className="text-rose-500 font-bold">guest@architect:~$</span>
                  <span>{line.content}</span>
                </div>
              )}
              {line.type === 'output' && (
                <div className="text-slate-300 pl-4 border-l border-white/10 my-1">
                  {line.content}
                </div>
              )}
              {line.type === 'system' && (
                <div className="text-cyan-400/90 text-xs">
                  {line.content}
                </div>
              )}
              {line.type === 'error' && (
                <div className="text-rose-400 pl-4 border-l border-rose-500/50">
                  {line.content}
                </div>
              )}
            </div>
          ))}

          {/* Prompt Input Line */}
          <div className="flex items-center gap-2 text-white pt-2">
            <span className="text-rose-500 font-bold shrink-0">guest@architect:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm w-full p-0 focus:ring-0"
              placeholder="Type 'help' or 'cat bio.md'..."
              autoFocus
            />
          </div>
          <div ref={bottomRef} />
        </div>

        {/* Quick Command Suggestions Pill Dock */}
        <div className="bg-black/50 p-3 px-5 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-slate-400">TRY:</span>
          {['help', 'cat bio.md', 'architecture', 'benchmarks', 'skills', 'warp', 'clear'].map(cmd => (
            <button
              key={cmd}
              onClick={(e) => {
                e.stopPropagation();
                executeCommand(cmd);
              }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-mono text-[10px] transition-colors border border-white/5 cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
