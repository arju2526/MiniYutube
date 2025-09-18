import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  uploadDate: string;
  userId: string;
  username: string;
  userAvatar: string;
  tags: string[];
  category: string;
}

interface VideoContextType {
  videos: Video[];
  addVideo: (video: Omit<Video, 'id' | 'views' | 'likes' | 'uploadDate'>) => Promise<void>;
  getVideo: (id: string) => Video | undefined;
  getUserVideos: (userId: string) => Video[];
  searchVideos: (query: string) => Video[];
  updateVideo: (id: string, updates: Partial<Video>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function useVideos() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
}

// Server base URL
const API_BASE = 'http://localhost:4000/api';

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    // Load from backend
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/videos`);
        const data: Video[] = await res.json();
        setVideos(data);
      } catch (e) {
        console.error('Failed to fetch videos', e);
      }
    })();
  }, []);

  const addVideo = async (videoData: Omit<Video, 'id' | 'views' | 'likes' | 'uploadDate'>) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(videoData)
    });
    if (!res.ok) throw new Error('Failed to create video');
    const created: Video = await res.json();
    setVideos(prev => [created, ...prev]);
  };

  const getVideo = (id: string) => {
    return videos.find(video => video.id === id);
  };

  const getUserVideos = (userId: string) => {
    return videos.filter(video => video.userId === userId);
  };

  const searchVideos = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return videos.filter(video => 
      video.title.toLowerCase().includes(lowercaseQuery) ||
      video.description.toLowerCase().includes(lowercaseQuery) ||
      video.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      video.username.toLowerCase().includes(lowercaseQuery)
    );
  };

  const updateVideo = async (id: string, updates: Partial<Video>) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/videos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update video');
    const updated: Video = await res.json();
    setVideos(prev => prev.map(video => video.id === id ? updated : video));
  };

  const deleteVideo = async (id: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/videos/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) throw new Error('Failed to delete video');
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  const value = {
    videos,
    addVideo,
    getVideo,
    getUserVideos,
    searchVideos,
    updateVideo,
    deleteVideo
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}