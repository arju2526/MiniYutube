import React, { useState, useRef } from 'react';
import { Upload, X, Play, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVideos } from '../contexts/VideoContext';

export default function UploadPage() {
  const { user } = useAuth();
  const { addVideo } = useVideos();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'Education',
    thumbnail: ''
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to upload videos</h2>
          <p className="text-gray-400">You need to be signed in to upload and manage videos.</p>
        </div>
      </div>
    );
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      
      // Auto-fill title from filename
      if (!videoData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        setVideoData(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateThumbnail = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!videoPreview) {
        // Use a default thumbnail
        resolve('https://images.pexels.com/photos/1659437/pexels-photo-1659437.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop');
        return;
      }

      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 1; // Seek to 1 second for thumbnail
      });

      video.addEventListener('seeked', () => {
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnailUrl);
        }
      });

      video.src = videoPreview;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    setUploading(true);

    try {
      // Generate thumbnail
      const thumbnail = await generateThumbnail();
      
      // In a real application, you would upload the video file to a server/cloud storage
      // For this demo, we'll use the object URL
      const videoUrl = videoPreview || '';
      
      // Create video object
      const newVideo = {
        title: videoData.title,
        description: videoData.description,
        thumbnail: thumbnail,
        videoUrl: videoUrl,
        duration: 0, // Would be calculated from actual video
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar || '',
        tags: videoData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        category: videoData.category
      };

      addVideo(newVideo);

      // Reset form
      setVideoData({
        title: '',
        description: '',
        tags: '',
        category: 'Education',
        thumbnail: ''
      });
      removeSelectedFile();

      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold mb-8">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Upload Area */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Video File</h2>
          
          {!selectedFile ? (
            <div
              className={`upload-area p-12 text-center rounded-lg cursor-pointer ${
                dragOver ? 'drag-over' : ''
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">Choose video file to upload</h3>
              <p className="text-gray-400 mb-4">Drag and drop video files here, or click to select</p>
              <p className="text-sm text-gray-500">
                Supported formats: MP4, MOV, AVI, WMV (Max size: 2GB)
              </p>
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Selected Video</h3>
                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex items-start space-x-4">
                {videoPreview && (
                  <div className="w-40 aspect-video bg-gray-900 rounded overflow-hidden">
                    <video
                      src={videoPreview}
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Video Details */}
        {selectedFile && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Video Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={videoData.title}
                    onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                             focus:border-red-600 focus:outline-none"
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={videoData.category}
                    onChange={(e) => setVideoData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                             focus:border-red-600 focus:outline-none"
                  >
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Music">Music</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={videoData.tags}
                    onChange={(e) => setVideoData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                             focus:border-red-600 focus:outline-none"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={videoData.description}
                  onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                           focus:border-red-600 focus:outline-none resize-none"
                  placeholder="Describe your video..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={removeSelectedFile}
                className="px-6 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 
                         rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !videoData.title}
                className="flex items-center space-x-2 px-6 py-2 bg-red-600 hover:bg-red-700 
                         disabled:bg-gray-600 rounded-lg transition-colors"
              >
                <Save size={16} />
                <span>{uploading ? 'Uploading...' : 'Upload Video'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}