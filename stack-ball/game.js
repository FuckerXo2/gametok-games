// Stack Ball 3D - Faithful Three.js Recreation
(function() {
'use strict';

// ===== CONFIG (matching original Unity values) =====
const CONFIG = {
  // Platform generation (from Generator.prefab)
  platformCount: 50,              // Original: 140, reduced for web
  platformHeightOffset: 0.4,      // _offsetHeight
  platformRotationOffset: 2,      // _offestAngle (degrees)
  
  // Platform geometry (from CirclePlatform.prefab - segments positioned at radius ~1.49)
  platformRadius: 1.6,            // Outer radius of wedge
  platformInnerRadius: 0.35,      // Inner hole radius  
  platformThickness: 0.25,        // Height/thickness of segment
  segmentsPerPlatform: 8,         // 8 wedge segments
  minSafeParts: 2,                // PLATFORM_SAFE_PARTS
  segmentGap: 0.03,               // Small gap between segments
  
  // Ball (from Ball.prefab)
  ballRadius: 0.3,
  gravity: 25,
  jumpPower: 11,                  // _jumpPower
  moveSpeed: 8,                   // _moveSpeed
  
  // Invincibility (from BallInvincibility)
  platformsToEnableIndicator: 10,
  secondsPerPlatform: 0.15,
  secondsToEnableInvincible: 4,    // _secondsToEnableInvincible
  invincibleSeconds: 3,            // _invincibleSeconds
  
  // Platform rotation speed (degrees per second) - from Generator.prefab _anglePerSecond
  platformRotationSpeed: 55,
  
  // Camera (from CameraMover)
  cameraTrackOffset: { x: 0, y: 3, z: -8.3 },
  cameraTrackDelay: 0.25,
  
  // Audio
  soundEnabled: true,
  basePitch: 1.0,
  pitchIncrement: 0.02,
  maxPitch: 3.0,
  pitchResetDelay: 3.0
};

// ===== STATE =====
let scene, camera, renderer;
let ball, ballVelocity = 0;
let platforms = [];
let particles = [];
let pole, finishPlatform;
let platformsContainer; // Container that rotates all platforms

let isPlaying = false;
let isHolding = false;
let gameState = 'menu'; // menu, playing, win, lose

// Invincibility state
let isInvincible = false;
let destroyedPlatformCount = 0;
let invincibleTimer = 0;
let invincibleTimerRunning = false;

// Score/Level
let score = 0;
let level = parseInt(localStorage.getItem('stackBallLevel')) || 1;
let bestScore = parseInt(localStorage.getItem('stackBallBest')) || 0;
let destroyedCount = 0;

// Camera
let cameraTargetY = 0;
let cameraVelocity = 0;

// Trail effect
let trailPoints = [];
let trailMesh = null;
const TRAIL_LENGTH = 15;

// Footprints
let footprints = [];

// Fire particles (invincibility)
let fireParticles = [];

// Audio
let audioCtx = null;
let currentPitch = 1.0;
let pitchResetTimer = 0;

let palette;
let lastTime = 0;

const palettes = [
  { main: 0xff6b6b, gradient: [0xff6b6b, 0xfeca57], bg: 0x1a1a2e },
  { main: 0x5f27cd, gradient: [0x5f27cd, 0x341f97], bg: 0x0c0c1e },
  { main: 0x00d2d3, gradient: [0x00d2d3, 0x01a3a4], bg: 0x0a2e2e },
  { main: 0xff9f43, gradient: [0xff9f43, 0xee5a24], bg: 0x2d1810 },
  { main: 0x10ac84, gradient: [0x10ac84, 0x1dd1a1], bg: 0x0a2a1a },
  { main: 0xe056fd, gradient: [0xe056fd, 0xbe2edd], bg: 0x2a1a2e },
];

// ===== DOM =====
const ui = {
  level: document.getElementById('level'),
  score: document.getElementById('score'),
  progress: document.getElementById('progress-fill'),
  invBar: document.getElementById('invincible-container'),
  invFill: document.getElementById('invincible-fill'),
  menu: document.getElementById('menu'),
  win: document.getElementById('win'),
  winLevel: document.getElementById('winLevel'),
  lose: document.getElementById('lose'),
  finalScore: document.getElementById('finalScore'),
  bestScore: document.getElementById('bestScore')
};

// ===== INIT =====
function init() {
  setupThreeJS();
  setupAudio();
  setupInput();
  setupButtons();
  buildLevel();
  lastTime = performance.now();
  animate();
}

function setupThreeJS() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  document.getElementById('game-container').insertBefore(renderer.domElement, document.getElementById('ui'));
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function setupAudio() {
  // Create audio context on first user interaction
  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    window.removeEventListener('click', initAudio);
    window.removeEventListener('touchstart', initAudio);
  };
  window.addEventListener('click', initAudio);
  window.addEventListener('touchstart', initAudio);
}

function playSound(frequency, duration, type = 'square') {
  if (!audioCtx || !CONFIG.soundEnabled) return;
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.frequency.value = frequency * currentPitch;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
}

function playBreakSound() {
  playSound(200, 0.1, 'square');
  playSound(150, 0.15, 'sawtooth');
  
  // Increase pitch like original FXHandler
  currentPitch += CONFIG.pitchIncrement;
  if (currentPitch >= CONFIG.maxPitch) {
    currentPitch = CONFIG.basePitch;
  }
  pitchResetTimer = CONFIG.pitchResetDelay;
}

function playWinSound() {
  currentPitch = 0.8;
  playSound(523, 0.15, 'sine'); // C5
  setTimeout(() => playSound(659, 0.15, 'sine'), 100); // E5
  setTimeout(() => playSound(784, 0.3, 'sine'), 200); // G5
}

function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 7);
  dir.castShadow = true;
  dir.shadow.mapSize.width = 2048;
  dir.shadow.mapSize.height = 2048;
  scene.add(dir);
  
  const fill = new THREE.DirectionalLight(0xffffff, 0.3);
  fill.position.set(-3, 5, -5);
  scene.add(fill);
}

function setupInput() {
  const onDown = (e) => {
    // Don't trigger on buttons
    if (e.target.tagName === 'BUTTON') return;
    
    // Prevent default to avoid double-firing and scrolling issues
    if (e.cancelable) e.preventDefault();
    
    isHolding = true;
  };
  
  const onUp = (e) => {
    isHolding = false;
    // When releasing, try to resume invincibility countdown (like original)
    if (!isInvincible && invincibleTimer > 0 && destroyedPlatformCount >= CONFIG.platformsToEnableIndicator) {
      invincibleTimerRunning = true;
    }
  };
  
  // Use document instead of window for better mobile support
  document.addEventListener('mousedown', onDown);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchstart', onDown, { passive: false });
  document.addEventListener('touchend', onUp, { passive: false });
  
  // Also handle touch cancel (when touch is interrupted)
  document.addEventListener('touchcancel', onUp, { passive: false });
}

function setupButtons() {
  document.getElementById('startBtn').onclick = () => {
    gameState = 'playing';
    isPlaying = true;
    ui.menu.classList.add('hidden');
  };
  
  document.getElementById('nextBtn').onclick = () => {
    level++;
    localStorage.setItem('stackBallLevel', level);
    ui.win.classList.add('hidden');
    buildLevel();
    gameState = 'playing';
    isPlaying = true;
  };
  
  document.getElementById('retryBtn').onclick = () => {
    score = 0;
    ui.lose.classList.add('hidden');
    buildLevel();
    gameState = 'playing';
    isPlaying = true;
  };
}

// ===== LEVEL BUILDING =====
function buildLevel() {
  // Clear scene
  while (scene.children.length > 0) scene.remove(scene.children[0]);
  platforms = [];
  particles = [];
  trailPoints = [];
  footprints = [];
  fireParticles = [];
  
  if (trailMesh) {
    scene.remove(trailMesh);
    trailMesh = null;
  }
  
  setupLights();
  
  palette = palettes[(level - 1) % palettes.length];
  scene.background = new THREE.Color(palette.bg);
  
  // Reset state
  destroyedCount = 0;
  destroyedPlatformCount = 0;
  isInvincible = false;
  invincibleTimer = 0;
  invincibleTimerRunning = false;
  currentPitch = CONFIG.basePitch;
  pitchResetTimer = 0;
  
  createPole();
  createPlatforms();
  createFinishPlatform();
  createBall();
  createTrail();
  
  // Camera: positioned behind (Z+), looking down at ~25 degrees
  cameraTargetY = ball.position.y + CONFIG.cameraTrackOffset.y;
  camera.position.set(0, cameraTargetY, 8.3);
  camera.rotation.x = -0.44; // ~25 degrees looking down
  
  updateUI();
  updateProgress();
  updateInvincibleUI();
}

function createPole() {
  // Create a container for all platforms that will rotate
  platformsContainer = new THREE.Group();
  scene.add(platformsContainer);
  
  const stackHeight = CONFIG.platformCount * CONFIG.platformHeightOffset;
  const poleHeight = stackHeight + 4;
  const poleRadius = 0.25;
  
  const geo = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 32);
  const mat = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc,
    metalness: 0.2, 
    roughness: 0.8 
  });
  pole = new THREE.Mesh(geo, mat);
  pole.position.y = -stackHeight / 2;
  pole.castShadow = true;
  pole.receiveShadow = true;
  platformsContainer.add(pole);
}

function createPlatforms() {
  let currentY = 0;
  let currentRotation = 0;
  
  // Group platforms with same danger count (like original)
  let i = 0;
  while (i < CONFIG.platformCount) {
    const groupSize = Math.floor(Math.random() * 6) + 5; // 5-10 platforms per group
    const maxDangerParts = Math.floor(Math.random() * (CONFIG.segmentsPerPlatform - CONFIG.minSafeParts));
    
    for (let j = 0; j < groupSize && i < CONFIG.platformCount; j++, i++) {
      currentY -= CONFIG.platformHeightOffset;
      currentRotation += CONFIG.platformRotationOffset * Math.PI / 180;
      
      const t = i / CONFIG.platformCount;
      const color = lerpColor(palette.gradient[0], palette.gradient[1], t);
      
      const platform = createPlatform(currentY, currentRotation, color, maxDangerParts, i);
      platforms.push(platform);
    }
  }
}

function createPlatform(y, rotation, color, maxDangerParts, index) {
  const segments = [];
  const segmentAngle = (Math.PI * 2) / CONFIG.segmentsPerPlatform;
  const gapAngle = CONFIG.segmentGap;
  
  // Assign danger parts - matching original Unity logic
  const dangerIndices = new Set();
  for (let i = 0; i < CONFIG.segmentsPerPlatform; i++) {
    if (i <= maxDangerParts && Math.random() < 0.9) {
      dangerIndices.add(i);
    }
  }
  
  for (let i = 0; i < CONFIG.segmentsPerPlatform; i++) {
    const isDanger = dangerIndices.has(i);
    const centerAngle = rotation + i * segmentAngle;
    const halfArc = (segmentAngle - gapAngle) / 2;
    const startAngle = centerAngle - halfArc;
    const arcLength = segmentAngle - gapAngle;
    
    const segColor = isDanger ? 0x111111 : color;
    const seg = createSegment(startAngle, arcLength, segColor);
    seg.position.y = y;
    seg.userData = {
      isDanger: isDanger,
      startAngle: startAngle,
      endAngle: startAngle + arcLength,
      platformIndex: index
    };
    seg.castShadow = true;
    seg.receiveShadow = true;
    platformsContainer.add(seg);
    segments.push(seg);
  }
  
  return { y, segments, destroyed: false };
}

function createSegment(startAngle, arcLength, color) {
  const inner = CONFIG.platformInnerRadius;
  const outer = CONFIG.platformRadius;
  const thickness = CONFIG.platformThickness;
  
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];
  const steps = 12;
  const halfThick = thickness / 2;
  
  // Top face vertices
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + (i / steps) * arcLength;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    vertices.push(cos * outer, halfThick, sin * outer);
    vertices.push(cos * inner, halfThick, sin * inner);
  }
  
  // Bottom face vertices
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + (i / steps) * arcLength;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    vertices.push(cos * outer, -halfThick, sin * outer);
    vertices.push(cos * inner, -halfThick, sin * inner);
  }
  
  const topStart = 0;
  const bottomStart = (steps + 1) * 2;
  
  // Top face triangles
  for (let i = 0; i < steps; i++) {
    const o1 = topStart + i * 2;
    const i1 = topStart + i * 2 + 1;
    const o2 = topStart + (i + 1) * 2;
    const i2 = topStart + (i + 1) * 2 + 1;
    indices.push(o1, i1, o2);
    indices.push(i1, i2, o2);
  }
  
  // Bottom face triangles
  for (let i = 0; i < steps; i++) {
    const o1 = bottomStart + i * 2;
    const i1 = bottomStart + i * 2 + 1;
    const o2 = bottomStart + (i + 1) * 2;
    const i2 = bottomStart + (i + 1) * 2 + 1;
    indices.push(o1, o2, i1);
    indices.push(i1, o2, i2);
  }
  
  // Outer arc face
  for (let i = 0; i < steps; i++) {
    const to1 = topStart + i * 2;
    const to2 = topStart + (i + 1) * 2;
    const bo1 = bottomStart + i * 2;
    const bo2 = bottomStart + (i + 1) * 2;
    indices.push(to1, to2, bo1);
    indices.push(bo1, to2, bo2);
  }
  
  // Inner arc face
  for (let i = 0; i < steps; i++) {
    const ti1 = topStart + i * 2 + 1;
    const ti2 = topStart + (i + 1) * 2 + 1;
    const bi1 = bottomStart + i * 2 + 1;
    const bi2 = bottomStart + (i + 1) * 2 + 1;
    indices.push(ti1, bi1, ti2);
    indices.push(bi1, bi2, ti2);
  }
  
  // Side faces
  const ts1o = topStart;
  const ts1i = topStart + 1;
  const bs1o = bottomStart;
  const bs1i = bottomStart + 1;
  indices.push(ts1o, bs1o, ts1i);
  indices.push(ts1i, bs1o, bs1i);
  
  const te1o = topStart + steps * 2;
  const te1i = topStart + steps * 2 + 1;
  const be1o = bottomStart + steps * 2;
  const be1i = bottomStart + steps * 2 + 1;
  indices.push(te1o, te1i, be1o);
  indices.push(te1i, be1i, be1o);
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  const mat = new THREE.MeshStandardMaterial({ 
    color, 
    metalness: 0.1, 
    roughness: 0.7,
    side: THREE.DoubleSide
  });
  
  return new THREE.Mesh(geometry, mat);
}

function createFinishPlatform() {
  const y = -(CONFIG.platformCount * CONFIG.platformHeightOffset) - 1;
  const geo = new THREE.CylinderGeometry(CONFIG.platformRadius, CONFIG.platformRadius, 0.8, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.6,
    roughness: 0.3,
    emissive: 0xffd700,
    emissiveIntensity: 0.2
  });
  finishPlatform = new THREE.Mesh(geo, mat);
  finishPlatform.position.y = y;
  finishPlatform.receiveShadow = true;
  platformsContainer.add(finishPlatform);
}

function createBall() {
  const geo = new THREE.SphereGeometry(CONFIG.ballRadius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: palette.main,
    metalness: 0.3,
    roughness: 0.4
  });
  ball = new THREE.Mesh(geo, mat);
  ball.position.set(1.2, 1.5, 0);
  ball.castShadow = true;
  ball.visible = true;
  ballVelocity = 0;
  scene.add(ball);
}

function createTrail() {
  trailPoints = [];
  for (let i = 0; i < TRAIL_LENGTH; i++) {
    trailPoints.push(ball.position.clone());
  }
  
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(TRAIL_LENGTH * 3);
  const colors = new Float32Array(TRAIL_LENGTH * 3);
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    linewidth: 2
  });
  
  trailMesh = new THREE.Line(geometry, material);
  scene.add(trailMesh);
}

function updateTrail() {
  if (!trailMesh || !ball) return;
  
  for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
    trailPoints[i].copy(trailPoints[i - 1]);
  }
  trailPoints[0].copy(ball.position);
  
  const positions = trailMesh.geometry.attributes.position.array;
  const colors = trailMesh.geometry.attributes.color.array;
  const trailColor = new THREE.Color(palette.main);
  
  for (let i = 0; i < TRAIL_LENGTH; i++) {
    positions[i * 3] = trailPoints[i].x;
    positions[i * 3 + 1] = trailPoints[i].y;
    positions[i * 3 + 2] = trailPoints[i].z;
    
    const alpha = 1 - (i / TRAIL_LENGTH);
    colors[i * 3] = trailColor.r * alpha;
    colors[i * 3 + 1] = trailColor.g * alpha;
    colors[i * 3 + 2] = trailColor.b * alpha;
  }
  
  trailMesh.geometry.attributes.position.needsUpdate = true;
  trailMesh.geometry.attributes.color.needsUpdate = true;
}

function createFootprint(position) {
  const geo = new THREE.CircleGeometry(CONFIG.ballRadius * 0.8, 16);
  const mat = new THREE.MeshBasicMaterial({
    color: palette.main,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  const footprint = new THREE.Mesh(geo, mat);
  footprint.position.copy(position);
  footprint.position.y += 0.01;
  footprint.rotation.x = -Math.PI / 2;
  footprint.userData.life = 2.0;
  platformsContainer.add(footprint);
  footprints.push(footprint);
}

function updateFootprints(dt) {
  for (let i = footprints.length - 1; i >= 0; i--) {
    const fp = footprints[i];
    fp.userData.life -= dt;
    fp.material.opacity = Math.max(0, fp.userData.life / 2.0) * 0.6;
    
    if (fp.userData.life <= 0) {
      platformsContainer.remove(fp);
      footprints.splice(i, 1);
    }
  }
}

function updateFireParticles(dt) {
  if (isInvincible && ball && Math.random() < 0.3) {
    const geo = new THREE.SphereGeometry(0.05 + Math.random() * 0.05, 8, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: Math.random() < 0.5 ? 0xff4400 : 0xffaa00,
      transparent: true,
      opacity: 1
    });
    const particle = new THREE.Mesh(geo, mat);
    particle.position.copy(ball.position);
    particle.position.x += (Math.random() - 0.5) * 0.3;
    particle.position.z += (Math.random() - 0.5) * 0.3;
    particle.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        2 + Math.random() * 2,
        (Math.random() - 0.5) * 2
      ),
      life: 0.5 + Math.random() * 0.3
    };
    scene.add(particle);
    fireParticles.push(particle);
  }
  
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    const p = fireParticles[i];
    p.position.add(p.userData.velocity.clone().multiplyScalar(dt));
    p.userData.velocity.y -= 5 * dt;
    p.userData.life -= dt;
    p.material.opacity = p.userData.life / 0.8;
    p.scale.multiplyScalar(0.97);
    
    if (p.userData.life <= 0) {
      scene.remove(p);
      fireParticles.splice(i, 1);
    }
  }
}


// ===== GAME LOOP =====
function animate(currentTime) {
  requestAnimationFrame(animate);
  
  const dt = Math.min((currentTime - lastTime) / 1000, 0.05) || 0.016;
  lastTime = currentTime;
  
  if (isPlaying) {
    updateBall(dt);
    checkCollisions();
    updateInvincibleTimer(dt);
    updateTrail();
    updateFireParticles(dt);
  }
  
  // Rotate platforms continuously (like Rotator.cs)
  if (platformsContainer) {
    platformsContainer.rotation.y += (CONFIG.platformRotationSpeed * Math.PI / 180) * dt;
  }
  
  updateParticles(dt);
  updateFootprints(dt);
  updateCamera(dt);
  
  // Pitch reset timer (like original FXHandler)
  if (pitchResetTimer > 0) {
    pitchResetTimer -= dt;
    if (pitchResetTimer <= 0) {
      currentPitch = CONFIG.basePitch;
    }
  }
  
  renderer.render(scene, camera);
}

function updateBall(dt) {
  if (isHolding) {
    ballVelocity = -CONFIG.moveSpeed;
  } else {
    ballVelocity -= CONFIG.gravity * dt;
  }
  
  ball.position.y += ballVelocity * dt;
  
  // Invincible visual effect
  if (isInvincible) {
    ball.material.emissive.setHex(0xff0000);
    ball.material.emissiveIntensity = 0.5 + Math.sin(performance.now() * 0.01) * 0.3;
  } else {
    ball.material.emissive.setHex(0x000000);
    ball.material.emissiveIntensity = 0;
  }
}

function checkCollisions() {
  const ballBottom = ball.position.y - CONFIG.ballRadius;
  const ballX = ball.position.x;
  const ballZ = ball.position.z;
  const distFromCenter = Math.sqrt(ballX * ballX + ballZ * ballZ);
  
  let ballAngle = Math.atan2(ballZ, ballX);
  if (ballAngle < 0) ballAngle += Math.PI * 2;
  
  const containerRotation = platformsContainer ? platformsContainer.rotation.y : 0;
  let localBallAngle = ballAngle - containerRotation;
  
  while (localBallAngle < 0) localBallAngle += Math.PI * 2;
  while (localBallAngle >= Math.PI * 2) localBallAngle -= Math.PI * 2;
  
  // Check finish platform
  const finishTop = finishPlatform.position.y + 0.4;
  if (ballBottom <= finishTop && ballVelocity < 0) {
    bounce(finishTop + CONFIG.ballRadius);
    winGame();
    return;
  }
  
  // Check platforms
  for (const platform of platforms) {
    if (platform.destroyed) continue;
    
    const platTop = platform.y + CONFIG.platformThickness / 2;
    const platBottom = platform.y - CONFIG.platformThickness / 2;
    
    if (ballBottom <= platTop && ballBottom > platBottom - 0.2) {
      if (distFromCenter >= CONFIG.platformInnerRadius && distFromCenter <= CONFIG.platformRadius) {
        for (const seg of platform.segments) {
          if (!seg.visible) continue;
          
          if (isAngleInSegment(localBallAngle, seg.userData.startAngle, seg.userData.endAngle)) {
            handleCollision(seg, platform, platTop);
            return;
          }
        }
      }
    }
  }
}

function isAngleInSegment(angle, startAngle, endAngle) {
  const twoPi = Math.PI * 2;
  angle = ((angle % twoPi) + twoPi) % twoPi;
  startAngle = ((startAngle % twoPi) + twoPi) % twoPi;
  endAngle = ((endAngle % twoPi) + twoPi) % twoPi;
  
  // Add small tolerance to shrink the detection zone (makes it more forgiving)
  const tolerance = 0.08; // ~4.5 degrees
  startAngle += tolerance;
  endAngle -= tolerance;
  
  if (startAngle <= endAngle) {
    return angle >= startAngle && angle <= endAngle;
  } else {
    return angle >= startAngle || angle <= endAngle;
  }
}

function handleCollision(segment, platform, platformTop) {
  if (isHolding) {
    // Only check danger if we're DEFINITELY on a black segment
    // Add tolerance to avoid false positives
    if (segment.userData.isDanger === true && !isInvincible) {
      // Double check - make sure ball is really on this segment
      const ballX = ball.position.x;
      const ballZ = ball.position.z;
      const distFromCenter = Math.sqrt(ballX * ballX + ballZ * ballZ);
      
      // Only trigger game over if ball is solidly on the platform (not on edge)
      if (distFromCenter > CONFIG.platformInnerRadius + 0.15 && 
          distFromCenter < CONFIG.platformRadius - 0.15) {
        loseGame();
        return;
      }
    }
    destroyPlatform(platform);
  } else if (ballVelocity < 0) {
    bounce(platformTop + CONFIG.ballRadius);
  }
}

function bounce(newY) {
  const footprintPos = new THREE.Vector3(ball.position.x, newY - CONFIG.ballRadius, ball.position.z);
  const localPos = platformsContainer.worldToLocal(footprintPos.clone());
  createFootprint(localPos);
  
  ball.position.y = newY;
  ballVelocity = CONFIG.jumpPower;
}

function destroyPlatform(platform) {
  if (platform.destroyed) return;
  platform.destroyed = true;
  destroyedCount++;
  
  playBreakSound();
  
  for (const seg of platform.segments) {
    if (!seg.visible) continue;
    throwSegment(seg, platform.y);
  }
  
  score += isInvincible ? 2 : 1;
  updateUI();
  updateProgress();
  
  // Invincibility logic
  if (!isInvincible) {
    destroyedPlatformCount++;
    
    if (destroyedPlatformCount >= CONFIG.platformsToEnableIndicator) {
      invincibleTimerRunning = false;
      invincibleTimer += CONFIG.secondsPerPlatform;
      
      if (invincibleTimer >= CONFIG.secondsToEnableInvincible) {
        activateInvincible();
      }
      updateInvincibleUI();
    }
  }
}

function throwSegment(seg, platformY) {
  seg.visible = false;
  
  const angle = (seg.userData.startAngle + seg.userData.endAngle) / 2;
  const x = Math.cos(angle) * 1.5;
  const z = Math.sin(angle) * 1.5;
  const pos = new THREE.Vector3(x, platformY, z);
  const color = seg.material.color.getHex();
  
  const throwX = x > 0 ? 8 : -8;
  const throwY = platformY + 13;
  
  for (let i = 0; i < 3; i++) {
    createDebris(pos.clone(), color, new THREE.Vector3(throwX, throwY, z));
  }
}

function createDebris(pos, color, throwTarget) {
  const size = 0.15 + Math.random() * 0.1;
  const geo = new THREE.BoxGeometry(size, size, size);
  const mat = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  
  mesh.position.copy(pos);
  mesh.position.x += (Math.random() - 0.5);
  mesh.position.z += (Math.random() - 0.5);
  
  const dir = throwTarget.clone().sub(pos).normalize();
  const speed = 8 + Math.random() * 4;
  
  scene.add(mesh);
  particles.push({
    mesh,
    velocity: dir.multiplyScalar(speed),
    rotSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ),
    life: 1.5
  });
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.velocity.y -= CONFIG.gravity * dt * 0.5;
    p.mesh.position.add(p.velocity.clone().multiplyScalar(dt));
    p.mesh.rotation.x += p.rotSpeed.x * dt;
    p.mesh.rotation.y += p.rotSpeed.y * dt;
    p.mesh.rotation.z += p.rotSpeed.z * dt;
    p.life -= dt;
    
    if (p.life <= 0) {
      scene.remove(p.mesh);
      particles.splice(i, 1);
    }
  }
}

// ===== INVINCIBILITY =====
function updateInvincibleTimer(dt) {
  if (isInvincible) {
    invincibleTimer -= dt;
    updateInvincibleUI();
    
    if (invincibleTimer <= 0) {
      deactivateInvincible();
    }
  } else if (invincibleTimerRunning && invincibleTimer > 0) {
    invincibleTimer -= dt;
    updateInvincibleUI();
    
    if (invincibleTimer <= 0) {
      resetInvincibleProgress();
    }
  }
}

function activateInvincible() {
  isInvincible = true;
  invincibleTimer = CONFIG.invincibleSeconds;
  invincibleTimerRunning = false;
  ui.invFill.classList.add('active');
  updateInvincibleUI();
}

function deactivateInvincible() {
  isInvincible = false;
  resetInvincibleProgress();
  ui.invFill.classList.remove('active');
}

function resetInvincibleProgress() {
  destroyedPlatformCount = 0;
  invincibleTimer = 0;
  invincibleTimerRunning = false;
  updateInvincibleUI();
}

function updateInvincibleUI() {
  const show = destroyedPlatformCount >= CONFIG.platformsToEnableIndicator || isInvincible;
  ui.invBar.classList.toggle('show', show);
  
  let fill;
  if (isInvincible) {
    fill = invincibleTimer / CONFIG.invincibleSeconds;
  } else {
    fill = invincibleTimer / CONFIG.secondsToEnableInvincible;
  }
  ui.invFill.style.width = `${Math.max(0, fill) * 100}%`;
}

// ===== CAMERA =====
function updateCamera(dt) {
  if (!ball) return;
  
  const tempTargetY = ball.position.y + CONFIG.cameraTrackOffset.y;
  
  if (isHolding && tempTargetY < cameraTargetY) {
    cameraTargetY = tempTargetY;
  }
  
  // Smooth damp
  const smoothTime = CONFIG.cameraTrackDelay;
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const delta = camera.position.y - cameraTargetY;
  const temp = (cameraVelocity + omega * delta) * dt;
  cameraVelocity = (cameraVelocity - omega * temp) * exp;
  camera.position.y = cameraTargetY + (delta + temp) * exp;
  
  camera.position.x = 0;
  camera.position.z = 8.3;
}

// ===== GAME STATES =====
function winGame() {
  gameState = 'win';
  isPlaying = false;
  isHolding = false;
  saveBestScore();
  playWinSound();
  
  ui.winLevel.textContent = `Level ${level} Cleared!`;
  ui.win.classList.remove('hidden');
}

function loseGame() {
  gameState = 'lose';
  isPlaying = false;
  isHolding = false;
  saveBestScore();
  
  ui.finalScore.textContent = score;
  ui.bestScore.textContent = bestScore;
  ui.lose.classList.remove('hidden');
  
  // Explode ball
  for (let i = 0; i < 20; i++) {
    createDebris(
      ball.position.clone(),
      palette.main,
      new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        ball.position.y + 5,
        (Math.random() - 0.5) * 10
      )
    );
  }
  ball.visible = false;
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
function lerpColor(a, b, t) {
  const c1 = new THREE.Color(a);
  const c2 = new THREE.Color(b);
  return c1.lerp(c2, t).getHex();
}

// Start
init();

})();
