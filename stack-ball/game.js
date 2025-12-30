// Stack Ball - Full replica with FBX 3D models from Unity source
(function() {
'use strict';

// =============================================================================
// EXACT VALUES FROM UNITY SOURCE
// =============================================================================
const CONFIG = {
  // Camera (from scene file)
  cameraY: 2, cameraZ: 5, cameraRotX: 20, orthoSize: 5,
  // Ball (from scene file & Ball.cs)
  ballStartY: 2.15, ballStartZ: -1.2, ballRadius: 0.25,
  smashVelocity: -14, bounceVelocity: 5, maxUpVelocity: 5,
  // Platforms (from LevelSpawner.cs)
  platformSpacing: 0.5, rotationPerPlatform: 8, baseAddOn: 7,
  // Rotation (from Rotator.cs)
  rotationSpeed: 100,
  // Physics
  gravity: 9.81,
  // Invincibility (from Ball.cs)
  invChargeRate: 0.8, invDecayRate: 0.5, invActiveDecay: 0.35,
  invShowThreshold: 0.3, invActivateThreshold: 1.0,
  // Shatter (from StackPartController.cs)
  shatterForceMin: 20, shatterForceMax: 35,
};

// Shape types from Unity (5 shapes, each with 4 variants 0-3 danger segments)
const SHAPES = ['Circle', 'Flower', 'Square', 'Spikes'];
const SHAPE_FILES = {
  Circle: 'Circle_Shape.glb',
  Flower: 'Flower_shape.glb',
  Square: 'Square_Sides.glb',
  Spikes: 'Spike_Shape.glb',
};

// Danger segment configs per variant (from Unity prefabs)
// variant 0 = 0 danger, variant 1 = 1 danger, etc.
const DANGER_CONFIGS = {
  0: [],           // All safe
  1: [0],          // Segment 1 is danger
  2: [0, 1],       // Segments 1,2 are danger
  3: [0, 1, 2],    // Segments 1,2,3 are danger
};

// =============================================================================
// STATE
// =============================================================================
let scene, camera, renderer;
let ball, pole, platforms = [], finishPlatform, platformsContainer;
let loadedModels = {};
let modelsLoaded = false;
let currentShape = 'Circle';

// Ball state
let ballY = CONFIG.ballStartY;
let ballVelocity = 0;
let isSmashing = false;
let isPlaying = false;
let gameState = 'menu';

// Invincibility
let invincibleTime = 0;
let isInvincible = false;

// Score
let score = 0;
let level = parseInt(localStorage.getItem('stackBallLevel')) || 1;
let bestScore = parseInt(localStorage.getItem('stackBallBest')) || 0;
let destroyedCount = 0;
let totalPlatforms = 0;

// Effects
let debris = [];
let fireParticles = [];
let splashSprites = [];
let trailPoints = [];

// Audio
let sounds = {};
let soundEnabled = true;

// Colors
let mainColor, baseColor;
let lastTime = 0;

// =============================================================================
// DOM ELEMENTS
// =============================================================================
const $ = id => document.getElementById(id);
const ui = {
  currentLevel: $('current-level-circle'),
  nextLevel: $('next-level-circle'),
  progressFill: $('progress-fill'),
  score: $('score'),
  invContainer: $('invincible-container'),
  invFill: $('invincible-fill'),
  menu: $('menu'),
  win: $('win'),
  winLevel: $('winLevel'),
  lose: $('lose'),
  finalScore: $('finalScore'),
  bestScore: $('bestScore'),
  soundBtn: $('sound-btn'),
};

// =============================================================================
// AUDIO
// =============================================================================
function loadSounds() {
  const files = {
    bounce: 'assets/audio/Balljump.mp3',
    break: 'assets/audio/BallBreakStack.wav',
    die: 'assets/audio/BallDied.mp3',
    win: 'assets/audio/BallLevel.mp3',
    button: 'assets/audio/button.mp3',
  };
  for (const [name, src] of Object.entries(files)) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    sounds[name] = audio;
  }
}

function playSound(name, volume = 0.5) {
  if (!soundEnabled || !sounds[name]) return;
  const sound = sounds[name].cloneNode();
  sound.volume = volume;
  sound.play().catch(() => {});
}

// =============================================================================
// GLB MODEL LOADING (converted from Unity FBX)
// =============================================================================
function loadModels() {
  return new Promise((resolve) => {
    if (typeof THREE.GLTFLoader === 'undefined') {
      console.warn('GLTFLoader not available, using procedural geometry');
      modelsLoaded = false;
      resolve();
      return;
    }
    
    const loader = new THREE.GLTFLoader();
    let loaded = 0;
    const toLoad = Object.keys(SHAPE_FILES).length;
    
    for (const [shape, file] of Object.entries(SHAPE_FILES)) {
      loader.load(
        'assets/' + file,
        (gltf) => {
          // Compute bounding box to determine scale
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());
          console.log('Loaded', shape, 'size:', size.x, size.y, size.z);
          
          loadedModels[shape] = gltf.scene;
          loaded++;
          if (loaded >= toLoad) {
            modelsLoaded = true;
            console.log('All models loaded!');
            resolve();
          }
        },
        undefined,
        (err) => {
          console.warn('Failed to load', file, err);
          loaded++;
          if (loaded >= toLoad) {
            resolve();
          }
        }
      );
    }
  });
}

// =============================================================================
// INITIALIZATION
// =============================================================================
async function init() {
  loadSounds();
  setupThreeJS();
  setupInput();
  setupButtons();
  
  // Try to load FBX models
  await loadModels();
  
  buildLevel();
  lastTime = performance.now();
  animate();
}

function setupThreeJS() {
  scene = new THREE.Scene();
  
  const aspect = window.innerWidth / window.innerHeight;
  const size = CONFIG.orthoSize;
  camera = new THREE.OrthographicCamera(
    -size * aspect, size * aspect, size, -size, 0.1, 100
  );
  camera.position.set(0, CONFIG.cameraY, CONFIG.cameraZ);
  camera.rotation.x = -CONFIG.cameraRotX * Math.PI / 180;
  
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x87CEEB);
  $('game-container').insertBefore(renderer.domElement, $('game-container').firstChild);
  
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xfff4d6, 1);
  dir.position.set(1, 2, 1);
  scene.add(dir);
  
  window.addEventListener('resize', onResize);
}

function onResize() {
  const aspect = window.innerWidth / window.innerHeight;
  const size = CONFIG.orthoSize;
  camera.left = -size * aspect;
  camera.right = size * aspect;
  camera.top = size;
  camera.bottom = -size;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupInput() {
  const onDown = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    if (e.cancelable) e.preventDefault();
    if (gameState === 'menu') { startGame(); return; }
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
  $('nextBtn').onclick = () => {
    playSound('button');
    level++;
    localStorage.setItem('stackBallLevel', level);
    ui.win.classList.add('hidden');
    buildLevel();
    startGame();
  };
  
  $('retryBtn').onclick = () => {
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
  isPlaying = true;
  ui.menu.classList.add('hidden');
}

// =============================================================================
// LEVEL BUILDING (from LevelSpawner.cs)
// =============================================================================
function buildLevel() {
  // Clear scene
  while (scene.children.length > 2) scene.remove(scene.children[2]);
  platforms = [];
  debris = [];
  fireParticles = [];
  splashSprites = [];
  trailPoints = [];
  destroyedCount = 0;
  invincibleTime = 0;
  isInvincible = false;
  
  // Random color (from LevelSpawner: Random.ColorHSV(0, 1, 0.5f, 1, 1, 1))
  const hue = Math.random();
  mainColor = new THREE.Color().setHSL(hue, 1, 0.5);
  baseColor = mainColor.clone().offsetHSL(0, 0, 0.2);
  
  document.documentElement.style.setProperty('--main-color', '#' + mainColor.getHexString());
  ui.currentLevel.style.background = '#' + mainColor.getHexString();
  ui.progressFill.style.background = '#' + mainColor.getHexString();
  
  // Select random shape for this level (from ModelSelection())
  currentShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  
  // Platform count (from LevelSpawner)
  const addOn = level <= 9 ? CONFIG.baseAddOn : 0;
  totalPlatforms = Math.floor((level + addOn) * 2);
  totalPlatforms = Math.min(totalPlatforms, 50);
  
  platformsContainer = new THREE.Group();
  scene.add(platformsContainer);
  
  // Pole
  const poleHeight = totalPlatforms * CONFIG.platformSpacing + 3;
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, poleHeight, 16);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = -poleHeight / 2 + 1;
  platformsContainer.add(pole);
  
  // Platforms (from LevelSpawner for loop)
  for (let i = 0; i < totalPlatforms; i++) {
    const y = -i * CONFIG.platformSpacing;
    const rotDeg = -i * CONFIG.rotationPerPlatform;
    createPlatform(y, rotDeg, i);
  }
  
  // Finish platform
  const finishY = -totalPlatforms * CONFIG.platformSpacing - 0.5;
  const finishGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
  const finishMat = new THREE.MeshStandardMaterial({
    color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.3
  });
  finishPlatform = new THREE.Mesh(finishGeo, finishMat);
  finishPlatform.position.y = finishY;
  platformsContainer.add(finishPlatform);
  
  // Ball
  const ballGeo = new THREE.SphereGeometry(CONFIG.ballRadius, 24, 24);
  const ballMat = new THREE.MeshStandardMaterial({ color: mainColor });
  ball = new THREE.Mesh(ballGeo, ballMat);
  ballY = CONFIG.ballStartY;
  ballVelocity = 0;
  ball.position.set(0, ballY, CONFIG.ballStartZ);
  ball.visible = true;
  scene.add(ball);
  
  createTrail();
  updateUI();
}

// =============================================================================
// PLATFORM CREATION
// =============================================================================
function createPlatform(y, rotDeg, index) {
  const group = new THREE.Group();
  group.position.y = y;
  group.rotation.y = rotDeg * Math.PI / 180;
  
  // Determine variant based on level difficulty (from LevelSpawner)
  let variant;
  if (level <= 20) variant = Math.floor(Math.random() * 2);      // 0-1
  else if (level <= 50) variant = 1 + Math.floor(Math.random() * 2);  // 1-2
  else if (level <= 100) variant = 2 + Math.floor(Math.random() * 2); // 2-3
  else variant = 3;  // Always hardest
  
  const dangerIndices = DANGER_CONFIGS[variant] || [];
  const segments = [];
  
  // Try to use loaded GLB model (converted from Unity FBX with 0.01 scale)
  if (modelsLoaded && loadedModels[currentShape]) {
    const model = loadedModels[currentShape].clone();
    let segIndex = 0;
    
    // Apply materials to each child mesh
    model.traverse((child) => {
      if (child.isMesh) {
        const isDanger = dangerIndices.includes(segIndex);
        
        child.material = new THREE.MeshStandardMaterial({
          color: isDanger ? 0x1a1a1a : mainColor.getHex()
        });
        child.userData = { isDanger, segmentIndex: segIndex };
        segments.push(child);
        segIndex++;
      }
    });
    
    // Models are pre-scaled to 0.01 during conversion
    // Just need to rotate from FBX Y-up to match our setup
    model.rotation.x = -Math.PI / 2;
    group.add(model);
  } else {
    // Fallback: procedural geometry (4 segments like Unity)
    const segAngle = Math.PI / 2; // 4 segments = 90 degrees each
    
    for (let i = 0; i < 4; i++) {
      const isDanger = dangerIndices.includes(i);
      const startAngle = i * segAngle;
      const color = isDanger ? 0x1a1a1a : mainColor.getHex();
      const segment = createProceduralSegment(startAngle, segAngle - 0.08, color);
      segment.userData = { isDanger, startAngle, endAngle: startAngle + segAngle - 0.08 };
      group.add(segment);
      segments.push(segment);
    }
  }
  
  platformsContainer.add(group);
  platforms.push({ group, y, segments, destroyed: false });
}

function createProceduralSegment(startAngle, arcLen, color) {
  const inner = 0.25, outer = 1.5, thickness = 0.12;
  const shape = new THREE.Shape();
  const steps = 12;
  
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + (i / steps) * arcLen;
    if (i === 0) shape.moveTo(Math.cos(a) * outer, Math.sin(a) * outer);
    else shape.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
  }
  for (let i = steps; i >= 0; i--) {
    const a = startAngle + (i / steps) * arcLen;
    shape.lineTo(Math.cos(a) * inner, Math.sin(a) * inner);
  }
  shape.closePath();
  
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  geo.rotateX(Math.PI / 2);
  geo.translate(0, thickness / 2, 0);
  
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color }));
}

function createTrail() {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(30 * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const mat = new THREE.LineBasicMaterial({ 
    color: mainColor, transparent: true, opacity: 0.6 
  });
  const trail = new THREE.Line(geo, mat);
  scene.add(trail);
  
  for (let i = 0; i < 30; i++) {
    trailPoints.push(ball ? ball.position.clone() : new THREE.Vector3());
  }
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
    updateInvincibility(dt);
    checkCollisions();
    updateTrail();
    updateFireParticles(dt, time);
  }
  
  // Rotate platforms (from Rotator.cs)
  if (platformsContainer) {
    platformsContainer.rotation.y += (CONFIG.rotationSpeed * Math.PI / 180) * dt;
  }
  
  updateDebris(dt);
  updateSplashes(dt);
  updateCamera();
  updateInvincibleUI();
  
  renderer.render(scene, camera);
}

function updateBall(dt) {
  if (isSmashing) {
    ballVelocity = CONFIG.smashVelocity;
  } else {
    ballVelocity -= CONFIG.gravity * dt;
  }
  
  if (ballVelocity > CONFIG.maxUpVelocity) {
    ballVelocity = CONFIG.maxUpVelocity;
  }
  
  ballY += ballVelocity * dt;
  ball.position.y = ballY;
  
  // Invincible glow
  if (isInvincible) {
    ball.material.emissive.setHex(0xff4400);
    ball.material.emissiveIntensity = 0.5 + Math.sin(lastTime * 0.01) * 0.3;
  } else {
    ball.material.emissive.setHex(0x000000);
    ball.material.emissiveIntensity = 0;
  }
}

function updateInvincibility(dt) {
  // Exact logic from Ball.cs Update()
  if (isInvincible) {
    invincibleTime -= dt * CONFIG.invActiveDecay;
    if (invincibleTime <= 0) {
      invincibleTime = 0;
      isInvincible = false;
    }
  } else {
    if (isSmashing) {
      invincibleTime += dt * CONFIG.invChargeRate;
    } else {
      invincibleTime -= dt * CONFIG.invDecayRate;
    }
    invincibleTime = Math.max(0, invincibleTime);
    
    if (invincibleTime >= CONFIG.invActivateThreshold) {
      invincibleTime = CONFIG.invActivateThreshold;
      isInvincible = true;
    }
  }
}

function updateInvincibleUI() {
  const show = invincibleTime >= CONFIG.invShowThreshold || isInvincible;
  ui.invContainer.classList.toggle('show', show);
  
  const fill = (invincibleTime / CONFIG.invActivateThreshold) * 100;
  ui.invFill.style.setProperty('--fill', fill + '%');
  ui.invFill.classList.toggle('active', isInvincible);
}

function updateTrail() {
  if (!ball || trailPoints.length === 0) return;
  
  for (let i = trailPoints.length - 1; i > 0; i--) {
    trailPoints[i].copy(trailPoints[i - 1]);
  }
  trailPoints[0].copy(ball.position);
  
  const trail = scene.children.find(c => c.type === 'Line');
  if (trail) {
    const positions = trail.geometry.attributes.position.array;
    for (let i = 0; i < trailPoints.length; i++) {
      positions[i * 3] = trailPoints[i].x;
      positions[i * 3 + 1] = trailPoints[i].y;
      positions[i * 3 + 2] = trailPoints[i].z;
    }
    trail.geometry.attributes.position.needsUpdate = true;
  }
}

function updateFireParticles(dt, time) {
  if (isInvincible && ball && Math.random() < 0.4) {
    const geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 6, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: Math.random() < 0.5 ? 0xff4400 : 0xffaa00,
      transparent: true, opacity: 1
    });
    const particle = new THREE.Mesh(geo, mat);
    particle.position.copy(ball.position);
    particle.position.x += (Math.random() - 0.5) * 0.2;
    particle.position.z += (Math.random() - 0.5) * 0.2;
    scene.add(particle);
    
    fireParticles.push({
      mesh: particle,
      velocity: new THREE.Vector3((Math.random() - 0.5) * 1, 2 + Math.random(), (Math.random() - 0.5) * 1),
      life: 0.4 + Math.random() * 0.2
    });
  }
  
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    const p = fireParticles[i];
    p.velocity.y -= 3 * dt;
    p.mesh.position.add(p.velocity.clone().multiplyScalar(dt));
    p.life -= dt;
    p.mesh.material.opacity = p.life / 0.6;
    p.mesh.scale.multiplyScalar(0.96);
    
    if (p.life <= 0) {
      scene.remove(p.mesh);
      fireParticles.splice(i, 1);
    }
  }
}

// =============================================================================
// COLLISION DETECTION
// =============================================================================
function checkCollisions() {
  const ballBottom = ballY - CONFIG.ballRadius;
  const ballX = ball.position.x;
  const ballZ = ball.position.z;
  const dist = Math.sqrt(ballX * ballX + ballZ * ballZ);
  
  if (dist < 0.25 || dist > 1.5) return;
  
  let ballAngle = Math.atan2(ballZ, ballX);
  if (ballAngle < 0) ballAngle += Math.PI * 2;
  
  // Check finish platform
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
      const containerRot = platformsContainer.rotation.y;
      let localAngle = ballAngle - containerRot - plat.group.rotation.y;
      while (localAngle < 0) localAngle += Math.PI * 2;
      while (localAngle >= Math.PI * 2) localAngle -= Math.PI * 2;
      
      // Check which segment we hit
      for (const seg of plat.segments) {
        if (!seg.visible) continue;
        
        // For FBX models, calculate segment angle from index
        let startAngle, endAngle;
        if (seg.userData.segmentIndex !== undefined) {
          const segAngle = Math.PI / 2;
          startAngle = seg.userData.segmentIndex * segAngle;
          endAngle = startAngle + segAngle;
        } else {
          startAngle = seg.userData.startAngle;
          endAngle = seg.userData.endAngle;
        }
        
        if (localAngle >= startAngle - 0.1 && localAngle <= endAngle + 0.1) {
          if (isSmashing) {
            if (seg.userData.isDanger && !isInvincible) {
              loseGame();
              return;
            }
            destroyPlatform(plat);
          } else {
            bounce(top);
          }
          return;
        }
      }
    }
  }
}

function bounce(platformTop) {
  ballY = platformTop + CONFIG.ballRadius;
  ballVelocity = CONFIG.bounceVelocity;
  playSound('bounce');
  createSplash(platformTop);
}

function createSplash(y) {
  const geo = new THREE.PlaneGeometry(0.4, 0.4);
  const mat = new THREE.MeshBasicMaterial({
    color: mainColor, transparent: true, opacity: 0.7, side: THREE.DoubleSide
  });
  const splash = new THREE.Mesh(geo, mat);
  splash.position.set(ball.position.x, y + 0.01, ball.position.z);
  splash.rotation.x = -Math.PI / 2;
  splash.rotation.z = Math.random() * Math.PI * 2;
  platformsContainer.add(splash);
  
  splashSprites.push({ mesh: splash, life: 2.0 });
}

function updateSplashes(dt) {
  for (let i = splashSprites.length - 1; i >= 0; i--) {
    const s = splashSprites[i];
    s.life -= dt;
    s.mesh.material.opacity = Math.max(0, s.life / 2.0) * 0.7;
    
    if (s.life <= 0) {
      platformsContainer.remove(s.mesh);
      splashSprites.splice(i, 1);
    }
  }
}

// =============================================================================
// DESTRUCTION (from StackPartController.cs)
// =============================================================================
function destroyPlatform(plat) {
  if (plat.destroyed) return;
  plat.destroyed = true;
  destroyedCount++;
  
  playSound('break');
  
  // Shatter each segment
  for (const seg of plat.segments) {
    shatterSegment(seg, plat.y);
  }
  
  score += isInvincible ? 2 : 1;
  updateUI();
  ui.progressFill.style.width = `${(destroyedCount / totalPlatforms) * 100}%`;
}

function shatterSegment(seg, y) {
  seg.visible = false;
  
  const color = seg.material ? seg.material.color.getHex() : mainColor.getHex();
  
  // Get segment angle
  let angle;
  if (seg.userData.segmentIndex !== undefined) {
    angle = (seg.userData.segmentIndex + 0.5) * (Math.PI / 2);
  } else {
    angle = (seg.userData.startAngle + seg.userData.endAngle) / 2;
  }
  
  // From StackPartController.cs Shatter()
  for (let i = 0; i < 4; i++) {
    const size = 0.06 + Math.random() * 0.05;
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    
    const x = Math.cos(angle) * 0.8 + (Math.random() - 0.5) * 0.4;
    const z = Math.sin(angle) * 0.8 + (Math.random() - 0.5) * 0.4;
    mesh.position.set(x, y, z);
    
    const dirX = x > 0 ? 1 : -1;
    const dir = new THREE.Vector3(dirX, 1.5, 0).normalize();
    const force = CONFIG.shatterForceMin + Math.random() * (CONFIG.shatterForceMax - CONFIG.shatterForceMin);
    
    scene.add(mesh);
    debris.push({
      mesh,
      velocity: dir.multiplyScalar(force * 0.25),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ),
      life: 1.0
    });
  }
}

function updateDebris(dt) {
  for (let i = debris.length - 1; i >= 0; i--) {
    const d = debris[i];
    d.velocity.y -= CONFIG.gravity * dt;
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
  const targetY = ballY + 2;
  camera.position.y += (targetY - camera.position.y) * 0.1;
}

// =============================================================================
// GAME STATES
// =============================================================================
function winGame() {
  isPlaying = false;
  gameState = 'win';
  playSound('win', 0.7);
  saveBest();
  
  ui.winLevel.textContent = `Level ${level}`;
  ui.win.classList.remove('hidden');
  
  // Win particles
  for (let i = 0; i < 30; i++) {
    setTimeout(() => createWinParticle(), i * 50);
  }
}

function createWinParticle() {
  const geo = new THREE.SphereGeometry(0.05, 8, 8);
  const colors = [0xff6b6b, 0xfeca57, 0x48dbfb, 0x1dd1a1, 0xff9ff3];
  const mat = new THREE.MeshBasicMaterial({ 
    color: colors[Math.floor(Math.random() * colors.length)] 
  });
  const particle = new THREE.Mesh(geo, mat);
  particle.position.set(
    (Math.random() - 0.5) * 4,
    ballY + Math.random() * 2,
    (Math.random() - 0.5) * 4
  );
  scene.add(particle);
  
  debris.push({
    mesh: particle,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      3 + Math.random() * 2,
      (Math.random() - 0.5) * 3
    ),
    rotSpeed: new THREE.Vector3(0, 0, 0),
    life: 2.0
  });
}

function loseGame() {
  isPlaying = false;
  gameState = 'lose';
  playSound('die');
  saveBest();
  
  ball.visible = false;
  
  // Explode ball
  for (let i = 0; i < 15; i++) {
    const size = 0.05;
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshStandardMaterial({ color: mainColor });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(ball.position);
    scene.add(mesh);
    
    const angle = (i / 15) * Math.PI * 2;
    debris.push({
      mesh,
      velocity: new THREE.Vector3(Math.cos(angle) * 3, 4, Math.sin(angle) * 3),
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
  ui.currentLevel.textContent = level;
  ui.nextLevel.textContent = level + 1;
  ui.score.textContent = score;
}

// Start the game
init();
})();
