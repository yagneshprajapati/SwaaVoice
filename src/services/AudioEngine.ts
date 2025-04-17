import { BehaviorSubject } from 'rxjs';

export type VoiceEffect = 'none' | 'pitch-up' | 'pitch-down' | 'robot' | 'echo' | 'reverb';

export interface AudioData {
  level: number;
  isSpeaking: boolean;
  frequencyData?: Uint8Array;
}

export interface AudioStatus {
  permission: 'granted' | 'denied' | 'prompt';
  isActive: boolean;
  isMuted: boolean;
  currentEffect: VoiceEffect;
}

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private effectNodes: AudioNode[] = [];
  private frequencyData: Uint8Array | null = null;
  private animationFrameId: number | null = null;
  private noiseFloor = 0.05;
  
  // RxJS behavior subjects
  private audioDataSubject = new BehaviorSubject<AudioData>({
    level: 0,
    isSpeaking: false
  });
  
  private statusSubject = new BehaviorSubject<AudioStatus>({
    permission: 'prompt',
    isActive: false,
    isMuted: true,
    currentEffect: 'none'
  });
  
  // Public observables
  public audioData$ = this.audioDataSubject.asObservable();
  public status$ = this.statusSubject.asObservable();
  
  /**
   * Initialize the audio engine
   */
  public async initialize(noiseFloor = 0.05): Promise<boolean> {
    this.noiseFloor = noiseFloor;
    
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.stream = stream;
      
      // Update status
      this.updateStatus({ permission: 'granted', isActive: true });
      
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContext();
      
      // Create source node
      this.sourceNode = this.audioContext.createMediaStreamSource(stream);
      
      // Create analyzer node
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      const bufferLength = this.analyserNode.frequencyBinCount;
      this.frequencyData = new Uint8Array(bufferLength);
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1;
      
      // Connect the audio graph: source -> analyser -> gain -> (destination)
      // Note: We don't connect to destination for monitoring as it would cause feedback
      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.gainNode);
      
      // Start analyzing audio levels
      this.startAnalysis();
      
      return true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      
      // Update status based on error
      if (error.name === 'NotAllowedError') {
        this.updateStatus({ permission: 'denied' });
      } else {
        this.updateStatus({ permission: 'prompt' });
      }
      
      return false;
    }
  }
  
  /**
   * Set mute state
   */
  public setMuted(muted: boolean): void {
    if (this.stream) {
      // Update audio tracks
      this.stream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
    
    if (this.gainNode && this.audioContext) {
      // Smoothly transition volume to avoid clicks
      const now = this.audioContext.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(muted ? 0 : 1, now + 0.02);
    }
    
    // Update status
    this.updateStatus({ isMuted: muted });
  }
  
  /**
   * Apply voice effect
   */
  public applyVoiceEffect(effect: VoiceEffect): void {
    if (!this.audioContext || !this.sourceNode || !this.analyserNode || !this.gainNode) {
      return;
    }
    
    // Update status
    this.updateStatus({ currentEffect: effect });
    
    // Clear previous effects
    this.clearEffectNodes();
    
    // Skip if no effect
    if (effect === 'none') {
      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.gainNode);
      return;
    }
    
    // Apply the selected effect
    switch (effect) {
      case 'pitch-up': {
        // Simple pitch shift up effect using a filter
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
        // Simple pitch shift down effect using a filter
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
        // Robot voice effect with oscillator
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = 30; // Hz
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
        // Echo effect
        const delay = this.audioContext.createDelay();
        delay.delayTime.value = 0.2;
        
        const feedback = this.audioContext.createGain();
        feedback.gain.value = 0.4;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2500;
        
        this.sourceNode.connect(this.analyserNode);
        this.analyserNode.connect(delay);
        delay.connect(filter);
        filter.connect(feedback);
        feedback.connect(delay);
        delay.connect(this.gainNode);
        this.analyserNode.connect(this.gainNode); // Direct path
        
        this.effectNodes.push(delay, feedback, filter);
        break;
      }
      case 'reverb': {
        // Basic reverb effect simulation
        const delay1 = this.audioContext.createDelay();
        delay1.delayTime.value = 0.03;
        
        const delay2 = this.audioContext.createDelay();
        delay2.delayTime.value = 0.05;
        
        const delay3 = this.audioContext.createDelay();
        delay3.delayTime.value = 0.07;
        
        const gain1 = this.audioContext.createGain();
        gain1.gain.value = 0.3;
        
        const gain2 = this.audioContext.createGain();
        gain2.gain.value = 0.2;
        
        const gain3 = this.audioContext.createGain();
        gain3.gain.value = 0.1;
        
        this.sourceNode.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode); // Direct path
        
        // Multiple delay paths for reverb effect
        this.analyserNode.connect(delay1);
        delay1.connect(gain1);
        gain1.connect(this.gainNode);
        
        this.analyserNode.connect(delay2);
        delay2.connect(gain2);
        gain2.connect(this.gainNode);
        
        this.analyserNode.connect(delay3);
        delay3.connect(gain3);
        gain3.connect(this.gainNode);
        
        this.effectNodes.push(delay1, delay2, delay3, gain1, gain2, gain3);
        break;
      }
    }
  }
  
  /**
   * Start analyzing audio levels
   */
  private startAnalysis(): void {
    if (!this.analyserNode || !this.frequencyData) return;
    
    const analyzeFrame = () => {
      if (!this.analyserNode || !this.frequencyData) return;
      
      // Get current frequency data
      this.analyserNode.getByteFrequencyData(this.frequencyData);
      
      // Calculate average volume level
      const sum = Array.from(this.frequencyData).reduce((a, b) => a + b, 0);
      const average = sum / this.frequencyData.length;
      
      // Normalize to 0-1 range
      const normalizedLevel = Math.min(1, average / 128);
      
      // Determine if speaking (above noise floor)
      const isSpeaking = normalizedLevel > this.noiseFloor && 
                         !this.statusSubject.getValue().isMuted;
      
      // Publish audio data
      this.audioDataSubject.next({
        level: normalizedLevel,
        isSpeaking,
        frequencyData: this.frequencyData 
      });
      
      // Continue loop
      this.animationFrameId = requestAnimationFrame(analyzeFrame);
    };
    
    // Start the analysis loop
    analyzeFrame();
  }
  
  /**
   * Clear effect nodes and restore default connections
   */
  private clearEffectNodes(): void {
    if (!this.sourceNode || !this.analyserNode) return;
    
    // Disconnect everything first
    this.sourceNode.disconnect();
    this.analyserNode.disconnect();
    
    // Stop any oscillators
    this.effectNodes.forEach(node => {
      node.disconnect();
      
      // Stop oscillators
      if ((node as OscillatorNode).stop) {
        (node as OscillatorNode).stop();
      }
    });
    
    // Clear the array
    this.effectNodes = [];
    
    // Restore default connections
    this.sourceNode.connect(this.analyserNode);
    if (this.gainNode) {
      this.analyserNode.connect(this.gainNode);
    }
  }
  
  /**
   * Update internal status and publish to subscribers
   */
  private updateStatus(update: Partial<AudioStatus>): void {
    const current = this.statusSubject.getValue();
    this.statusSubject.next({...current, ...update});
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
    
    // Clear effect nodes
    this.clearEffectNodes();
    
    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
    
    // Reset nodes
    this.sourceNode = null;
    this.analyserNode = null;
    this.gainNode = null;
    this.frequencyData = null;
    
    // Reset status
    this.updateStatus({
      isActive: false,
      isMuted: true,
      currentEffect: 'none'
    });
    
    // Reset audio data
    this.audioDataSubject.next({
      level: 0,
      isSpeaking: false
    });
  }
}

// Export singleton instance
export default new AudioEngine();
