import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { 
  Search, 
  Terminal, 
  Layers, 
  Cpu, 
  BarChart3, 
  Mail, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  ExternalLink,
  X,
  Compass
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (targetId: string) => void;
}

interface CommandItem {
  id: string;
  category: 'NAVIGATION' | 'SYSTEM ACTIONS' | 'EXTERNAL LINKS';
  title: string;
  description: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAction = (cb: () => void) => {
    soundEngine.playRadarPing();
    cb();
    onClose();
  };

  const handleCopy = () => {
    soundEngine.playMechanicalClick();
    navigator.clipboard.writeText('adityasoni.work@gmail.com');
    alert('Email copied: adityasoni.work@gmail.com');
  };

  const commands: CommandItem[] = [
    {
      id: 'nav-hero',
      category: 'NAVIGATION',
      title: 'Jump to System Core (Hero)',
      description: 'Quantum Reactor Core & Mission Statement',
      shortcut: '1',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => onNavigate('hero')
    },
    {
      id: 'nav-arch',
      category: 'NAVIGATION',
      title: 'Explore Architecture Topology',
      description: 'Multi-Region Mesh, Kafka Pipelines & Sub-10ms Ledger',
      shortcut: '2',
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      action: () => onNavigate('architecture')
    },
    {
      id: 'nav-projects',
      category: 'NAVIGATION',
      title: 'Inspect Production Bento Case Studies',
      description: 'Nexus Cloud, PulseStream, Hyperion, Maritime AI',
      shortcut: '3',
      icon: <Layers className="w-4 h-4 text-sky-400" />,
      action: () => onNavigate('projects')
    },
    {
      id: 'nav-benchmarks',
      category: 'NAVIGATION',
      title: 'Empirical Latency Benchmarks',
      description: 'Sub-millisecond p99 metrics & cache speedup comparisons',
      shortcut: '4',
      icon: <BarChart3 className="w-4 h-4 text-emerald-400" />,
      action: () => onNavigate('benchmarks')
    },
    {
      id: 'nav-terminal',
      category: 'NAVIGATION',
      title: 'Launch Interactive UNIX Shell',
      description: 'Execute guest@architect:~$ terminal commands and scripts',
      shortcut: '5',
      icon: <Terminal className="w-4 h-4 text-amber-400" />,
      action: () => onNavigate('terminal')
    },
    {
      id: 'nav-contact',
      category: 'NAVIGATION',
      title: 'Establish Comm-Link Uplink',
      description: 'Transmit encrypted message or consultation request',
      shortcut: '6',
      icon: <Mail className="w-4 h-4 text-rose-400" />,
      action: () => onNavigate('contact')
    },
    {
      id: 'act-warp',
      category: 'SYSTEM ACTIONS',
      title: 'Trigger Hyperdrive Warp Jump',
      description: 'Engage audio-visual warp speed trajectory surge',
      shortcut: 'W',
      icon: <Sparkles className="w-4 h-4 text-amber-300" />,
      action: () => {
        soundEngine.playWarpSpeed();
        window.dispatchEvent(new CustomEvent('warp-speed-triggered'));
      }
    },
    {
      id: 'act-drone',
      category: 'SYSTEM ACTIONS',
      title: 'Toggle Ambient Reactor Drone',
      description: '55Hz synthesized sub-bass audio oscillator',
      shortcut: 'M',
      icon: soundEngine.isDronePlaying() ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        soundEngine.toggleDrone();
      }
    },
    {
      id: 'act-copy',
      category: 'SYSTEM ACTIONS',
      title: 'Copy Direct Email Address',
      description: 'adityasoni.work@gmail.com',
      shortcut: 'C',
      icon: <Copy className="w-4 h-4 text-cyan-400" />,
      action: handleCopy
    },
    {
      id: 'ext-github',
      category: 'EXTERNAL LINKS',
      title: 'Open GitHub Profile',
      description: 'github.com/mradityasonicse',
      icon: <ExternalLink className="w-4 h-4 text-slate-400" />,
      action: () => window.open('https://github.com/mradityasonicse', '_blank')
    },
    {
      id: 'ext-linkedin',
      category: 'EXTERNAL LINKS',
      title: 'Open LinkedIn Profile',
      description: 'linkedin.com/in/mradityasoni',
      icon: <ExternalLink className="w-4 h-4 text-slate-400" />,
      action: () => window.open('https://linkedin.com/in/mradityasoni', '_blank')
    }
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      soundEngine.playMechanicalClick();
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        soundEngine.playMechanicalClick();
        setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        soundEngine.playMechanicalClick();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleAction(filteredCommands[selectedIndex].action);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-4 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, navigate sections, or jump anywhere..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
              soundEngine.playMechanicalClick();
            }}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base font-mono focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-sm">
              <Compass className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-spin" />
              No matching directives located in command directory.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleAction(cmd.action)}
                  onMouseEnter={() => {
                    setSelectedIndex(idx);
                    soundEngine.playMechanicalClick();
                  }}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-white'
                      : 'hover:bg-slate-800/50 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20' : 'bg-slate-800/80'}`}>
                      {cmd.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium font-mono flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {cmd.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{cmd.description}</div>
                    </div>
                  </div>

                  {cmd.shortcut && (
                    <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-300">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hotkey Legend */}
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">ENTER</kbd> select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">ESC</kbd> dismiss</span>
          </div>
          <span className="hidden sm:inline text-cyan-400/80">⌘K ARCHITECTURAL PALETTE</span>
        </div>
      </div>
    </div>
  );
};
