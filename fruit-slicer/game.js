// Fruit Slicer - HTML5 Port from Python/Pygame
// Exact port of all game mechanics from the Python version
(function() {
'use strict';

// ===== CONFIG (from Python constants.py & managers.py) =====
const CONFIG = {
  gravity: 0.15,
  spawnInterval: 70, // frames (from FruitSpawner)
  maxSlicePoints: 15, // from InputHandler
  lives: 5, // from LivesManager
  
  // Difficulty scaling (from DifficultyManager)
  speedMultiplierIncrement: 0.05,
  maxSpeedMultiplier: 4.0,
  fruitsPerLevel: 10,
  
  // Special fruit chance (from FruitFactory)
  specialFruitChance: 0.05, // 5% chance for freeze banana
  
  // Background change thresholds (from game.py check_background_change)
  bgThresholds: [0, 200, 500, 1000, 1500, 2000, 2500, 3000],
  
  // Fruit types with their images
  fruits: [
    { name: 'banana', whole: 'assets/fruits/Banana.png', sliced: ['assets/fruits/BananaTop.png', 'assets/fruits/BananaBottom.png'], points: 10 },
    { name: 'apple', whole: 'assets/fruits/GreenApple.png', sliced: ['assets/fruits/GreenAppleSliced.png', 'assets/fruits/GreenAppleSliced.png'], points: 10 },
    { name: 'orange', whole: 'assets/fruits/Orange.png', sliced: ['assets/fruits/OrangeSliced.png', 'assets/fruits/OrangeSliced.png'], points: 10 },
    { name: 'watermelon', whole: 'assets/fruits/Watermelon.png', sliced: ['assets/fruits/WatermelonHalf.png', 'assets/fruits/WatermelonHalf.png'], points: 15 }
  ],
  
  // Freeze banana (special fruit)
  freezeBanana: { name: 'freezeBanana', whole: 'assets/fruits/FreezeBanana.png', sliced: ['assets/fruits/FreezeBananaSliced.png', 'assets/fruits/FreezeBananaSliced.png'], points: 20 },
  
  backgrounds: [
    'assets/Background1.png',
    'assets/Background2.png', 
    'assets/Background3.png',
    'assets/Background4.png',
    'assets/Background5.png',
    'assets/Background6.png',
    'assets/Background7.png',
    'assets/Background8.png'
  ]
};

// ===== STATE =====
let canvas, ctx;
let width, height;
let fruits = [];
let slicePoints = [];
let isSlicing = false;
let cursorPos = { x: 0, y: 0 };

let score = 0;
let lives = CONFIG.lives;
let bestScore = parseInt(localStorage.getItem('fruitSlicerBest')) || 0;
let fruitsSliced = 0;
let speedMultiplier = 1.0;
let currentLevel = 1;
let currentBgIndex = 0;

let gameState = 'menu'; // menu, playing, gameover
let spawnTimer = 0;
let lastTime = 0;

// Assets
let images = {};
let backgroundImgs = [];
let cursorImg = null;

// Audio
let audioCtx = null;

// DOM
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const comboEl = document.getElementById('combo');
const menuScreen = document.getElementById('menu');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const bestScoreEl = document.getElementById('bestScore');

// ===== ASSET LOADING =====
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('Failed to load:', src);
      resolve(null);
    };
    img.src = src;
  });
}

async function loadAssets() {
  const promises = [];
  
  // Load fruit images
  for (const fruit of CONFIG.fruits) {
    promises.push(loadImage(fruit.whole).then(img => { images[fruit.name] = img; }));
    promises.push(loadImage(fruit.sliced[0]).then(img => { images[fruit.name + '_left'] = img; }));
    promises.push(loadImage(fruit.sliced[1]).then(img => { images[fruit.name + '_right'] = img; }));
  }
  
  // Load freeze banana
  promises.push(loadImage(CONFIG.freezeBanana.whole).then(img => { images.freezeBanana = img; }));
  promises.push(loadImage(CONFIG.freezeBanana.sliced[0]).then(img => { images.freezeBanana_left = img; }));
  promises.push(loadImage(CONFIG.freezeBanana.sliced[1]).then(img => { images.freezeBanana_right = img; }));
  
  // Load all backgrounds
  for (let i = 0; i < CONFIG.backgrounds.length; i++) {
    promises.push(loadImage(CONFIG.backgrounds[i]).then(img => { backgroundImgs[i] = img; }));
  }
  
  // Load cursor
  promises.push(loadImage('assets/sword.png').then(img => { cursorImg = img; }));
  
  await Promise.all(promises);
  console.log('Assets loaded');
}

// ===== AUDIO =====
function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(freq, duration, type = 'square', volume = 0.2) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playSliceSound() {
  playSound(800, 0.1, 'sine', 0.15);
  playSound(1200, 0.08, 'sine', 0.1);
}

function playMissSound() {
  playSound(200, 0.2, 'sine', 0.15);
}

function playBgChangeSound() {
  playSound(600, 0.15, 'sine', 0.2);
  playSound(800, 0.1, 'sine', 0.15);
}

// ===== FRUIT CLASS =====
class Fruit {
  constructor(type, x, y, vx, vy, radius, isSpecial = false) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.isSpecial = isSpecial;
    
    // Python: random.uniform(-2, 2)
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 4;
    
    this.sliced = false;
    this.remove = false;
    
    // Sliced pieces
    this.leftX = 0;
    this.leftY = 0;
    this.leftVx = 0;
    this.leftVy = 0;
    this.leftRotation = 0;
    this.leftRotSpeed = 0;
    
    this.rightX = 0;
    this.rightY = 0;
    this.rightVx = 0;
    this.rightVy = 0;
    this.rightRotation = 0;
    this.rightRotSpeed = 0;
  }
  
  update() {
    if (!this.sliced) {
      // Apply gravity (Python: self.vy += self.gravity where gravity = 0.15)
      this.vy += CONFIG.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      
      // Bounce off walls with 0.9 energy preservation (from Python fruit.py)
      if (this.x < this.radius) {
        this.x = this.radius;
        this.vx = Math.abs(this.vx) * 0.9;
      } else if (this.x > width - this.radius) {
        this.x = width - this.radius;
        this.vx = -Math.abs(this.vx) * 0.9;
      }
      
      // Remove if fallen off screen (Python: if self.y > screen_height + self.radius and self.vy > 0)
      if (this.y > height + this.radius && this.vy > 0) {
        this.remove = true;
      }
    } else {
      // Update sliced pieces (same gravity)
      this.leftVy += CONFIG.gravity;
      this.leftX += this.leftVx;
      this.leftY += this.leftVy;
      this.leftRotation += this.leftRotSpeed;
      
      this.rightVy += CONFIG.gravity;
      this.rightX += this.rightVx;
      this.rightY += this.rightVy;
      this.rightRotation += this.rightRotSpeed;
      
      // Remove if both pieces off screen
      if (this.leftY > height + this.radius && this.rightY > height + this.radius) {
        this.remove = true;
      }
    }
  }
  
  checkSlice(points) {
    if (this.sliced || points.length < 2) return false;
    
    // Check if slice line intersects fruit (from Python fruit.py check_slice)
    for (let i = 0; i < points.length - 1; i++) {
      const dist = pointToLineDistance(
        this.x, this.y,
        points[i].x, points[i].y,
        points[i + 1].x, points[i + 1].y
      );
      
      if (dist < this.radius) {
        this.slice(points[i], points[i + 1]);
        return true;
      }
    }
    return false;
  }
  
  slice(p1, p2) {
    this.sliced = true;
    
    // Calculate slice direction vector and normalize (from Python fruit.py)
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = len > 0 ? dx / len : 0;
    const ny = len > 0 ? dy / len : 0;
    
    // Initialize pieces (Python: slice_force = 4.0)
    const sliceForce = 4.0;
    
    // Python: self.left_piece_x = self.x - 15
    this.leftX = this.x - 15;
    this.leftY = this.y;
    // Python: self.left_vx = self.vx - dy * slice_force
    this.leftVx = this.vx - ny * sliceForce;
    this.leftVy = this.vy + nx * sliceForce;
    // Python: random.uniform(-5, -2)
    this.leftRotSpeed = -5 + Math.random() * 3;
    
    this.rightX = this.x + 15;
    this.rightY = this.y;
    this.rightVx = this.vx + ny * sliceForce;
    this.rightVy = this.vy - nx * sliceForce;
    // Python: random.uniform(2, 5)
    this.rightRotSpeed = 2 + Math.random() * 3;
  }
  
  getPoints() {
    // Python: points calculation from FruitFactory
    let points = this.type.points;
    
    // Increase points based on level (Python: points += (current_level - 1) * 5)
    if (currentLevel > 1) {
      points += (currentLevel - 1) * 5;
    }
    
    // Double points for special fruits (Python: if is_special: points *= 2)
    if (this.isSpecial) {
      points *= 2;
    }
    
    return points;
  }
  
  render() {
    if (!this.sliced) {
      const img = images[this.type.name];
      if (img) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(img, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.restore();
      } else {
        // Fallback circle
        ctx.fillStyle = this.isSpecial ? '#00ffff' : '#ff6b6b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Draw sliced pieces
      const leftImg = images[this.type.name + '_left'];
      const rightImg = images[this.type.name + '_right'];
      
      if (leftImg) {
        ctx.save();
        ctx.translate(this.leftX, this.leftY);
        ctx.rotate(this.leftRotation);
        ctx.drawImage(leftImg, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.restore();
      }
      
      if (rightImg) {
        ctx.save();
        ctx.translate(this.rightX, this.rightY);
        ctx.rotate(this.rightRotation);
        ctx.drawImage(rightImg, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.restore();
      }
    }
  }
}

// ===== UTILITY (from Python utils.py) =====
function pointToLineDistance(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) {
    return Math.sqrt(A * A + B * B);
  }
  
  let param = dot / lenSq;
  
  let xx, yy;
  if (param < 0) {
    xx = x1; yy = y1;
  } else if (param > 1) {
    xx = x2; yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  
  return Math.sqrt((px - xx) ** 2 + (py - yy) ** 2);
}

// ===== SPAWNING (from Python FruitFactory.create_fruit) =====
function spawnFruit() {
  // Python: radius = random.randint(35, 45)
  const radius = 35 + Math.floor(Math.random() * 11);
  
  // Python: is_special = random.random() < self.special_fruit_chance (0.05)
  const isSpecial = Math.random() < CONFIG.specialFruitChance;
  
  // Select fruit type
  const type = isSpecial ? CONFIG.freezeBanana : CONFIG.fruits[Math.floor(Math.random() * CONFIG.fruits.length)];
  
  // Python: x = random.randint(radius, screen_width - radius)
  const x = radius + Math.random() * (width - radius * 2);
  
  // Python: spawn_height = random.randint(screen_height // 2, screen_height)
  const y = Math.floor(height / 2) + Math.random() * (height / 2);
  
  // Python: base_speed = speed_multiplier; if current_level <= 3: base_speed *= 0.8
  let baseSpeed = speedMultiplier;
  if (currentLevel <= 3) {
    baseSpeed *= 0.8;
  }
  
  // Python: vx = random.uniform(-1.5, 1.5) * base_speed
  const vx = (Math.random() * 3 - 1.5) * baseSpeed;
  // Python: vy = random.uniform(-8, -6) * base_speed
  const vy = (-8 + Math.random() * 2) * baseSpeed;
  
  fruits.push(new Fruit(type, x, y, vx, vy, radius, isSpecial));
}

// ===== BACKGROUND CHANGE (from Python game.py check_background_change) =====
function checkBackgroundChange() {
  let newBgIndex = 0;
  
  // Python thresholds: 0, 200, 500, 1000, 1500, 2000, 2500, 3000
  if (score < 200) newBgIndex = 0;
  else if (score < 500) newBgIndex = 1;
  else if (score < 1000) newBgIndex = 2;
  else if (score < 1500) newBgIndex = 3;
  else if (score < 2000) newBgIndex = 4;
  else if (score < 2500) newBgIndex = 5;
  else if (score < 3000) newBgIndex = 6;
  else newBgIndex = 7;
  
  // Python: if new_bg_index >= 2 and speed_multiplier < 2.0: speed_multiplier = 2.0
  if (newBgIndex >= 2 && speedMultiplier < 2.0) {
    speedMultiplier = 2.0;
  }
  
  if (newBgIndex !== currentBgIndex && newBgIndex < backgroundImgs.length) {
    currentBgIndex = newBgIndex;
    currentLevel = newBgIndex + 1;
    playBgChangeSound();
  }
}

// ===== GAME LOGIC =====
function updateGame(dt) {
  // Spawn timer (from Python FruitSpawner)
  spawnTimer++;
  if (spawnTimer >= CONFIG.spawnInterval) {
    spawnFruit();
    spawnTimer = 0;
  }
  
  // Update fruits
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];
    fruit.update();
    
    // Check slice
    if (!fruit.sliced && isSlicing && slicePoints.length > 1) {
      if (fruit.checkSlice(slicePoints)) {
        playSliceSound();
        
        // Add points (Python: self.score_manager.add_score(10) but we use fruit.getPoints())
        score += fruit.getPoints();
        fruitsSliced++;
        
        // Difficulty increase (Python: DifficultyManager.increase_difficulty)
        if (fruitsSliced % CONFIG.fruitsPerLevel === 0) {
          speedMultiplier = Math.min(CONFIG.maxSpeedMultiplier, speedMultiplier + CONFIG.speedMultiplierIncrement);
        }
        
        // Check background change
        checkBackgroundChange();
        
        updateUI();
      }
    }
    
    // Remove fallen fruits
    if (fruit.remove) {
      if (!fruit.sliced) {
        // Missed fruit - lose life (Python: self.lives_manager.lose_life())
        lives--;
        playMissSound();
        updateUI();
        
        if (lives <= 0) {
          gameOver();
          return;
        }
      }
      fruits.splice(i, 1);
    }
  }
}

function renderGame() {
  // Clear
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);
  
  // Background
  const bg = backgroundImgs[currentBgIndex];
  if (bg) {
    ctx.drawImage(bg, 0, 0, width, height);
  }
  
  // Fruits
  for (const fruit of fruits) {
    fruit.render();
  }
  
  // Slice trail (Python: draws with width 2 main line, width 4 glow)
  if (slicePoints.length > 1) {
    // Glow effect first
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(slicePoints[0].x, slicePoints[0].y);
    for (let i = 1; i < slicePoints.length; i++) {
      ctx.lineTo(slicePoints[i].x, slicePoints[i].y);
    }
    ctx.stroke();
    
    // Main line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Custom cursor
  if (cursorImg) {
    ctx.save();
    ctx.translate(cursorPos.x, cursorPos.y);
    ctx.rotate(-0.3);
    ctx.drawImage(cursorImg, -15, -50, 30, 60);
    ctx.restore();
  }
}

function updateUI() {
  scoreEl.textContent = score;
  livesEl.textContent = '❤️'.repeat(Math.max(0, lives));
}

function gameOver() {
  gameState = 'gameover';
  
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('fruitSlicerBest', bestScore);
  }
  
  finalScoreEl.textContent = score;
  bestScoreEl.textContent = bestScore;
  gameOverScreen.classList.remove('hidden');
  
  // Notify app
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score }));
  }
}

function resetGame() {
  fruits = [];
  slicePoints = [];
  score = 0;
  lives = CONFIG.lives;
  fruitsSliced = 0;
  speedMultiplier = 1.0;
  currentLevel = 1;
  currentBgIndex = 0;
  spawnTimer = 0;
  
  updateUI();
  gameOverScreen.classList.add('hidden');
  menuScreen.classList.add('hidden');
  gameState = 'playing';
}

// ===== INPUT (from Python InputHandler) =====
function getEventPos(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

function onPointerDown(e) {
  if (e.target.tagName === 'BUTTON') return;
  e.preventDefault();
  
  initAudio();
  
  if (gameState === 'menu') {
    resetGame();
    return;
  }
  
  if (gameState === 'gameover') {
    resetGame();
    return;
  }
  
  const pos = getEventPos(e);
  cursorPos = pos;
  isSlicing = true;
  slicePoints = [pos];
}

function onPointerMove(e) {
  const pos = getEventPos(e);
  cursorPos = pos;
  
  if (isSlicing && gameState === 'playing') {
    slicePoints.push(pos);
    // Python: max_slice_points = 15
    if (slicePoints.length > CONFIG.maxSlicePoints) {
      slicePoints.shift();
    }
  }
}

function onPointerUp() {
  isSlicing = false;
  slicePoints = [];
}

// ===== MAIN LOOP =====
function animate(currentTime) {
  requestAnimationFrame(animate);
  
  const dt = Math.min((currentTime - lastTime) / 1000, 0.05) || 0.016;
  lastTime = currentTime;
  
  if (gameState === 'playing') {
    updateGame(dt);
  }
  
  renderGame();
}

// ===== INIT =====
async function init() {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resize();
  window.addEventListener('resize', resize);
  
  await loadAssets();
  
  // Input
  document.addEventListener('mousedown', onPointerDown);
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('mouseup', onPointerUp);
  document.addEventListener('touchstart', onPointerDown, { passive: false });
  document.addEventListener('touchmove', onPointerMove, { passive: false });
  document.addEventListener('touchend', onPointerUp);
  document.addEventListener('touchcancel', onPointerUp);
  
  // Buttons
  document.getElementById('startBtn').onclick = () => {
    initAudio();
    resetGame();
  };
  document.getElementById('retryBtn').onclick = () => {
    resetGame();
  };
  
  updateUI();
  requestAnimationFrame(animate);
}

init();

})();
