// Stack Ball - Clean Three.js rebuild
(function() {
'use strict';

// Config
const PLATFORM_COUNT = 30;
const SEGMENTS_PER_PLATFORM = 8;
const PLATFORM_SPACING = 0.5;
const BALL_RADIUS = 0.35;
const PLATFORM_RADIUS = 1.8;
const INNER_RADIUS = 0.4;
const ROTATION_SPEED = 50; // degrees/sec

// State
let scene, camera, renderer;
let ball, pole, platforms = [], finishPlatform;
let ballY = 2, ballVel = 0;
let isHolding = false, isPlaying = false;
let gameState = 'menu';
let score = 0, level = parseInt(localStorage.getItem('stackBallLevel')) || 1;
let bestScore = parseInt(localStorage.getItem('stackBallBest')) || 0;
let destroyedCount = 0;
let rotation = 0;
let lastTime = 0;

// Colors
const colors = [
  [0xff6b6b, 0xfeca57],
  [0x5f27cd, 0x9b59b6],
  [0x00d2d3, 0x01a3a4],
  [0xff9f43, 0xee5a24],
  [0x10ac84, 0x1dd1a1],
];
let palette;

// DOM
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

// Init
function init() {
  setupThree();
  setupInput();
  setupButtons();
  buildLevel();
  animate();
}

function setupThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);
  
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.getElementById('game-container').insertBefore(renderer.domElement, document.getElementById('ui'));
  
  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 5);
  scene.add(dir);
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function setupInput() {
  const down = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    isHolding = true;
  };
  const up = () => { isHolding = false; };
  
  document.addEventListener('mousedown', down);
  document.addEventListener('mouseup', up);
  document.addEventListener('touchstart', down, { passive: false });
  document.addEventListener('touchend', up);
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

function buildLevel() {
  // Clear
  while(scene.children.length > 2) scene.remove(scene.children[2]);
  platforms = [];
  destroyedCount = 0;
  rotation = 0;
  
  palette = colors[(level - 1) % colors.length];
  
  // Pole
  const poleH = PLATFORM_COUNT * PLATFORM_SPACING + 3;
  const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, poleH, 16);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = -poleH / 2 + 1;
  scene.add(pole);
  
  // Platforms
  for (let i = 0; i < PLATFORM_COUNT; i++) {
    const y = -i * PLATFORM_SPACING;
    const dangerCount = Math.min(Math.floor(i / 5), SEGMENTS_PER_PLATFORM - 2);
    const platform = createPlatform(y, i, dangerCount);
    platforms.push(platform);
  }
  
  // Finish
  const finishY = -PLATFORM_COUNT * PLATFORM_SPACING - 0.5;
  const finishGeo = new THREE.CylinderGeometry(PLATFORM_RADIUS, PLATFORM_RADIUS, 0.5, 32);
  const finishMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.3 });
  finishPlatform = new THREE.Mesh(finishGeo, finishMat);
  finishPlatform.position.y = finishY;
  scene.add(finishPlatform);
  
  // Ball
  const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 24, 24);
  const ballMat = new THREE.MeshStandardMaterial({ color: palette[0] });
  ball = new THREE.Mesh(ballGeo, ballMat);
  ballY = 2;
  ballVel = 0;
  ball.position.set(1.2, ballY, 0);
  scene.add(ball);
  
  updateUI();
}

function createPlatform(y, index, maxDanger) {
  const group = new THREE.Group();
  group.position.y = y;
  
  // Pick random danger segments
  const dangerSet = new Set();
  const indices = [...Array(SEGMENTS_PER_PLATFORM).keys()];
  shuffle(indices);
  for (let i = 0; i < maxDanger; i++) dangerSet.add(indices[i]);
  
  const segments = [];
  const segAngle = (Math.PI * 2) / SEGMENTS_PER_PLATFORM;
  const t = index / PLATFORM_COUNT;
  const color = lerpColor(palette[0], palette[1], t);
  
  for (let i = 0; i < SEGMENTS_PER_PLATFORM; i++) {
    const isDanger = dangerSet.has(i);
    const startAngle = i * segAngle;
    const seg = createSegment(startAngle, segAngle - 0.05, isDanger ? 0x222222 : color);
    seg.userData = { isDanger, startAngle, endAngle: startAngle + segAngle - 0.05 };
    group.add(seg);
    segments.push(seg);
  }
  
  scene.add(group);
  return { group, y, segments, destroyed: false };
}

function createSegment(startAngle, arcLen, color) {
  const shape = new THREE.Shape();
  const inner = INNER_RADIUS, outer = PLATFORM_RADIUS;
  const steps = 8;
  
  // Outer arc
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + (i / steps) * arcLen;
    const x = Math.cos(a) * outer;
    const z = Math.sin(a) * outer;
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  }
  
  // Inner arc (reverse)
  for (let i = steps; i >= 0; i--) {
    const a = startAngle + (i / steps) * arcLen;
    shape.lineTo(Math.cos(a) * inner, Math.sin(a) * inner);
  }
  
  shape.closePath();
  
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false });
  geo.rotateX(Math.PI / 2);
  geo.translate(0, 0.1, 0);
  
  const mat = new THREE.MeshStandardMaterial({ color });
  return new THREE.Mesh(geo, mat);
}

// Game loop
function animate(time = 0) {
  requestAnimationFrame(animate);
  
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  
  if (isPlaying) {
    // Ball physics
    if (isHolding) {
      ballVel = -12; // smash down
    } else {
      ballVel += 30 * dt; // gravity
    }
    ballY += ballVel * dt;
    ball.position.y = ballY;
    
    // Rotate platforms
    rotation += ROTATION_SPEED * dt;
    platforms.forEach(p => { if (!p.destroyed) p.group.rotation.y = rotation * Math.PI / 180; });
    
    checkCollision();
  }
  
  // Camera follow
  camera.position.y += (ballY + 4 - camera.position.y) * 0.1;
  camera.lookAt(0, ballY, 0);
  
  renderer.render(scene, camera);
}

function checkCollision() {
  const ballBottom = ballY - BALL_RADIUS;
  const ballX = ball.position.x;
  const ballZ = ball.position.z;
  const dist = Math.sqrt(ballX * ballX + ballZ * ballZ);
  
  // Must be over platform ring
  if (dist < INNER_RADIUS || dist > PLATFORM_RADIUS) return;
  
  // Ball angle in world
  let ballAngle = Math.atan2(ballZ, ballX);
  if (ballAngle < 0) ballAngle += Math.PI * 2;
  
  // Check finish
  if (ballBottom <= finishPlatform.position.y + 0.25 && ballVel < 0) {
    winGame();
    return;
  }
  
  // Check platforms
  for (const plat of platforms) {
    if (plat.destroyed) continue;
    
    const top = plat.y + 0.1;
    const bot = plat.y - 0.1;
    
    if (ballBottom <= top && ballBottom > bot && ballVel < 0) {
      // Get local angle (subtract rotation)
      let localAngle = ballAngle - (rotation * Math.PI / 180);
      while (localAngle < 0) localAngle += Math.PI * 2;
      while (localAngle >= Math.PI * 2) localAngle -= Math.PI * 2;
      
      // Find segment
      for (const seg of plat.segments) {
        if (!seg.visible) continue;
        
        let start = seg.userData.startAngle;
        let end = seg.userData.endAngle;
        
        // Check if angle is in segment
        if (localAngle >= start && localAngle <= end) {
          if (isHolding) {
            // Smashing
            if (seg.userData.isDanger) {
              loseGame();
              return;
            }
            destroyPlatform(plat);
          } else {
            // Bounce
            ballY = top + BALL_RADIUS;
            ballVel = 8;
          }
          return;
        }
      }
    }
  }
}

function destroyPlatform(plat) {
  plat.destroyed = true;
  plat.segments.forEach(s => s.visible = false);
  destroyedCount++;
  score++;
  updateUI();
  ui.progress.style.width = `${(destroyedCount / PLATFORM_COUNT) * 100}%`;
}

function winGame() {
  isPlaying = false;
  gameState = 'win';
  saveBest();
  ui.winLevel.textContent = `Level ${level}`;
  ui.win.classList.remove('hidden');
}

function loseGame() {
  isPlaying = false;
  gameState = 'lose';
  saveBest();
  ball.visible = false;
  ui.finalScore.textContent = score;
  ui.bestScore.textContent = bestScore;
  ui.lose.classList.remove('hidden');
}

function saveBest() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('stackBallBest', bestScore);
  }
}

function updateUI() {
  ui.level.textContent = `Level ${level}`;
  ui.score.textContent = score;
}

// Utils
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function lerpColor(a, b, t) {
  const c1 = new THREE.Color(a);
  const c2 = new THREE.Color(b);
  return c1.lerp(c2, t).getHex();
}

init();
})();
