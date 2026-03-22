/**
 * PORTFOLIO ADMIN SERVER
 * ──────────────────────
 * 1. Run this server:    node admin-server.js
 * 2. Run portfolio:      ng serve
 * 3. Open admin UI:      http://localhost:4200/admin
 * 4. Open portfolio:     http://localhost:4200
 *
 * Changes made in the admin UI are written DIRECTLY
 * to src/assets/profile-data.json in real time.
 * The portfolio hot-reloads automatically.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const JSON_PATH = path.join(__dirname, 'src', 'assets', 'profile-data.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// GET — Read current profile data
app.get('/api/profile', (req, res) => {
  try {
    const data = fs.readFileSync(JSON_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read profile data', detail: err.message });
  }
});

// POST — Write updated profile data
app.post('/api/profile', (req, res) => {
  try {
    const updated = JSON.stringify(req.body, null, 2);
    fs.writeFileSync(JSON_PATH, updated, 'utf8');
    res.json({ success: true, message: 'Profile data saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write profile data', detail: err.message });
  }
});

// GET — Read raw JSON string (for editor view)
app.get('/api/profile/raw', (req, res) => {
  try {
    const data = fs.readFileSync(JSON_PATH, 'utf8');
    res.json({ raw: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read raw data' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Admin API running at http://localhost:${PORT}`);
  console.log(`📁 Editing: ${JSON_PATH}\n`);
});
