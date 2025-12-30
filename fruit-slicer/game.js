// Fruit Slicer - Polished Version
(function() {
'use strict';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  gravity: 0.35,
  throwPower: { min: 14, max: 20 },
  throwAngle: { min: 70, max: 110 },
  spawnInterval: { min: 600, max: 1200 },
  bombChance: 0.12,
  fruitSize: 70,
  sliceTrailLength: 15,
  maxLives: 3,
  comboWindow: 800,
};

// Fruit types with colors and points
const FRUITS = [
  { emoji: '🍎', name: 'apple', color: '#ff6b6b', points: 1 },
  { emoji: '🍊', name: 'orange', color: '#ffa502', points: 1 },
  { emoji: '🍋', name: 'lemon', color: '#ffd32a', points: 1 },
  { emoji: '🍉', name: 'watermelon', color: '#ff4757', points: 2 },
  { emoji: '🍇', name: 'grape', color: '#8e44ad', points: 1 },
  { emoji: '🍓', name: 'strawberry', color: '#e74c3c', points: 1 },
  { emoji: '🥝', name: 'kiwi', color: '#2ecc71', points: 2 },
  { emoji: '🍑', name: 'peach', color: '#fd79a8', points: 1 },
  { emoji: '🍒', name: 'cherry', color: '#c0392b', points: 2 },
  { emoji: '🥭', name: 'mango', color: '#f39c12', points: 2 },
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

// Audio context
let audioCtx;

// ============================================
// UI ELEMENTS
// ============================================
const ui = {
  score: document.getElementById('score'),
  lives: document.getElementById('lives'),
  bestScore: document.getElementById('best-score'),
  combo: document.getElementById('combo'),
  menu: document.getElementById('menu'),
  gameOver: document.getElementById('gameOver'),
  finalScore: document.getElementById('finalScore'),
  bestScoreEnd: document.getElementById('bestScoreEnd'),
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');
  
  resize();
  window.addEventListener('resize', resize);
  
  setupInput();
  setupButtons();
  
  ui.bestScore.textContent = highScore;
  
  requestAnimationFrame(gameLoop);
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
    if (e.touches) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };
  
  const onStart = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    
    if (!audioCtx) initAudio();
    
    isSlicing = true;
    lastMousePos = getPos(e);
    sliceTrail = [lastMousePos];
  };
  
  const onMove = (e) => {
    if (!isSlicing) return;
    e.preventDefault();
    
    const pos = getPos(e);
    
    // Check for fruit slicing
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
  if (!audioCtx) initAudio();
  
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
}


// ============================================
// AUDIO
// ============================================
function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  const now = audioCtx.currentTime;
  
  switch(type) {
    case 'slice':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
      
    case 'combo':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + combo * 100, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
      
    case 'bomb':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;
      
    case 'miss':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
  }
}

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
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
    spawnTimer = interval / difficulty;
  }
  
  // Update fruits
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];
    
    fruit.vy += CONFIG.gravity;
    fruit.x += fruit.vx;
    fruit.y += fruit.vy;
    fruit.rotation += fruit.rotSpeed;
    
    // Check if fruit fell off screen without being sliced
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
    p.vy += CONFIG.gravity * 0.5;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= dt;
    p.rotation += p.rotSpeed || 0;
    
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  
  // Update juice splats (fade out)
  for (let i = juiceSplats.length - 1; i >= 0; i--) {
    juiceSplats[i].alpha -= dt * 0.3;
    if (juiceSplats[i].alpha <= 0) {
      juiceSplats.splice(i, 1);
    }
  }
  
  // Increase difficulty over time
  difficulty = 1 + score * 0.01;
}

// ============================================
// SPAWNING
// ============================================
function spawnFruit() {
  const isBomb = Math.random() < CONFIG.bombChance * difficulty;
  
  // Spawn from bottom, throw upward
  const x = 50 + Math.random() * (width - 100);
  const y = height + 50;
  
  // Random angle and power
  const angle = CONFIG.throwAngle.min + Math.random() * (CONFIG.throwAngle.max - CONFIG.throwAngle.min);
  const power = CONFIG.throwPower.min + Math.random() * (CONFIG.throwPower.max - CONFIG.throwPower.min);
  const rad = angle * Math.PI / 180;
  
  const vx = Math.cos(rad) * power * (Math.random() < 0.5 ? 1 : -1) * 0.3;
  const vy = -Math.sin(rad) * power;
  
  if (isBomb) {
    fruits.push({
      x, y, vx, vy,
      isBomb: true,
      emoji: '💣',
      color: '#333',
      size: CONFIG.fruitSize * 0.9,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      sliced: false,
    });
  } else {
    const type = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    fruits.push({
      x, y, vx, vy,
      isBomb: false,
      emoji: type.emoji,
      color: type.color,
      points: type.points,
      size: CONFIG.fruitSize,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      sliced: false,
    });
  }
}

// ============================================
// SLICING
// ============================================
function checkSlice(from, to) {
  for (const fruit of fruits) {
    if (fruit.sliced) continue;
    
    // Check line-circle intersection
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
    // Hit bomb - game over
    playSound('bomb');
    vibrate([100, 50, 100, 50, 200]);
    gameOver();
    return;
  }
  
  // Update combo
  const now = performance.now();
  if (now - lastSliceTime < CONFIG.comboWindow) {
    combo++;
    if (combo >= 3) {
      showCombo(combo);
      playSound('combo');
    }
  } else {
    combo = 1;
  }
  lastSliceTime = now;
  
  // Add score
  const points = fruit.points * Math.max(1, Math.floor(combo / 2));
  score += points;
  
  playSound('slice');
  vibrate(15);
  
  // Create juice splat
  juiceSplats.push({
    x: fruit.x,
    y: fruit.y,
    color: fruit.color,
    size: fruit.size * 1.5,
    alpha: 0.6,
  });
  
  // Create fruit halves
  createFruitHalves(fruit);
  
  // Create juice particles
  for (let i = 0; i < 12; i++) {
    createJuiceParticle(fruit.x, fruit.y, fruit.color);
  }
  
  // Score popup
  createScorePopup(fruit.x, fruit.y - 30, points);
  
  updateUI();
}

function createFruitHalves(fruit) {
  // Left half
  particles.push({
    x: fruit.x - 10,
    y: fruit.y,
    vx: fruit.vx - 3 - Math.random() * 2,
    vy: fruit.vy - 2,
    emoji: fruit.emoji,
    size: fruit.size * 0.8,
    rotation: fruit.rotation,
    rotSpeed: -0.15,
    life: 2,
    type: 'half',
    clipLeft: true,
  });
  
  // Right half
  particles.push({
    x: fruit.x + 10,
    y: fruit.y,
    vx: fruit.vx + 3 + Math.random() * 2,
    vy: fruit.vy - 2,
    emoji: fruit.emoji,
    size: fruit.size * 0.8,
    rotation: fruit.rotation,
    rotSpeed: 0.15,
    life: 2,
    type: 'half',
    clipLeft: false,
  });
}

function createJuiceParticle(x, y, color) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 3 + Math.random() * 6;
  
  particles.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 3,
    color,
    size: 4 + Math.random() * 6,
    life: 0.5 + Math.random() * 0.3,
    type: 'juice',
  });
}

function createScorePopup(x, y, points) {
  particles.push({
    x,
    y,
    vx: 0,
    vy: -2,
    text: `+${points}`,
    life: 0.8,
    type: 'score',
  });
}


// ============================================
// GAME STATE
// ============================================
function loseLife() {
  lives--;
  playSound('miss');
  vibrate(50);
  combo = 0;
  updateUI();
  
  if (lives <= 0) {
    gameOver();
  }
}

function gameOver() {
  gameState = 'gameover';
  
  // Save high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('fruitslicer_high', highScore);
  }
  
  ui.finalScore.textContent = score;
  ui.bestScoreEnd.textContent = highScore;
  ui.bestScore.textContent = highScore;
  
  setTimeout(() => {
    ui.gameOver.classList.remove('hidden');
  }, 500);
}

function showCombo(count) {
  ui.combo.textContent = `${count}x COMBO!`;
  ui.combo.classList.remove('show');
  void ui.combo.offsetWidth; // Trigger reflow
  ui.combo.classList.add('show');
  
  setTimeout(() => {
    ui.combo.classList.remove('show');
  }, 600);
}

function updateUI() {
  ui.score.textContent = score;
  ui.lives.textContent = '❤️'.repeat(lives) + '🖤'.repeat(CONFIG.maxLives - lives);
}

// ============================================
// RENDERING
// ============================================
function render() {
  // Clear with gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw juice splats (background)
  for (const splat of juiceSplats) {
    ctx.save();
    ctx.globalAlpha = splat.alpha;
    ctx.fillStyle = splat.color;
    ctx.beginPath();
    ctx.arc(splat.x, splat.y, splat.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // Draw slice trail
  if (sliceTrail.length > 1 && isSlicing) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    for (let i = 1; i < sliceTrail.length; i++) {
      const alpha = i / sliceTrail.length;
      const lineWidth = 3 + alpha * 8;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.lineWidth = lineWidth;
      
      ctx.beginPath();
      ctx.moveTo(sliceTrail[i - 1].x, sliceTrail[i - 1].y);
      ctx.lineTo(sliceTrail[i].x, sliceTrail[i].y);
      ctx.stroke();
    }
    
    // Glow effect
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sliceTrail[0].x, sliceTrail[0].y);
    for (let i = 1; i < sliceTrail.length; i++) {
      ctx.lineTo(sliceTrail[i].x, sliceTrail[i].y);
    }
    ctx.stroke();
    
    ctx.restore();
  }
  
  // Draw fruits
  for (const fruit of fruits) {
    if (fruit.sliced) continue;
    
    ctx.save();
    ctx.translate(fruit.x, fruit.y);
    ctx.rotate(fruit.rotation);
    
    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    
    ctx.font = `${fruit.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fruit.emoji, 0, 0);
    
    ctx.restore();
  }
  
  // Draw particles
  for (const p of particles) {
    ctx.save();
    
    if (p.type === 'half') {
      // Fruit halves
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      // Clip to show half
      ctx.beginPath();
      if (p.clipLeft) {
        ctx.rect(-p.size, -p.size, p.size, p.size * 2);
      } else {
        ctx.rect(0, -p.size, p.size, p.size * 2);
      }
      ctx.clip();
      
      ctx.globalAlpha = Math.min(1, p.life);
      ctx.font = `${p.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      
    } else if (p.type === 'juice') {
      // Juice droplets
      ctx.globalAlpha = p.life * 2;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (p.type === 'score') {
      // Score popup
      ctx.globalAlpha = p.life;
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(p.text, p.x, p.y);
    }
    
    ctx.restore();
  }
  
  // Fade trail when not slicing
  if (!isSlicing && sliceTrail.length > 0) {
    sliceTrail.shift();
  }
}

// ============================================
// START
// ============================================
init();

})();
