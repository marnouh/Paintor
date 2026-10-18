import { ARTWORKS, Artwork } from '../data/artworks.ts';

export interface CurrentAudioState {
  artworkId: string;
  title: string;
  subtitle: string;
  speaker: string;
  audioSrc: string;
  artworkImage: string;
  duration: number; // in seconds
  currentTime: number; // in seconds
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  transcript: string;
  mode: 'file' | 'speech';
  audioFormat: string;
  audioElementConnected: boolean;
}

type AudioListener = (state: CurrentAudioState | null) => void;

class AudioManager {
  private audioElement: HTMLAudioElement | null = null;
  private listeners: Set<AudioListener> = new Set();
  private state: CurrentAudioState | null = null;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private speechTimer: number | null = null;
  private boundListeners: Array<{ type: string; handler: EventListener }> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    const audio = new Audio();
    audio.preload = 'metadata';
    this.attachAudioListeners(audio);
  }

  private detachAudioListeners() {
    if (this.audioElement && this.boundListeners.length > 0) {
      for (const { type, handler } of this.boundListeners) {
        this.audioElement.removeEventListener(type, handler);
      }
      this.boundListeners = [];
    }
  }

  public bindDomAudioElement(element: HTMLAudioElement | null) {
    if (!element) return;
    if (this.audioElement === element) return;
    
    // Transfer current state if previous element was playing
    const wasPlaying = this.audioElement && !this.audioElement.paused;
    const prevTime = this.audioElement?.currentTime || 0;
    
    if (this.audioElement && this.audioElement !== element) {
      try {
        this.audioElement.pause();
      } catch {
        // ignore
      }
    }

    this.attachAudioListeners(element);
    
    if (this.state) {
      element.volume = this.state.isMuted ? 0 : this.state.volume;
      element.playbackRate = this.state.playbackRate;
      if (wasPlaying) {
        element.currentTime = prevTime;
        element.play().catch(() => {});
      }
      this.updateState({ audioElementConnected: true });
    }
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }

  /**
   * Generates a real acoustic verification tone (440 Hz standard A or custom note)
   * via Web Audio API to prove sound output on user device/headphones immediately.
   */
  public playToneTest(freq = 440, duration = 0.5): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      const ctx = new AudioCtx();
      
      // Chime with fundamental + soft octave overtone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
      return true;
    } catch (e) {
      console.warn('Web Audio test failed:', e);
      return false;
    }
  }

  private attachAudioListeners(el: HTMLAudioElement) {
    this.detachAudioListeners();
    this.audioElement = el;

    const add = (type: string, handler: EventListener) => {
      el.addEventListener(type, handler);
      this.boundListeners.push({ type, handler });
    };

    add('timeupdate', () => {
      if (!this.state || this.state.mode !== 'file') return;
      const cur = el.currentTime || 0;
      this.updateState({ currentTime: cur });
    });

    add('durationchange', () => {
      if (!this.state || this.state.mode !== 'file') return;
      const d = el.duration;
      if (d && isFinite(d) && d > 0) {
        this.updateState({ duration: d });
      }
    });

    add('playing', () => {
      if (!this.state) return;
      this.updateState({ isPlaying: true, isLoading: false, hasError: false, errorMessage: null });
    });

    add('pause', () => {
      if (!this.state || this.state.mode !== 'file') return;
      this.updateState({ isPlaying: false, isLoading: false });
    });

    add('waiting', () => {
      if (!this.state || this.state.mode !== 'file') return;
      this.updateState({ isLoading: true });
    });

    add('canplay', () => {
      if (!this.state || this.state.mode !== 'file') return;
      this.updateState({ isLoading: false });
    });

    add('ended', () => {
      if (!this.state) return;
      this.updateState({ isPlaying: false, currentTime: 0 });
    });

    add('error', (e) => {
      if (!this.state || this.state.mode !== 'file') return;
      console.warn('Audio element error:', e, el.error);
      const code = el.error?.code;
      let msg = 'Impossible de charger la piste audio studio.';
      if (code === 2) msg = 'Erreur réseau lors du chargement audio.';
      else if (code === 3) msg = 'Erreur de décodage du fichier audio.';
      else if (code === 4) msg = 'Format ou source audio non supporté.';

      this.updateState({
        isPlaying: false,
        isLoading: false,
        hasError: true,
        errorMessage: msg,
      });
    });
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private updateState(partial: Partial<CurrentAudioState>) {
    if (!this.state) return;
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public getState(): CurrentAudioState | null {
    return this.state;
  }

  public async playArtwork(artworkId: string, forceMode?: 'file' | 'speech', artworkObj?: Artwork) {
    const artwork = artworkObj || ARTWORKS.find((a) => a.id === artworkId) || ARTWORKS[0];
    const guide = artwork.audioGuide;

    const title = guide?.title || 'Regard de conservateur';
    const subtitle = `${artwork.title} • ${artwork.artist}`;
    const speaker = guide?.speaker || 'Claire D., Conservatrice';
    const audioSrc = guide?.audioSrc || '/audio/general-guide.wav';
    const duration = guide?.durationSeconds || 134;
    const transcript = guide?.transcript || artwork.openingText || artwork.quote || '';
    const artworkImage = artwork.imageUrl;

    const currentMode = forceMode || (this.state?.artworkId === artworkId ? this.state.mode : 'file');
    const prevRate = this.state?.playbackRate || 1.0;
    const prevVol = this.state?.volume ?? 1.0;
    const prevMute = this.state?.isMuted ?? false;

    // Reset speech synthesis if active
    this.stopSpeech();

    this.state = {
      artworkId: artwork.id,
      title,
      subtitle,
      speaker,
      audioSrc,
      artworkImage,
      duration,
      currentTime: 0,
      isPlaying: false,
      isLoading: true,
      hasError: false,
      errorMessage: null,
      playbackRate: prevRate,
      volume: prevVol,
      isMuted: prevMute,
      transcript,
      mode: currentMode,
      audioFormat: 'WAVE PCM (16-bit 22.05 kHz Stéréo)',
      audioElementConnected: this.audioElement !== null,
    };
    this.notify();

    if (currentMode === 'speech') {
      this.startSpeech(transcript, prevRate, prevVol, prevMute);
    } else {
      await this.startAudioFile(audioSrc, prevRate, prevVol, prevMute);
    }
  }

  private async startAudioFile(src: string, rate: number, volume: number, isMuted: boolean) {
    if (!this.audioElement) {
      this.initAudioElement();
    }
    if (!this.audioElement) return;

    try {
      this.audioElement.pause();
      this.audioElement.src = src;
      this.audioElement.playbackRate = rate;
      this.audioElement.volume = isMuted ? 0 : volume;
      this.audioElement.currentTime = 0;
      await this.audioElement.play();
      this.updateState({ isPlaying: true, isLoading: false, hasError: false, errorMessage: null });
    } catch (err: unknown) {
      console.warn('Playback initiation error:', err);
      // If error is NotAllowedError (autoplay blocked), don't treat as fatal broken file
      const isNotAllowed = err instanceof Error && err.name === 'NotAllowedError';
      this.updateState({
        isPlaying: false,
        isLoading: false,
        hasError: !isNotAllowed,
        errorMessage: isNotAllowed
          ? 'Lecture en attente d’interaction utilisateur'
          : 'Échec de lecture du fichier audio. Vous pouvez réessayer ou basculer en voix de synthèse.',
      });
    }
  }

  private startSpeech(text: string, rate: number, volume: number, isMuted: boolean) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.updateState({
        hasError: true,
        errorMessage: 'Synthèse vocale indisponible sur ce navigateur.',
        isLoading: false,
      });
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = rate;
    utterance.volume = isMuted ? 0 : volume;

    // Pick French voice if available
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find((v) => v.lang.startsWith('fr'));
    if (frenchVoice) utterance.voice = frenchVoice;

    const estimatedDuration = Math.max(10, Math.round(text.split(' ').length / (2.5 * rate)));
    this.updateState({ duration: estimatedDuration, currentTime: 0, isLoading: false });

    utterance.onstart = () => {
      this.updateState({ isPlaying: true, isLoading: false, hasError: false, errorMessage: null });
      this.startSpeechTimer();
    };

    utterance.onend = () => {
      this.stopSpeechTimer();
      this.updateState({ isPlaying: false, currentTime: 0 });
    };

    utterance.onerror = (e) => {
      this.stopSpeechTimer();
      console.warn('SpeechSynthesis error:', e);
      this.updateState({
        isPlaying: false,
        isLoading: false,
        hasError: true,
        errorMessage: 'Erreur lors de la lecture vocale synthétisée.',
      });
    };

    this.speechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  private startSpeechTimer() {
    this.stopSpeechTimer();
    this.speechTimer = window.setInterval(() => {
      if (!this.state || !this.state.isPlaying || this.state.mode !== 'speech') return;
      const nextTime = Math.min(this.state.duration, this.state.currentTime + 1);
      this.updateState({ currentTime: nextTime });
    }, 1000);
  }

  private stopSpeechTimer() {
    if (this.speechTimer !== null) {
      clearInterval(this.speechTimer);
      this.speechTimer = null;
    }
  }

  private stopSpeech() {
    this.stopSpeechTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.speechUtterance = null;
  }

  public async togglePlay() {
    if (!this.state) {
      // Default to first artwork
      await this.playArtwork('starry-night');
      return;
    }

    if (this.state.isPlaying) {
      this.pause();
    } else {
      await this.resume();
    }
  }

  public pause() {
    if (!this.state) return;
    if (this.state.mode === 'file' && this.audioElement) {
      this.audioElement.pause();
    } else if (this.state.mode === 'speech') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      this.stopSpeechTimer();
    }
    this.updateState({ isPlaying: false });
  }

  public async resume() {
    if (!this.state) return;

    if (this.state.hasError) {
      // If was in error state, attempt retry
      await this.retry();
      return;
    }

    if (this.state.mode === 'file' && this.audioElement) {
      try {
        await this.audioElement.play();
        this.updateState({ isPlaying: true, hasError: false, errorMessage: null });
      } catch (err) {
        console.warn('Resume error:', err);
        this.updateState({
          isPlaying: false,
          hasError: true,
          errorMessage: 'Échec de reprise audio. Cliquez pour réessayer.',
        });
      }
    } else if (this.state.mode === 'speech') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          // Restart speech
          this.startSpeech(this.state.transcript, this.state.playbackRate, this.state.volume, this.state.isMuted);
        }
      }
      this.updateState({ isPlaying: true });
      this.startSpeechTimer();
    }
  }

  public seek(seconds: number) {
    if (!this.state) return;
    const clamped = Math.max(0, Math.min(seconds, this.state.duration));

    if (this.state.mode === 'file' && this.audioElement) {
      this.audioElement.currentTime = clamped;
      this.updateState({ currentTime: clamped });
    } else if (this.state.mode === 'speech') {
      this.updateState({ currentTime: clamped });
    }
  }

  public skip(deltaSeconds: number) {
    if (!this.state) return;
    this.seek(this.state.currentTime + deltaSeconds);
  }

  public setPlaybackRate(rate: number) {
    if (!this.state) return;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
    if (this.state.mode === 'speech' && this.state.isPlaying) {
      // Re-init speech with new rate
      this.startSpeech(this.state.transcript, rate, this.state.volume, this.state.isMuted);
    }
    this.updateState({ playbackRate: rate });
  }

  public setVolume(volume: number) {
    if (!this.state) return;
    const clamped = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.state.isMuted ? 0 : clamped;
    }
    this.updateState({ volume: clamped });
  }

  public toggleMute() {
    if (!this.state) return;
    const nextMute = !this.state.isMuted;
    if (this.audioElement) {
      this.audioElement.volume = nextMute ? 0 : this.state.volume;
    }
    this.updateState({ isMuted: nextMute });
  }

  public async switchMode(newMode: 'file' | 'speech') {
    if (!this.state) return;
    await this.playArtwork(this.state.artworkId, newMode);
  }

  public async retry() {
    if (!this.state) return;
    await this.playArtwork(this.state.artworkId, this.state.mode);
  }

  public stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }
    this.stopSpeech();
    this.state = null;
    this.notify();
  }
}

export const audioManager = new AudioManager();
