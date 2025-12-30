// Stack Ball - EXACT replica from Unity source
(function() {
'use strict';

// =============================================================================
// EXACT VALUES FROM UNITY SCENE FILE
// =============================================================================

// Camera (from Main Camera transform)
// Position: x: 0, y: 2, z: -5
// Rotation: x: 20 degrees (looking down)
// orthographic: 1 (TRUE - uses orthographic projection!)
// orthographic size: 5
const CAMERA_Y = 2;
const CAMERA_Z = -5;
const CAMERA_ROTATION_X = 20; // degrees

// Ball (from Ball transform)
// Position: x: 0, y: 2.15, z: -1.2
// Scale: 0.5, 0.5, 0.5 (radius = 0.25)
const BALL_START_Y = 2.15;
const BALL_START_Z = -1.2;
const BALL_RADIUS = 0.25;

// From Ball.cs FixedUpdate:
// rb.velocity = new Vector3(0, -100 * Time.fixedDeltaTime * 7, 0)
// = -100 * 0.02 * 7 = -14 units/sec
const SMASH_VELOCITY = -14;

// From Ball.cs OnCollisionEnter/Stay:
// rb.velocity = new Vector3(0, 50 * Time.deltaTime * 5, 0)
// This is applied every frame during collision = constant upward push
const BOUNCE_VELOCITY = 5;

// From Ball.cs: if (rb.velocity.y > 5) rb.velocity.y = 5
const MAX_UP_VELOCITY = 5;

// From Rotator.cs: public float speed = 100
const ROTATION_SPEED = 100;

// From LevelSpawner.cs: i -= 0.5f
const PLATFORM_SPACING = 0.5;

// From LevelSpawner.cs: i * 8 degrees
const ROTATION_PER_PLATFORM = 8;

// Unity default gravity
const GRAVITY = 9.81;

// =============================================================================
// STATE
// =============================================================================
let scene, camera, renderer;
let ball, pole, platforms = [], finishPlatform;
let platformsContainer;

let ballY = BALL_START_Y;
let ballVelocity = 0;
let isSmashing = false;
let isPlaying = false;
let gameState = 'menu';

let score = 0;
let level = parseInt(localStorage.getItem('stackBallLevel')) || 1;
let bestScore = parseInt(localStorage.getItem('stackBallBest')) || 0;
let destroyedCount = 0;
let totalPlatforms = 0;

let debris = [];
let lastTime = 0;
let mainColor;

// =============================================================================
// DOM
// =============================================================================
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

// =============================================================================
// INIT
// =============================================================================
function init() {
  setupThreeJS();
  setupInput();
  setupButtons();
  buildLevel();
  lastTime = performance.now();
  animate();
}

function setupThreeJS() {
  scene = new THREE.Scene();
  
  // ORTHOGRAPHIC camera like Unity (orthographic: 1, size: 5)
  const aspect = window.innerWidth / window.innerHeight;
  const frustumSize = 5;
  camera = new THREE.OrthographicCamera(
    -frustumSize * aspect, frustumSize * aspect,
    frustumSize, -frustumSize,
    0.1, 100
  );
  
  // Camera position from Unity scene: x:0, y:2, z:-5, rotX: 20deg
  camera.position.set(0, CAMERA_Y, -CAMERA_Z); // Flip Z for Three.js
  camera.rotation.x = -CAMERA_ROTATION_X * Math.PI / 180;
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x87CEEB); // Sky blue like Unity
  document.getElementById('game-container').insertBefore(renderer.domElement, document.getElementById('ui'));
  
  // Lighting (from Unity scene - directional light at rotation 50, -30, 0)
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  
  const directional = new THREE.DirectionalLight(0xfff4d6, 1); // Warm light
  directional.position.set(1, 2, 1);
  scene.add(directional);
  
  window.addEventListener('resize', onResize);
}

function onResize() {
  const aspect = window.innerWidth / window.innerHeight;
  const frustumSize = 5;
  camera.left = -frustumSize * aspect;
  camera.right = frustumSize * aspect;
  camera.top = frustumSize;
  camera.bottom = -frustumSize;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupInput() {
  const onDown = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    if (e.cancelable) e.preventDefault();
    isSmashing = true;
  };
  
  const onUp = () => { isSmashing = false; };
  
  document.addEventListener('mousedown', onDown);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchstart', onDown, { passive: false });
  document.addEventListener('touchend', onUp);
  document.addEventListener('touchcancel', onUp);
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

// =============================================================================
// LEVEL BUILDING
// =============================================================================
function buildLevel() {
  while (scene.children.length > 2) scene.remove(scene.children[2]);
  platforms = [];
  debris = [];
  destroyedCount = 0;
  
  // Random color (from LevelSpawner: Random.ColorHSV(0, 1, 0.5f, 1, 1, 1))
  const hue = Math.random();
  mainColor = new THREE.Color().setHSL(hue, 1, 0.5);
  
  // Platform count (from LevelSpawner)
  const addOn = level <= 9 ? 7 : 0;
  totalPlatforms = Math.floor((level + addOn) * 2); // *2 because spacing is 0.5
  totalPlatforms = Math.min(totalPlatforms, 50);
  
  // Container for rotating platforms
  platformsContainer = new THREE.Group();
  scene.add(platformsContainer);
  
  // Pole
  const poleHeight = totalPlatforms * PLATFORM_SPACING + 3;
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, poleHeight, 16);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = -poleHeight / 2 + 1;
  platformsContainer.add(pole);
  
  // Create platforms
  for (let i = 0; i < totalPlatforms; i++) {
    const y = -i * PLATFORM_SPACING;
    const rotDeg = -i * ROTATION_PER_PLATFORM;
    createPlatform(y, rotDeg, i);
  }
  
  // Finish platform
  const finishY = -totalPlatforms * PLATFORM_SPACING - 0.5;
  const finishGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
  const finishMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.3
  });
  finishPlatform = new THREE.Mesh(finishGeo, finishMat);
  finishPlatform.position.y = finishY;
  platformsContainer.add(finishPlatform);
  
  // Ball (position from Unity: y: 2.15, z: -1.2)
  const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 24, 24);
  const ballMat = new THREE.MeshStandardMaterial({ color: mainColor });
  ball = new THREE.Mesh(ballGeo, ballMat);
  ballY = BALL_START_Y;
  ballVelocity = 0;
  ball.position.set(0, ballY, BALL_START_Z);
  ball.visible = true;
  scene.add(ball);
  
  updateUI();
}

function createPlatform(y, rotDeg, index) {
  const group = new THREE.Group();
  group.position.y = y;
  group.rotation.y = rotDeg * Math.PI / 180;
  
  // Difficulty scaling
  let maxDanger = Math.min(Math.floor(index / 6), 5);
  const dangerCount = Math.floor(Math.random() * (maxDanger + 1));
  
  const dangerSet = new Set();
  const indices = [...Array(8).keys()];
  shuffle(indices);
  for (let i = 0; i < dangerCount; i++) dangerSet.add(indices[i]);
  
  const segments = [];
  const segAngle = Math.PI / 4; // 45 degrees = 8 segments
  
  for (let i = 0; i < 8; i++) {
    const isDanger = dangerSet.has(i);
    const startAngle = i * segAngle;
    const color = isDanger ? 0x1a1a1a : mainColor.getHex();
    const segment = createSegment(startAngle, segAngle - 0.06, color);
    segment.userData = { isDanger, startAngle, endAngle: startAngle + segAngle - 0.06 };
    group.add(segment);
    segments.push(segment);
  }
  
  platformsContainer.add(group);
  platforms.push({ group, y, segments, destroyed: false });
}

function createSegment(startAngle, arcLen, color) {
  const inner = 0.25;
  const outer = 1.5;
  const thickness = 0.12;
  
  const shape = new THREE.Shape();
  const steps = 8;
  
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + (i / steps) * arcLen;
    const x = Math.cos(a) * outer;
    const z = Math.sin(a) * outer;
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  }
  
  for (let i = steps; i >= 0; i--) {
    const a = startAngle + (i / steps) * arcLen;
    shape.lineTo(Math.cos(a) * inner, Math.sin(a) * inner);
  }
  shape.closePath();
  
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  geo.rotateX(Math.PI / 2);
  geo.translate(0, thickness / 2, 0);
  
  const mat = new THREE.MeshStandardMaterial({ color });
  return new THREE.Mesh(geo, mat);
}

// =============================================================================
// GAME LOOP
// =============================================================================
function animate(time = 0) {
  requestAnimationFrame(animate);
  
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  
  if (isPlaying) {
    updateBall(dt);
    checkCollisions();
  }
  
  // Rotate platforms (Rotator.cs: speed = 100 deg/sec)
  if (platformsContainer) {
    platformsContainer.rotation.y += (ROTATION_SPEED * Math.PI / 180) * dt;
  }
  
  updateDebris(dt);
  updateCamera();
  
  renderer.render(scene, camera);
}

function updateBall(dt) {
  if (isSmashing) {
    // From Ball.cs: rb.velocity = new Vector3(0, -100 * Time.fixedDeltaTime * 7, 0)
    ballVelocity = SMASH_VELOCITY;
  } else {
    // Apply gravity when not smashing
    ballVelocity -= GRAVITY * dt;
  }
  
  // Cap upward velocity
  if (ballVelocity > MAX_UP_VELOCITY) {
    ballVelocity = MAX_UP_VELOCITY;
  }
  
  ballY += ballVelocity * dt;
  ball.position.y = ballY;
}

function checkCollisions() {
  const ballBottom = ballY - BALL_RADIUS;
  const ballX = ball.position.x;
  const ballZ = ball.position.z;
  const dist = Math.sqrt(ballX * ballX + ballZ * ballZ);
  
  // Check if over platform ring
  if (dist < 0.25 || dist > 1.5) return;
  
  // Ball angle
  let ballAngle = Math.atan2(ballZ, ballX);
  if (ballAngle < 0) ballAngle += Math.PI * 2;
  
  // Check finish
  if (ballBottom <= finishPlatform.position.y + 0.15 && ballVelocity < 0) {
    winGame();
    return;
  }
  
  // Check platforms
  for (const plat of platforms) {
    if (plat.destroyed) continue;
    
    const top = plat.y + 0.06;
    const bot = plat.y - 0.06;
    
    if (ballBottom <= top && ballBottom > bot - 0.05 && ballVelocity < 0) {
      // Local angle
      const containerRot = platformsContainer.rotation.y;
      let localAngle = ballAngle - containerRot - plat.group.rotation.y;
      while (localAngle < 0) localAngle += Math.PI * 2;
      while (localAngle >= Math.PI * 2) localAngle -= Math.PI * 2;
      
      for (const seg of plat.segments) {
        if (!seg.visible) continue;
        
        const start = seg.userData.startAngle;
        const end = seg.userData.endAngle;
        
        if (localAngle >= start - 0.05 && localAngle <= end + 0.05) {
          if (isSmashing) {
            if (seg.userData.isDanger) {
              loseGame();
              return;
            }
            destroyPlatform(plat);
          } else {
            // Bounce
            ballY = top + BALL_RADIUS;
            ballVelocity = BOUNCE_VELOCITY;
          }
          return;
        }
      }
    }
  }
}

function destroyPlatform(plat) {
  if (plat.destroyed) return;
  plat.destroyed = true;
  destroyedCount++;
  score++;
  
  for (const seg of plat.segments) {
    seg.visible = false;
    createDebrisFromSegment(seg, plat.y);
  }
  
  updateUI();
  ui.progress.style.width = `${(destroyedCount / totalPlatforms) * 100}%`;
}

function createDebrisFromSegment(seg, y) {
  const color = seg.material.color.getHex();
  const angle = (seg.userData.startAngle + seg.userData.endAngle) / 2;
  
  for (let i = 0; i < 3; i++) {
    const size = 0.08 + Math.random() * 0.06;
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    
    const x = Math.cos(angle) * 0.8 + (Math.random() - 0.5) * 0.3;
    const z = Math.sin(angle) * 0.8 + (Math.random() - 0.5) * 0.3;
    mesh.position.set(x, y, z);
    
    const dirX = x > 0 ? 1 : -1;
    scene.add(mesh);
    
    debris.push({
      mesh,
      velocity: new THREE.Vector3(dirX * (3 + Math.random() * 2), 4 + Math.random() * 2, (Math.random() - 0.5) * 2),
      rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10),
      life: 1.0
    });
  }
}

function updateDebris(dt) {
  for (let i = debris.length - 1; i >= 0; i--) {
    const d = debris[i];
    d.velocity.y -= GRAVITY * dt;
    d.mesh.position.add(d.velocity.clone().multiplyScalar(dt));
    d.mesh.rotation.x += d.rotSpeed.x * dt;
    d.mesh.rotation.y += d.rotSpeed.y * dt;
    d.mesh.rotation.z += d.rotSpeed.z * dt;
    d.life -= dt;
    
    if (d.life <= 0) {
      scene.remove(d.mesh);
      debris.splice(i, 1);
    }
  }
}

function updateCamera() {
  // Camera follows ball Y (from CameraFollow.cs)
  const targetY = ballY + 2;
  camera.position.y += (targetY - camera.position.y) * 0.1;
}

// =============================================================================
// GAME STATES
// =============================================================================
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
  
  for (let i = 0; i < 12; i++) {
    const size = 0.06;
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshStandardMaterial({ color: mainColor });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(ball.position);
    scene.add(mesh);
    
    const angle = (i / 12) * Math.PI * 2;
    debris.push({
      mesh,
      velocity: new THREE.Vector3(Math.cos(angle) * 3, 5, Math.sin(angle) * 3),
      rotSpeed: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
      life: 1.5
    });
  }
  
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

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

init();
})();
