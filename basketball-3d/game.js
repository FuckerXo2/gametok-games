import * as THREE from 'three';

// Game state
let scene, camera, renderer;
let ball, backboard, hoop, hoopRim;
let gameState = 'idle'; // idle, playing, gameover
let score = 0;
let bestScore = 0;
let timeRemaining = 45;
let timerInterval = null;

// Ball physics
let ballVelocity = new THREE.Vector3();
let ballAngularVelocity = new THREE.Vector3();
const GRAVITY = -15;
const BOUNCE_DAMPING = 0.6;
const FRICTION = 0.98;

// Touch/drag state
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let canShoot = true;

// Hoop position (where ball needs to go)
const HOOP_CENTER = new THREE.Vector3(0, 2.8, -3.5);
const HOOP_RADIUS = 0.35;

// Textures
let floorTexture, wallTexture, ballTexture;

function init() {
    const container = document.getElementById('game-container');
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2d1f1f);
    
    // Camera - positioned to look at the hoop from below
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2, 4);  // Higher and further back
    camera.lookAt(0, 2, -2);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(2, 5, 3);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);
    
    // Warm fill light from below
    const fillLight = new THREE.PointLight(0xffaa77, 0.3);
    fillLight.position.set(0, 0.5, 2);
    scene.add(fillLight);
    
    // Load textures and create scene
    loadTextures(() => {
        createEnvironment();
        createBackboard();
        createBall();
        setupControls();
        
        // Expose startGame globally
        window.startGame = startGame;
        
        // Start idle animation
        drawIdlePreview();
    });
    
    window.addEventListener('resize', onResize);
}

function loadTextures(callback) {
    const loader = new THREE.TextureLoader();
    let loaded = 0;
    const total = 3;
    
    const checkLoaded = () => {
        loaded++;
        if (loaded >= total) callback();
    };
    
    // Floor texture
    floorTexture = loader.load('assets/floor.png', checkLoaded, undefined, () => {
        // Fallback - create red court color
        floorTexture = null;
        checkLoaded();
    });
    
    // Wall texture
    wallTexture = loader.load('assets/brickwall.jpeg', checkLoaded, undefined, () => {
        wallTexture = null;
        checkLoaded();
    });
    if (wallTexture) {
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
    }
    
    // Ball texture
    ballTexture = loader.load('assets/ball.png', checkLoaded, undefined, () => {
        ballTexture = null;
        checkLoaded();
    });
}

function createEnvironment() {
    // Floor - red basketball court
    const floorGeom = new THREE.PlaneGeometry(10, 12);
    const floorMat = new THREE.MeshStandardMaterial({
        map: floorTexture,
        color: floorTexture ? 0xffffff : 0xcc4444,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.position.z = -2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Back wall - brick
    const wallGeom = new THREE.PlaneGeometry(10, 8);
    const wallMat = new THREE.MeshStandardMaterial({
        map: wallTexture,
        color: wallTexture ? 0xffffff : 0x8b4513,
        roughness: 0.9
    });
    if (wallTexture) {
        wallTexture.repeat.set(2, 1.5);
    }
    const wall = new THREE.Mesh(wallGeom, wallMat);
    wall.position.set(0, 4, -5);
    scene.add(wall);
}

function createBackboard() {
    // Backboard - white rectangle with red border
    const boardGroup = new THREE.Group();
    
    // Main backboard
    const boardGeom = new THREE.BoxGeometry(1.4, 1.0, 0.05);
    const boardMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.3
    });
    const board = new THREE.Mesh(boardGeom, boardMat);
    boardGroup.add(board);
    
    // Red square on backboard
    const squareGeom = new THREE.BoxGeometry(0.6, 0.45, 0.06);
    const squareMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const square = new THREE.Mesh(squareGeom, squareMat);
    square.position.z = 0.01;
    square.position.y = -0.15;
    boardGroup.add(square);
    
    // Inner white of square
    const innerGeom = new THREE.BoxGeometry(0.5, 0.35, 0.07);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const inner = new THREE.Mesh(innerGeom, innerMat);
    inner.position.z = 0.01;
    inner.position.y = -0.15;
    boardGroup.add(inner);
    
    boardGroup.position.set(0, 3.5, -4);
    scene.add(boardGroup);
    backboard = boardGroup;
    
    // Hoop rim - orange torus
    const rimGeom = new THREE.TorusGeometry(HOOP_RADIUS, 0.02, 8, 24);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xff6600 });
    hoopRim = new THREE.Mesh(rimGeom, rimMat);
    hoopRim.rotation.x = Math.PI / 2;
    hoopRim.position.copy(HOOP_CENTER);
    scene.add(hoopRim);
    
    // Net (simplified - just some lines)
    const netGroup = new THREE.Group();
    const netMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const points = [];
        const topX = Math.cos(angle) * HOOP_RADIUS;
        const topZ = Math.sin(angle) * HOOP_RADIUS;
        
        points.push(new THREE.Vector3(topX, 0, topZ));
        points.push(new THREE.Vector3(topX * 0.6, -0.4, topZ * 0.6));
        
        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeom, netMat);
        netGroup.add(line);
    }
    netGroup.position.copy(HOOP_CENTER);
    scene.add(netGroup);
    
    // Pole
    const poleGeom = new THREE.CylinderGeometry(0.04, 0.04, 3.5);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const pole = new THREE.Mesh(poleGeom, poleMat);
    pole.position.set(0, 1.75, -4);
    scene.add(pole);
    
    // Arm connecting pole to backboard
    const armGeom = new THREE.BoxGeometry(0.08, 0.08, 0.5);
    const arm = new THREE.Mesh(armGeom, poleMat);
    arm.position.set(0, 3.5, -3.75);
    scene.add(arm);
}

function createBall() {
    const ballGeom = new THREE.SphereGeometry(0.18, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
        map: ballTexture,
        color: ballTexture ? 0xffffff : 0xff6600,
        roughness: 0.7
    });
    ball = new THREE.Mesh(ballGeom, ballMat);
    ball.castShadow = true;
    resetBallPosition();
    scene.add(ball);
}

function resetBallPosition() {
    // Random x position like in OpenPigeon
    const xPos = (Math.random() * 0.66 - 0.33);
    ball.position.set(xPos, 0.8, 1.0);  // Moved closer and higher to be visible
    ballVelocity.set(0, 0, 0);
    ballAngularVelocity.set(0, 0, 0);
    canShoot = true;
    ballPassedAboveHoop = false;
}

function setupControls() {
    const canvas = renderer.domElement;
    
    // Touch events
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    
    // Mouse events (for testing)
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
}

function onTouchStart(e) {
    e.preventDefault();
    if (!canShoot || gameState !== 'playing') return;
    isDragging = true;
    dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}

function onTouchMove(e) {
    e.preventDefault();
}

function onTouchEnd(e) {
    e.preventDefault();
    if (!isDragging || !canShoot) return;
    isDragging = false;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    
    // Only shoot if swiped upward
    if (deltaY < -30) {
        shootBall(deltaX);
    }
}

function onMouseDown(e) {
    if (!canShoot || gameState !== 'playing') return;
    isDragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
}

function onMouseMove(e) {
    // Could add visual feedback here
}

function onMouseUp(e) {
    if (!isDragging || !canShoot) return;
    isDragging = false;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    if (deltaY < -30) {
        shootBall(deltaX);
    }
}

function shootBall(xDelta) {
    if (!canShoot) return;
    canShoot = false;
    
    // Convert screen delta to game force (-1 to 1 range)
    const xForce = Math.max(-1, Math.min(1, xDelta / 150));
    
    // Calculate proper arc trajectory using physics
    // Ball starts at (x, 0.8, 1.0), hoop at (0, 2.8, -3.5)
    const startY = ball.position.y;
    const targetY = HOOP_CENTER.y + 0.5; // Aim slightly above hoop
    const startZ = ball.position.z;
    const targetZ = HOOP_CENTER.z;
    
    // We want the ball to reach peak height above the hoop, then fall through
    const peakHeight = targetY + 1.2; // Peak 1.2 units above target
    
    // Time to reach peak (using v = v0 + at, where v=0 at peak)
    // v0 = sqrt(2 * g * (peakHeight - startY))
    const upVelocity = Math.sqrt(2 * Math.abs(GRAVITY) * (peakHeight - startY));
    
    // Time to reach peak
    const timeToPeak = upVelocity / Math.abs(GRAVITY);
    
    // Time to fall from peak to hoop height
    const fallHeight = peakHeight - targetY;
    const timeToFall = Math.sqrt(2 * fallHeight / Math.abs(GRAVITY));
    
    // Total flight time to reach hoop
    const totalTime = timeToPeak + timeToFall;
    
    // Z velocity needed to cover distance in that time
    const zDistance = targetZ - startZ; // negative (going toward hoop)
    const zVelocity = zDistance / totalTime;
    
    // X velocity - aim toward center with user input adjustment
    const xTarget = HOOP_CENTER.x + xForce * 0.3; // Allow slight aim adjustment
    const xDistance = xTarget - ball.position.x;
    const xVelocity = xDistance / totalTime;
    
    ballVelocity.set(xVelocity, upVelocity, zVelocity);
    
    // Add spin
    ballAngularVelocity.set(-8, xForce * 3, 0);
    
    // Play swoosh sound
    playSound('swoosh');
    
    // Spawn new ball after delay
    setTimeout(() => {
        if (gameState === 'playing') {
            resetBallPosition();
        }
    }, 2500);
}

function updateBallPhysics(delta) {
    if (!canShoot) {
        // Apply gravity
        ballVelocity.y += GRAVITY * delta;
        
        // Update position
        ball.position.x += ballVelocity.x * delta;
        ball.position.y += ballVelocity.y * delta;
        ball.position.z += ballVelocity.z * delta;
        
        // Rotate ball
        ball.rotation.x += ballAngularVelocity.x * delta;
        ball.rotation.y += ballAngularVelocity.y * delta;
        ball.rotation.z += ballAngularVelocity.z * delta;
        
        // Check hoop collision (scoring)
        checkHoopCollision();
        
        // Backboard collision
        if (ball.position.z < -3.8 && ball.position.y > 2.8 && ball.position.y < 4.2) {
            if (Math.abs(ball.position.x) < 0.7) {
                ball.position.z = -3.8;
                ballVelocity.z *= -BOUNCE_DAMPING;
                playSound('bounce');
            }
        }
        
        // Rim collision (simplified)
        const distToHoop = new THREE.Vector2(
            ball.position.x - HOOP_CENTER.x,
            ball.position.z - HOOP_CENTER.z
        ).length();
        
        if (Math.abs(ball.position.y - HOOP_CENTER.y) < 0.15) {
            if (distToHoop > HOOP_RADIUS - 0.1 && distToHoop < HOOP_RADIUS + 0.2) {
                // Hit the rim
                const bounceDir = new THREE.Vector2(
                    ball.position.x - HOOP_CENTER.x,
                    ball.position.z - HOOP_CENTER.z
                ).normalize();
                
                ballVelocity.x += bounceDir.x * 2;
                ballVelocity.z += bounceDir.y * 2;
                ballVelocity.y *= 0.5;
                playSound('rim');
            }
        }
        
        // Floor collision
        if (ball.position.y < 0.18) {
            ball.position.y = 0.18;
            ballVelocity.y *= -BOUNCE_DAMPING;
            ballVelocity.x *= FRICTION;
            ballVelocity.z *= FRICTION;
            
            if (Math.abs(ballVelocity.y) > 0.5) {
                playSound('bounce');
            }
        }
        
        // Slow down angular velocity
        ballAngularVelocity.multiplyScalar(0.99);
    }
}

let hasScored = false;
let ballPassedAboveHoop = false;

function checkHoopCollision() {
    // Check if ball passes through hoop
    const distToCenter = new THREE.Vector2(
        ball.position.x - HOOP_CENTER.x,
        ball.position.z - HOOP_CENTER.z
    ).length();
    
    // Track if ball went above the hoop (must come from above to score)
    if (ball.position.y > HOOP_CENTER.y + 0.2 && distToCenter < HOOP_RADIUS + 0.3) {
        ballPassedAboveHoop = true;
    }
    
    // Ball is within hoop radius, below hoop level, moving downward, and came from above
    // More forgiving detection zone
    if (distToCenter < HOOP_RADIUS && 
        ball.position.y < HOOP_CENTER.y - 0.1 && 
        ball.position.y > HOOP_CENTER.y - 0.5 &&
        ballVelocity.y < 0 &&
        ballPassedAboveHoop &&
        !hasScored) {
        
        // SCORE!
        hasScored = true;
        score++;
        updateUI();
        playSound('score');
        
        // Visual feedback - ball drops straight through
        ballVelocity.x *= 0.3;
        ballVelocity.z *= 0.3;
        
        // Reset flags after ball resets
        setTimeout(() => { 
            hasScored = false; 
            ballPassedAboveHoop = false;
        }, 1500);
    }
    
    // Reset the above-hoop flag if ball goes too far away
    if (ball.position.y < HOOP_CENTER.y - 1 || distToCenter > HOOP_RADIUS + 1) {
        ballPassedAboveHoop = false;
    }
}

function playSound(type) {
    // Web Audio API sounds
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    switch(type) {
        case 'swoosh':
            oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.2);
            break;
        case 'bounce':
            oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
            break;
        case 'rim':
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
            break;
        case 'score':
            // Happy sound
            oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);
            oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
            break;
    }
}

function startGame() {
    gameState = 'playing';
    score = 0;
    timeRemaining = 45;
    hasScored = false;
    
    resetBallPosition();
    updateUI();
    
    document.getElementById('ui').classList.remove('hidden');
    document.getElementById('swipe-hint').classList.remove('hidden');
    
    // Hide hint after 3 seconds
    setTimeout(() => {
        document.getElementById('swipe-hint').classList.add('hidden');
    }, 3000);
    
    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateUI();
        
        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameState = 'gameover';
    clearInterval(timerInterval);
    
    if (score > bestScore) {
        bestScore = score;
    }
    
    // Send score to app
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: 'gameOver', 
            score: score 
        }));
    }
}

function updateUI() {
    document.getElementById('player-score').textContent = score.toString().padStart(2, '0');
    document.getElementById('best-score').textContent = bestScore.toString().padStart(2, '0');
    
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    document.getElementById('timer').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function drawIdlePreview() {
    // Animate ball bobbing in idle state
    let idleTime = 0;
    
    function idleLoop() {
        if (gameState === 'playing') return;
        
        idleTime += 0.02;
        
        // Gentle bob - ball at bottom of screen
        ball.position.y = 0.8 + Math.sin(idleTime) * 0.08;
        ball.rotation.y += 0.01;
        ball.rotation.x += 0.005;
        
        renderer.render(scene, camera);
        requestAnimationFrame(idleLoop);
    }
    idleLoop();
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Main game loop
let lastTime = 0;
function gameLoop(time) {
    const delta = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    
    if (gameState === 'playing') {
        updateBallPhysics(delta);
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
}

// Initialize
window.addEventListener('load', () => {
    init();
    requestAnimationFrame(gameLoop);
});
