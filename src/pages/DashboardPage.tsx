import React, { useState } from 'react';
import { Edit3, Trash2, Eye, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVideos } from '../contexts/VideoContext';

interface DashboardPageProps {
  onNavigate: (page: string, videoId?: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  const { getUserVideos, deleteVideo, updateVideo } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h2>
          <p className="text-gray-400">You need to be signed in to manage your videos.</p>
        </div>
      </div>
    );
  }

  const userVideos = getUserVideos(user.id);
  
  const totalViews = userVideos.reduce((sum, video) => sum + video.views, 0);
  const totalLikes = userVideos.reduce((sum, video) => sum + video.likes, 0);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatUploadDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDeleteVideo = (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      deleteVideo(videoId);
    }
  };

  return (
    <div className="p-6 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Channel Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Eye size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatViews(totalViews)}</p>
                <p className="text-gray-400">Total Views</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatViews(totalLikes)}</p>
                <p className="text-gray-400">Total Likes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{userVideos.length}</p>
                <p className="text-gray-400">Total Videos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => onNavigate('upload')}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Upload New Video
          </button>
        </div>
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Your Videos</h2>
        
        {userVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">You haven't uploaded any videos yet</p>
            <button
              onClick={() => onNavigate('upload')}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Upload Your First Video
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userVideos.map((video) => (
              <div key={video.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-32 aspect-video rounded overflow-hidden flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg truncate mb-2">{video.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                      {video.description || 'No description'}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{formatViews(video.views)} views</span>
                      <span>{formatViews(video.likes)} likes</span>
                      <span>Uploaded {formatUploadDate(video.uploadDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onNavigate('video', video.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded 
                               transition-colors"
                      title="View Video"
                    >
                      <Eye size={16} />
                    </button>
                    
                    <button
                      onClick={() => setSelectedVideo(video.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded 
                               transition-colors"
                      title="Edit Video"
                    >
                      <Edit3 size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded 
                               transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}