import express from 'express';
import jwt from 'jsonwebtoken';
import { seedVideos } from '../data/seed.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// In-memory videos store
let videos = seedVideos();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

router.get('/', (req, res) => {
  res.json(videos);
});

router.get('/:id', (req, res) => {
  const video = videos.find(v => v.id === req.params.id);
  if (!video) return res.status(404).json({ message: 'Not found' });
  res.json(video);
});

router.post('/', authMiddleware, (req, res) => {
  const { title, description, thumbnail, videoUrl, duration, tags, category, username, userAvatar } = req.body || {};
  if (!title || !videoUrl || !thumbnail) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const newVideo = {
    id: Date.now().toString(),
    title,
    description: description || '',
    thumbnail,
    videoUrl,
    duration: duration || 0,
    views: 0,
    likes: 0,
    uploadDate: new Date().toISOString().split('T')[0],
    userId: req.user.id,
    username: username || 'user',
    userAvatar: userAvatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(req.user.email)}`,
    tags: Array.isArray(tags) ? tags : [],
    category: category || 'Education'
  };
  videos = [newVideo, ...videos];
  res.status(201).json(newVideo);
});

router.patch('/:id', authMiddleware, (req, res) => {
  const idx = videos.findIndex(v => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  videos[idx] = { ...videos[idx], ...req.body };
  res.json(videos[idx]);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const before = videos.length;
  videos = videos.filter(v => v.id !== req.params.id);
  if (videos.length === before) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
});

export default router;


