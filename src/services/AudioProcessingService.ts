import { BehaviorSubject, Subject } from 'rxjs';

export type VoiceEffect = 'none' | 'pitch-up' | 'pitch-down' | 'robot' | 'reverb' | 'echo' | 'underwater';

export interface AudioLevelData {
  level: number;
  isSpeaking: boolean;
  frequencyData: Uint8Array;
}

export interface SpatialPosition {
  x: number;
  y: number;
  z: number;
}

class AudioProcessingService {
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private effectNodes: AudioNode[] = [];
  private animationFrameId: number | null = null;
  private frequencyData: Uint8Array | null = null;
  private noiseFloor = 0.05;
  
  // RxJS subjects for reactive programming
  private audioLevelSubject = new BehaviorSubject<AudioLevelData>({
    level: 0,
    isSpeaking: false,
    frequencyData: new Uint8Array(0)
  });
  
  private permissionStatusSubject = new BehaviorSubject<'prompt' | 'granted' | 'denied' | 'error'>('prompt');
  private errorSubject = new Subject<string>();
  
  public audioLevel$ = this.audioLevelSubject.asObservable();
  public permissionStatus$ = this.permissionStatusSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  
  /**
   * Initialize audio processing
   */
  public async initialize(noiseFloor = 0.05): Promise<boolean> {
    this.noiseFloor = noiseFloor;
    
    try {
      this.permissionStatusSubject.next('prompt');
      
      // Request user permission for microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.stream = stream;
      this.permissionStatusSubject.next('granted');
      
      // Set up Web Audio API
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create audio source from microphone
      this.sourceNode = this.audioContext.createMediaStreamSource(stream);
      
      // Create analyser for visualizations
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      const bufferLength = this.analyserNode.frequencyBinCount;
      this.frequencyData = new Uint8Array(bufferLength);
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1;
      
      // Connect the audio graph
      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.gainNode);
      
      // Start audio analysis loop
      this.startAnalyzing();
      
      return true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      this.permissionStatusSubject.next(error.name === 'NotAllowedError' ? 'denied' : 'error');
      this.errorSubject.next(error.message || 'Failed to initialize audio');
      return false;
    }
  }
  
  /**
   * Start analyzing audio levels
   */
  private startAnalyzing(): void {
    if (!this.analyserNode || !this.frequencyData) return;
    
    const analyze = () => {
      if (!this.analyserNode || !this.frequencyData) return;
      
      // Get frequency data
      this.analyserNode.getByteFrequencyData(this.frequencyData);
      
      // Calculate average levels
      const sum = this.frequencyData.reduce((acc, val) => acc + val, 0);
      const avg = sum / this.frequencyData.length;
      
      // Normalize to 0-1
      const normalizedLevel = Math.min(1, avg / 128);
      
      // Determine if speaking (above noise floor)
      const isSpeaking = normalizedLevel > this.noiseFloor;
      
      // Publish the data
      this.audioLevelSubject.next({
        level: normalizedLevel,
        isSpeaking,
        frequencyData: this.frequencyData.slice(0)
      });
      
      this.animationFrameId = requestAnimationFrame(analyze);
    };
    
    analyze();
  }
  
  /**
   * Set mute state
   */
  public setMuted(muted: boolean): void {
    if (this.stream) {
      this.stream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
    
    if (this.gainNode) {
      // Smooth transition to avoid clicks
      const now = this.audioContext?.currentTime || 0;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(muted ? 0 : 1, now + 0.05);
    }
  }
  
  /**
   * Apply voice effect
   */
  public applyVoiceEffect(effect: VoiceEffect): void {
    if (!this.audioContext || !this.sourceNode || !this.analyserNode || !this.gainNode) {
      return;
    }
    
    // Clear previous effect nodes
    this.clearEffectNodes();
    
    // Skip if no effect
    if (effect === 'none') {
      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.gainNode);
      return;
    }
    
    // Create a chain of audio nodes based on the selected effect
    switch (effect) {
      case 'pitch-up': {
        // Basic pitch shift up - in a real app, we'd use a proper pitch shifter
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 500;
        filter.Q.value = 1;
        
        this.sourceNode.connect(filter);
        filter.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode);
        
        this.effectNodes.push(filter);
        break;
      }
      case 'pitch-down': {
        // Basic pitch shift down
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 700;
        filter.Q.value = 1;
        
        this.sourceNode.connect(filter);
        filter.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode);
        
        this.effectNodes.push(filter);
        break;
      }
      case 'robot': {
        // Robot voice effect with oscillator modulation
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = 30;
        oscillator.start();
        
        const oscillatorGain = this.audioContext.createGain();
        oscillatorGain.gain.value = 0.15;
        oscillator.connect(oscillatorGain);
        
        const modulated = this.audioContext.createGain();
        this.sourceNode.connect(modulated);
        oscillatorGain.connect(modulated.gain);
        
        modulated.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode);
        
        this.effectNodes.push(oscillator, oscillatorGain, modulated);
        break;
      }
      case 'echo': {
        // Echo effect with delay
        const delay = this.audioContext.createDelay(0.5);
        delay.delayTime.value = 0.2;
        
        const feedback = this.audioContext.createGain();
        feedback.gain.value = 0.4;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        
        this.sourceNode.connect(this.analyserNode);
        this.analyserNode.connect(delay);
        delay.connect(filter);
        filter.connect(feedback);
        feedback.connect(delay);
        delay.connect(this.gainNode);
        this.analyserNode.connect(this.gainNode); // Direct signal path
        
        this.effectNodes.push(delay, feedback, filter);
        break;
      }
      case 'reverb': {
        // Simple reverb approximation
        const convolver = this.audioContext.createConvolver();
        
        // In a real app, we would load an impulse response file
        // For now, we'll simulate with multiple delays
        
        const delay1 = this.audioContext.createDelay();
        delay1.delayTime.value = 0.04;
        
        const delay2 = this.audioContext.createDelay();
        delay2.delayTime.value = 0.07;
        
        const gain1 = this.audioContext.createGain();
        gain1.gain.value = 0.3;
        
        const gain2 = this.audioContext.createGain();
        gain2.gain.value = 0.2;
        
        this.sourceNode.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode); // Direct signal path
        
        this.analyserNode.connect(delay1);
        delay1.connect(gain1);
        gain1.connect(this.gainNode);
        
        this.analyserNode.connect(delay2);
        delay2.connect(gain2);
        gain2.connect(this.gainNode);
        
        this.effectNodes.push(delay1, delay2, gain1, gain2);
        break;
      }
      case 'underwater': {
        // Underwater effect with lowpass filter and modulation
        const lowpass = this.audioContext.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 300;
        lowpass.Q.value = 0.5;
        
        // Slow modulation for "underwater" wobble
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 0.5;
        oscillator.start();
        
        const modulationGain = this.audioContext.createGain();
        modulationGain.gain.value = 0.008;
        
        oscillator.connect(modulationGain);
        modulationGain.connect(lowpass.frequency);
        
        this.sourceNode.connect(lowpass);
        lowpass.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode);
        
        this.effectNodes.push(lowpass, oscillator, modulationGain);
        break;
      }
    }
  }
  
  /**
   * Clear effect nodes and recreate default connections
   */
  private clearEffectNodes(): void {
    if (!this.sourceNode || !this.analyserNode || !this.gainNode) return;
    
    // Disconnect everything
    this.sourceNode.disconnect();
    this.analyserNode.disconnect();
    
    // Stop any oscillators
    this.effectNodes.forEach(node => {
      node.disconnect();
      if ((node as OscillatorNode).stop) {
        (node as OscillatorNode).stop();
      }
    });
    
    this.effectNodes = [];
    
    // Recreate default connections
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);
  }
  
  /**
   * Apply spatial audio positioning
   */
  public applySpatialPosition(position: SpatialPosition): void {
    // In a real implementation, we would use WebAudio's PannerNode
    // For the hackathon, we'll simulate this with a simple stereo panner
    if (!this.audioContext || !this.gainNode) return;
    
    // Create a stereo panner if it doesn't exist
    let pannerNode = this.effectNodes.find(node => node instanceof StereoPannerNode) as StereoPannerNode;
    
    if (!pannerNode) {
      pannerNode = this.audioContext.createStereoPanner();
      
      // Insert panner in the chain
      this.gainNode.disconnect();
      pannerNode.connect(this.audioContext.destination);
      this.gainNode.connect(pannerNode);
      
      this.effectNodes.push(pannerNode);
    }
    
    // Map x position (-1...1) to panning
    pannerNode.pan.value = Math.max(-1, Math.min(1, position.x));
  }
  
  /**
   * Clean up resources
   */
  public dispose(): void {
    // Cancel animation frame
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Disconnect all nodes
    this.clearEffectNodes();
    
    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    // Reset state
    this.sourceNode = null;
    this.analyserNode = null;
    this.gainNode = null;
    this.frequencyData = null;
    this.effectNodes = [];
    
    this.audioLevelSubject.next({
      level: 0,
      isSpeaking: false,
      frequencyData: new Uint8Array(0)
    });
  }
}

// Export as a singleton
export default new AudioProcessingService();
