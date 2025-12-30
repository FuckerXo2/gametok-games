// Crossy Road - Hop across traffic
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let player, lanes, score, cameraY;
    let gameState = 'start';
    let lastTime = 0;

    const TILE = 50;
    const PLAYER_SIZE = 40;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);
        
        setupControls();
        
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        
        draw();
    }

    function startGame() {
        player = {
            x: Math.floor(width / TILE / 2) * TILE + TILE / 2,
            y: height - TILE * 2,
            targetX: 0,
            targetY: 0,
            moving: false
        };
        player.targetX = player.x;
        player.targetY = player.y;
        
        score = 0;
        cameraY = 0;
        lanes = [];
        
        // Generate initial lanes
        for (let i = -5; i < 20; i++) {
            generateLane(i);
        }
        
        gameState = 'playing';
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        document.getElementById('score').textContent = '0';
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function generateLane(index) {
        const types = ['grass', 'road', 'road', 'water', 'grass'];
        const type = types[Math.abs(index) % types.length];
        
        const lane = {
            y: -index * TILE,
            type: type,
            obstacles: []
        };
        
        if (type === 'road') {
            const speed = (1 + Math.random() * 2) * (Math.random() > 0.5 ? 1 : -1);
            const count = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < count; i++) {
                lane.obstacles.push({
                    x: Math.random() * width,
                    speed: speed,
                    width: 60 + Math.random() * 40,
                    color: ['#e74c3c', '#3498db', '#f39c12', '#9b59b6'][Math.floor(Math.random() * 4)]
                });
            }
        } else if (type === 'water') {
            const speed = (1 + Math.random()) * (Math.random() > 0.5 ? 1 : -1);
            const count = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < count; i++) {
                lane.obstacles.push({
                    x: Math.random() * width,
                    speed: speed,
                    width: 80 + Math.random() * 60,
                    isLog: true
                });
            }
        }
        
        lanes.push(lane);
    }

    function setupControls() {
        let startX, startY, startTime;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (gameState !== 'playing' || player.moving) return;
            
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            const dt = Date.now() - startTime;
            
            if (dt < 200 && Math.abs(dx) < 30 && Math.abs(dy) < 30) {
                // Tap - move forward
                move(0, -1);
            } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                // Horizontal swipe
                move(dx > 0 ? 1 : -1, 0);
            } else if (dy > 30) {
                // Swipe down - move back
                move(0, 1);
            } else if (dy < -30) {
                // Swipe up - move forward
                move(0, -1);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (gameState !== 'playing' || player.moving) return;
            if (e.key === 'ArrowUp') move(0, -1);
            if (e.key === 'ArrowDown') move(0, 1);
            if (e.key === 'ArrowLeft') move(-1, 0);
            if (e.key === 'ArrowRight') move(1, 0);
        });
    }

    function move(dx, dy) {
        const newX = player.x + dx * TILE;
        const newY = player.y + dy * TILE;
        
        // Bounds check
        if (newX < TILE / 2 || newX > width - TILE / 2) return;
        
        player.targetX = newX;
        player.targetY = newY;
        player.moving = true;
        
        // Update score when moving forward
        if (dy < 0) {
            score++;
            document.getElementById('score').textContent = score;
        }
    }

    function gameLoop(time) {
        if (gameState !== 'playing') return;
        
        const dt = Math.min((time - lastTime) / 16.67, 3);
        lastTime = time;
        
        update(dt);
        draw();
        
        requestAnimationFrame(gameLoop);
    }

    function update(dt) {
        // Move player towards target
        if (player.moving) {
            const dx = player.targetX - player.x;
            const dy = player.targetY - player.y;
            const speed = 8;
            
            if (Math.abs(dx) < speed && Math.abs(dy) < speed) {
                player.x = player.targetX;
                player.y = player.targetY;
                player.moving = false;
            } else {
                player.x += Math.sign(dx) * speed;
                player.y += Math.sign(dy) * speed;
            }
        }
        
        // Camera follows player
        const targetCameraY = player.y - height * 0.6;
        cameraY += (targetCameraY - cameraY) * 0.1;
        
        // Update obstacles
        for (let lane of lanes) {
            for (let obs of lane.obstacles) {
                obs.x += obs.speed * dt;
                
                // Wrap around
                if (obs.speed > 0 && obs.x > width + obs.width) {
                    obs.x = -obs.width;
                } else if (obs.speed < 0 && obs.x < -obs.width) {
                    obs.x = width + obs.width;
                }
            }
        }
        
        // Generate new lanes
        const topLane = Math.floor((cameraY - height) / TILE);
        while (lanes.length < -topLane + 25) {
            generateLane(-lanes.length);
        }
        
        // Check collisions
        checkCollisions();
    }

    function checkCollisions() {
        const playerLane = lanes.find(l => Math.abs(l.y - player.y + cameraY) < TILE / 2);
        if (!playerLane) return;
        
        if (playerLane.type === 'road') {
            for (let obs of playerLane.obstacles) {
                if (player.x > obs.x - obs.width / 2 - PLAYER_SIZE / 2 &&
                    player.x < obs.x + obs.width / 2 + PLAYER_SIZE / 2) {
                    gameOver();
                    return;
                }
            }
        } else if (playerLane.type === 'water') {
            let onLog = false;
            for (let obs of playerLane.obstacles) {
                if (player.x > obs.x - obs.width / 2 + 5 &&
                    player.x < obs.x + obs.width / 2 - 5) {
                    onLog = true;
                    // Move with log
                    if (!player.moving) {
                        player.x += obs.speed * 0.5;
                        player.targetX = player.x;
                    }
                    break;
                }
            }
            if (!onLog && !player.moving) {
                gameOver();
            }
        }
        
        // Off screen
        if (player.y - cameraY > height + TILE) {
            gameOver();
        }
    }

    function gameOver() {
        gameState = 'gameover';
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('ui').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    function draw() {
        ctx.fillStyle = '#4a7c59';
        ctx.fillRect(0, 0, width, height);
        
        // Draw lanes
        for (let lane of lanes) {
            const screenY = lane.y + cameraY;
            if (screenY < -TILE || screenY > height + TILE) continue;
            
            // Lane background
            if (lane.type === 'grass') {
                ctx.fillStyle = '#4a7c59';
            } else if (lane.type === 'road') {
                ctx.fillStyle = '#333';
            } else if (lane.type === 'water') {
                ctx.fillStyle = '#3498db';
            }
            ctx.fillRect(0, screenY - TILE / 2, width, TILE);
            
            // Road markings
            if (lane.type === 'road') {
                ctx.strokeStyle = '#fff';
                ctx.setLineDash([20, 20]);
                ctx.beginPath();
                ctx.moveTo(0, screenY);
                ctx.lineTo(width, screenY);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            
            // Water waves
            if (lane.type === 'water') {
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                for (let x = 0; x < width; x += 30) {
                    ctx.beginPath();
                    ctx.arc(x + Math.sin(Date.now() / 500 + x) * 5, screenY, 8, 0, Math.PI);
                    ctx.fill();
                }
            }
            
            // Obstacles
            for (let obs of lane.obstacles) {
                if (obs.isLog) {
                    // Log
                    ctx.fillStyle = '#8b4513';
                    ctx.beginPath();
                    ctx.roundRect(obs.x - obs.width / 2, screenY - 20, obs.width, 40, 10);
                    ctx.fill();
                    
                    // Log texture
                    ctx.fillStyle = '#6b3510';
                    ctx.beginPath();
                    ctx.arc(obs.x - obs.width / 4, screenY, 8, 0, Math.PI * 2);
                    ctx.arc(obs.x + obs.width / 4, screenY, 6, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Car
                    ctx.fillStyle = obs.color;
                    ctx.beginPath();
                    ctx.roundRect(obs.x - obs.width / 2, screenY - 18, obs.width, 36, 8);
                    ctx.fill();
                    
                    // Windows
                    ctx.fillStyle = '#87ceeb';
                    const winX = obs.speed > 0 ? obs.x + obs.width / 4 : obs.x - obs.width / 4;
                    ctx.fillRect(winX - 10, screenY - 12, 20, 24);
                    
                    // Wheels
                    ctx.fillStyle = '#222';
                    ctx.beginPath();
                    ctx.arc(obs.x - obs.width / 3, screenY + 15, 8, 0, Math.PI * 2);
                    ctx.arc(obs.x + obs.width / 3, screenY + 15, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        // Draw player (chicken)
        const px = player.x;
        const py = player.y + cameraY;
        
        // Body
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(px, py, PLAYER_SIZE / 2.5, PLAYER_SIZE / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(px, py - PLAYER_SIZE / 3, PLAYER_SIZE / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(px, py - PLAYER_SIZE / 3);
        ctx.lineTo(px + 10, py - PLAYER_SIZE / 3 + 3);
        ctx.lineTo(px, py - PLAYER_SIZE / 3 + 6);
        ctx.fill();
        
        // Comb
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(px - 3, py - PLAYER_SIZE / 2, 5, 0, Math.PI * 2);
        ctx.arc(px + 3, py - PLAYER_SIZE / 2 - 2, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(px + 3, py - PLAYER_SIZE / 3 - 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    window.addEventListener('load', init);
})();
