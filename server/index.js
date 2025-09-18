import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'multimedia-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});


