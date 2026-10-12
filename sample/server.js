// GameTok sample game server (Node 18+, no dependencies).
//
// Your game sends the player's session (from GameTok.init() / GameTok.session()) to your own
// server. Your server checks it with GameTok using your secret API key before trusting the
// player. Never put the key in game code.
//
//   GAMETOK_API_KEY=gtk_test_... node server.js     (test key in the test player)
//   GAMETOK_API_KEY=gtk_live_... node server.js     (live key once the game is live)
//
// Then from the game:  fetch('https://your-server.example/api/me', { method: 'POST', body: JSON.stringify({ session }) })

const http = require('http');

const GAMETOK_API = 'https://gametok-backend-267787411422.us-central1.run.app/api';
const API_KEY = process.env.GAMETOK_API_KEY;
if (!API_KEY) throw new Error('Set GAMETOK_API_KEY');

async function verifySession(session) {
  const res = await fetch(`${GAMETOK_API}/developer/sessions/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ session }),
  });
  const data = await res.json();
  // { valid: true, gameId, mode, player: { id, name, guest }, expiresAt }  or  { valid: false, code, error }
  return res.ok ? data : null;
}

http.createServer(async (req, res) => {
  // Allow your game's origin to call this server.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.end();

  if (req.method === 'POST' && req.url === '/api/me') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { session } = JSON.parse(body || '{}');
    const verified = await verifySession(session);
    if (!verified) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid or expired GameTok session' }));
    }
    // verified.player.id is stable for this player in YOUR game: use it as your user id
    // (save progress, coins, unlocks... against it).
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ player: verified.player, mode: verified.mode }));
  }

  res.writeHead(404);
  res.end();
}).listen(process.env.PORT || 3000, () => console.log('Sample game server on :' + (process.env.PORT || 3000)));
