import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// In-memory users store (email -> user)
const users = new Map();

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', (req, res) => {
  const { email, password, username } = req.body || {};
  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  if (users.has(email)) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const newUser = {
    id: Date.now().toString(),
    email,
    username,
    password, // NOTE: For demo only. Do NOT store plain passwords in production.
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
  };
  users.set(email, newUser);
  const token = createToken({ sub: newUser.id, email });
  res.json({ token, user: { id: newUser.id, email, username, avatar: newUser.avatar } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const existing = users.get(email);
  if (!existing || existing.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = createToken({ sub: existing.id, email });
  res.json({ token, user: { id: existing.id, email, username: existing.username, avatar: existing.avatar } });
});

export default router;

router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ message: 'Missing idToken' });
    if (!googleClient) return res.status(500).json({ message: 'Google client not configured' });

    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ message: 'Invalid token' });

    const email = payload.email || '';
    const username = payload.name || email.split('@')[0];
    const avatar = payload.picture || `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;

    let user = users.get(email);
    if (!user) {
      user = { id: Date.now().toString(), email, username, avatar };
      users.set(email, user);
    }

    const token = createToken({ sub: user.id, email });
    return res.json({ token, user: { id: user.id, email, username: user.username, avatar: user.avatar } });
  } catch (e) {
    console.error('Google auth error', e);
    return res.status(401).json({ message: 'Google authentication failed' });
  }
});


