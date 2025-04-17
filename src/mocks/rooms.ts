import { Room } from '../types/room';

export const mockRooms: Room[] = [
  {
    id: '1',
    title: 'Tech Talk: Future of AI',
    description: 'Join us for a discussion about the latest developments in artificial intelligence.',
    participantCount: 150,
    speakerCount: 3,
    startedAt: '2024-04-16T10:00:00Z',
    isLive: true,
    hostName: 'Sarah Johnson',
    hostAvatar: 'https://i.pravatar.cc/150?img=1',
    topics: ['AI', 'Technology', 'Future'],
    roomType: 'discussion',
    translationEnabled: true,
    availableLanguages: ['en', 'es', 'fr']
  },
  {
    id: '2',
    title: 'Music Production Workshop',
    description: 'Learn the basics of music production and sound design.',
    participantCount: 75,
    speakerCount: 1,
    scheduledFor: '2024-04-17T15:00:00Z',
    isLive: false,
    hostName: 'Mike Chen',
    hostAvatar: 'https://i.pravatar.cc/150?img=2',
    topics: ['Music', 'Production', 'Workshop'],
    roomType: 'workshop'
  },
  {
    id: '3',
    title: 'Startup Pitch Session',
    description: 'Watch innovative startups pitch their ideas to investors.',
    participantCount: 200,
    speakerCount: 5,
    startedAt: '2024-04-16T14:00:00Z',
    isLive: true,
    hostName: 'Alex Rodriguez',
    hostAvatar: 'https://i.pravatar.cc/150?img=3',
    topics: ['Startups', 'Pitching', 'Investment'],
    roomType: 'pitch',
    recordingStatus: 'recording'
  }
]; 