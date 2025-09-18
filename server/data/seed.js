export const seedVideos = () => {
  const now = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const base = [
    {
      id: '1',
      title: 'Introduction to React Hooks',
      description: "Learn the fundamentals of React Hooks in this comprehensive tutorial.",
      thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 1260,
      views: 15420,
      likes: 1205,
      uploadDate: fmt(new Date(now.getTime() - 8 * 86400000)),
      userId: '1',
      username: 'reactdev',
      userAvatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      tags: ['react', 'javascript', 'tutorial', 'hooks'],
      category: 'Education'
    },
    {
      id: '2',
      title: 'Modern CSS Animations',
      description: 'Explore advanced CSS animation techniques and create stunning visual effects.',
      thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 980,
      views: 8765,
      likes: 892,
      uploadDate: fmt(new Date(now.getTime() - 6 * 86400000)),
      userId: '2',
      username: 'cssmaster',
      userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      tags: ['css', 'animation', 'web design', 'frontend'],
      category: 'Education'
    },
    {
      id: '3',
      title: 'Beautiful Nature Documentary',
      description: 'Experience the wonders of nature in stunning 4K quality.',
      thumbnail: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 2100,
      views: 45230,
      likes: 3890,
      uploadDate: fmt(new Date(now.getTime() - 7 * 86400000)),
      userId: '3',
      username: 'naturelover',
      userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      tags: ['nature', 'documentary', '4k', 'wildlife'],
      category: 'Documentary'
    },
    {
      id: '4',
      title: 'JavaScript ES6 Features',
      description: 'Deep dive into ES6 features including arrow functions and modules.',
      thumbnail: 'https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: 1540,
      views: 12340,
      likes: 1156,
      uploadDate: fmt(new Date(now.getTime() - 5 * 86400000)),
      userId: '1',
      username: 'reactdev',
      userAvatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      tags: ['javascript', 'es6', 'tutorial', 'programming'],
      category: 'Education'
    },
  ];

  const extra = [
    {
      title: 'AI Music Mix - Chill Beats',
      description: 'Lo-fi chill beats to relax and study to.',
      thumbnail: 'https://images.pexels.com/photos/1647123/pexels-photo-1647123.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      duration: 3600,
      views: 985421,
      likes: 24012,
      userId: '4',
      username: 'aibeats',
      userAvatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      tags: ['music', 'lofi', 'chill', 'mix'],
      category: 'Music'
    },
    {
      title: 'Top 10 Gaming Moments',
      description: 'The craziest gaming moments compiled for you.',
      thumbnail: 'https://images.pexels.com/photos/777263/pexels-photo-777263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: 1200,
      views: 320120,
      likes: 15423,
      userId: '5',
      username: 'gamehub',
      userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      tags: ['gaming', 'top10', 'highlights'],
      category: 'Gaming'
    },
    {
      title: 'Tech News Weekly',
      description: 'All the latest in technology this week.',
      thumbnail: 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      duration: 900,
      views: 54210,
      likes: 3801,
      userId: '6',
      username: 'technews',
      userAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      tags: ['technology', 'news', 'weekly'],
      category: 'Technology'
    },
    {
      title: 'Football Skills Tutorial',
      description: 'Master the basics of football skills and drills.',
      thumbnail: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      duration: 1100,
      views: 84210,
      likes: 5123,
      userId: '7',
      username: 'coachpro',
      userAvatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      tags: ['sports', 'football', 'skills'],
      category: 'Sports'
    },
    {
      title: 'Comedy Night - Standup Highlights',
      description: 'Best moments from the comedy night.',
      thumbnail: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      duration: 1800,
      views: 201204,
      likes: 12110,
      userId: '8',
      username: 'laughhub',
      userAvatar: 'https://images.pexels.com/photos/211050/pexels-photo-211050.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      tags: ['comedy', 'standup', 'entertainment'],
      category: 'Entertainment'
    }
  ].map((v, idx) => ({
    id: (base.length + idx + 1).toString(),
    uploadDate: fmt(new Date(now.getTime() - (idx + 1) * 86400000)),
    ...v,
  }));

  return [...base, ...extra];
};


