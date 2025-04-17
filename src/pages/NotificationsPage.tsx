import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Mock notifications data
const mockNotifications = [
  {
    id: 'notif-1',
    type: 'room-invite',
    message: 'Alex Johnson invited you to join "The Future of AI and ML in 2024"',
    time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    read: false,
    action: {
      type: 'join',
      roomId: 'room-1'
    },
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&auto=format',
    }
  },
  {
    id: 'notif-2',
    type: 'room-start',
    message: 'A room you\'re interested in has just started: "Design Systems for Modern Web Applications"',
    time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    read: false,
    action: {
      type: 'join',
      roomId: 'room-2'
    }
  },
  {
    id: 'notif-3',
    type: 'reminder',
    message: 'Reminder: "Blockchain and Web3: Beyond the Hype" is starting in 10 minutes',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    read: true,
    action: {
      type: 'view',
      roomId: 'room-3'
    }
  },
  {
    id: 'notif-4',
    type: 'new-follower',
    message: 'Sarah Wilson started following you',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    read: false,
    action: {
      type: 'profile',
      userId: 'user-2'
    },
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
    }
  },
  {
    id: 'notif-5',
    type: 'mention',
    message: 'Michael Brown mentioned you in "Tech Trends Discussion Room"',
    time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    action: {
      type: 'view',
      roomId: 'room-4'
    },
    user: {
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    }
  },
  {
    id: 'notif-6',
    type: 'recording-ready',
    message: 'Your recording of "Intro to Machine Learning" is now ready to view',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: false,
    action: {
      type: 'view-recording',
      roomId: 'room-5',
      recordingId: 'rec-1'
    }
  },
  {
    id: 'notif-7',
    type: 'speaker-promotion',
    message: 'You were promoted to speaker in "Open Discussion: Future of Work"',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: true,
    action: {
      type: 'join',
      roomId: 'room-6'
    }
  },
  {
    id: 'notif-8',
    type: 'scheduled-room',
    message: '"Advanced TypeScript Patterns" is scheduled to start tomorrow at 2:00 PM',
    time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    read: false,
    action: {
      type: 'calendar',
      roomId: 'room-7'
    }
  },
  {
    id: 'notif-9',
    type: 'message',
    message: 'You received a private message from James Lee',
    time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    read: true,
    action: {
      type: 'message',
      userId: 'user-3'
    },
    user: {
      name: 'James Lee',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
    }
  },
  {
    id: 'notif-10',
    type: 'system',
    message: 'Your account has been verified. Welcome to the community!',
    time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    read: true,
    action: {
      type: 'settings',
    }
  }
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || (filter === 'unread' && !notif.read)
  );

  // Format time to relative format
  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'Just now';
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== id)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'room-invite':
        return (
          <div className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'room-start':
        return (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'reminder':
        return (
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'new-follower':
        return (
          <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      case 'mention':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
        );
      case 'recording-ready':
        return (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'speaker-promotion':
        return (
          <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
      case 'scheduled-room':
        return (
          <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 p-2 rounded-full
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto py-2 minimal-scrollbar">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-gray-50/90 dark:bg-gray-900/90  pb-5 pt-3 mt-0 px-1">
        <motion.div 
          className="flex justify-between items-center mb-6 mt-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="page-title">
            Notifications
          </h1>
          
          
        </motion.div>
      </div>
      
      {/* Notification List */}
      {filteredNotifications.length > 0 ? (
        <AnimatePresence>
          <motion.div 
            className="space-y-4"
            layout
          >
            {filteredNotifications.map((notification) => (
              <motion.div 
                key={notification.id}
                className={`relative rounded-xl p-4 
                  ${!notification.read 
                    ? 'bg-gray-50 dark:bg-gray-800 border-l-4 border-l-violet-500' 
                    : 'bg-gray-50 dark:bg-gray-800'
                  }
                  shadow-[6px_6px_12px_0px_rgba(0,0,0,0.06),-6px_-6px_12px_0px_rgba(255,255,255,0.80)] 
                  dark:shadow-[5px_5px_10px_0px_rgba(0,0,0,0.5),-5px_-5px_10px_0px_rgba(255,255,255,0.05)]
                  transition-all duration-300 
                  hover:shadow-[8px_8px_16px_0px_rgba(0,0,0,0.08),-8px_-8px_16px_0px_rgba(255,255,255,0.9)] 
                  dark:hover:shadow-[7px_7px_14px_0px_rgba(0,0,0,0.6),-7px_-7px_14px_0px_rgba(255,255,255,0.07)]`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
                onClick={() => {
                  setSelectedNotification(notification.id === selectedNotification ? null : notification.id);
                  if (!notification.read) markAsRead(notification.id);
                }}
                whileHover={{ 
                  y: -3,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon or Avatar */}
                  {notification.user ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden
                      shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                      dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]">
                      <img 
                        src={notification.user.avatar} 
                        alt={notification.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {formatTime(notification.time)}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <AnimatePresence>
                      {selectedNotification === notification.id && notification.action && (
                        <motion.div 
                          className="mt-3 flex space-x-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {notification.action.type === 'join' && (
                            <Link 
                              to={`/join/${notification.action.roomId}?isDiscovery=true`}
                              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium
                                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                                transition-all duration-200"
                            >
                              Join Room
                            </Link>
                          )}
                          
                          {notification.action.type === 'view' && (
                            <Link 
                              to={`/rooms/${notification.action.roomId}`}
                              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium
                                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                                transition-all duration-200"
                            >
                              View Room
                            </Link>
                          )}
                          
                          {notification.action.type === 'view-recording' && (
                            <Link 
                              to={`/rooms/${notification.action.roomId}/recordings/${notification.action.recordingId}`}
                              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium
                                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                                transition-all duration-200"
                            >
                              View Recording
                            </Link>
                          )}
                          
                          {notification.action.type === 'calendar' && (
                            <Link 
                              to={`/rooms/${notification.action.roomId}`}
                              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium
                                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                                transition-all duration-200"
                            >
                              Add to Calendar
                            </Link>
                          )}
                          
                          {notification.action.type === 'profile' && (
                            <Link 
                              to={`/profile/${notification.action.userId}`}
                              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium
                                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                                transition-all duration-200"
                            >
                              View Profile
                            </Link>
                          )}
                          
                          {notification.action.type === 'message' && (
                            <Link 
                              to={`/messages/${notification.action.userId}`}
                              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium
                                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                                transition-all duration-200"
                            >
                              View Message
                            </Link>
                          )}
                          
                          {notification.action.type === 'settings' && (
                            <Link 
                              to="/settings"
                              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium
                                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                                transition-all duration-200"
                            >
                              Go to Settings
                            </Link>
                          )}
                          
                          <motion.button 
                            className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm
                              shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                              dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                              hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                              dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                              transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            Dismiss
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div 
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center flex flex-col items-center
            shadow-[6px_6px_12px_0px_rgba(0,0,0,0.06),-6px_-6px_12px_0px_rgba(255,255,255,0.80)] 
            dark:shadow-[5px_5px_10px_0px_rgba(0,0,0,0.5),-5px_-5px_10px_0px_rgba(255,255,255,0.05)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4
            shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.5)]
            dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.03)]">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-6">
            {filter === 'unread' ? 'You have no unread notifications.' : 'You have no notifications yet.'}
          </p>
          {filter === 'unread' && notifications.length > 0 && (
            <button 
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm
                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                transition-all duration-200"
              onClick={() => setFilter('all')}
            >
              Show all notifications
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NotificationsPage;
