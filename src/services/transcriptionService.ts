import { VoiceEffect } from '../hooks/useAudioEngine';

export interface Transcription {
  id: string;
  text: string;
  timestamp: string;
  speakerId: string;
  speakerName: string;
  isFinal: boolean;
}

export interface TranscriptionHighlight {
  id: string;
  transcriptionId: string;
  text: string;
  timestamp: string;
  speakerId: string;
  speakerName: string;
  savedById: string;
  savedByName: string;
  note?: string;
}

export interface SpeechSegment {
  speakerId: string;
  speakerName: string;
  text: string;
  start: number;
  end: number;
}

export interface TranscriptSummary {
  topics: string[];
  keyPoints: string[];
  questions: string[];
  decisions: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  wordCount: number;
  speakerStats: Array<{
    speakerId: string;
    speakerName: string;
    talkTimePercent: number;
    wordCount: number;
  }>;
}

// Simulate a speech recognition service with Web Speech API
class TranscriptionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private currentVoiceEffect: VoiceEffect = 'none';
  private listeners: Array<(transcription: Transcription) => void> = [];
  
  // Mock data for demonstration when Web Speech API is not available
  private mockTranscripts: string[] = [
    "I think we should focus on improving the user experience first.",
    "The analytics data shows significant growth in mobile users.",
    "What are your thoughts on implementing the new design system?",
    "We need to consider the performance implications of these changes.",
    "I agree with the approach, but we should test it with real users.",
    "The timeline seems tight. Can we prioritize the key features?",
    "Machine learning will transform how we deliver recommendations.",
    "Let's schedule a follow-up meeting to discuss the technical details.",
    "Has anyone reviewed the accessibility requirements?",
    "The feedback from the beta testers has been mostly positive."
  ];
  
  constructor() {
    this.setupSpeechRecognition();
  }
  
  private setupSpeechRecognition() {
    // Check if browser supports Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      if (this.recognition) {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = (event) => {
          const lastResult = event.results[event.results.length - 1];
          const transcript = lastResult[0].transcript;
          const isFinal = lastResult.isFinal;
          
          if (transcript.trim()) {
            this.handleTranscription(transcript, isFinal);
          }
        };
        
        this.recognition.onend = () => {
          if (this.isListening) {
            // Restart if it stopped but should still be listening
            try {
              this.recognition?.start();
            } catch (e) {
              console.error("Failed to restart speech recognition:", e);
            }
          }
        };
        
        this.recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          
          // If we get a fatal error, fall back to mock data
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            this.recognition = null;
          }
        };
      }
    }
  }
  
  public startListening(speakerId: string, speakerName: string): void {
    this.isListening = true;
    
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    } else {
      // Fall back to mock transcription service
      this.startMockTranscription(speakerId, speakerName);
    }
  }
  
  public stopListening(): void {
    this.isListening = false;
    
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error("Failed to stop speech recognition:", e);
      }
    }
  }
  
  public setVoiceEffect(effect: VoiceEffect): void {
    this.currentVoiceEffect = effect;
  }
  
  private startMockTranscription(speakerId: string, speakerName: string): void {
    const generateRandomTranscription = () => {
      if (!this.isListening) return;
      
      // Pick a random transcript from the list
      const randomIndex = Math.floor(Math.random() * this.mockTranscripts.length);
      const text = this.mockTranscripts[randomIndex];
      
      // Create transcription object
      const transcription: Transcription = {
        id: `trans-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        text,
        timestamp: new Date().toISOString(),
        speakerId,
        speakerName,
        isFinal: true
      };
      
      // Notify listeners
      this.listeners.forEach(listener => listener(transcription));
      
      // Schedule next transcription after random delay (3-10 seconds)
      const delay = Math.random() * 7000 + 3000;
      setTimeout(generateRandomTranscription, delay);
    };
    
    // Start the mock transcription process
    generateRandomTranscription();
  }
  
  private handleTranscription(text: string, isFinal: boolean): void {
    // We would apply voice effect modification to the text here in a real system
    // For now we'll just add an indicator if a voice effect is active
    let modifiedText = text;
    if (this.currentVoiceEffect !== 'none') {
      // In a real implementation, we would transform the text to match the voice effect
      modifiedText = `[${this.currentVoiceEffect}] ${text}`;
    }
    
    // Create transcription object with mock speaker info
    // In a real app, you'd get this from the authenticated user
    const transcription: Transcription = {
      id: `trans-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text: modifiedText,
      timestamp: new Date().toISOString(),
      speakerId: 'current-user',
      speakerName: 'Current User',
      isFinal
    };
    
    // Notify listeners
    this.listeners.forEach(listener => listener(transcription));
  }
  
  public subscribe(listener: (transcription: Transcription) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  public generateSummary(transcriptions: Transcription[]): TranscriptSummary {
    // In a real implementation, this would use NLP to analyze the transcript
    // Here we'll create a mock summary
    
    // Extract all text
    const allText = transcriptions.map(t => t.text).join(' ');
    const wordCount = allText.split(/\s+/).filter(Boolean).length;
    
    // Count words per speaker
    const speakerStats: Record<string, { name: string, words: number }> = {};
    transcriptions.forEach(t => {
      const speakerWords = t.text.split(/\s+/).filter(Boolean).length;
      if (!speakerStats[t.speakerId]) {
        speakerStats[t.speakerId] = {
          name: t.speakerName,
          words: 0
        };
      }
      speakerStats[t.speakerId].words += speakerWords;
    });
    
    // Convert to array and calculate percentages
    const speakerStatsArray = Object.entries(speakerStats).map(([id, stat]) => ({
      speakerId: id,
      speakerName: stat.name,
      talkTimePercent: Math.round((stat.words / wordCount) * 100),
      wordCount: stat.words
    }));
    
    // Mock topic detection
    const possibleTopics = [
      'User Experience', 'Design', 'Development', 'Analytics', 
      'Performance', 'Testing', 'Planning', 'Machine Learning',
      'Accessibility', 'Feedback', 'Mobile', 'Collaboration'
    ];
    
    const topics = Array.from(
      { length: Math.floor(Math.random() * 3) + 2 }, 
      () => possibleTopics[Math.floor(Math.random() * possibleTopics.length)]
    );
    
    // Mock key points
    const keyPoints = [
      "Focus on improving user experience first",
      "Consider performance implications of changes",
      "Test with real users before launch",
      "Mobile usage shows significant growth"
    ];
    
    // Mock questions
    const questions = [
      "What are your thoughts on implementing the new design system?",
      "Can we prioritize the key features given the timeline?"
    ];
    
    // Mock decisions
    const decisions = [
      "Schedule a follow-up meeting for technical details",
      "Review accessibility requirements"
    ];
    
    // Mock sentiment analysis
    const sentiments: Array<'positive' | 'neutral' | 'negative' | 'mixed'> = 
      ['positive', 'neutral', 'negative', 'mixed'];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    return {
      topics,
      keyPoints,
      questions,
      decisions,
      sentiment,
      wordCount,
      speakerStats: speakerStatsArray
    };
  }
}

// Export as singleton
export default new TranscriptionService();
