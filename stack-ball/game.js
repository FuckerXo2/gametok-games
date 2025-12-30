// Stack Ball 3D - Polished Version
(function() {
'use strict';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Platform settings
  platformCount: 35,
  platformGap: 0.6,
  platformRadius: 2.0,
  platformInnerRadius: 0.45,
  platformThickness: 0.35,
  segmentsPerPlatform: 8,
  minSafeSegments: 3,
  
  // Ball settings
  ballRadius: 0.38,
  gravity: 35,
  smashSpeed: 14,
  bounceSpeed: 11,
  
  // Camera
  cameraDistance: 10,
  cameraHeight: 5,
  cameraSmooth: 0.12,
  
  // Rotation
  rotationSpeed: 50,
};

// ============================================
// GAME STATE
// ============================================
let scene, camera, renderer;
let ball, ballVelocity = 0;
let platforms = [], particles = [];
let towerGroup, finishPlatform;

let gameState = 'menu'; // menu, playing, win, lose
let isHolding = false;
let score = 0;
let level = parseInt(localStorage.getItem('stackball_level')) || 1;
let highScore = parseInt(localStorage.getItem('stackball_high')) || 0;
let destroyedPlatforms = 0;
let combo = 0;
let lastDestroyTime = 0;

let cameraTargetY = 0;
let shakeIntensity = 0;

// Color palettes per level
const PALETTES = [
  { primary: 0xff6b6b, secondary: 0xfeca57, bg1: 0x1a1a2e, bg2: 0x16213e },
  { primary: 0x667eea, secondary: 0x764ba2, bg1: 0x0f0c29, bg2: 0x302b63 },
  { primary: 0x11998e, secondary: 0x38ef7d, bg1: 0x0f2027, bg2: 0x203a43 },
  { primary: 0xf857a6, secondary: 0xff5858, bg1: 0x1f1c2c, bg2: 0x3a3a5c },
  { primary: 0xf2994a, secondary: 0xf2c94c, bg1: 0x2c1810, bg2: 0x1a0f0a },
  { primary: 0x00d2d3, secondary: 0x54a0ff, bg1: 0x0a1628, bg2: 0x1a2a4a },
];

let palette;

// UI Elements
const ui = {
  level: document.getElementById('level'),
  score: document.getElementById('score'),
  progress: document.getElementById('progress-fill'),
  menu: document.getElementById('menu'),
  win: document.getElementById('win'),
  winLevel: document.getElementById('winLevel'),
  lose: document.getElementById('lose'),
  finalScore: document.getElementById('finalScore'),
  bestScore: document.getElementById('bestScore'),
};

// ============================================
// AUDIO (Web Audio API)
// ============================================
let audioCtx;
const sounds = {};

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
    case 'bounce':
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
      
    case 'smash':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150 + combo * 30, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
      
    case 'hit':
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
      
    case 'win':
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.15, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        o.start(now + i * 0.1);
        o.stop(now + i * 0.1 + 0.3);
      });
      break;
  }
}

// Haptic feedback
function vibrate(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  setupRenderer();
  setupLights();
  setupInput();
  setupButtons();
  buildLevel();
  animate();
}

function setupRenderer() {
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: 'high-performance',
    alpha: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  
  document.getElementById('game-container').insertBefore(
    renderer.domElement, 
    document.getElementById('ui')
  );
  
  window.addEventListener('resize', onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupLights() {
  // Ambient
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  
  // Main light with shadows
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
  mainLight.position.set(5, 20, 10);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  mainLight.shadow.camera.near = 1;
  mainLight.shadow.camera.far = 50;
  mainLight.shadow.camera.left = -15;
  mainLight.shadow.camera.right = 15;
  mainLight.shadow.camera.top = 15;
  mainLight.shadow.camera.bottom = -30;
  mainLight.shadow.bias = -0.001;
  scene.add(mainLight);
  
  // Rim light
  const rimLight = new THREE.DirectionalLight(0x6688ff, 0.4);
  rimLight.position.set(-5, 5, -10);
  scene.add(rimLight);
}


function setupInput() {
  const onDown = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    if (e.cancelable) e.preventDefault();
    
    if (!audioCtx) initAudio();
    
    isHolding = true;
    
    if (gameState === 'menu') {
      startGame();
    }
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
  document.getElementById('startBtn').onclick = () => {
    if (!audioCtx) initAudio();
    startGame();
  };
  
  document.getElementById('nextBtn').onclick = () => {
    level++;
    localStorage.setItem('stackball_level', level);
    ui.win.classList.add('hidden');
    buildLevel();
    startGame();
  };
  
  document.getElementById('retryBtn').onclick = () => {
    score = 0;
    ui.lose.classList.add('hidden');
    buildLevel();
    startGame();
  };
}

function startGame() {
  gameState = 'playing';
  ui.menu.classList.add('hidden');
}

// ============================================
// LEVEL BUILDING
// ============================================
function buildLevel() {
  // Clear scene (keep lights)
  const lights = scene.children.filter(c => c.isLight);
  scene.children = lights;
  
  platforms = [];
  particles = [];
  destroyedPlatforms = 0;
  combo = 0;
  ballVelocity = 0;
  
  // Select palette
  palette = PALETTES[(level - 1) % PALETTES.length];
  
  // Background gradient
  const bgColor = new THREE.Color(palette.bg1).lerp(new THREE.Color(palette.bg2), 0.5);
  scene.background = bgColor;
  scene.fog = new THREE.Fog(bgColor, 20, 50);
  
  // Create tower group (for rotation)
  towerGroup = new THREE.Group();
  scene.add(towerGroup);
  
  createPole();
  createPlatforms();
  createFinishPlatform();
  createBall();
  
  // Position camera
  cameraTargetY = ball.position.y + CONFIG.cameraHeight;
  camera.position.set(0, cameraTargetY, CONFIG.cameraDistance);
  camera.lookAt(0, ball.position.y, 0);
  
  updateUI();
}

function createPole() {
  const height = CONFIG.platformCount * CONFIG.platformGap + 8;
  
  // Main pole
  const poleGeo = new THREE.CylinderGeometry(0.3, 0.3, height, 24);
  const poleMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.7,
    roughness: 0.2,
  });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = -height / 2 + 3;
  pole.castShadow = true;
  pole.receiveShadow = true;
  towerGroup.add(pole);
  
  // Top cap
  const capGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const cap = new THREE.Mesh(capGeo, poleMat);
  cap.position.y = 3;
  towerGroup.add(cap);
}

function createPlatforms() {
  let y = 0;
  let rotation = 0;
  
  for (let i = 0; i < CONFIG.platformCount; i++) {
    y -= CONFIG.platformGap;
    rotation += (Math.random() * 40 + 20) * Math.PI / 180;
    
    // Color gradient through tower
    const t = i / CONFIG.platformCount;
    const color = lerpColor(palette.primary, palette.secondary, t);
    
    // More danger as you go down
    const dangerChance = 0.12 + t * 0.28;
    
    const platform = createPlatform(y, rotation, color, dangerChance, i);
    platforms.push(platform);
  }
}

function createPlatform(y, baseRotation, color, dangerChance, index) {
  const segments = [];
  const segmentAngle = (Math.PI * 2) / CONFIG.segmentsPerPlatform;
  
  // Determine which segments are dangerous
  const dangerSet = new Set();
  let safeCount = CONFIG.segmentsPerPlatform;
  
  for (let i = 0; i < CONFIG.segmentsPerPlatform; i++) {
    if (safeCount > CONFIG.minSafeSegments && Math.random() < dangerChance) {
      dangerSet.add(i);
      safeCount--;
    }
  }
  
  for (let i = 0; i < CONFIG.segmentsPerPlatform; i++) {
    const isDanger = dangerSet.has(i);
    const startAngle = baseRotation + i * segmentAngle + 0.02;
    const arcLength = segmentAngle - 0.04;
    
    const segment = createSegment(startAngle, arcLength, isDanger ? 0x1a1a1a : color, isDanger);
    segment.position.y = y;
    segment.userData = {
      isDanger,
      startAngle,
      endAngle: startAngle + arcLength,
      platformIndex: index
    };
    towerGroup.add(segment);
    segments.push(segment);
  }
  
  return { y, segments, destroyed: false };
}

function createSegment(startAngle, arcLength, color, isDanger) {
  const inner = CONFIG.platformInnerRadius;
  const outer = CONFIG.platformRadius;
  const thickness = CONFIG.platformThickness;
  const steps = 12;
  
  // Create shape
  const shape = new THREE.Shape();
  
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + (i / steps) * arcLength;
    const x = Math.cos(a) * outer;
    const z = Math.sin(a) * outer;
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  }
  
  for (let i = steps; i >= 0; i--) {
    const a = startAngle + (i / steps) * arcLength;
    shape.lineTo(Math.cos(a) * inner, Math.sin(a) * inner);
  }
  shape.closePath();
  
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, thickness / 2, 0);
  
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: isDanger ? 0.85 : 0.15,
    roughness: isDanger ? 0.25 : 0.55,
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  return mesh;
}

function createFinishPlatform() {
  const y = -(CONFIG.platformCount * CONFIG.platformGap) - 2;
  
  // Golden finish platform
  const geo = new THREE.CylinderGeometry(CONFIG.platformRadius, CONFIG.platformRadius * 1.15, 1.2, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.15,
    emissive: 0xffd700,
    emissiveIntensity: 0.2
  });
  finishPlatform = new THREE.Mesh(geo, mat);
  finishPlatform.position.y = y;
  finishPlatform.receiveShadow = true;
  towerGroup.add(finishPlatform);
  
  // Trophy/star on top
  const starGeo = new THREE.OctahedronGeometry(0.5, 0);
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffcc,
    emissiveIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.1
  });
  const star = new THREE.Mesh(starGeo, starMat);
  star.position.y = y + 1.2;
  star.userData.isStar = true;
  towerGroup.add(star);
}

function createBall() {
  const geo = new THREE.SphereGeometry(CONFIG.ballRadius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.15,
    roughness: 0.25,
  });
  
  ball = new THREE.Mesh(geo, mat);
  ball.position.set(1.2, 2.5, 0);
  ball.castShadow = true;
  scene.add(ball);
  
  // Glow ring around ball
  const ringGeo = new THREE.TorusGeometry(CONFIG.ballRadius * 1.3, 0.025, 8, 32);
  const ringMat = new THREE.MeshBasicMaterial({ 
    color: palette.primary,
    transparent: true,
    opacity: 0.7
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ball.add(ring);
}


// ============================================
// GAME LOOP
// ============================================
let lastTime = performance.now();

function animate(currentTime = performance.now()) {
  requestAnimationFrame(animate);
  
  const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
  lastTime = currentTime;
  
  if (gameState === 'playing') {
    updateBall(dt);
    checkCollisions();
  }
  
  // Rotate tower
  if (towerGroup) {
    towerGroup.rotation.y += CONFIG.rotationSpeed * Math.PI / 180 * dt;
  }
  
  // Animate star
  towerGroup?.children.forEach(child => {
    if (child.userData?.isStar) {
      child.rotation.y += dt * 2.5;
      child.rotation.x = Math.sin(currentTime * 0.002) * 0.3;
    }
  });
  
  updateParticles(dt);
  updateCamera(dt);
  
  // Decay shake
  shakeIntensity *= 0.9;
  
  renderer.render(scene, camera);
}

function updateBall(dt) {
  if (isHolding) {
    // Smashing down
    ballVelocity = -CONFIG.smashSpeed;
    
    // Squash effect
    ball.scale.x = THREE.MathUtils.lerp(ball.scale.x, 1.15, 0.3);
    ball.scale.y = THREE.MathUtils.lerp(ball.scale.y, 0.8, 0.3);
    ball.scale.z = THREE.MathUtils.lerp(ball.scale.z, 1.15, 0.3);
  } else {
    // Gravity
    ballVelocity -= CONFIG.gravity * dt;
    
    // Return to normal shape
    ball.scale.x = THREE.MathUtils.lerp(ball.scale.x, 1, 0.15);
    ball.scale.y = THREE.MathUtils.lerp(ball.scale.y, 1, 0.15);
    ball.scale.z = THREE.MathUtils.lerp(ball.scale.z, 1, 0.15);
  }
  
  ball.position.y += ballVelocity * dt;
  
  // Roll animation
  ball.rotation.z += ballVelocity * dt * 1.5;
}

// ============================================
// COLLISION DETECTION
// ============================================
function checkCollisions() {
  const ballBottom = ball.position.y - CONFIG.ballRadius;
  const ballX = ball.position.x;
  const ballZ = ball.position.z;
  const distFromCenter = Math.sqrt(ballX * ballX + ballZ * ballZ);
  
  // Get ball angle in world space, then convert to tower local space
  let ballAngle = Math.atan2(ballZ, ballX);
  if (ballAngle < 0) ballAngle += Math.PI * 2;
  
  let localAngle = ballAngle - towerGroup.rotation.y;
  while (localAngle < 0) localAngle += Math.PI * 2;
  while (localAngle >= Math.PI * 2) localAngle -= Math.PI * 2;
  
  // Check finish platform
  const finishTop = finishPlatform.position.y + 0.6;
  if (ballBottom <= finishTop && ballVelocity < 0) {
    ball.position.y = finishTop + CONFIG.ballRadius;
    ballVelocity = CONFIG.bounceSpeed * 0.5;
    winGame();
    return;
  }
  
  // Check platforms
  for (const platform of platforms) {
    if (platform.destroyed) continue;
    
    const platTop = platform.y + CONFIG.platformThickness / 2;
    const platBottom = platform.y - CONFIG.platformThickness / 2;
    
    // Check if ball is at platform height
    if (ballBottom <= platTop && ballBottom > platBottom - 0.2) {
      // Check if ball is over platform (not hole)
      if (distFromCenter >= CONFIG.platformInnerRadius - 0.1 && 
          distFromCenter <= CONFIG.platformRadius + 0.1) {
        
        // Find which segment
        for (const seg of platform.segments) {
          if (!seg.visible) continue;
          
          if (isAngleInRange(localAngle, seg.userData.startAngle, seg.userData.endAngle)) {
            handlePlatformHit(seg, platform, platTop);
            return;
          }
        }
      }
    }
  }
}

function isAngleInRange(angle, start, end) {
  const twoPi = Math.PI * 2;
  angle = ((angle % twoPi) + twoPi) % twoPi;
  start = ((start % twoPi) + twoPi) % twoPi;
  end = ((end % twoPi) + twoPi) % twoPi;
  
  if (start <= end) {
    return angle >= start && angle <= end;
  }
  return angle >= start || angle <= end;
}

function handlePlatformHit(segment, platform, platformTop) {
  if (isHolding) {
    // Smashing
    if (segment.userData.isDanger) {
      // Hit black segment - game over
      loseGame();
    } else {
      // Destroy platform
      destroyPlatform(platform);
    }
  } else if (ballVelocity < 0) {
    // Bouncing
    bounce(platformTop + CONFIG.ballRadius);
    combo = 0;
  }
}

function bounce(newY) {
  ball.position.y = newY;
  ballVelocity = CONFIG.bounceSpeed;
  
  // Stretch effect
  ball.scale.set(0.85, 1.25, 0.85);
  
  playSound('bounce');
  vibrate(10);
  
  // Small bounce particles
  for (let i = 0; i < 4; i++) {
    createSparkle(ball.position.clone(), 0xffffff, 0.5);
  }
}

// ============================================
// DESTRUCTION
// ============================================
function destroyPlatform(platform) {
  if (platform.destroyed) return;
  platform.destroyed = true;
  destroyedPlatforms++;
  
  // Combo system
  const now = performance.now();
  if (now - lastDestroyTime < 400) {
    combo++;
  } else {
    combo = 1;
  }
  lastDestroyTime = now;
  
  // Score with combo multiplier
  const points = combo;
  score += points;
  
  // Effects
  playSound('smash');
  vibrate(combo > 3 ? [20, 10, 20] : 15);
  shakeIntensity = Math.min(0.15 + combo * 0.03, 0.4);
  
  // Destroy all segments
  for (const seg of platform.segments) {
    if (seg.visible) {
      explodeSegment(seg, platform.y);
    }
  }
  
  updateUI();
}

function explodeSegment(segment, platformY) {
  segment.visible = false;
  
  // Calculate world position
  const angle = (segment.userData.startAngle + segment.userData.endAngle) / 2;
  const radius = (CONFIG.platformInnerRadius + CONFIG.platformRadius) / 2;
  const worldAngle = angle + towerGroup.rotation.y;
  
  const pos = new THREE.Vector3(
    Math.cos(worldAngle) * radius,
    platformY,
    Math.sin(worldAngle) * radius
  );
  
  const color = segment.material.color.getHex();
  
  // Debris chunks
  for (let i = 0; i < 5; i++) {
    createDebris(pos.clone(), color);
  }
  
  // Sparkles
  for (let i = 0; i < 10; i++) {
    createSparkle(pos.clone(), color, 1);
  }
}

// ============================================
// PARTICLES
// ============================================
function createDebris(pos, color) {
  const size = 0.08 + Math.random() * 0.12;
  const geo = new THREE.BoxGeometry(size, size, size);
  const mat = new THREE.MeshStandardMaterial({ 
    color,
    metalness: 0.3,
    roughness: 0.6
  });
  const mesh = new THREE.Mesh(geo, mat);
  
  mesh.position.copy(pos);
  mesh.position.x += (Math.random() - 0.5) * 0.4;
  mesh.position.z += (Math.random() - 0.5) * 0.4;
  
  const velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 6,
    4 + Math.random() * 4,
    (Math.random() - 0.5) * 6
  );
  
  const rotSpeed = new THREE.Vector3(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 12
  );
  
  mesh.castShadow = true;
  scene.add(mesh);
  
  particles.push({
    mesh,
    velocity,
    rotSpeed,
    life: 1.2 + Math.random() * 0.5,
    type: 'debris'
  });
}

function createSparkle(pos, color, scale = 1) {
  const geo = new THREE.SphereGeometry(0.035 * scale, 6, 6);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 1
  });
  const mesh = new THREE.Mesh(geo, mat);
  
  mesh.position.copy(pos);
  mesh.position.x += (Math.random() - 0.5) * 0.3;
  mesh.position.z += (Math.random() - 0.5) * 0.3;
  
  const velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 3 * scale,
    Math.random() * 2.5 * scale + 1,
    (Math.random() - 0.5) * 3 * scale
  );
  
  scene.add(mesh);
  
  particles.push({
    mesh,
    velocity,
    life: 0.4 + Math.random() * 0.2,
    type: 'sparkle'
  });
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    
    // Gravity
    p.velocity.y -= CONFIG.gravity * dt * 0.5;
    
    // Move
    p.mesh.position.add(p.velocity.clone().multiplyScalar(dt));
    
    // Rotate debris
    if (p.rotSpeed) {
      p.mesh.rotation.x += p.rotSpeed.x * dt;
      p.mesh.rotation.y += p.rotSpeed.y * dt;
      p.mesh.rotation.z += p.rotSpeed.z * dt;
    }
    
    p.life -= dt;
    
    // Fade sparkles
    if (p.type === 'sparkle') {
      p.mesh.material.opacity = Math.max(0, p.life * 2.5);
      p.mesh.scale.multiplyScalar(0.96);
    }
    
    // Remove dead particles
    if (p.life <= 0) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      particles.splice(i, 1);
    }
  }
}

// ============================================
// CAMERA
// ============================================
function updateCamera(dt) {
  if (!ball) return;
  
  const targetY = ball.position.y + CONFIG.cameraHeight;
  
  // Only follow downward
  if (targetY < cameraTargetY) {
    cameraTargetY = targetY;
  }
  
  // Smooth follow
  camera.position.y += (cameraTargetY - camera.position.y) * CONFIG.cameraSmooth;
  
  // Screen shake
  camera.position.x = (Math.random() - 0.5) * shakeIntensity;
  camera.position.z = CONFIG.cameraDistance + (Math.random() - 0.5) * shakeIntensity;
  
  camera.lookAt(0, camera.position.y - CONFIG.cameraHeight, 0);
}

// ============================================
// GAME STATES
// ============================================
function winGame() {
  gameState = 'win';
  isHolding = false;
  
  playSound('win');
  vibrate([50, 30, 50, 30, 100]);
  
  saveHighScore();
  
  // Victory particles
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      if (ball) {
        createSparkle(
          new THREE.Vector3(
            ball.position.x + (Math.random() - 0.5) * 2,
            ball.position.y + Math.random() * 2,
            ball.position.z + (Math.random() - 0.5) * 2
          ),
          Math.random() < 0.5 ? 0xffd700 : 0xffffff,
          1.5
        );
      }
    }, i * 40);
  }
  
  ui.winLevel.textContent = `Level ${level} Complete!`;
  setTimeout(() => ui.win.classList.remove('hidden'), 500);
}

function loseGame() {
  gameState = 'lose';
  isHolding = false;
  
  playSound('hit');
  vibrate([100, 50, 100]);
  shakeIntensity = 0.5;
  
  saveHighScore();
  
  // Explode ball
  for (let i = 0; i < 30; i++) {
    createDebris(ball.position.clone(), palette.primary);
  }
  ball.visible = false;
  
  ui.finalScore.textContent = score;
  ui.bestScore.textContent = highScore;
  setTimeout(() => ui.lose.classList.remove('hidden'), 300);
}

function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('stackball_high', highScore);
  }
}

// ============================================
// UI
// ============================================
function updateUI() {
  ui.level.textContent = `Level ${level}`;
  ui.score.textContent = score;
  
  const progress = (destroyedPlatforms / CONFIG.platformCount) * 100;
  ui.progress.style.width = `${progress}%`;
}

// ============================================
// UTILITIES
// ============================================
function lerpColor(a, b, t) {
  const c1 = new THREE.Color(a);
  const c2 = new THREE.Color(b);
  return c1.lerp(c2, t).getHex();
}

// Start the game
init();

})();
