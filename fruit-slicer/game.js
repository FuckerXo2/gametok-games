// Fruit Slicer - Polished with real images
(function() {
'use strict';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  gravity: 0.4,
  throwPower: { min: 16, max: 22 },
  spawnInterval: { min: 500, max: 1000 },
  bombChance: 0.1,
  fruitSize: 80,
  sliceTrailLength: 12,
  maxLives: 3,
  comboWindow: 600,
};

// Fruit images from the repo
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

// Juice colors for each fruit
const JUICE_COLORS = [
  '#ff6b6b', '#ffa502', '#ffd32a', '#ff4757', '#8e44ad',
  '#e74c3c', '#2ecc71', '#fd79a8', '#c0392b', '#f39c12'
];

// ============================================
// GAME STATE
// ============================================
let canvas, ctx;
let width, height;
let gameState = 'menu';
let score = 0;
let lives = CONFIG.maxLives;
let highScore = parseInt(localStorage.getItem('fruitslicer_high')) || 0;
let combo = 0;
let lastSliceTime = 0;
let spawnTimer = 0;
let difficulty = 1;

let fruits = [];
let particles = [];
let sliceTrail = [];
let juiceSplats = [];

let isSlicing = false;
let lastMousePos = null;

// Preloaded images
const images = {};
let imagesLoaded = 0;

// Limit particles to prevent memory issues
const MAX_PARTICLES = 100;
const MAX_SPLATS = 20;

// UI
const ui = {
  score: document.getElementById('score'),
  lives: document.getElementById('lives'),
  combo: document.getElementById('combo'),
  menu: document.getElementById('menu'),
  gameOver: document.getElementById('gameOver'),
  finalScore: document.getElementById('finalScore'),
  bestScore: document.getElementById('bestScore'),
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');
  
  resize();
  window.addEventListener('resize', resize);
  
  preloadImages();
  setupInput();
  setupButtons();
  
  ui.bestScore.textContent = highScore;
  updateLivesUI();
  
  requestAnimationFrame(gameLoop);
}

function preloadImages() {
  // Load fruit images
  FRUIT_IMAGES.forEach((src, i) => {
    const img = new Image();
    img.onload = () => {
      imagesLoaded++;
    };
    img.src = src;
    images[`fruit${i}`] = img;
  });
  
  // Load bomb
  const bombImg = new Image();
  bombImg.onload = () => imagesLoaded++;
  bombImg.src = BOMB_IMAGE;
  images.bomb = bombImg;
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  ctx.scale(dpr, dpr);
}

function setupInput() {
  const getPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };
  
  const onStart = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    
    isSlicing = true;
    lastMousePos = getPos(e);
    sliceTrail = [lastMousePos];
  };
  
  const onMove = (e) => {
    if (!isSlicing) return;
    e.preventDefault();
    
    const pos = getPos(e);
    
    if (lastMousePos && gameState === 'playing') {
      checkSlice(lastMousePos, pos);
    }
    
    lastMousePos = pos;
    sliceTrail.push(pos);
    if (sliceTrail.length > CONFIG.sliceTrailLength) {
      sliceTrail.shift();
    }
  };
  
  const onEnd = () => {
    isSlicing = false;
    lastMousePos = null;
  };
  
  canvas.addEventListener('mousedown', onStart);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onEnd);
  canvas.addEventListener('mouseleave', onEnd);
  
  canvas.addEventListener('touchstart', onStart, { passive: false });
  canvas.addEventListener('touchmove', onMove, { passive: false });
  canvas.addEventListener('touchend', onEnd);
  canvas.addEventListener('touchcancel', onEnd);
}

function setupButtons() {
  document.getElementById('startBtn').onclick = startGame;
  document.getElementById('retryBtn').onclick = startGame;
}

function startGame() {
  gameState = 'playing';
  score = 0;
  lives = CONFIG.maxLives;
  combo = 0;
  difficulty = 1;
  fruits = [];
  particles = [];
  juiceSplats = [];
  spawnTimer = 0;
  
  ui.menu.classList.add('hidden');
  ui.gameOver.classList.add('hidden');
  updateUI();
  updateLivesUI();
}


// ============================================
// GAME LOOP
// ============================================
let lastTime = performance.now();

function gameLoop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
  lastTime = currentTime;
  
  update(dt);
  render();
  
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  if (gameState !== 'playing') return;
  
  // Spawn fruits
  spawnTimer -= dt * 1000;
  if (spawnTimer <= 0) {
    spawnFruit();
    const interval = CONFIG.spawnInterval.min + 
      Math.random() * (CONFIG.spawnInterval.max - CONFIG.spawnInterval.min);
    spawnTimer = interval / Math.min(difficulty, 2);
  }
  
  // Update fruits
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];
    
    fruit.vy += CONFIG.gravity;
    fruit.x += fruit.vx;
    fruit.y += fruit.vy;
    fruit.rotation += fruit.rotSpeed;
    
    // Fruit fell off screen
    if (fruit.y > height + 100) {
      if (!fruit.sliced && !fruit.isBomb) {
        loseLife();
      }
      fruits.splice(i, 1);
    }
  }
  
  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vy += CONFIG.gravity * 0.6;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= dt;
    p.rotation += p.rotSpeed || 0;
    
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  
  // Fade juice splats
  for (let i = juiceSplats.length - 1; i >= 0; i--) {
    juiceSplats[i].alpha -= dt * 0.4;
    if (juiceSplats[i].alpha <= 0) {
      juiceSplats.splice(i, 1);
    }
  }
  
  // Increase difficulty
  difficulty = 1 + score * 0.015;
}

// ============================================
// SPAWNING
// ============================================
function spawnFruit() {
  const isBomb = Math.random() < CONFIG.bombChance * Math.min(difficulty, 1.5);
  
  // Spawn from bottom
  const x = 60 + Math.random() * (width - 120);
  const y = height + 60;
  
  // Throw upward at angle
  const angle = 70 + Math.random() * 40; // 70-110 degrees
  const power = CONFIG.throwPower.min + Math.random() * (CONFIG.throwPower.max - CONFIG.throwPower.min);
  const rad = angle * Math.PI / 180;
  
  const vx = Math.cos(rad) * power * (x > width/2 ? -1 : 1) * 0.4;
  const vy = -Math.sin(rad) * power;
  
  const fruitIndex = Math.floor(Math.random() * FRUIT_IMAGES.length);
  
  fruits.push({
    x, y, vx, vy,
    isBomb,
    imageKey: isBomb ? 'bomb' : `fruit${fruitIndex}`,
    colorIndex: fruitIndex,
    size: isBomb ? CONFIG.fruitSize * 0.85 : CONFIG.fruitSize,
    rotation: 0,
    rotSpeed: (Math.random() - 0.5) * 0.2,
    sliced: false,
  });
}

// ============================================
// SLICING
// ============================================
function checkSlice(from, to) {
  for (const fruit of fruits) {
    if (fruit.sliced) continue;
    
    if (lineCircleIntersect(from.x, from.y, to.x, to.y, fruit.x, fruit.y, fruit.size / 2)) {
      sliceFruit(fruit);
    }
  }
}

function lineCircleIntersect(x1, y1, x2, y2, cx, cy, r) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const fx = x1 - cx;
  const fy = y1 - cy;
  
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - r * r;
  
  let discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return false;
  
  discriminant = Math.sqrt(discriminant);
  const t1 = (-b - discriminant) / (2 * a);
  const t2 = (-b + discriminant) / (2 * a);
  
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}

function sliceFruit(fruit) {
  fruit.sliced = true;
  
  if (fruit.isBomb) {
    playBombSound();
    vibrate([100, 50, 100, 50, 200]);
    gameOver();
    return;
  }
  
  // Combo
  const now = performance.now();
  if (now - lastSliceTime < CONFIG.comboWindow) {
    combo++;
    if (combo >= 3) {
      showCombo(combo);
    }
  } else {
    combo = 1;
  }
  lastSliceTime = now;
  
  // Score
  const points = Math.max(1, Math.floor(combo / 2));
  score += points;
  
  playSliceSound();
  vibrate(15);
  
  // Juice splat
  const color = JUICE_COLORS[fruit.colorIndex] || '#ff6b6b';
  if (juiceSplats.length < MAX_SPLATS) {
    juiceSplats.push({
      x: fruit.x,
      y: fruit.y,
      color,
      size: fruit.size * 1.2,
      alpha: 0.5,
    });
  }
  
  // Fruit halves
  createFruitHalves(fruit);
  
  // Juice particles (limit count)
  const juiceCount = Math.min(8, MAX_PARTICLES - particles.length);
  for (let i = 0; i < juiceCount; i++) {
    createJuiceParticle(fruit.x, fruit.y, color);
  }
  
  // Score popup
  createScorePopup(fruit.x, fruit.y - 40, points);
  
  updateUI();
}

function createFruitHalves(fruit) {
  if (particles.length >= MAX_PARTICLES - 2) return;
  
  [-1, 1].forEach(dir => {
    particles.push({
      x: fruit.x + dir * 15,
      y: fruit.y,
      vx: fruit.vx + dir * (3 + Math.random() * 2),
      vy: fruit.vy - 3,
      imageKey: fruit.imageKey,
      size: fruit.size * 0.75,
      rotation: fruit.rotation,
      rotSpeed: dir * 0.12,
      life: 1.5,
      type: 'half',
      clipDir: dir,
    });
  });
}

function createJuiceParticle(x, y, color) {
  if (particles.length >= MAX_PARTICLES) return;
  
  const angle = Math.random() * Math.PI * 2;
  const speed = 4 + Math.random() * 5;
  
  particles.push({
    x: x + (Math.random() - 0.5) * 20,
    y: y + (Math.random() - 0.5) * 20,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 4,
    color,
    size: 5 + Math.random() * 8,
    life: 0.6,
    type: 'juice',
  });
}

function createScorePopup(x, y, points) {
  if (particles.length >= MAX_PARTICLES) return;
  
  particles.push({
    x, y,
    vx: 0,
    vy: -2.5,
    text: `+${points}`,
    life: 0.9,
    type: 'score',
  });
}

// ============================================
// AUDIO & HAPTICS
// ============================================
let audioCtx;

function initAudio() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window['webkitAudioContext'];
    audioCtx = new AudioCtx();
  }
}

function playSliceSound() {
  try {
    if (!audioCtx) initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(800 + Math.random() * 400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch(e) {}
}

function playBombSound() {
  try {
    if (!audioCtx) initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch(e) {}
}

function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch(e) {}
}


// ============================================
// GAME STATE
// ============================================
function loseLife() {
  lives--;
  vibrate(50);
  combo = 0;
  updateUI();
  updateLivesUI();
  
  if (lives <= 0) {
    gameOver();
  }
}

function gameOver() {
  gameState = 'gameover';
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('fruitslicer_high', highScore);
  }
  
  ui.finalScore.textContent = score;
  ui.bestScore.textContent = highScore;
  
  setTimeout(() => {
    ui.gameOver.classList.remove('hidden');
  }, 400);
}

function showCombo(count) {
  ui.combo.textContent = `${count}x COMBO!`;
  ui.combo.classList.remove('show');
  void ui.combo.offsetWidth;
  ui.combo.classList.add('show');
  
  setTimeout(() => {
    ui.combo.classList.remove('show');
  }, 600);
}

function updateUI() {
  ui.score.textContent = score;
}

function updateLivesUI() {
  let html = '';
  for (let i = 0; i < CONFIG.maxLives; i++) {
    const lost = i >= lives;
    html += `<img src="${HEART_IMAGE}" class="${lost ? 'lost' : ''}" alt="life">`;
  }
  ui.lives.innerHTML = html;
}

// ============================================
// RENDERING
// ============================================
function render() {
  // Clear (background is CSS)
  ctx.clearRect(0, 0, width, height);
  
  // Juice splats
  for (const splat of juiceSplats) {
    ctx.save();
    ctx.globalAlpha = splat.alpha;
    ctx.fillStyle = splat.color;
    ctx.beginPath();
    ctx.arc(splat.x, splat.y, splat.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // Slice trail
  if (sliceTrail.length > 1 && isSlicing) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Glow
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 20;
    
    for (let i = 1; i < sliceTrail.length; i++) {
      const alpha = i / sliceTrail.length;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      ctx.lineWidth = 4 + alpha * 10;
      
      ctx.beginPath();
      ctx.moveTo(sliceTrail[i - 1].x, sliceTrail[i - 1].y);
      ctx.lineTo(sliceTrail[i].x, sliceTrail[i].y);
      ctx.stroke();
    }
    ctx.restore();
  }
  
  // Fruits
  for (const fruit of fruits) {
    if (fruit.sliced) continue;
    
    const img = images[fruit.imageKey];
    if (!img || !img.complete) continue;
    
    ctx.save();
    ctx.translate(fruit.x, fruit.y);
    ctx.rotate(fruit.rotation);
    
    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    
    ctx.drawImage(img, -fruit.size/2, -fruit.size/2, fruit.size, fruit.size);
    ctx.restore();
  }
  
  // Particles
  for (const p of particles) {
    ctx.save();
    
    if (p.type === 'half') {
      const img = images[p.imageKey];
      if (img && img.complete) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.min(1, p.life);
        
        // Clip half
        ctx.beginPath();
        if (p.clipDir < 0) {
          ctx.rect(-p.size, -p.size, p.size, p.size * 2);
        } else {
          ctx.rect(0, -p.size, p.size, p.size * 2);
        }
        ctx.clip();
        
        ctx.drawImage(img, -p.size/2, -p.size/2, p.size, p.size);
      }
      
    } else if (p.type === 'juice') {
      ctx.globalAlpha = Math.min(1, p.life * 1.8);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * Math.min(1, p.life + 0.3), 0, Math.PI * 2);
      ctx.fill();
      
    } else if (p.type === 'score') {
      ctx.globalAlpha = Math.min(1, p.life * 1.2);
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 6;
      ctx.fillText(p.text, p.x, p.y);
    }
    
    ctx.restore();
  }
  
  // Fade trail
  if (!isSlicing && sliceTrail.length > 0) {
    sliceTrail.shift();
  }
}

// ============================================
// START
// ============================================
init();

})();
