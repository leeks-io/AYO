/**
 * Web Audio API synthesizer for authentic African board game sounds:
 * - Carved wood resonance
 * - Cowrie shell clatter & clicks
 * - Divination bronze bell chime
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    // Lazy AudioContext to satisfy browser autoplay policies
    try {
      const saved = localStorage.getItem("ayo_sound_muted");
      if (saved !== null) {
        this.isMuted = saved === "true";
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem("ayo_sound_muted", String(this.isMuted));
    } catch {}
    return this.isMuted;
  }

  // Wooden pit drop / seed contact
  public playSeedDrop(pitchVariance: number = 1.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm wooden thump
    const baseFreq = (220 + Math.random() * 60) * pitchVariance;
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    // High shell tick
    const tickOsc = this.ctx.createOscillator();
    const tickGain = this.ctx.createGain();
    tickOsc.type = "triangle";
    tickOsc.frequency.setValueAtTime(1400 + Math.random() * 400, now);
    tickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    tickGain.gain.setValueAtTime(0.12, now);
    tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    tickOsc.connect(tickGain);
    tickGain.connect(this.ctx.destination);

    osc.start(now);
    tickOsc.start(now);
    osc.stop(now + 0.09);
    tickOsc.stop(now + 0.04);
  }

  // Capture rattle (multiple shells scooped into the store)
  public playCapture(seedsCount: number = 2) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Resonant bronze chord
    const bronzeOsc = this.ctx.createOscillator();
    const bronzeGain = this.ctx.createGain();
    bronzeOsc.type = "sine";
    bronzeOsc.frequency.setValueAtTime(523.25, now); // C5
    bronzeGain.gain.setValueAtTime(0.2, now);
    bronzeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    bronzeOsc.connect(bronzeGain);
    bronzeGain.connect(this.ctx.destination);
    bronzeOsc.start(now);
    bronzeOsc.stop(now + 0.45);

    // Multi-click shells
    for (let i = 0; i < Math.min(seedsCount, 6); i++) {
      setTimeout(() => {
        this.playSeedDrop(1.2 + i * 0.1);
      }, i * 35);
    }
  }

  // Big grand slam capture
  public playGrandCapture() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [440, 554.37, 659.25, 880]; // A major triumphant chord
    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.18, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + 0.85);
    });
  }

  // Divination singing bowl / chime
  public playDivinationChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [293.66, 440, 587.33, 880]; // D minor mystical tuning
    freqs.forEach(freq => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.65);
    });
  }
}

export const sound = new SoundEffects();
