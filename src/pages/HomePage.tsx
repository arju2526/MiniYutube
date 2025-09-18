import React from 'react';
import { useVideos } from '../contexts/VideoContext';
import VideoCard from '../components/VideoCard';

interface HomePageProps {
  onNavigate: (page: string, videoId?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { videos } = useVideos();

  const categories = ['All', 'Education', 'Technology', 'Entertainment', 'Music', 'Gaming', 'Sports'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div className="p-6 pt-20">
      {/* Category Filters */}
      <div className="mb-8 flex space-x-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => onNavigate('video', video.id)}
          />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No videos found in this category</p>
        </div>
      )}
    </div>
  );
}