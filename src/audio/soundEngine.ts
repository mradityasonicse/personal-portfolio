/**
 * Web Audio API Generative Sound Engine
 * Zero external MP3/WAV dependencies. Pure programmatic synthesis.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  
  // Ambient Drone State
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private isDroneActive = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  /**
   * 55Hz Sub-Bass Ambient Reactor Drone with Lowpass Biquad Filter & Gentle Chorusing
   */
  public toggleReactorDrone(enable?: boolean): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain) return false;

    const targetState = enable !== undefined ? enable : !this.isDroneActive;

    if (targetState && !this.isDroneActive) {
      // Start drone
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 2.5);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(120, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      // Deep 55Hz Sub Root (A1)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

      // Ethereal Detuned 55.4Hz Harmonic
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(55.4, this.ctx.currentTime);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.isDroneActive = true;
    } else if (!targetState && this.isDroneActive) {
      // Fade out drone
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        const osc1 = this.droneOsc1;
        const osc2 = this.droneOsc2;
        setTimeout(() => {
          try {
            osc1?.stop();
            osc1?.disconnect();
            osc2?.stop();
            osc2?.disconnect();
          } catch {
            // Already stopped
          }
        }, 850);
      }
      this.isDroneActive = false;
    }

    return this.isDroneActive;
  }

  public getIsDroneActive(): boolean {
    return this.isDroneActive;
  }

  /**
   * Hyperdrive Warp Frequency Sweep (80Hz -> 880Hz -> 65Hz)
   */
  public playWarpSurge() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(5.0, now);

    // Warp Pitch Trajectory: 80Hz -> 880Hz -> 65Hz
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.45);
    osc.frequency.exponentialRampToValueAtTime(65, now + 1.2);

    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.45);
    filter.frequency.exponentialRampToValueAtTime(100, now + 1.2);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.4);
  }

  /**
   * High-Precision Radar Telemetry Ping
   */
  public playRadarPing() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now); // A6
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Mechanical Keyboard Keystroke Click Cue
   */
  public playKeyClick() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Subtle crisp mechanical snap
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.04);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Aliases for seamless component consumption
  public playMechanicalClick() {
    this.playKeyClick();
  }

  public playWarpSpeed() {
    this.playWarpSurge();
  }

  public toggleDrone(enable?: boolean): boolean {
    return this.toggleReactorDrone(enable);
  }

  public isDronePlaying(): boolean {
    return this.getIsDroneActive();
  }
}

export const soundEngine = new SoundEngine();
