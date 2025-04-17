// Room related type definitions

export interface Speaker {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHost: boolean;
  hasRaisedHand?: boolean;
}

export interface Message {
  id: string;
  sender: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  startedAt: string;
  hostId: string;
  participantCount: number;
  topics: string[];
  isRecording?: boolean;
  isTranscribing?: boolean;
  scheduledFor?: string | null;
}

export type RoomRole = 'host' | 'speaker' | 'listener';

export interface RoomSettings {
  allowChat: boolean;
  allowHandRaise: boolean;
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
  aiSummaryEnabled: boolean;
  onlyHostsCanSpeak: boolean;
} 