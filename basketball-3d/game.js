import * as THREE from 'three';

// Game state
let scene, camera, renderer;
let ball, backboard, hoopRim;
let gameState = 'idle';
let score = 0;
let bestScore = 0;
let timeRemaining = 45;
let timerInterval = null;

// Ball physics - matching OpenPigeon values
let ballVelocity = new THREE.Vector3();
let ballAngularVelocity = new THREE.Vector3();
const GRAVITY = -9.8;  // Godot default gravity
const BALL_RADIUS = 0.12;

// Hoop collision spheres (like OpenPigeon's 13 spheres around rim)
let hoopColliders = [];
const HOOP_CENTER = new THREE.Vector3(0, 0.95, -3.5);
const HOOP_RADIUS = 0.2;

// Touch/drag state
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let canShoot = true;
let ballInPlay = false;

// Textures
let floorTexture, wallTexture, ballTexture;

function init() {
    const container = document.getElementById('game-container');
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2d1f1f);
    
    // Camera - matching OpenPigeon: position (0, 3.63, -4.6) looking at court
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3.6, 4.6);
    camera.lookAt(0, 0.5, -2);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(2, 5, 3);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(0xffaa77, 0.4);
    fillLight.position.set(0, 1, 3);
    scene.add(fillLight);
    
    loadTextures(() => {
        createEnvironment();
        createBackboard();
        createHoopColliders();
        createBall();
        setupControls();
        
        window.startGame = startGame;
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
    
    floorTexture = loader.load('assets/floor.png', checkLoaded, undefined, checkLoaded);
    wallTexture = loader.load('assets/brickwall.jpeg', (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 1.5);
        checkLoaded();
    }, undefined, checkLoaded);
    ballTexture = loader.load('assets/ball.png', checkLoaded, undefined, checkLoaded);
}

function createEnvironment() {
    // Floor - red basketball court
    const floorGeom = new THREE.PlaneGeometry(8, 10);
    const floorMat = new THREE.MeshStandardMaterial({
        map: floorTexture,
        color: floorTexture ? 0xffffff : 0xcc4444,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -2);
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Back wall - brick
    const wallGeom = new THREE.PlaneGeometry(8, 6);
    const wallMat = new THREE.MeshStandardMaterial({
        map: wallTexture,
        color: wallTexture ? 0xffffff : 0x8b4513,
        roughness: 0.9
    });
    const wall = new THREE.Mesh(wallGeom, wallMat);
    wall.position.set(0, 3, -5);
    scene.add(wall);
}

function createBackboard() {
    const boardGroup = new THREE.Group();
    
    // Main backboard - white
    const boardGeom = new THREE.BoxGeometry(1.2, 0.8, 0.04);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const board = new THREE.Mesh(boardGeom, boardMat);
    boardGroup.add(board);
    
    // Red square outline
    const squareGeom = new THREE.BoxGeometry(0.5, 0.38, 0.05);
    const squareMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const square = new THREE.Mesh(squareGeom, squareMat);
    square.position.set(0, -0.12, 0.01);
    boardGroup.add(square);
    
    // Inner white
    const innerGeom = new THREE.BoxGeometry(0.42, 0.3, 0.06);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const inner = new THREE.Mesh(innerGeom, innerMat);
    inner.position.set(0, -0.12, 0.02);
    boardGroup.add(inner);
    
    boardGroup.position.set(0, 1.5, -4.2);
    scene.add(boardGroup);
    backboard = boardGroup;
    
    // Hoop rim - orange torus
    const rimGeom = new THREE.TorusGeometry(HOOP_RADIUS, 0.015, 8, 24);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.3 });
    hoopRim = new THREE.Mesh(rimGeom, rimMat);
    hoopRim.rotation.x = Math.PI / 2;
    hoopRim.position.copy(HOOP_CENTER);
    scene.add(hoopRim);
    
    // Net
    const netGroup = new THREE.Group();
    const netMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const points = [
            new THREE.Vector3(Math.cos(angle) * HOOP_RADIUS, 0, Math.sin(angle) * HOOP_RADIUS),
            new THREE.Vector3(Math.cos(angle) * HOOP_RADIUS * 0.5, -0.35, Math.sin(angle) * HOOP_RADIUS * 0.5)
        ];
        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
        netGroup.add(new THREE.Line(lineGeom, netMat));
    }
    netGroup.position.copy(HOOP_CENTER);
    scene.add(netGroup);
    
    // Pole
    const poleGeom = new THREE.CylinderGeometry(0.03, 0.03, 1.5);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const pole = new THREE.Mesh(poleGeom, poleMat);
    pole.position.set(0, 0.75, -4.2);
    scene.add(pole);
    
    // Arm
    const armGeom = new THREE.BoxGeometry(0.06, 0.06, 0.7);
    const arm = new THREE.Mesh(armGeom, poleMat);
    arm.position.set(0, 1.5, -3.85);
    scene.add(arm);
}

// Create collision spheres around the hoop rim (like OpenPigeon)
function createHoopColliders() {
    hoopColliders = [];
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = HOOP_CENTER.x + Math.cos(angle) * HOOP_RADIUS;
        const z = HOOP_CENTER.z + Math.sin(angle) * HOOP_RADIUS;
        hoopColliders.push(new THREE.Vector3(x, HOOP_CENTER.y, z));
    }
}

function createBall() {
    const ballGeom = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
        map: ballTexture,
        color: ballTexture ? 0xffffff : 0xff6600,
        roughness: 0.6
    });
    ball = new THREE.Mesh(ballGeom, ballMat);
    ball.castShadow = true;
    resetBallPosition();
    scene.add(ball);
}

function resetBallPosition() {
    // OpenPigeon: x_pos = random * 0.66 - 0.33, y = -0.45, z = -1
    const xPos = Math.random() * 0.66 - 0.33;
    ball.position.set(xPos, 0.5, 1.5);  // Adjusted for our camera
    ballVelocity.set(0, 0, 0);
    ballAngularVelocity.set(0, 0, 0);
    canShoot = true;
    ballInPlay = false;
}

function setupControls() {
    const canvas = renderer.domElement;
    
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    
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

function onMouseMove(e) {}

function onMouseUp(e) {
    if (!isDragging || !canShoot) return;
    isDragging = false;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    if (deltaY < -30) {
        shootBall(deltaX);
    }
}

function shootBall(dragDeltaX) {
    if (!canShoot) return;
    canShoot = false;
    ballInPlay = true;
    
    // OpenPigeon: interpolate_x_delta maps -200 to 200 pixels → -1 to 1
    const t = Math.max(0, Math.min(1, (dragDeltaX + 200) / 400));
    const xDelta = -1 + t * 2;
    
    // OpenPigeon: x_force = ball.position.x + x_delta
    const xForce = ball.position.x + xDelta;
    
    // OpenPigeon: apply_impulse(Vector3(x_force, 6.80, -2.5))
    // Scale for Three.js coordinate system
    ballVelocity.set(xForce * 2, 8.5, -6);
    
    // OpenPigeon: apply_torque_impulse(Vector3(-0.02, 0, 0)) - backspin
    ballAngularVelocity.set(-5, 0, 0);
    
    playSound('swoosh');
    
    // Spawn new ball after 2.5 seconds (OpenPigeon timer)
    setTimeout(() => {
        if (gameState === 'playing') {
            resetBallPosition();
        }
    }, 2500);
}

let hasScored = false;
let lastBallY = 0;

function updateBallPhysics(delta) {
    if (!ballInPlay) return;
    
    // Apply gravity
    ballVelocity.y += GRAVITY * delta;
    
    // Update position
    ball.position.x += ballVelocity.x * delta;
    ball.position.y += ballVelocity.y * delta;
    ball.position.z += ballVelocity.z * delta;
    
    // Rotate ball
    ball.rotation.x += ballAngularVelocity.x * delta;
    ball.rotation.y += ballAngularVelocity.y * delta;
    
    // Check scoring - ball passes through hoop going down
    const distToHoopCenter = Math.sqrt(
        Math.pow(ball.position.x - HOOP_CENTER.x, 2) +
        Math.pow(ball.position.z - HOOP_CENTER.z, 2)
    );
    
    if (!hasScored && 
        distToHoopCenter < HOOP_RADIUS - BALL_RADIUS * 0.5 &&
        lastBallY > HOOP_CENTER.y &&
        ball.position.y <= HOOP_CENTER.y &&
        ballVelocity.y < 0) {
        // SCORE!
        hasScored = true;
        score++;
        updateUI();
        playSound('score');
        
        // OpenPigeon: set velocity to go straight down after scoring
        ballVelocity.set(0, -2.5, 0);
    }
    lastBallY = ball.position.y;
    
    // Backboard collision
    if (ball.position.z < -4.0 && ball.position.y > 1.1 && ball.position.y < 1.9) {
        if (Math.abs(ball.position.x) < 0.6) {
            ball.position.z = -4.0;
            ballVelocity.z *= -0.5;
            playSound('bounce');
        }
    }
    
    // Rim collision - check against each collider sphere
    for (const collider of hoopColliders) {
        const dist = ball.position.distanceTo(collider);
        if (dist < BALL_RADIUS + 0.02) {
            // Bounce off rim
            const normal = ball.position.clone().sub(collider).normalize();
            
            // OpenPigeon: bounce = 0.6 for rim, 0.2 for top of rim
            const bounce = collider.y >= 0.95 ? 0.2 : 0.6;
            
            // Reflect velocity
            const dot = ballVelocity.dot(normal);
            ballVelocity.sub(normal.multiplyScalar(2 * dot));
            ballVelocity.multiplyScalar(bounce);
            
            // Push ball out of collision
            ball.position.copy(collider).add(normal.normalize().multiplyScalar(BALL_RADIUS + 0.03));
            
            playSound('rim');
            break;
        }
    }
    
    // Floor collision
    if (ball.position.y < BALL_RADIUS) {
        ball.position.y = BALL_RADIUS;
        ballVelocity.y *= -0.5;
        ballVelocity.x *= 0.8;
        ballVelocity.z *= 0.8;
        
        if (Math.abs(ballVelocity.y) > 0.3) {
            playSound('bounce');
        }
        
        // Reset scored flag when ball hits floor
        hasScored = false;
    }
    
    // Slow down angular velocity
    ballAngularVelocity.multiplyScalar(0.98);
}

function playSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        switch(type) {
            case 'swoosh':
                oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.15);
                break;
            case 'bounce':
                oscillator.frequency.setValueAtTime(120, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.08);
                break;
            case 'rim':
                oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
                oscillator.type = 'triangle';
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.12);
                break;
            case 'score':
                oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);
                oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.08);
                oscillator.frequency.setValueAtTime(784, audioCtx.currentTime + 0.16);
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.25);
                break;
        }
    } catch(e) {}
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
    
    setTimeout(() => {
        document.getElementById('swipe-hint').classList.add('hidden');
    }, 3000);
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateUI();
        if (timeRemaining <= 0) endGame();
    }, 1000);
}

function endGame() {
    gameState = 'gameover';
    clearInterval(timerInterval);
    
    if (score > bestScore) bestScore = score;
    
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score }));
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
    let idleTime = 0;
    
    function idleLoop() {
        if (gameState === 'playing') return;
        
        idleTime += 0.03;
        ball.position.y = 0.5 + Math.sin(idleTime) * 0.08;
        ball.rotation.y += 0.015;
        ball.rotation.x += 0.008;
        
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

window.addEventListener('load', () => {
    init();
    requestAnimationFrame(gameLoop);
});
