# GameTok Games

Standalone HTML5 games for GameTok.

## Structure

```
gametok-games/
├── stack-ball/
│   └── index.html
├── helix-jump/
│   └── index.html
├── gravity-flip/
│   └── index.html
├── color-match/
│   └── index.html
├── orbit/
│   └── index.html
└── stack-tower/
    └── index.html
```

## Hosting

### Option 1: Cloudflare Pages (Recommended)
1. Push this folder to GitHub
2. Connect to Cloudflare Pages
3. Deploy — get URLs like: `https://gametok-games.pages.dev/stack-ball/`

### Option 2: GitHub Pages
1. Push to GitHub
2. Enable Pages in repo settings
3. Get URLs like: `https://yourusername.github.io/gametok-games/stack-ball/`

### Option 3: Vercel
1. `npx vercel` in this folder
2. Get URLs like: `https://gametok-games.vercel.app/stack-ball/`

## Adding to Backend

Once hosted, add games to the backend:

```bash
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Stack Ball",
    "description": "Hold to smash through platforms!",
    "icon": "🎱",
    "color": "#667eea",
    "game_url": "https://your-host.com/stack-ball/"
  }'
```

## Game Requirements

Each game must:
1. Be a single `index.html` file (can load external scripts like Three.js from CDN)
2. Work on mobile (touch events)
3. Send scores to parent app via:
   ```js
   if (window.ReactNativeWebView) {
     window.ReactNativeWebView.postMessage(JSON.stringify({ 
       type: 'score', 
       score: 123 
     }));
   }
   ```
