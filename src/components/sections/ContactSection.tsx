import React, { useState } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { 
  Send, 
  Terminal, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Mail, 
  MapPin, 
  Cpu
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    callsign: '',
    frequency: '',
    protocol: 'Architectural Consultation',
    payload: ''
  });
  const [copied, setCopied] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);

  const handleCopyEmail = () => {
    soundEngine.playMechanicalClick();
    navigator.clipboard.writeText('adityasoni.work@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInputChange = (field: string, value: string) => {
    soundEngine.playMechanicalClick();
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.frequency || !formData.payload) return;

    soundEngine.playRadarPing();
    setIsTransmitting(true);

    // Simulate high-throughput cryptographic transmission sequence
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmissionSuccess(true);
      soundEngine.playWarpSpeed();

      // Trigger confetti if available
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#06b6d4', '#6366f1', '#10b981']
          });
        }).catch(() => {});
      }

      setTimeout(() => {
        setFormData({ callsign: '', frequency: '', protocol: 'Architectural Consultation', payload: '' });
        setTransmissionSuccess(false);
      }, 5000);
    }, 1200);
  };

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>ESTABLISH SECURE COMM-LINK</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
          Initiate <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Transmission</span>
        </h2>
        <p className="max-w-2xl text-slate-400 text-base sm:text-lg">
          Currently booking high-scale distributed systems architecture, full-stack WebGL engineering, and Staff/Senior engineering leadership missions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Uplink Card & System Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Frequency Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono text-cyan-400 tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                DIRECT FREQUENCY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                P-256 TLS 1.3
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-mono">PRIMARY INBOX</span>
                <div className="mt-1 flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                  <span className="text-sm sm:text-base font-mono text-slate-100 select-all">
                    adityasoni.work@gmail.com
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors flex items-center gap-1.5 text-xs font-mono"
                    title="Copy Email Address"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-mono">LOCATION NODE</span>
                <div className="mt-1 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm font-mono text-slate-200">
                    New Delhi, India (IST / UTC+5:30) • Remote Worldwide
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Array Links */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-400 mb-3 block">TELEMETRY & CODE REPOSITORIES</span>
              <div className="grid grid-cols-3 gap-2.5">
                <a
                  href="https://github.com/mradityasonicse"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundEngine.playMechanicalClick()}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all flex flex-col items-center justify-center text-center gap-1.5 group/link"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover/link:text-cyan-400 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span className="text-[11px] font-mono text-slate-300">GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/mradityasoni"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundEngine.playMechanicalClick()}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all flex flex-col items-center justify-center text-center gap-1.5 group/link"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover/link:text-cyan-400 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 0 0 1.69-1.69c0-.93-.76-1.69-1.69-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.69 1.69 1.69m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                  </svg>
                  <span className="text-[11px] font-mono text-slate-300">LinkedIn</span>
                </a>
                <a
                  href="mailto:adityasoni.work@gmail.com"
                  onClick={() => soundEngine.playMechanicalClick()}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all flex flex-col items-center justify-center text-center gap-1.5 group/link"
                >
                  <Mail className="w-4 h-4 text-slate-400 group-hover/link:text-cyan-400" />
                  <span className="text-[11px] font-mono text-slate-300">Direct RF</span>
                </a>
              </div>
            </div>
          </div>

          {/* Encryption Integrity Badge */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Tracking • Non-Leaking Headers</span>
            </div>
            <span className="text-[10px] text-emerald-400">ACTIVE</span>
          </div>
        </div>

        {/* Right Column: Interactive Uplink Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl relative space-y-6"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-300 tracking-wider">
                  COMM-UPLINK v4.9.2 // TRANSMISSION BUFFER
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  OPERATOR / CALLSIGN
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commander Sarah Chen"
                  value={formData.callsign}
                  onChange={(e) => handleInputChange('callsign', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  RETURN FREQUENCY (EMAIL)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@enterprise.io"
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                MISSION PROTOCOL
              </label>
              <select
                value={formData.protocol}
                onChange={(e) => handleInputChange('protocol', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 text-sm font-mono transition-colors cursor-pointer"
              >
                <option value="Architectural Consultation">Distributed Architecture Consultation</option>
                <option value="High-Throughput Full-Stack Project">Full-Scale WebGL / Next-Gen Frontend</option>
                <option value="Staff/Senior Engineering Lead">Full-Time Staff / Lead Engineering Role</option>
                <option value="Advisory & Code Review">Technical Advisory / Performance Audit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                PAYLOAD (MESSAGE & SPECIFICATION)
              </label>
              <textarea
                rows={4}
                required
                placeholder="Detail system requirements, scale targets, engineering timeline, or technical inquiry..."
                value={formData.payload}
                onChange={(e) => handleInputChange('payload', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm font-mono transition-colors resize-none"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isTransmitting || transmissionSuccess}
              className={`w-full py-4 rounded-xl font-mono text-sm uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2.5 shadow-lg ${
                transmissionSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/25'
                  : isTransmitting
                  ? 'bg-cyan-700 text-white cursor-wait'
                  : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-[0.99]'
              }`}
            >
              {transmissionSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  <span>TRANSMISSION BROADCAST SUCCESSFUL</span>
                </>
              ) : isTransmitting ? (
                <>
                  <Cpu className="w-5 h-5 animate-spin" />
                  <span>MODULATING CARRIER SIGNAL...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT ENCRYPTED PACKET</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
