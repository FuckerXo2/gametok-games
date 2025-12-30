// Stack Ball - DOM-based rebuild using Unity source as reference
(function() {
'use strict';

// ===== CONFIG (from Unity Ball.cs, Generator.prefab) =====
const CONFIG = {
  // Level
  platformCount: 25,
  platformSpacing: 45,        // pixels between platforms
  segmentsPerPlatform: 8,
  minSafeParts: 2,            // minimum non-danger segments
  
  // Ball physics (from Ball.cs)
  gravity: 1800,              // pixels/s²
  jumpVelocity: 600,          // bounce velocity
  smashVelocity: 1200,        // velocity when holding
  
  // Invincibility (from BallInvincibility)
  platformsToEnableIndicator: 8,
  secondsPerPlatform: 0.12,
  secondsToEnableInvincible: 3,
  invincibleDuration: 2.5,
  
  // Platform rotation (from Rotator.cs)
  rotationSpeed: 40,          // degrees per second
  
  // Visual
  platformRadius: 55,         // distance from center to segment
  segmentWidth: 50,
  segmentHeight: 18,
};

// ===== STATE =====
let gameState = 'menu';       // menu, playing, win, lose
let isHolding = false;
let score = 0;
let level = parseInt(localStorage.getItem('stackBallLevel')) || 1;
let bestScore = parseInt(localStorage.getItem('stackBallBest')) || 0;

// Ball state
let ballY = 0;
let ballVelocity = 0;

// Platform state
let platforms = [];
let currentRotation = 0;
let destroyedCount = 0;

// Invincibility (from Ball.cs)
let isInvincible = false;
let invincibleTimer = 0;
let destroyedPlatformCount = 0;
let invincibleChargeTimer = 0;

// Particles
let debris = [];
let splashes = [];

// Audio
let soundEnabled = true;
let sounds = {};

// Color palettes
const palettes = [
  { main: '#ff6b6b', gradient: ['#ff6b6b', '#feca57'], bg: ['#1a1a2e', '#16213e'] },
  { main: '#5f27cd', gradient: ['#5f27cd', '#341f97'], bg: ['#0c0c1e', '#1a0a2e'] },
  { main: '#00d2d3', gradient: ['#00d2d3', '#01a3a4'], bg: ['#0a2e2e', '#0a1e2e'] },
  { main: '#ff9f43', gradient: ['#ff9f43', '#ee5a24'], bg: ['#2d1810', '#1d1010'] },
  { main: '#10ac84', gradient: ['#10ac84', '#1dd1a1'], bg: ['#0a2a1a', '#0a1a1a'] },
];
let palette;

// DOM elements
const $ = id => document.getElementById(id);
const tower = $('tower');
const ball = $('ball');
const pole = $('pole');
const finish = $('finish');
const ui = {
  level: $('level-display'),
  score: $('score-display'),
  progress: $('progress-fill'),
  invBar: $('invincible-container'),
  invFill: $('invincible-fill'),
  menu: $('menu-screen'),
  win: $('win-screen'),
  winLevel: $('win-level'),
  lose: $('lose-screen'),
  finalScore: $('final-score'),
  bestScore: $('best-score'),
  soundBtn: $('sound-btn'),
};

// ===== AUDIO =====
function loadSounds() {
  const soundFiles = {
    jump: 'assets/audio/Balljump.mp3',
    break: 'assets/audio/BallBreakStack.wav',
    die: 'assets/audio/BallDied.mp3',
    level: 'assets/audio/BallLevel.mp3',
    button: 'assets/audio/button.mp3',
  };
  
  for (const [name, src] of Object.entries(soundFiles)) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    sounds[name] = audio;
  }
}

function playSound(name) {
  if (!soundEnabled || !sounds[name]) return;
  const sound = sounds[name].cloneNode();
  sound.volume = 0.5;
  sound.play().catch(() => {});
}

// ===== INIT =====
function init() {
  loadSounds();
  setupInput();
  setupButtons();
  buildLevel();
  requestAnimationFrame(gameLoop);
}

function setupInput() {
  const onDown = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    if (e.cancelable) e.preventDefault();
    isHolding = true;
  };
  
  const onUp = () => {
    isHolding = false;
  };
  
  document.addEventListener('mousedown', onDown);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchstart', onDown, { passive: false });
  document.addEventListener('touchend', onUp, { passive: false });
  document.addEventListener('touchcancel', onUp);
}

function setupButtons() {
  $('start-btn').onclick = () => {
    playSound('button');
    startGame();
  };
  
  $('next-btn').onclick = () => {
    playSound('button');
    level++;
    localStorage.setItem('stackBallLevel', level);
    ui.win.classList.add('hidden');
    buildLevel();
    startGame();
  };
  
  $('retry-btn').onclick = () => {
    playSound('button');
    score = 0;
    ui.lose.classList.add('hidden');
    buildLevel();
    startGame();
  };
  
  ui.soundBtn.onclick = () => {
    soundEnabled = !soundEnabled;
    ui.soundBtn.classList.toggle('muted', !soundEnabled);
  };
}

function startGame() {
  gameState = 'playing';
  ui.menu.classList.add('hidden');
}

// ===== LEVEL BUILDING =====
function buildLevel() {
  // Clear old platforms
  platforms.forEach(p => p.element.remove());
  platforms = [];
  debris.forEach(d => d.element.remove());
  debris = [];
  splashes.forEach(s => s.element.remove());
  splashes = [];
  
  // Set palette
  palette = palettes[(level - 1) % palettes.length];
  document.body.style.background = `linear-gradient(180deg, ${palette.bg[0]} 0%, ${palette.bg[1]} 100%)`;
  ball.style.background = `radial-gradient(circle at 30% 30%, ${palette.main}, ${darkenColor(palette.main, 30)})`;
  
  // Reset state
  destroyedCount = 0;
  destroyedPlatformCount = 0;
  isInvincible = false;
  invincibleTimer = 0;
  invincibleChargeTimer = 0;
  currentRotation = 0;
  
  // Calculate tower height
  const towerHeight = CONFIG.platformCount * CONFIG.platformSpacing;
  
  // Position pole
  pole.style.height = `${towerHeight + 100}px`;
  pole.style.top = `-50px`;
  
  // Create platforms
  for (let i = 0; i < CONFIG.platformCount; i++) {
    createPlatform(i);
  }
  
  // Position finish platform
  finish.style.top = `${CONFIG.platformCount * CONFIG.platformSpacing + 30}px`;
  
  // Position ball at top
  ballY = -30;
  ballVelocity = 0;
  ball.style.top = `${ballY}px`;
  ball.style.display = 'block';
  ball.classList.remove('invincible');
  
  // Update UI
  updateUI();
  updateProgress();
  updateInvincibleUI();
}

function createPlatform(index) {
  const y = index * CONFIG.platformSpacing;
  const element = document.createElement('div');
  element.className = 'platform';
  element.style.top = `${y}px`;
  
  // Determine danger count for this platform group
  const groupIndex = Math.floor(index / 5);
  const maxDanger = Math.min(groupIndex, CONFIG.segmentsPerPlatform - CONFIG.minSafeParts);
  const dangerCount = Math.floor(Math.random() * (maxDanger + 1));
  
  // Randomly select which segments are danger
  const dangerIndices = new Set();
  const indices = [...Array(CONFIG.segmentsPerPlatform).keys()];
  shuffleArray(indices);
  for (let i = 0; i < dangerCount; i++) {
    dangerIndices.add(indices[i]);
  }
  
  // Create segments
  const segments = [];
  const segmentAngle = 360 / CONFIG.segmentsPerPlatform;
  const t = index / CONFIG.platformCount;
  const color = lerpColor(palette.gradient[0], palette.gradient[1], t);
  
  for (let i = 0; i < CONFIG.segmentsPerPlatform; i++) {
    const seg = document.createElement('div');
    seg.className = 'segment';
    if (dangerIndices.has(i)) {
      seg.classList.add('danger');
    } else {
      seg.style.background = `linear-gradient(135deg, ${color}, ${darkenColor(color, 20)})`;
    }
    
    const angle = i * segmentAngle;
    seg.style.width = `${CONFIG.segmentWidth}px`;
    seg.style.height = `${CONFIG.segmentHeight}px`;
    seg.style.left = '50%';
    seg.style.top = '50%';
    seg.style.transform = `rotate(${angle}deg) translateX(${CONFIG.platformRadius}px) translateY(-50%)`;
    seg.dataset.angle = angle;
    seg.dataset.isDanger = dangerIndices.has(i);
    
    element.appendChild(seg);
    segments.push({
      element: seg,
      angle: angle,
      isDanger: dangerIndices.has(i),
      destroyed: false
    });
  }
  
  tower.appendChild(element);
  platforms.push({
    element,
    y,
    segments,
    destroyed: false,
    index
  });
}

// ===== GAME LOOP =====
let lastTime = 0;

function gameLoop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.05) || 0.016;
  lastTime = currentTime;
  
  if (gameState === 'playing') {
    updateBall(dt);
    checkCollisions();
    updateInvincibility(dt);
  }
  
  // Always rotate platforms
  currentRotation += CONFIG.rotationSpeed * dt;
  tower.style.transform = `translateX(-50%) translateY(-50%) rotateX(65deg) rotateZ(${currentRotation}deg)`;
  
  updateParticles(dt);
  
  requestAnimationFrame(gameLoop);
}

function updateBall(dt) {
  if (isHolding) {
    // Smashing down (from Ball.cs FixedUpdate)
    ballVelocity = CONFIG.smashVelocity;
  } else {
    // Apply gravity
    ballVelocity += CONFIG.gravity * dt;
  }
  
  ballY += ballVelocity * dt;
  ball.style.top = `${ballY}px`;
  
  // Invincible visual
  ball.classList.toggle('invincible', isInvincible);
}

function checkCollisions() {
  const ballBottom = ballY + 20; // ball radius
  const ballAngle = (((-currentRotation % 360) + 360) % 360);
  
  // Check finish platform
  const finishY = CONFIG.platformCount * CONFIG.platformSpacing + 30;
  if (ballBottom >= finishY && ballVelocity > 0) {
    winGame();
    return;
  }
  
  // Check platforms
  for (const platform of platforms) {
    if (platform.destroyed) continue;
    
    const platTop = platform.y;
    const platBottom = platform.y + CONFIG.segmentHeight;
    
    // Check if ball is at this platform's height
    if (ballBottom >= platTop && ballBottom <= platBottom + 10 && ballVelocity > 0) {
      // Find which segment we're over
      const hitSegment = findSegmentAtAngle(platform, ballAngle);
      
      if (hitSegment && !hitSegment.destroyed) {
        handleCollision(hitSegment, platform, platTop);
        return;
      }
    }
  }
}

function findSegmentAtAngle(platform, ballAngle) {
  const segmentArc = 360 / CONFIG.segmentsPerPlatform;
  
  for (const seg of platform.segments) {
    if (seg.destroyed) continue;
    
    let segStart = seg.angle - segmentArc / 2;
    let segEnd = seg.angle + segmentArc / 2;
    
    // Normalize
    let checkAngle = ballAngle;
    if (segStart < 0) {
      segStart += 360;
      if (checkAngle < 180) checkAngle += 360;
    }
    if (segEnd > 360) {
      segEnd -= 360;
      if (checkAngle > 180) checkAngle -= 360;
    }
    
    // Simple check
    const angleDiff = Math.abs(((ballAngle - seg.angle + 180) % 360) - 180);
    if (angleDiff < segmentArc / 2 + 5) {
      return seg;
    }
  }
  return null;
}

function handleCollision(segment, platform, platformTop) {
  // From Ball.cs OnCollisionEnter
  if (!isHolding) {
    // Bounce (not smashing)
    bounce(platformTop);
    return;
  }
  
  // Smashing
  if (segment.isDanger && !isInvincible) {
    // Hit danger while smashing = GAME OVER
    loseGame();
    return;
  }
  
  // Destroy platform (safe segment or invincible)
  destroyPlatform(platform);
}

function bounce(platformTop) {
  ballY = platformTop - 20;
  ballVelocity = -CONFIG.jumpVelocity;
  playSound('jump');
  createSplash(platformTop);
}

function destroyPlatform(platform) {
  if (platform.destroyed) return;
  platform.destroyed = true;
  destroyedCount++;
  
  playSound('break');
  
  // Shatter all segments (from StackController.cs)
  for (const seg of platform.segments) {
    if (!seg.destroyed) {
      shatterSegment(seg, platform.y);
    }
  }
  
  platform.element.style.display = 'none';
  
  // Score
  score += isInvincible ? 2 : 1;
  updateUI();
  updateProgress();
  
  // Invincibility charge (from Ball.cs)
  if (!isInvincible) {
    destroyedPlatformCount++;
    if (destroyedPlatformCount >= CONFIG.platformsToEnableIndicator) {
      invincibleChargeTimer += CONFIG.secondsPerPlatform;
      if (invincibleChargeTimer >= CONFIG.secondsToEnableInvincible) {
        activateInvincible();
      }
      updateInvincibleUI();
    }
  }
}

function shatterSegment(seg, platformY) {
  seg.destroyed = true;
  seg.element.style.opacity = '0';
  
  // Create debris (from StackPartController.cs Shatter)
  const angle = parseFloat(seg.element.dataset.angle);
  const color = seg.isDanger ? '#222' : seg.element.style.background;
  
  for (let i = 0; i < 3; i++) {
    createDebris(angle, platformY, seg.isDanger ? '#333' : palette.main);
  }
}

// ===== INVINCIBILITY =====
function updateInvincibility(dt) {
  if (isInvincible) {
    invincibleTimer -= dt;
    updateInvincibleUI();
    if (invincibleTimer <= 0) {
      deactivateInvincible();
    }
  }
}

function activateInvincible() {
  isInvincible = true;
  invincibleTimer = CONFIG.invincibleDuration;
  invincibleChargeTimer = 0;
}

function deactivateInvincible() {
  isInvincible = false;
  destroyedPlatformCount = 0;
  invincibleChargeTimer = 0;
  updateInvincibleUI();
}

function updateInvincibleUI() {
  const show = destroyedPlatformCount >= CONFIG.platformsToEnableIndicator || isInvincible;
  ui.invBar.classList.toggle('show', show);
  
  let fill;
  if (isInvincible) {
    fill = invincibleTimer / CONFIG.invincibleDuration;
  } else {
    fill = invincibleChargeTimer / CONFIG.secondsToEnableInvincible;
  }
  ui.invFill.style.width = `${Math.max(0, fill) * 100}%`;
}

// ===== PARTICLES =====
function createDebris(angle, y, color) {
  const el = document.createElement('div');
  el.className = 'debris';
  el.style.background = color;
  el.style.left = '50%';
  el.style.top = `${y}px`;
  tower.appendChild(el);
  
  const rad = (angle + currentRotation) * Math.PI / 180;
  const throwDir = Math.cos(rad) > 0 ? 1 : -1;
  
  debris.push({
    element: el,
    x: 0,
    y: y,
    vx: throwDir * (200 + Math.random() * 150),
    vy: -(300 + Math.random() * 200),
    rotation: 0,
    rotSpeed: (Math.random() - 0.5) * 720,
    life: 0.8
  });
}

function createSplash(y) {
  const el = document.createElement('div');
  el.className = 'splash';
  el.style.left = '50%';
  el.style.top = `${y}px`;
  el.style.transform = 'translateX(-50%)';
  tower.appendChild(el);
  
  splashes.push({
    element: el,
    life: 0.5
  });
}

function updateParticles(dt) {
  // Update debris
  for (let i = debris.length - 1; i >= 0; i--) {
    const d = debris[i];
    d.vy += 1500 * dt; // gravity
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    d.rotation += d.rotSpeed * dt;
    d.life -= dt;
    
    d.element.style.transform = `translateX(${d.x}px) rotate(${d.rotation}deg)`;
    d.element.style.top = `${d.y}px`;
    d.element.style.opacity = Math.max(0, d.life / 0.8);
    
    if (d.life <= 0) {
      d.element.remove();
      debris.splice(i, 1);
    }
  }
  
  // Update splashes
  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i];
    s.life -= dt;
    s.element.style.opacity = Math.max(0, s.life / 0.5);
    
    if (s.life <= 0) {
      s.element.remove();
      splashes.splice(i, 1);
    }
  }
}

// ===== GAME STATES =====
function winGame() {
  gameState = 'win';
  isHolding = false;
  playSound('level');
  saveBestScore();
  
  ui.winLevel.textContent = `Level ${level} Complete!`;
  ui.win.classList.remove('hidden');
}

function loseGame() {
  gameState = 'lose';
  isHolding = false;
  playSound('die');
  saveBestScore();
  
  // Explode ball
  ball.style.display = 'none';
  for (let i = 0; i < 15; i++) {
    createDebris(i * 24, ballY, palette.main);
  }
  
  ui.finalScore.textContent = score;
  ui.bestScore.textContent = bestScore;
  ui.lose.classList.remove('hidden');
}

function saveBestScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('stackBallBest', bestScore);
  }
}

// ===== UI =====
function updateUI() {
  ui.level.textContent = `Level ${level}`;
  ui.score.textContent = score;
}

function updateProgress() {
  const pct = (destroyedCount / CONFIG.platformCount) * 100;
  ui.progress.style.width = `${pct}%`;
}

// ===== UTILS =====
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function lerpColor(a, b, t) {
  const parse = c => {
    const hex = c.replace('#', '');
    return [
      parseInt(hex.substr(0, 2), 16),
      parseInt(hex.substr(2, 2), 16),
      parseInt(hex.substr(4, 2), 16)
    ];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bl.toString(16).padStart(2,'0')}`;
}

function darkenColor(color, percent) {
  const hex = color.replace('#', '');
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - percent);
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - percent);
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - percent);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// Start
init();

})();
