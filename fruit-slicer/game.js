// Fruit Slicer - HTML5 Port from Python/Pygame
(function() {
'use strict';

// ===== CONFIG (from Python constants.py) =====
const CONFIG = {
  gravity: 0.15,
  fruitRadius: 40,
  spawnInterval: 70, // frames
  maxSlicePoints: 15,
  lives: 5,
  
  // Difficulty scaling
  speedMultiplierIncrement: 0.05,
  maxSpeedMultiplier: 4.0,
  fruitsPerLevel: 10,
  
  // Fruit types with their images
  fruits: [
    { name: 'banana', whole: 'assets/fruits/Banana.png', sliced: ['assets/fruits/BananaTop.png', 'assets/fruits/BananaBottom.png'], points: 10 },
    { name: 'apple', whole: 'assets/fruits/GreenApple.png', sliced: ['assets/fruits/GreenAppleSliced.png', 'assets/fruits/GreenAppleSliced.png'], points: 10 },
    { name: 'orange', whole: 'assets/fruits/Orange.png', sliced: ['assets/fruits/OrangeSliced.png', 'assets/fruits/OrangeSliced.png'], points: 10 },
    { name: 'watermelon', whole: 'assets/fruits/Watermelon.png', sliced: ['assets/fruits/WatermelonHalf.png', 'assets/fruits/WatermelonHalf.png'], points: 15 }
  ],
  
  bomb: { whole: 'assets/fruits/Bomb.png' },
  bombChance: 0.1, // 10% chance to spawn bomb
  
  backgrounds: [
    'assets/Background1.png',
    'assets/Background2.png',
    'assets/Background3.png'
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
let comboCount = 0;
let comboTimer = 0;

let gameState = 'menu'; // menu, playing, gameover
let spawnTimer = 0;
let lastTime = 0;

// Assets
let images = {};
let imagesLoaded = 0;
let totalImages = 0;
let backgroundImg = null;
let cursorImg = null;

// Audio
let audioCtx = null;
let sounds = {};

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
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('Failed to load:', src);
      resolve(null); // Don't fail, just return null
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
  
  // Load bomb
  promises.push(loadImage(CONFIG.bomb.whole).then(img => { images.bomb = img; }));
  
  // Load backgrounds
  promises.push(loadImage(CONFIG.backgrounds[0]).then(img => { backgroundImg = img; }));
  
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

function playBombSound() {
  playSound(100, 0.3, 'sawtooth', 0.3);
  playSound(80, 0.4, 'square', 0.2);
}

function playMissSound() {
  playSound(200, 0.2, 'sine', 0.15);
}

// ===== FRUIT CLASS =====
class Fruit {
  constructor(type, x, y, vx, vy) {
    this.type = type; // fruit config object or 'bomb'
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = CONFIG.fruitRadius;
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
    
    this.isBomb = type === 'bomb';
  }
  
  update() {
    if (!this.sliced) {
      // Apply gravity
      this.vy += CONFIG.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      
      // Bounce off walls
      if (this.x < this.radius) {
        this.x = this.radius;
        this.vx = Math.abs(this.vx) * 0.9;
      } else if (this.x > width - this.radius) {
        this.x = width - this.radius;
        this.vx = -Math.abs(this.vx) * 0.9;
      }
      
      // Remove if fallen off screen
      if (this.y > height + this.radius && this.vy > 0) {
        this.remove = true;
      }
    } else {
      // Update sliced pieces
      this.leftVy += CONFIG.gravity;
      this.leftX += this.leftVx;
      this.leftY += this.leftVy;
      this.leftRotation += this.leftRotSpeed;
      
      this.rightVy += CONFIG.gravity;
      this.rightX += this.rightVx;
      this.rightY += this.rightVy;
      this.rightRotation += this.rightRotSpeed;
      
      // Remove if both pieces off screen
      if (this.leftY > height + 100 && this.rightY > height + 100) {
        this.remove = true;
      }
    }
  }
  
  checkSlice(points) {
    if (this.sliced || points.length < 2) return false;
    
    // Check if slice line intersects fruit
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
    
    // Calculate slice direction
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = len > 0 ? dx / len : 0;
    const ny = len > 0 ? dy / len : 0;
    
    // Initialize pieces
    const sliceForce = 4;
    
    this.leftX = this.x - 15;
    this.leftY = this.y;
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
  
  render() {
    if (!this.sliced) {
      const img = this.isBomb ? images.bomb : images[this.type.name];
      if (img) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(img, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.restore();
      } else {
        // Fallback circle
        ctx.fillStyle = this.isBomb ? '#333' : '#ff6b6b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (!this.isBomb) {
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

// ===== UTILITY =====
function pointToLineDistance(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  let param = lenSq !== 0 ? dot / lenSq : -1;
  
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


// ===== SPAWNING =====
function spawnFruit() {
  const isBomb = Math.random() < CONFIG.bombChance;
  const type = isBomb ? 'bomb' : CONFIG.fruits[Math.floor(Math.random() * CONFIG.fruits.length)];
  
  // Random radius like Python: random.randint(35, 45)
  const radius = 35 + Math.floor(Math.random() * 11); // 35-45
  
  // Spawn at random x position
  const x = radius + Math.random() * (width - radius * 2);
  
  // Spawn from middle to bottom of screen (like Python: random.randint(screen_height // 2, screen_height))
  const y = Math.floor(height / 2) + Math.random() * (height / 2);
  
  // Velocity - EXACT Python values:
  // vx = random.uniform(-1.5, 1.5) * speed_multiplier
  // vy = random.uniform(-8, -6) * speed_multiplier
  const vx = (Math.random() * 3 - 1.5) * speedMultiplier;
  const vy = (-8 + Math.random() * 2) * speedMultiplier; // -8 to -6
  
  const fruit = new Fruit(type, x, y, vx, vy);
  fruit.radius = radius;
  fruits.push(fruit);
}

// ===== GAME LOGIC =====
function updateGame(dt) {
  // Spawn timer
  spawnTimer++;
  if (spawnTimer >= CONFIG.spawnInterval / speedMultiplier) {
    spawnFruit();
    spawnTimer = 0;
  }
  
  // Combo timer
  if (comboTimer > 0) {
    comboTimer -= dt;
    if (comboTimer <= 0) {
      comboCount = 0;
      comboEl.classList.remove('show');
    }
  }
  
  // Update fruits
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];
    fruit.update();
    
    // Check slice
    if (!fruit.sliced && isSlicing && slicePoints.length > 1) {
      if (fruit.checkSlice(slicePoints)) {
        if (fruit.isBomb) {
          // Hit bomb - game over
          playBombSound();
          gameOver();
          return;
        } else {
          // Sliced fruit
          playSliceSound();
          score += fruit.type.points;
          fruitsSliced++;
          
          // Combo
          comboCount++;
          comboTimer = 0.5;
          if (comboCount >= 3) {
            score += comboCount * 5; // Bonus
            comboEl.textContent = `${comboCount}x COMBO!`;
            comboEl.classList.add('show');
          }
          
          // Difficulty
          if (fruitsSliced % CONFIG.fruitsPerLevel === 0) {
            speedMultiplier = Math.min(CONFIG.maxSpeedMultiplier, speedMultiplier + CONFIG.speedMultiplierIncrement);
          }
          
          updateUI();
        }
      }
    }
    
    // Remove fallen fruits
    if (fruit.remove) {
      if (!fruit.sliced && !fruit.isBomb) {
        // Missed fruit
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
  if (backgroundImg) {
    ctx.drawImage(backgroundImg, 0, 0, width, height);
  }
  
  // Fruits
  for (const fruit of fruits) {
    fruit.render();
  }
  
  // Slice trail
  if (slicePoints.length > 1) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(slicePoints[0].x, slicePoints[0].y);
    for (let i = 1; i < slicePoints.length; i++) {
      ctx.lineTo(slicePoints[i].x, slicePoints[i].y);
    }
    ctx.stroke();
    
    // Glow effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 8;
    ctx.stroke();
  }
  
  // Custom cursor
  if (cursorImg) {
    ctx.save();
    ctx.translate(cursorPos.x, cursorPos.y);
    ctx.rotate(-0.3); // Slight angle
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
  comboCount = 0;
  comboTimer = 0;
  spawnTimer = 0;
  
  updateUI();
  gameOverScreen.classList.add('hidden');
  menuScreen.classList.add('hidden');
  gameState = 'playing';
}

// ===== INPUT =====
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
    if (slicePoints.length > CONFIG.maxSlicePoints) {
      slicePoints.shift();
    }
  }
}

function onPointerUp(e) {
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
  
  // Size canvas
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resize();
  window.addEventListener('resize', resize);
  
  // Load assets
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
  
  // Start
  updateUI();
  requestAnimationFrame(animate);
}

init();

})();
