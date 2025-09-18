import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import VideoPage from './pages/VideoPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigateTo = (page: string, videoId?: string) => {
    setCurrentPage(page);
    if (videoId) {
      setSelectedVideoId(videoId);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'upload':
        return <UploadPage />;
      case 'video':
        return <VideoPage videoId={selectedVideoId} onNavigate={navigateTo} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case 'search':
        return <SearchPage searchQuery={searchQuery} onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <AuthProvider>
      <VideoProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <Header 
            onNavigate={navigateTo} 
            onSearch={handleSearch}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <div className="flex">
            <Sidebar 
              isOpen={sidebarOpen} 
              onNavigate={navigateTo}
              currentPage={currentPage}
            />
            <main className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? 'ml-64' : 'ml-16'
            } lg:ml-64`}>
              {renderPage()}
            </main>
          </div>
        </div>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;