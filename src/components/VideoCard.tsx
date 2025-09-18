import React from 'react';
import { Eye, Clock, User } from 'lucide-react';
import { Video } from '../contexts/VideoContext';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function VideoCard({ video, onClick, size = 'medium' }: VideoCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatUploadDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const cardClasses = {
    small: 'w-full',
    medium: 'w-full max-w-sm',
    large: 'w-full max-w-md'
  };

  return (
    <div 
      className={`cursor-pointer group ${cardClasses[size]}`}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="video-thumbnail w-full h-full"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs 
                      px-2 py-1 rounded flex items-center space-x-1">
          <Clock size={12} />
          <span>{formatDuration(video.duration)}</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 
                      transition-all duration-200" />
      </div>

      {/* Video Info */}
      <div className="space-y-2">
        <h3 className="font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
          {video.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <img
            src={video.userAvatar}
            alt={video.username}
            className="w-6 h-6 rounded-full"
          />
          <span className="hover:text-white transition-colors">{video.username}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Eye size={14} />
            <span>{formatViews(video.views)} views</span>
          </div>
          <span>•</span>
          <span>{formatUploadDate(video.uploadDate)}</span>
        </div>
      </div>
    </div>
  );
}