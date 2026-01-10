// Run: npm install puppeteer && node generate-thumbnails.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const games = [
  '2048', '2048-v2', 'tetris', 'hextris', 'hextris-v2', 'pacman', 'snake-io', 
  'flappy-bird', 'doodle-jump', 'breakout', 'pong', 'space-invaders', 
  'fruit-slicer', 'geometry-dash', 'crossy-road', 'piano-tiles', 'memory-match',
  'tic-tac-toe', 'connect4', 'bubble-pop', 'ball-bounce', 'basketball-3d',
  'block-blast', 'color-match', 'simon-says', 'number-tap', 'tower-blocks-3d',
  'asteroids', 'whack-a-mole', 'aim-trainer', 'racer', 'hyperspace', 
  'towermaster', 'chess', 'rock-paper-scissors', 'tap-tap-dash', 'basketball'
];

const outputDir = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateThumbnails() {
  const browser = await puppeteer.launch({ headless: true });
  
  for (const gameId of games) {
    console.log(`Capturing ${gameId}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 400 });
    
    try {
      await page.goto(`file://${__dirname}/${gameId}/index.html`, { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });
      
      // Wait a bit for game to render
      await sleep(2000);
      
      // Try to start the game if there's a start button
      await page.evaluate(() => {
        const btn = document.querySelector('button, .start, .play, [onclick]');
        if (btn) btn.click();
      });
      
      await sleep(1000);
      
      // Capture screenshot
      await page.screenshot({ 
        path: path.join(outputDir, `${gameId}.png`),
        clip: { x: 0, y: 0, width: 400, height: 400 }
      });
      
      console.log(`✓ ${gameId}.png saved`);
    } catch (err) {
      console.log(`✗ ${gameId} failed: ${err.message}`);
    }
    
    await page.close();
  }
  
  await browser.close();
  console.log('Done! Thumbnails saved to /thumbnails/');
}

generateThumbnails();
