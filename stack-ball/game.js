// Stack Ball - EXACT replica using Unity source values
(function() {
'use strict';

// =============================================================================
// EXACT VALUES FROM UNITY SOURCE CODE
// =============================================================================

// From Ball.cs FixedUpdate():
// rb.velocity = new Vector3(0, -100 * Time.fixedDeltaTime * 7, 0)
// Time.fixedDeltaTime = 0.02 in Unity, so: -100 * 0.02 * 7 = -14
const SMASH_VELOCITY = -14;

// From Ball.cs OnCollisionEnter/OnCollisionStay():
// rb.velocity = new Vector3(0, 50 * Time.deltaTime * 5, 0)
// At 60fps, deltaTime ≈ 0.0167, so: 50 * 0.0167 * 5 ≈ 4.17
// But this is set every frame during collision, effectively a constant upward push
const BOUNCE_VELOCITY = 5;

// From Ball.cs FixedUpdate():
// if (rb.velocity.y > 5) rb.velocity = new Vector3(rb.velocity.x, 5, rb.velocity.z)
const MAX_UP_VELOCITY = 5;

// From Rotator.cs:
// public float speed = 100;
const ROTATION_SPEED = 100; // degrees per second

// From LevelSpawner.cs:
// for (i = 0; i > -level - addOn; i -= 0.5f)
const PLATFORM_SPACING = 0.5; // Unity units

// From LevelSpawner.cs:
// temp1.transform.eulerAngles = new Vector3(0, i * 8, 0)
const ROTATION_PER_PLATFORM = 8; // degrees

// From LevelSpawner.cs:
// addOn = 7 for level <= 9
const BASE_ADDON = 7;

// From CameraFollow.cs:
// transform.position = new Vector3(transform.position.x, camFollow.y, -5)
const CAMERA_Z = -5;

// From Ball.cs invincibility system:
// currentTime += Time.deltaTime * 0.8f (when smashing)
// currentTime -= Time.deltaTime * 0.5f (when not smashing, not invincible)
// currentTime -= Time.deltaTime * 0.35f (when invincible)
// Show bar when currentTime >= 0.3f
// Activate invincible when currentTime >= 1
const INV_CHARGE_RATE = 0.8;
const INV_DECAY_RATE = 0.5;
const INV_ACTIVE_DECAY = 0.35;
const INV_SHOW_THRESHOLD = 0.3;
const INV_ACTIVATE_THRESHOLD = 1.0;

// From StackPartController.cs Shatter():
// float force = Random.Range(20, 35);
// float torque = Random.Range(110, 180);
const SHATTER_FORCE_MIN = 20;
const SHATTER_FORCE_MAX = 35;
const SHATTER_TORQUE_MIN = 110;
const SHATTER_TORQUE_MAX = 180;

// Unity uses real physics gravity, default is -9.81
// But ball doesn't use gravity when smashing (velocity is set directly)
// When not smashing and not colliding, ball falls with gravity
const GRAVITY = 20; // Adjusted for web feel

// =============================================================================
// GAME STATE
// =============================================================================
let scene, camera, renderer;
let ball, pole, platforms = [], finishPlatform;
let platformsContainer; // Rotates all platforms together

let ballY = 0;
let ballVelocity = 0;
let isSmashing = false;
let isPlaying = false;
let gameState = 'menu'; // menu, playing, win, lose

// Invincibility (exact from Ball.cs)
let invincibleTime = 0; // currentTime in Unity
let isInvincible = false;

// Score/Level
let score = 0;
let level = parseInt(localStorage.getItem('stackBallLevel')) || 1;
let bestScore = parseInt(localStorage.getItem('stackBallBest')) || 0;
let destroyedCount = 0;
let totalPlatforms = 0;

// Debris particles
let debris = [];

// Timing
let lastTime = 0;

// Colors (random HSV like Unity: Random.ColorHSV(0, 1, 0.5f, 1, 1, 1))
let mainColor;

// =============================================================================
// DOM ELEMENTS
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
// INITIALIZATION
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
  scene.background = new THREE.Color(0x1a1a2e);
  
  // Camera setup (from CameraFollow.cs: z = -5, but we need to see the 3D)
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 2, 8);
  camera.lookAt(0, 0, 0);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  document.getElementById('game-container').insertBefore(renderer.domElement, document.getElementById('ui'));
  
  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(5, 10, 5);
  directional.castShadow = true;
  scene.add(directional);
  
  window.addEventListener('resize', onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupInput() {
  // From Ball.cs Update():
  // if (Input.GetMouseButtonDown(0)) smash = true;
  // if (Input.GetMouseButtonUp(0)) smash = false;
  
  const onDown = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    if (e.cancelable) e.preventDefault();
    isSmashing = true;
  };
  
  const onUp = () => {
    isSmashing = false;
  };
  
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
// LEVEL BUILDING (from LevelSpawner.cs)
// =============================================================================
function buildLevel() {
  // Clear scene (keep lights)
  while (scene.children.length > 2) {
    scene.remove(scene.children[2]);
  }
  platforms = [];
  debris = [];
  destroyedCount = 0;
  invincibleTime = 0;
  isInvincible = false;
  
  // Random color (from LevelSpawner.cs: Random.ColorHSV(0, 1, 0.5f, 1, 1, 1))
  const hue = Math.random();
  mainColor = new THREE.Color().setHSL(hue, 1, 0.5);
  
  // Calculate platform count (from LevelSpawner.cs)
  // for (i = 0; i > -level - addOn; i -= 0.5f)
  const addOn = level <= 9 ? BASE_ADDON : 0;
  totalPlatforms = Math.floor((level + addOn) / PLATFORM_SPACING);
  
  // Cap for web performance
  totalPlatforms = Math.min(totalPlatforms, 40);
  
  // Create container for rotating platforms (like Rotator.cs parent)
  platformsContainer = new THREE.Group();
  scene.add(platformsContainer);
  
  // Create pole
  const poleHeight = totalPlatforms * PLATFORM_SPACING + 3;
  const poleGeo = new THREE.CylinderGeometry(0.15, 0.15, poleHeight, 16);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = -poleHeight / 2 + 1;
  platformsContainer.add(pole);
  
  // Create platforms (from LevelSpawner.cs)
  // i starts at 0, decrements by 0.5 each iteration
  // rotation = i * 8 degrees
  for (let i = 0; i < totalPlatforms; i++) {
    const y = -i * PLATFORM_SPACING;
    const rotationDeg = -i * ROTATION_PER_PLATFORM;
    createPlatform(y, rotationDeg, i);
  }
  
  // Create finish platform (WinPrefab)
  const finishY = -totalPlatforms * PLATFORM_SPACING - 0.5;
  const finishGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32);
  const finishMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.3
  });
  finishPlatform = new THREE.Mesh(finishGeo, finishMat);
  finishPlatform.position.y = finishY;
  platformsContainer.add(finishPlatform);
  
  // Create ball
  const ballGeo = new THREE.SphereGeometry(0.3, 24, 24);
  const ballMat = new THREE.MeshStandardMaterial({ color: mainColor });
  ball = new THREE.Mesh(ballGeo, ballMat);
  ballY = 1.5;
  ballVelocity = 0;
  ball.position.set(1.0, ballY, 0);
  ball.visible = true;
  scene.add(ball);
  
  updateUI();
}

function createPlatform(y, rotationDeg, index) {
  const group = new THREE.Group();
  group.position.y = y;
  group.rotation.y = rotationDeg * Math.PI / 180;
  
  // Determine difficulty based on level (from LevelSpawner.cs model selection)
  // Early levels: easier models (fewer danger segments)
  // Later levels: harder models (more danger segments)
  let maxDanger;
  if (level <= 20) maxDanger = Math.min(2, Math.floor(index / 8));
  else if (level <= 50) maxDanger = Math.min(3, Math.floor(index / 6));
  else if (level <= 100) maxDanger = Math.min(4, Math.floor(index / 5));
  else maxDanger = Math.min(5, Math.floor(index / 4));
  
  // Randomly select danger segments (must leave at least 2 safe)
  const segmentCount = 8;
  const dangerCount = Math.min(maxDanger, segmentCount - 2);
  const dangerIndices = new Set();
  const indices = [...Array(segmentCount).keys()];
  shuffleArray(indices);
  for (let i = 0; i < dangerCount; i++) {
    dangerIndices.add(indices[i]);
  }
  
  const segments = [];
  const segmentAngle = (Math.PI * 2) / segmentCount;
  
  for (let i = 0; i < segmentCount; i++) {
    const isDanger = dangerIndices.has(i);
    const startAngle = i * segmentAngle;
    
    // Tags from Unity: "enemy" = colored (safe to smash), "plane" = black (kills)
    // WAIT - re-reading Ball.cs:
    // if (target.gameObject.tag == "enemy") -> ShatterAllParts (SAFE)
    // if (target.gameObject.tag == "plane") -> Died (DEATH)
    // So "enemy" is the COLORED segments, "plane" is BLACK
    
    const color = isDanger ? 0x1a1a1a : mainColor.getHex();
    const segment = createSegment(startAngle, segmentAngle - 0.08, color);
    segment.userData = {
      isDanger: isDanger, // true = black = "plane" tag = death
      startAngle: startAngle,
      endAngle: startAngle + segmentAngle - 0.08
    };
    group.add(segment);
    segments.push(segment);
  }
  
  platformsContainer.add(group);
  platforms.push({ group, y, segments, destroyed: false });
}

function createSegment(startAngle, arcLength, color) {
  const innerRadius = 0.3;
  const outerRadius = 1.5;
  const thickness = 0.15;
  
  const shape = new THREE.Shape();
  const steps = 10;
  
  // Outer arc
  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + (i / steps) * arcLength;
    const x = Math.cos(angle) * outerRadius;
    const z = Math.sin(angle) * outerRadius;
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  }
  
  // Inner arc (reverse)
  for (let i = steps; i >= 0; i--) {
    const angle = startAngle + (i / steps) * arcLength;
    const x = Math.cos(angle) * innerRadius;
    const z = Math.sin(angle) * innerRadius;
    shape.lineTo(x, z);
  }
  
  shape.closePath();
  
  const extrudeSettings = { depth: thickness, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, thickness / 2, 0);
  
  const material = new THREE.MeshStandardMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

// =============================================================================
// GAME LOOP
// =============================================================================
function animate(currentTime = 0) {
  requestAnimationFrame(animate);
  
  const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
  lastTime = currentTime;
  
  if (isPlaying) {
    updateBall(dt);
    updateInvincibility(dt);
    checkCollisions();
  }
  
  // Rotate platforms (from Rotator.cs: speed = 100 degrees/sec)
  if (platformsContainer) {
    platformsContainer.rotation.y += (ROTATION_SPEED * Math.PI / 180) * dt;
  }
  
  updateDebris(dt);
  updateCamera(dt);
  
  renderer.render(scene, camera);
}

function updateBall(dt) {
  // From Ball.cs FixedUpdate():
  if (isSmashing) {
    // rb.velocity = new Vector3(0, -100 * Time.fixedDeltaTime * 7, 0)
    // This sets velocity directly, not acceleration
    ballVelocity = SMASH_VELOCITY;
  } else {
    // When not smashing, apply gravity
    ballVelocity -= GRAVITY * dt;
  }
  
  // Cap upward velocity (from Ball.cs)
  if (ballVelocity > MAX_UP_VELOCITY) {
    ballVelocity = MAX_UP_VELOCITY;
  }
  
  ballY += ballVelocity * dt;
  ball.position.y = ballY;
  
  // Invincible visual effect
  if (isInvincible) {
    ball.material.emissive.setHex(0xff4400);
    ball.material.emissiveIntensity = 0.5 + Math.sin(currentTime * 0.01) * 0.3;
  } else {
    ball.material.emissive.setHex(0x000000);
    ball.material.emissiveIntensity = 0;
  }
}

function updateInvincibility(dt) {
  // From Ball.cs Update() - exact logic:
  if (isInvincible) {
    // currentTime -= Time.deltaTime * 0.35f
    invincibleTime -= dt * INV_ACTIVE_DECAY;
    
    if (invincibleTime <= 0) {
      invincibleTime = 0;
      isInvincible = false;
    }
  } else {
    if (isSmashing) {
      // currentTime += Time.deltaTime * 0.8f
      invincibleTime += dt * INV_CHARGE_RATE;
    } else {
      // currentTime -= Time.deltaTime * 0.5f
      invincibleTime -= dt * INV_DECAY_RATE;
    }
    
    // Clamp
    if (invincibleTime < 0) invincibleTime = 0;
    
    // Activate invincible when >= 1
    if (invincibleTime >= INV_ACTIVATE_THRESHOLD) {
      invincibleTime = INV_ACTIVATE_THRESHOLD;
      isInvincible = true;
    }
  }
}

function checkCollisions() {
  const ballBottom = ballY - 0.3; // ball radius
  const ballX = ball.position.x;
  const ballZ = ball.position.z;
  const distFromCenter = Math.sqrt(ballX * ballX + ballZ * ballZ);
  
  // Check if ball is over platform ring (inner to outer radius)
  if (distFromCenter < 0.3 || distFromCenter > 1.5) {
    return; // Ball is over the hole or outside
  }
  
  // Get ball angle in world space
  let ballAngle = Math.atan2(ballZ, ballX);
  if (ballAngle < 0) ballAngle += Math.PI * 2;
  
  // Convert to local space (subtract container rotation)
  const containerRotation = platformsContainer.rotation.y;
  let localAngle = ballAngle - containerRotation;
  while (localAngle < 0) localAngle += Math.PI * 2;
  while (localAngle >= Math.PI * 2) localAngle -= Math.PI * 2;
  
  // Check finish platform
  const finishTop = finishPlatform.position.y + 0.2;
  if (ballBottom <= finishTop && ballVelocity < 0) {
    winGame();
    return;
  }
  
  // Check platforms
  for (const platform of platforms) {
    if (platform.destroyed) continue;
    
    const platTop = platform.y + 0.075; // half thickness
    const platBottom = platform.y - 0.075;
    
    // Check if ball is at platform height and moving down
    if (ballBottom <= platTop && ballBottom > platBottom - 0.1 && ballVelocity < 0) {
      // Find which segment ball is over
      for (const segment of platform.segments) {
        if (!segment.visible) continue;
        
        // Account for platform's own rotation
        let segStart = segment.userData.startAngle + platform.group.rotation.y;
        let segEnd = segment.userData.endAngle + platform.group.rotation.y;
        
        // Normalize
        while (segStart < 0) segStart += Math.PI * 2;
        while (segEnd < 0) segEnd += Math.PI * 2;
        segStart = segStart % (Math.PI * 2);
        segEnd = segEnd % (Math.PI * 2);
        
        if (isAngleInRange(localAngle, segStart, segEnd)) {
          handleCollision(segment, platform, platTop);
          return;
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
    return angle >= start - 0.05 && angle <= end + 0.05;
  } else {
    return angle >= start - 0.05 || angle <= end + 0.05;
  }
}

function handleCollision(segment, platform, platformTop) {
  // From Ball.cs OnCollisionEnter():
  
  if (!isSmashing) {
    // Not smashing = bounce
    // rb.velocity = new Vector3(0, 50 * Time.deltaTime * 5, 0)
    ballY = platformTop + 0.3;
    ballVelocity = BOUNCE_VELOCITY;
    return;
  }
  
  // Smashing
  if (isInvincible) {
    // When invincible, destroy everything (both "enemy" and "plane")
    destroyPlatform(platform);
  } else {
    // Not invincible
    if (segment.userData.isDanger) {
      // Hit "plane" (black) = DEATH
      loseGame();
    } else {
      // Hit "enemy" (colored) = destroy
      destroyPlatform(platform);
    }
  }
}

function destroyPlatform(platform) {
  if (platform.destroyed) return;
  platform.destroyed = true;
  destroyedCount++;
  
  // Shatter all parts (from StackController.cs)
  for (const segment of platform.segments) {
    shatterSegment(segment, platform.y);
  }
  
  // Score (from Ball.cs IncreaseBrokenStacks)
  score += isInvincible ? 2 : 1;
  
  updateUI();
  ui.progress.style.width = `${(destroyedCount / totalPlatforms) * 100}%`;
}

function shatterSegment(segment, platformY) {
  segment.visible = false;
  
  // Create debris (from StackPartController.cs Shatter())
  const color = segment.material.color.getHex();
  const angle = (segment.userData.startAngle + segment.userData.endAngle) / 2;
  
  for (let i = 0; i < 3; i++) {
    createDebris(platformY, angle, color);
  }
}

function createDebris(y, angle, color) {
  const size = 0.1 + Math.random() * 0.08;
  const geo = new THREE.BoxGeometry(size, size, size);
  const mat = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  
  const x = Math.cos(angle) * 1.0;
  const z = Math.sin(angle) * 1.0;
  mesh.position.set(x, y, z);
  
  // From StackPartController.cs:
  // Vector3 subDir = (paretXpos - xPos < 0) ? Vector3.right : Vector3.left;
  // Vector3 dir = (Vector3.up * 1.5f + subDir).normalized;
  // float force = Random.Range(20, 35);
  const force = SHATTER_FORCE_MIN + Math.random() * (SHATTER_FORCE_MAX - SHATTER_FORCE_MIN);
  const dirX = x > 0 ? 1 : -1;
  const dir = new THREE.Vector3(dirX, 1.5, 0).normalize();
  
  scene.add(mesh);
  debris.push({
    mesh,
    velocity: dir.multiplyScalar(force * 0.3),
    rotSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ),
    life: 1.0
  });
}

function updateDebris(dt) {
  for (let i = debris.length - 1; i >= 0; i--) {
    const d = debris[i];
    
    // Apply gravity
    d.velocity.y -= GRAVITY * dt;
    
    // Update position
    d.mesh.position.add(d.velocity.clone().multiplyScalar(dt));
    
    // Update rotation
    d.mesh.rotation.x += d.rotSpeed.x * dt;
    d.mesh.rotation.y += d.rotSpeed.y * dt;
    d.mesh.rotation.z += d.rotSpeed.z * dt;
    
    // Fade out
    d.life -= dt;
    d.mesh.material.opacity = Math.max(0, d.life);
    d.mesh.material.transparent = true;
    
    if (d.life <= 0) {
      scene.remove(d.mesh);
      debris.splice(i, 1);
    }
  }
}

function updateCamera(dt) {
  // From CameraFollow.cs:
  // Camera follows ball Y, stays at fixed Z
  const targetY = ballY + 3;
  camera.position.y += (targetY - camera.position.y) * 0.1;
  camera.lookAt(0, ballY, 0);
}

// =============================================================================
// GAME STATES
// =============================================================================
function winGame() {
  gameState = 'win';
  isPlaying = false;
  isSmashing = false;
  saveBestScore();
  
  ui.winLevel.textContent = `Level ${level}`;
  ui.win.classList.remove('hidden');
}

function loseGame() {
  gameState = 'lose';
  isPlaying = false;
  isSmashing = false;
  saveBestScore();
  
  // Explode ball
  ball.visible = false;
  for (let i = 0; i < 15; i++) {
    createDebris(ballY, (i / 15) * Math.PI * 2, mainColor.getHex());
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

// =============================================================================
// UI
// =============================================================================
function updateUI() {
  ui.level.textContent = `Level ${level}`;
  ui.score.textContent = score;
}

// =============================================================================
// UTILITIES
// =============================================================================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// =============================================================================
// START
// =============================================================================
init();

})();
