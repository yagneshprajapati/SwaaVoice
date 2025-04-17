// Room service to handle API calls for room data

import { RoomMood } from '../types';

// Types to match your component interfaces
export interface Room {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostAvatar: string;
  mood: RoomMood;
  isLive: boolean;
  participantCount: number;
  speakerCount: number;
  // Add other fields as needed
}

export interface RoomSpeaker {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isModerator?: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  audioLevel: number;
}

export interface RoomParticipant {
  id: string;
  name: string;
  avatar: string;
  isHandRaised: boolean;
}

// Fetch room by ID
export async function getRoomById(roomId: string): Promise<Room> {
  try {
    // In a real app, this would be an API call
    // const response = await fetch(`/api/rooms/${roomId}`);
    // if (!response.ok) throw new Error('Room not found');
    // return await response.json();
    
    // For now, return mock data with a delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // This mocks what your API would return
    return {
      id: roomId,
      title: `Room ${roomId}`,
      description: `This is room ${roomId} description. It's a great place to discuss things related to this topic.`,
      hostName: 'Alex Johnson',
      hostAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      mood: ['focused', 'energetic', 'creative', 'calm'][Math.floor(Math.random() * 4)] as RoomMood,
      isLive: true,
      participantCount: Math.floor(Math.random() * 50) + 5,
      speakerCount: Math.floor(Math.random() * 5) + 1,
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    throw new Error('Failed to load room data');
  }
}

// Get room speakers
export async function getRoomSpeakers(roomId: string): Promise<RoomSpeaker[]> {
  try {
    // In a real app, API call here
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'speaker-1',
        name: 'Alex Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isHost: true,
        isMuted: false,
        isSpeaking: Math.random() > 0.5,
        audioLevel: Math.random() * 0.7,
      },
      {
        id: 'speaker-2',
        name: 'Maria Garcia',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        isModerator: true,
        isMuted: false,
        isSpeaking: Math.random() > 0.7,
        audioLevel: Math.random() * 0.5,
      },
      {
        id: 'speaker-3',
        name: 'James Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        isMuted: true,
        isSpeaking: false,
        audioLevel: 0,
      },
    ];
  } catch (error) {
    console.error('Error fetching speakers:', error);
    throw new Error('Failed to load speaker data');
  }
}

// Get room participants (audience)
export async function getRoomParticipants(roomId: string): Promise<RoomParticipant[]> {
  try {
    // In a real app, API call here
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return Array(12).fill(null).map((_, i) => ({
      id: `audience-${i}`,
      name: `User ${i + 1}`,
      avatar: `https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 10}.jpg`,
      isHandRaised: i % 5 === 0,
    }));
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw new Error('Failed to load participant data');
  }
}
