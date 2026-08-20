// Web Audio API Synth Engine for Birthday Music Box & Sound Effects

import { extractYouTubeId } from './urlHelpers';

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrack: 'musicbox' | 'acoustic' | 'party' | 'custom' = 'musicbox';
  private customAudioEl: HTMLAudioElement | null = null;
  private ytIframeEl: HTMLIFrameElement | null = null;
  private timerId: number | null = null;
  private volume: number = 0.5;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.customAudioEl) {
      this.customAudioEl.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public playTrack(track: 'musicbox' | 'acoustic' | 'party' | 'custom', customUrl?: string) {
    this.initCtx();
    this.stop();
    this.currentTrack = track;
    this.isPlaying = true;

    if (track === 'custom' && customUrl) {
      this.playCustomAudio(customUrl);
      return;
    }

    this.playSynthLoop();
  }

  private playCustomAudio(url: string) {
    this.stopCustomMedia();

    const ytId = extractYouTubeId(url);
    if (ytId) {
      // Create or update hidden YouTube embedded player
      let iframe = document.getElementById('yt-audio-player') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'yt-audio-player';
        iframe.style.position = 'fixed';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none';
        iframe.allow = 'autoplay';
        document.body.appendChild(iframe);
      }
      iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&enablejsapi=1`;
      this.ytIframeEl = iframe;
      return;
    }

    this.customAudioEl = new Audio(url);
    this.customAudioEl.loop = true;
    this.customAudioEl.volume = this.volume;
    this.customAudioEl.play().catch((err) => {
      console.warn('Audio play auto-blocked by browser or invalid URL:', err);
      // Fallback to synth loop
      this.playSynthLoop();
    });
  }

  private stopCustomMedia() {
    if (this.customAudioEl) {
      this.customAudioEl.pause();
      this.customAudioEl = null;
    }
    const iframe = document.getElementById('yt-audio-player');
    if (iframe) {
      iframe.remove();
      this.ytIframeEl = null;
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stopCustomMedia();
  }

  public togglePlay(track: 'musicbox' | 'acoustic' | 'party' | 'custom', customUrl?: string): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.playTrack(track, customUrl);
      return true;
    }
  }

  // Melodies in note frequencies
  // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25
  private getMelodyNotes() {
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

    if (this.currentTrack === 'party') {
      // Upbeat Happy Birthday
      return [
        { freq: G4, dur: 0.3 }, { freq: G4, dur: 0.3 }, { freq: A4, dur: 0.6 }, { freq: G4, dur: 0.6 }, { freq: C5, dur: 0.6 }, { freq: B4, dur: 1.2 },
        { freq: G4, dur: 0.3 }, { freq: G4, dur: 0.3 }, { freq: A4, dur: 0.6 }, { freq: G4, dur: 0.6 }, { freq: D5, dur: 0.6 }, { freq: C5, dur: 1.2 },
        { freq: G4, dur: 0.3 }, { freq: G4, dur: 0.3 }, { freq: G5 || 783.99, dur: 0.6 }, { freq: E5, dur: 0.6 }, { freq: C5, dur: 0.6 }, { freq: B4, dur: 0.6 }, { freq: A4, dur: 1.2 },
        { freq: F5, dur: 0.3 }, { freq: F5, dur: 0.3 }, { freq: E5, dur: 0.6 }, { freq: C5, dur: 0.6 }, { freq: D5, dur: 0.6 }, { freq: C5, dur: 1.5 }
      ];
    }

    if (this.currentTrack === 'acoustic') {
      // Gentle guitar style
      return [
        { freq: C4, dur: 0.5 }, { freq: E4, dur: 0.5 }, { freq: G4, dur: 0.5 }, { freq: C5, dur: 1.0 },
        { freq: B4, dur: 0.5 }, { freq: G4, dur: 0.5 }, { freq: A4, dur: 1.0 },
        { freq: F4, dur: 0.5 }, { freq: A4, dur: 0.5 }, { freq: C5, dur: 0.5 }, { freq: E5, dur: 1.0 },
        { freq: D5, dur: 0.5 }, { freq: C5, dur: 0.5 }, { freq: B4, dur: 1.0 }
      ];
    }

    // Default Music Box Happy Birthday
    return [
      { freq: C4, dur: 0.4 }, { freq: C4, dur: 0.4 }, { freq: D4, dur: 0.8 }, { freq: C4, dur: 0.8 }, { freq: F4, dur: 0.8 }, { freq: E4, dur: 1.4 },
      { freq: C4, dur: 0.4 }, { freq: C4, dur: 0.4 }, { freq: D4, dur: 0.8 }, { freq: C4, dur: 0.8 }, { freq: G4, dur: 0.8 }, { freq: F4, dur: 1.4 },
      { freq: C4, dur: 0.4 }, { freq: C4, dur: 0.4 }, { freq: C5, dur: 0.8 }, { freq: A4, dur: 0.8 }, { freq: F4, dur: 0.8 }, { freq: E4, dur: 0.8 }, { freq: D4, dur: 1.4 },
      { freq: Bb4, dur: 0.4 }, { freq: Bb4, dur: 0.4 }, { freq: A4, dur: 0.8 }, { freq: F4, dur: 0.8 }, { freq: G4, dur: 0.8 }, { freq: F4, dur: 1.6 }
    ];
  }

  private playSynthLoop() {
    if (!this.isPlaying || !this.ctx) return;

    const notes = this.getMelodyNotes();
    let noteIndex = 0;

    const scheduleNextNote = () => {
      if (!this.isPlaying || !this.ctx) return;

      const note = notes[noteIndex];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.currentTrack === 'musicbox') {
        osc.type = 'sine'; // Pure bell/music box chime tone
      } else if (this.currentTrack === 'acoustic') {
        osc.type = 'triangle'; // Soft acoustic string warmth
      } else {
        osc.type = 'sine'; // Upbeat synth
      }

      osc.frequency.setValueAtTime(note.freq, now);

      // Envelope for soft attack & chime fade
      const noteVol = this.volume * 0.35;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(noteVol, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.dur * 0.95);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + note.dur);

      noteIndex = (noteIndex + 1) % notes.length;
      this.timerId = window.setTimeout(scheduleNextNote, note.dur * 1000);
    };

    scheduleNextNote();
  }

  // Sound Effect: Pop Balloon
  public playPopSound() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Sound Effect: Rotary Scroll Lock Key Click/Tick
  public playDialTickSound() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.025);

    gain.gain.setValueAtTime(this.volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  }

  // Sound Effect: Gift Box Unlock & Magically Open
  public playMagicalUnlockSound() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6 arpeggio

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // Sound Effect: Blow Candle Wind & Cheer
  public playCandleBlowSound() {
    this.initCtx();
    if (!this.ctx) return;

    // Soft white noise puff
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }
}

export const audioEngine = new BirthdayAudioEngine();
