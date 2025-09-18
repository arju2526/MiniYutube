import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal } from 'lucide-react';
import { useVideos } from '../contexts/VideoContext';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';

interface VideoPageProps {
  videoId: string | null;
  onNavigate: (page: string, videoId?: string) => void;
}

export default function VideoPage({ videoId, onNavigate }: VideoPageProps) {
  const { videos, getVideo, updateVideo } = useVideos();
  const [showDescription, setShowDescription] = useState(false);
  
  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Video not found</p>
      </div>
    );
  }

  const video = getVideo(videoId);
  
  if (!video) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Video not found</p>
      </div>
    );
  }

  // Get related videos (excluding current video)
  const relatedVideos = videos
    .filter(v => v.id !== video.id)
    .slice(0, 10);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatUploadDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleLike = () => {
    updateVideo(video.id, { likes: video.likes + 1 });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 pt-20">
      {/* Main Content */}
      <div className="flex-1">
        {/* Video Player */}
        <div className="mb-6">
          <VideoPlayer
            src={video.videoUrl}
            poster={video.thumbnail}
            title={video.title}
          />
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatUploadDate(video.uploadDate)}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                         rounded-full transition-colors"
              >
                <ThumbsUp size={18} />
                <span>{formatViews(video.likes)}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                               rounded-full transition-colors">
                <ThumbsDown size={18} />
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                               rounded-full transition-colors">
                <Share size={18} />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                               rounded-full transition-colors">
                <Download size={18} />
                <span>Download</span>
              </button>
              
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <img
              src={video.userAvatar}
              alt={video.username}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-medium text-lg">{video.username}</h3>
              <button className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full 
                               text-sm font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className={`${showDescription ? '' : 'line-clamp-3'} whitespace-pre-wrap`}>
              {video.description}
            </div>
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="mt-2 text-red-400 hover:text-red-300 font-medium"
            >
              {showDescription ? 'Show less' : 'Show more'}
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 text-sm rounded-full hover:bg-gray-700 
                         cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar - Related Videos */}
      <div className="w-full lg:w-96">
        <h3 className="text-lg font-medium mb-4">Related Videos</h3>
        <div className="space-y-4">
          {relatedVideos.map((relatedVideo) => (
            <div key={relatedVideo.id} className="flex space-x-3">
              <div className="w-40 flex-shrink-0">
                <VideoCard
                  video={relatedVideo}
                  onClick={() => onNavigate('video', relatedVideo.id)}
                  size="small"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}