// Crossy Road - Hop across traffic (fixed camera, isometric style)
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let player, lanes, score, highestRow;
    let gameState = 'start';
    let lastTime = 0;
    let scrollOffset = 0;

    const TILE = 50;
    const COLS = 9;

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
        
        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
    }

    function startGame() {
        const startCol = Math.floor(COLS / 2);
        player = {
            col: startCol,
            row: 0,
            x: startCol * TILE + TILE / 2,
            y: 0,
            targetX: startCol * TILE + TILE / 2,
            targetY: 0,
            moving: false,
            onLog: null
        };
        
        score = 0;
        highestRow = 0;
        scrollOffset = 0;
        lanes = [];
        
        // Generate lanes
        for (let i = -2; i < 30; i++) {
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

    function generateLane(rowIndex) {
        let type = 'grass';
        if (rowIndex > 0) {
            const pattern = rowIndex % 5;
            if (pattern === 1 || pattern === 2) type = 'road';
            else if (pattern === 3) type = 'water';
            else type = 'grass';
        }
        
        const lane = { row: rowIndex, type: type, obstacles: [] };
        
        if (type === 'road') {
            const speed = (1 + Math.random() * 1.5) * (rowIndex % 2 === 0 ? 1 : -1);
            const carCount = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < carCount; i++) {
                lane.obstacles.push({
                    x: Math.random() * width * 1.5 - width * 0.25,
                    speed: speed,
                    width: 45 + Math.random() * 25,
                    color: ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#1abc9c'][Math.floor(Math.random() * 5)]
                });
            }
        } else if (type === 'water') {
            const speed = (0.8 + Math.random()) * (rowIndex % 2 === 0 ? 1 : -1);
            const logCount = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < logCount; i++) {
                lane.obstacles.push({
                    x: Math.random() * width * 1.5 - width * 0.25,
                    speed: speed,
                    width: 80 + Math.random() * 50,
                    isLog: true
                });
            }
        }
        
        lanes.push(lane);
    }

    function setupControls() {
        let startX, startY, startTime;
        
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.btn')) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (gameState !== 'playing' || player.moving) return;
            if (e.target.closest('.btn')) return;
            
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            const dt = Date.now() - startTime;
            
            // Tap = forward, swipe = direction
            if (dt < 250 && Math.abs(dx) < 30 && Math.abs(dy) < 30) {
                move(0, 1); // Forward
            } else if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > 20) move(dx > 0 ? 1 : -1, 0);
            } else {
                if (dy < -20) move(0, 1); // Swipe up = forward
                else if (dy > 20) move(0, -1); // Swipe down = back
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (gameState !== 'playing' || player.moving) return;
            if (e.key === 'ArrowUp' || e.key === 'w') move(0, 1);
            if (e.key === 'ArrowDown' || e.key === 's') move(0, -1);
            if (e.key === 'ArrowLeft' || e.key === 'a') move(-1, 0);
            if (e.key === 'ArrowRight' || e.key === 'd') move(1, 0);
        });
    }

    function move(dx, dy) {
        const newCol = player.col + dx;
        const newRow = player.row + dy;
        
        // Bounds
        if (newCol < 0 || newCol >= COLS) return;
        if (newRow < 0) return;
        
        player.col = newCol;
        player.row = newRow;
        player.targetX = newCol * TILE + TILE / 2;
        player.moving = true;
        player.onLog = null;
        
        // Update score
        if (newRow > highestRow) {
            highestRow = newRow;
            score = highestRow;
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
        // Smooth scroll to keep player in view
        const targetScroll = Math.max(0, (player.row - 4) * TILE);
        scrollOffset += (targetScroll - scrollOffset) * 0.08;
        
        // Move player towards target
        if (player.moving) {
            const dx = player.targetX - player.x;
            const speed = 12;
            
            if (Math.abs(dx) < speed) {
                player.x = player.targetX;
                player.moving = false;
            } else {
                player.x += Math.sign(dx) * speed;
            }
        }
        
        // Update player Y based on row
        player.y = player.row * TILE;
        player.targetY = player.y;
        
        // Update obstacles
        for (let lane of lanes) {
            for (let obs of lane.obstacles) {
                obs.x += obs.speed * dt;
                
                // Wrap
                if (obs.speed > 0 && obs.x > width + obs.width) {
                    obs.x = -obs.width - Math.random() * 100;
                } else if (obs.speed < 0 && obs.x < -obs.width) {
                    obs.x = width + Math.random() * 100;
                }
            }
        }
        
        // Check collisions
        checkCollisions();
        
        // Generate more lanes if needed
        while (lanes[lanes.length - 1].row < player.row + 20) {
            generateLane(lanes[lanes.length - 1].row + 1);
        }
    }

    function checkCollisions() {
        const playerLane = lanes.find(l => l.row === player.row);
        if (!playerLane) return;
        
        const playerLeft = player.x - 15;
        const playerRight = player.x + 15;
        
        if (playerLane.type === 'road') {
            for (let obs of playerLane.obstacles) {
                const carLeft = obs.x - obs.width / 2;
                const carRight = obs.x + obs.width / 2;
                
                if (playerRight > carLeft && playerLeft < carRight) {
                    gameOver();
                    return;
                }
            }
        } else if (playerLane.type === 'water') {
            let onLog = false;
            for (let obs of playerLane.obstacles) {
                const logLeft = obs.x - obs.width / 2 + 10;
                const logRight = obs.x + obs.width / 2 - 10;
                
                if (playerRight > logLeft && playerLeft < logRight) {
                    onLog = true;
                    // Move with log
                    if (!player.moving) {
                        player.x += obs.speed * 0.6;
                        player.targetX = player.x;
                        // Update col based on position
                        player.col = Math.round((player.x - TILE / 2) / TILE);
                        player.col = Math.max(0, Math.min(COLS - 1, player.col));
                    }
                    break;
                }
            }
            if (!onLog && !player.moving) {
                gameOver();
            }
        }
        
        // Off screen sides
        if (player.x < 0 || player.x > COLS * TILE) {
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
        // Sky
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(0, 0, width, height);
        
        // Center the game board
        const boardWidth = COLS * TILE;
        const offsetX = (width - boardWidth) / 2;
        
        ctx.save();
        ctx.translate(offsetX, 0);
        
        // Draw lanes from back to front
        const sortedLanes = [...lanes].sort((a, b) => b.row - a.row);
        
        for (let lane of sortedLanes) {
            const screenY = height - (lane.row * TILE - scrollOffset) - TILE;
            
            if (screenY < -TILE * 2 || screenY > height + TILE) continue;
            
            // Lane background
            if (lane.type === 'grass') {
                ctx.fillStyle = lane.row % 2 === 0 ? '#7ec850' : '#8fd460';
            } else if (lane.type === 'road') {
                ctx.fillStyle = '#555';
            } else if (lane.type === 'water') {
                ctx.fillStyle = '#4a90d9';
            }
            ctx.fillRect(0, screenY, boardWidth, TILE);
            
            // Road markings
            if (lane.type === 'road') {
                ctx.strokeStyle = '#fff';
                ctx.setLineDash([15, 15]);
                ctx.beginPath();
                ctx.moveTo(0, screenY + TILE / 2);
                ctx.lineTo(boardWidth, screenY + TILE / 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            
            // Obstacles
            for (let obs of lane.obstacles) {
                if (obs.isLog) {
                    // Log
                    ctx.fillStyle = '#8b5a2b';
                    const logY = screenY + 8;
                    ctx.beginPath();
                    ctx.roundRect(obs.x - obs.width / 2, logY, obs.width, TILE - 16, 8);
                    ctx.fill();
                    
                    // Log rings
                    ctx.fillStyle = '#6b4423';
                    ctx.beginPath();
                    ctx.arc(obs.x - obs.width / 4, logY + (TILE - 16) / 2, 6, 0, Math.PI * 2);
                    ctx.arc(obs.x + obs.width / 4, logY + (TILE - 16) / 2, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Car
                    const carY = screenY + 5;
                    const carH = TILE - 10;
                    
                    ctx.fillStyle = obs.color;
                    ctx.beginPath();
                    ctx.roundRect(obs.x - obs.width / 2, carY, obs.width, carH, 6);
                    ctx.fill();
                    
                    // Windows
                    ctx.fillStyle = '#87ceeb';
                    const winOffset = obs.speed > 0 ? obs.width * 0.2 : -obs.width * 0.2;
                    ctx.fillRect(obs.x + winOffset - 8, carY + 5, 16, carH - 10);
                    
                    // Wheels
                    ctx.fillStyle = '#333';
                    ctx.beginPath();
                    ctx.arc(obs.x - obs.width / 3, carY + carH, 6, 0, Math.PI * 2);
                    ctx.arc(obs.x + obs.width / 3, carY + carH, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        // Draw player (chicken)
        const playerScreenY = height - (player.y - scrollOffset) - TILE;
        drawChicken(player.x, playerScreenY + TILE / 2);
        
        ctx.restore();
    }

    function drawChicken(x, y) {
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(x, y + 15, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(x, y, 14, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Wing
        ctx.fillStyle = '#eee';
        ctx.beginPath();
        ctx.ellipse(x - 5, y + 2, 8, 10, -0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y - 14, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(x + 8, y - 14);
        ctx.lineTo(x + 16, y - 12);
        ctx.lineTo(x + 8, y - 10);
        ctx.closePath();
        ctx.fill();
        
        // Comb
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x - 2, y - 22, 4, 0, Math.PI * 2);
        ctx.arc(x + 3, y - 24, 3, 0, Math.PI * 2);
        ctx.arc(x - 6, y - 21, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + 4, y - 16, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + 5, y - 17, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Feet
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(x - 6, y + 12, 3, 6);
        ctx.fillRect(x + 3, y + 12, 3, 6);
    }

    window.addEventListener('load', init);
})();
