// Fruit Slicer - Mobile Optimized
(function() {
'use strict';

// ============================================
// CONFIGURATION (tuned for mobile portrait)
// ============================================
const CONFIG = {
  gravity: 0.35,
  fruitSize: 70,
  sliceTrailLength: 10,
  maxLives: 3,
  comboWindow: 500,
  spawnDelay: 1000,
  bombChance: 0.12,
};

// Fruit images
const FRUIT_IMAGES = [
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/1.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/2.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/3.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/4.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/5.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/6.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/7.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/8.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/9.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/10.png',
];
const BOMB_IMAGE = 'https://raw.githubusercontent.com/nicholasadamou/fruit-ninja/master/images/bomb.png';
const HEART_IMAGE = 'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/wrong.png';

const JUICE_COLORS = ['#ff6b6b','#ffa502','#ffd32a','#ff4757','#8e44ad','#e74c3c','#2ecc71','#fd79a8','#c0392b','#f39c12'];

// ============================================
// GAME STATE
// ============================================
let canvas, ctx, width, height;
let gameState = 'menu';
let score = 0, lives = CONFIG.maxLives, combo = 0;
let highScore = parseInt(localStorage.getItem('fruitslicer_high')) || 0;
let lastSliceTime = 0, spawnTimer = 0, difficulty = 1;

let fruits = [];
let splats = [];
let sliceTrail = [];
let isSlicing = false;
let lastPos = null;

const images = {};
let imagesLoaded = 0;

// Strict limits
const MAX_FRUITS = 8;
const MAX_SPLATS = 6;

const ui = {
  score: null, lives: null, combo: null,
  menu: null, gameOver: null, finalScore: null, bestScore: null
};

// ============================================
// INIT
// ============================================
function init() {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');
  
  ui.score = document.getElementById('score');
  ui.lives = document.getElementById('lives');
  ui.combo = document.getElementById('combo');
  ui.menu = document.getElementById('menu');
  ui.gameOver = document.getElementById('gameOver');
  ui.finalScore = document.getElementById('finalScore');
  ui.bestScore = document.getElementById('bestScore');
  
  resize();
  window.addEventListener('resize', resize);
  
  preloadImages();
  setupInput();
  
  document.getElementById('startBtn').onclick = startGame;
  document.getElementById('retryBtn').onclick = startGame;
  
  ui.bestScore.textContent = highScore;
  updateLivesUI();
  
  requestAnimationFrame(loop);
}

function preloadImages() {
  FRUIT_IMAGES.forEach((src, i) => {
    const img = new Image();
    img.onload = () => imagesLoaded++;
    img.src = src;
    images['f' + i] = img;
  });
  const bomb = new Image();
  bomb.onload = () => imagesLoaded++;
  bomb.src = BOMB_IMAGE;
  images.bomb = bomb;
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function setupInput() {
  const getPos = (e) => {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };
  
  const start = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    isSlicing = true;
    lastPos = getPos(e);
    sliceTrail = [lastPos];
  };
  
  const move = (e) => {
    if (!isSlicing) return;
    e.preventDefault();
    const pos = getPos(e);
    if (lastPos && gameState === 'playing') checkSlice(lastPos, pos);
    lastPos = pos;
    sliceTrail.push(pos);
    if (sliceTrail.length > CONFIG.sliceTrailLength) sliceTrail.shift();
  };
  
  const end = () => { isSlicing = false; lastPos = null; };
  
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('mouseleave', end);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);
}

function startGame() {
  gameState = 'playing';
  score = 0; lives = CONFIG.maxLives; combo = 0; difficulty = 1;
  fruits = []; splats = []; spawnTimer = 0;
  ui.menu.classList.add('hidden');
  ui.gameOver.classList.add('hidden');
  updateUI();
  updateLivesUI();
}

// ============================================
// GAME LOOP
// ============================================
let lastTime = 0;

function loop(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  
  if (gameState === 'playing') {
    update(dt);
  }
  render();
  requestAnimationFrame(loop);
}

function update(dt) {
  // Spawn
  spawnTimer -= dt * 1000;
  if (spawnTimer <= 0 && fruits.length < MAX_FRUITS) {
    spawnFruit();
    spawnTimer = CONFIG.spawnDelay / Math.min(difficulty, 1.8);
  }
  
  // Update fruits
  for (let i = fruits.length - 1; i >= 0; i--) {
    const f = fruits[i];
    f.vy += CONFIG.gravity;
    f.x += f.vx;
    f.y += f.vy;
    f.rot += f.rotSpd;
    
    // Off screen
    if (f.y > height + 80) {
      if (!f.sliced && !f.bomb) loseLife();
      fruits.splice(i, 1);
    }
  }
  
  // Fade splats
  for (let i = splats.length - 1; i >= 0; i--) {
    splats[i].a -= dt * 0.5;
    if (splats[i].a <= 0) splats.splice(i, 1);
  }
  
  // Difficulty
  difficulty = 1 + score * 0.02;
}

// ============================================
// SPAWNING - Mobile optimized (throw from bottom)
// ============================================
function spawnFruit() {
  const isBomb = Math.random() < CONFIG.bombChance;
  const size = CONFIG.fruitSize;
  
  // Spawn from bottom, random X position
  const margin = size;
  const x = margin + Math.random() * (width - margin * 2);
  const y = height + size;
  
  // Throw upward - calculate based on screen height
  // Need enough velocity to reach top third of screen
  const targetHeight = height * 0.3; // Reach top 30% of screen
  const flightTime = 1.5; // seconds to reach peak
  
  // vy = -sqrt(2 * g * h) but simplified for game feel
  const vy = -(height * 0.018 + Math.random() * 3);
  
  // Slight horizontal drift toward center
  const centerPull = (width / 2 - x) * 0.003;
  const vx = centerPull + (Math.random() - 0.5) * 2;
  
  const idx = Math.floor(Math.random() * FRUIT_IMAGES.length);
  
  fruits.push({
    x, y, vx, vy,
    bomb: isBomb,
    img: isBomb ? 'bomb' : 'f' + idx,
    color: idx,
    size: isBomb ? size * 0.85 : size,
    rot: 0,
    rotSpd: (Math.random() - 0.5) * 0.15,
    sliced: false
  });
}

// ============================================
// SLICING
// ============================================
function checkSlice(from, to) {
  for (const f of fruits) {
    if (f.sliced) continue;
    if (lineHitsCircle(from.x, from.y, to.x, to.y, f.x, f.y, f.size / 2)) {
      sliceFruit(f);
    }
  }
}

function lineHitsCircle(x1, y1, x2, y2, cx, cy, r) {
  const dx = x2 - x1, dy = y2 - y1;
  const fx = x1 - cx, fy = y1 - cy;
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - r * r;
  let disc = b * b - 4 * a * c;
  if (disc < 0) return false;
  disc = Math.sqrt(disc);
  const t1 = (-b - disc) / (2 * a);
  const t2 = (-b + disc) / (2 * a);
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}

function sliceFruit(f) {
  f.sliced = true;
  
  if (f.bomb) {
    vibrate([100, 50, 100]);
    endGame();
    return;
  }
  
  // Combo
  const now = performance.now();
  if (now - lastSliceTime < CONFIG.comboWindow) {
    combo++;
    if (combo >= 3) showCombo(combo);
  } else {
    combo = 1;
  }
  lastSliceTime = now;
  
  // Score
  const pts = Math.max(1, Math.floor(combo / 2));
  score += pts;
  
  vibrate(10);
  
  // Splat (simple, no clipping)
  if (splats.length < MAX_SPLATS) {
    splats.push({ x: f.x, y: f.y, color: JUICE_COLORS[f.color] || '#ff6b6b', size: f.size, a: 0.6 });
  }
  
  updateUI();
}

function vibrate(p) { try { navigator.vibrate && navigator.vibrate(p); } catch(e) {} }

// ============================================
// GAME STATE
// ============================================
function loseLife() {
  lives--;
  vibrate(30);
  combo = 0;
  updateUI();
  updateLivesUI();
  if (lives <= 0) endGame();
}

function endGame() {
  gameState = 'gameover';
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('fruitslicer_high', highScore);
  }
  ui.finalScore.textContent = score;
  ui.bestScore.textContent = highScore;
  setTimeout(() => ui.gameOver.classList.remove('hidden'), 300);
}

function showCombo(n) {
  ui.combo.textContent = n + 'x COMBO!';
  ui.combo.classList.remove('show');
  void ui.combo.offsetWidth;
  ui.combo.classList.add('show');
  setTimeout(() => ui.combo.classList.remove('show'), 500);
}

function updateUI() { ui.score.textContent = score; }

function updateLivesUI() {
  let h = '';
  for (let i = 0; i < CONFIG.maxLives; i++) {
    h += `<img src="${HEART_IMAGE}" class="${i >= lives ? 'lost' : ''}" alt="">`;
  }
  ui.lives.innerHTML = h;
}

// ============================================
// RENDER (simplified - no clipping)
// ============================================
function render() {
  ctx.clearRect(0, 0, width, height);
  
  // Splats
  for (const s of splats) {
    ctx.globalAlpha = s.a;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Slice trail
  if (sliceTrail.length > 1 && isSlicing) {
    ctx.lineCap = 'round';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 15;
    for (let i = 1; i < sliceTrail.length; i++) {
      const a = i / sliceTrail.length;
      ctx.strokeStyle = `rgba(255,255,255,${a * 0.8})`;
      ctx.lineWidth = 3 + a * 8;
      ctx.beginPath();
      ctx.moveTo(sliceTrail[i-1].x, sliceTrail[i-1].y);
      ctx.lineTo(sliceTrail[i].x, sliceTrail[i].y);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
  
  // Fruits
  for (const f of fruits) {
    if (f.sliced) continue;
    const img = images[f.img];
    if (!img || !img.complete) continue;
    
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot);
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    ctx.drawImage(img, -f.size/2, -f.size/2, f.size, f.size);
    ctx.restore();
  }
  
  // Fade trail when not slicing
  if (!isSlicing && sliceTrail.length > 0) sliceTrail.shift();
}

// ============================================
// START
// ============================================
init();

})();
