import React, { useState, useEffect } from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { useVideos } from '../contexts/VideoContext';
import VideoCard from '../components/VideoCard';

interface SearchPageProps {
  searchQuery: string;
  onNavigate: (page: string, videoId?: string) => void;
}

export default function SearchPage({ searchQuery, onNavigate }: SearchPageProps) {
  const { searchVideos } = useVideos();
  const [results, setResults] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      let searchResults = searchVideos(searchQuery);
      
      // Apply filters
      if (filterBy !== 'all') {
        searchResults = searchResults.filter(video => video.category.toLowerCase() === filterBy);
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'date':
          searchResults.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
          break;
        case 'views':
          searchResults.sort((a, b) => b.views - a.views);
          break;
        case 'duration':
          searchResults.sort((a, b) => a.duration - b.duration);
          break;
        default:
          // Keep relevance order (default from search)
          break;
      }
      
      setResults(searchResults);
    }
  }, [searchQuery, sortBy, filterBy, searchVideos]);

  const categories = ['all', 'education', 'technology', 'entertainment', 'music', 'gaming', 'sports'];

  return (
    <div className="p-6 pt-20">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Search results for "{searchQuery}"
        </h1>
        <p className="text-gray-400">
          {results.length} {results.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {/* Filters and Sorting */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                   rounded-lg transition-colors"
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>

        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     focus:border-red-600 focus:outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Upload Date</option>
            <option value="views">View Count</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-3">Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterBy(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filterBy === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {results.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onNavigate('video', video.id)}
            />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">
            No videos found for "{searchQuery}"
          </p>
          <p className="text-gray-500">
            Try different keywords or check your spelling
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Enter a search term to find videos
          </p>
        </div>
      )}
    </div>
  );
}