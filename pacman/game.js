// PAC-MAN - Mobile swipe controls only
(function() {
    'use strict';

    const TILE = 20;
    const COLS = 19;
    const ROWS = 21;
    const WIDTH = COLS * TILE;
    const HEIGHT = ROWS * TILE;

    const COLORS = {
        wall: '#2121DE',
        dot: '#FFB8FF',
        powerDot: '#FFB8FF',
        pacman: '#FFFF00',
        blinky: '#FF0000',
        pinky: '#FFB8FF',
        inky: '#00FFFF',
        clyde: '#FFB852',
        frightened: '#2121DE',
        eyes: '#FFFFFF'
    };

    // Classic Pac-Man maze
    const MAP = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
        [1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
        [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
        [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
        [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
        [1,1,1,1,2,1,0,1,1,4,1,1,0,1,2,1,1,1,1],
        [0,0,0,0,2,0,0,1,4,4,4,1,0,0,2,0,0,0,0],
        [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
        [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
        [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
        [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
        [1,3,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,3,1],
        [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
        [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
        [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    let canvas, ctx;
    let gameState = 'start';
    let score = 0;
    let lives = 3;
    let level = 1;
    let dotsLeft = 0;
    let map = [];
    let pacman, ghosts;
    let lastTime = 0;
    let frightenedTimer = 0;
    let inputDir = null;
    let swipeCount = 0;

    function init() {
        canvas = document.getElementById('game');
        ctx = canvas.getContext('2d');
        
        const maxWidth = window.innerWidth - 20;
        const maxHeight = window.innerHeight - 160;
        const scale = Math.min(maxWidth / WIDTH, maxHeight / HEIGHT, 2);
        
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.width = (WIDTH * scale) + 'px';
        canvas.style.height = (HEIGHT * scale) + 'px';

        setupSwipeControls();
        draw();
    }

    function startGame() {
        score = 0;
        lives = 3;
        level = 1;
        swipeCount = 0;
        resetLevel();
        gameState = 'playing';
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        document.getElementById('swipe-hint').classList.remove('hidden');
        
        updateUI();
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function resetLevel() {
        map = MAP.map(row => [...row]);
        dotsLeft = 0;
        
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (map[y][x] === 2 || map[y][x] === 3) dotsLeft++;
            }
        }

        pacman = {
            x: 9 * TILE + TILE/2,
            y: 15 * TILE + TILE/2,
            dir: { x: 0, y: 0 },
            nextDir: { x: 0, y: 0 },
            speed: 3,
            mouthAngle: 0,
            mouthDir: 1
        };

        ghosts = [
            createGhost(9, 9, COLORS.blinky, 'blinky'),
            createGhost(8, 9, COLORS.pinky, 'pinky'),
            createGhost(9, 9, COLORS.inky, 'inky'),
            createGhost(10, 9, COLORS.clyde, 'clyde')
        ];

        frightenedTimer = 0;
        inputDir = null;
    }

    function createGhost(tx, ty, color, name) {
        return {
            x: tx * TILE + TILE/2,
            y: ty * TILE + TILE/2,
            dir: { x: 0, y: -1 },
            speed: 2.2 + Math.random() * 0.3,
            color: color,
            name: name,
            frightened: false,
            eaten: false
        };
    }

    function gameLoop(time) {
        if (gameState !== 'playing') return;

        const dt = Math.min((time - lastTime) / 16.67, 2);
        lastTime = time;

        update(dt);
        draw();

        requestAnimationFrame(gameLoop);
    }

    function update(dt) {
        if (frightenedTimer > 0) {
            frightenedTimer -= dt * 16.67;
            if (frightenedTimer <= 0) {
                ghosts.forEach(g => g.frightened = false);
            }
        }

        updatePacman(dt);
        ghosts.forEach(g => updateGhost(g, dt));
        checkCollisions();

        if (dotsLeft <= 0) {
            level++;
            resetLevel();
        }
    }

    function updatePacman(dt) {
        pacman.mouthAngle += 0.15 * pacman.mouthDir * dt;
        if (pacman.mouthAngle > 0.4) pacman.mouthDir = -1;
        if (pacman.mouthAngle < 0.05) pacman.mouthDir = 1;

        if (inputDir) {
            const nextTile = getTile(
                pacman.x + inputDir.x * TILE,
                pacman.y + inputDir.y * TILE
            );
            if (!isWall(nextTile.x, nextTile.y)) {
                pacman.nextDir = { ...inputDir };
            }
        }

        const tile = getTile(pacman.x, pacman.y);
        const centerX = tile.x * TILE + TILE/2;
        const centerY = tile.y * TILE + TILE/2;
        
        if (Math.abs(pacman.x - centerX) < 3 && Math.abs(pacman.y - centerY) < 3) {
            const nextTile = { x: tile.x + pacman.nextDir.x, y: tile.y + pacman.nextDir.y };
            if (!isWall(nextTile.x, nextTile.y)) {
                pacman.dir = { ...pacman.nextDir };
                pacman.x = centerX;
                pacman.y = centerY;
            }
        }

        const newX = pacman.x + pacman.dir.x * pacman.speed * dt;
        const newY = pacman.y + pacman.dir.y * pacman.speed * dt;

        const newTile = getTile(newX, newY);
        if (!isWall(newTile.x, newTile.y)) {
            pacman.x = newX;
            pacman.y = newY;
        } else {
            pacman.x = tile.x * TILE + TILE/2;
            pacman.y = tile.y * TILE + TILE/2;
        }

        if (pacman.x < 0) pacman.x = WIDTH;
        if (pacman.x > WIDTH) pacman.x = 0;

        if (map[tile.y] && map[tile.y][tile.x] === 2) {
            map[tile.y][tile.x] = 0;
            score += 10;
            dotsLeft--;
            updateUI();
        } else if (map[tile.y] && map[tile.y][tile.x] === 3) {
            map[tile.y][tile.x] = 0;
            score += 50;
            dotsLeft--;
            frightenedTimer = 7000;
            ghosts.forEach(g => {
                if (!g.eaten) g.frightened = true;
            });
            updateUI();
        }
    }

    function updateGhost(ghost, dt) {
        if (ghost.eaten) {
            const homeX = 9 * TILE + TILE/2;
            const homeY = 9 * TILE + TILE/2;
            const dx = homeX - ghost.x;
            const dy = homeY - ghost.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 5) {
                ghost.eaten = false;
                ghost.frightened = false;
            } else {
                ghost.x += (dx / dist) * 5 * dt;
                ghost.y += (dy / dist) * 5 * dt;
            }
            return;
        }

        const tile = getTile(ghost.x, ghost.y);
        const centerX = tile.x * TILE + TILE/2;
        const centerY = tile.y * TILE + TILE/2;

        if (Math.abs(ghost.x - centerX) < 2 && Math.abs(ghost.y - centerY) < 2) {
            ghost.x = centerX;
            ghost.y = centerY;

            const dirs = [
                { x: 0, y: -1 },
                { x: 0, y: 1 },
                { x: -1, y: 0 },
                { x: 1, y: 0 }
            ];

            const validDirs = dirs.filter(d => {
                if (d.x === -ghost.dir.x && d.y === -ghost.dir.y) return false;
                return !isWall(tile.x + d.x, tile.y + d.y);
            });

            if (validDirs.length > 0) {
                if (ghost.frightened) {
                    ghost.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
                } else {
                    let target = { x: pacman.x, y: pacman.y };
                    
                    if (ghost.name === 'pinky') {
                        target.x = pacman.x + pacman.dir.x * TILE * 4;
                        target.y = pacman.y + pacman.dir.y * TILE * 4;
                    } else if (ghost.name === 'clyde') {
                        const dist = Math.sqrt(Math.pow(ghost.x - pacman.x, 2) + Math.pow(ghost.y - pacman.y, 2));
                        if (dist < TILE * 8) {
                            target = { x: 0, y: HEIGHT };
                        }
                    }

                    let bestDir = validDirs[0];
                    let bestDist = Infinity;
                    
                    validDirs.forEach(d => {
                        const nx = ghost.x + d.x * TILE;
                        const ny = ghost.y + d.y * TILE;
                        const dist = Math.sqrt(Math.pow(nx - target.x, 2) + Math.pow(ny - target.y, 2));
                        if (dist < bestDist) {
                            bestDist = dist;
                            bestDir = d;
                        }
                    });
                    
                    ghost.dir = bestDir;
                }
            }
        }

        const speed = ghost.frightened ? ghost.speed * 0.5 : ghost.speed;
        ghost.x += ghost.dir.x * speed * dt;
        ghost.y += ghost.dir.y * speed * dt;

        if (ghost.x < 0) ghost.x = WIDTH;
        if (ghost.x > WIDTH) ghost.x = 0;
    }

    function checkCollisions() {
        ghosts.forEach(ghost => {
            if (ghost.eaten) return;
            
            const dist = Math.sqrt(
                Math.pow(pacman.x - ghost.x, 2) + 
                Math.pow(pacman.y - ghost.y, 2)
            );

            if (dist < TILE * 0.8) {
                if (ghost.frightened) {
                    ghost.eaten = true;
                    score += 200;
                    updateUI();
                } else {
                    lives--;
                    updateUI();
                    
                    if (lives <= 0) {
                        gameOver();
                    } else {
                        pacman.x = 9 * TILE + TILE/2;
                        pacman.y = 15 * TILE + TILE/2;
                        pacman.dir = { x: 0, y: 0 };
                        
                        ghosts.forEach((g, i) => {
                            g.x = (8 + i % 3) * TILE + TILE/2;
                            g.y = 9 * TILE + TILE/2;
                            g.frightened = false;
                            g.eaten = false;
                        });
                    }
                }
            }
        });
    }

    function gameOver() {
        gameState = 'gameover';
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('ui').classList.add('hidden');
        document.getElementById('swipe-hint').classList.add('hidden');
        
        // Send score to parent app
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    // Pause/Resume for React Native
    window.gamePause = function() {
        if (gameState === 'playing') {
            gameState = 'paused';
        }
    };
    
    window.gameResume = function() {
        if (gameState === 'paused') {
            gameState = 'playing';
            requestAnimationFrame(gameLoop);
        }
    };

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        drawMap();
        drawPacman();
        ghosts.forEach(drawGhost);
    }

    function drawMap() {
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const tile = map[y][x];
                const px = x * TILE;
                const py = y * TILE;

                if (tile === 1) {
                    ctx.fillStyle = COLORS.wall;
                    ctx.beginPath();
                    roundRect(ctx, px + 2, py + 2, TILE - 4, TILE - 4, 4);
                    ctx.fill();
                } else if (tile === 2) {
                    ctx.fillStyle = COLORS.dot;
                    ctx.beginPath();
                    ctx.arc(px + TILE/2, py + TILE/2, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile === 3) {
                    const pulse = Math.sin(performance.now() / 200) * 0.3 + 0.7;
                    ctx.fillStyle = COLORS.powerDot;
                    ctx.beginPath();
                    ctx.arc(px + TILE/2, py + TILE/2, 6 * pulse, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    function drawPacman() {
        ctx.save();
        ctx.translate(pacman.x, pacman.y);
        
        let angle = 0;
        if (pacman.dir.x === 1) angle = 0;
        else if (pacman.dir.x === -1) angle = Math.PI;
        else if (pacman.dir.y === 1) angle = Math.PI / 2;
        else if (pacman.dir.y === -1) angle = -Math.PI / 2;
        
        ctx.rotate(angle);

        ctx.fillStyle = COLORS.pacman;
        ctx.beginPath();
        ctx.arc(0, 0, TILE/2 - 2, pacman.mouthAngle, Math.PI * 2 - pacman.mouthAngle);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-2, -5, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawGhost(ghost) {
        ctx.save();
        ctx.translate(ghost.x, ghost.y);

        const size = TILE/2 - 2;

        if (ghost.eaten) {
            drawGhostEyes(ghost);
        } else {
            ctx.fillStyle = ghost.frightened ? 
                (frightenedTimer < 2000 && Math.floor(frightenedTimer / 200) % 2 ? '#FFF' : COLORS.frightened) : 
                ghost.color;
            
            ctx.beginPath();
            ctx.arc(0, -2, size, Math.PI, 0);
            ctx.lineTo(size, size - 2);
            
            const wave = Math.sin(performance.now() / 100) * 2;
            for (let i = 0; i < 4; i++) {
                const wx = size - (i * size / 2);
                const wy = size - 2 + (i % 2 ? wave : -wave);
                ctx.lineTo(wx, wy);
            }
            ctx.lineTo(-size, size - 2);
            ctx.closePath();
            ctx.fill();

            if (!ghost.frightened) {
                drawGhostEyes(ghost);
            } else {
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(-4, -2, 2, 0, Math.PI * 2);
                ctx.arc(4, -2, 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = '#FFF';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-5, 4);
                for (let i = 0; i < 5; i++) {
                    ctx.lineTo(-5 + i * 2.5, 4 + (i % 2 ? -2 : 2));
                }
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    function drawGhostEyes(ghost) {
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-4, -2, 4, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(4, -2, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const px = (dx / dist) * 2;
        const py = (dy / dist) * 2;

        ctx.fillStyle = '#00F';
        ctx.beginPath();
        ctx.arc(-4 + px, -2 + py, 2, 0, Math.PI * 2);
        ctx.arc(4 + px, -2 + py, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
    }

    function getTile(x, y) {
        return {
            x: Math.floor(x / TILE),
            y: Math.floor(y / TILE)
        };
    }

    function isWall(tx, ty) {
        if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return false;
        return map[ty] && map[ty][tx] === 1;
    }

    function updateUI() {
        document.querySelector('.score').textContent = score;
        // Report score to React Native for multiplayer
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'score', score: score }));
        }
        
        const livesEl = document.querySelector('.lives');
        livesEl.innerHTML = '';
        for (let i = 0; i < lives; i++) {
            const life = document.createElement('div');
            life.className = 'life';
            livesEl.appendChild(life);
        }
    }

    function setupSwipeControls() {
        let touchStart = null;
        const minSwipe = 30;

        // Touch start
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.btn')) return;
            touchStart = { 
                x: e.touches[0].clientX, 
                y: e.touches[0].clientY,
                time: Date.now()
            };
        }, { passive: true });

        // Touch move - continuous swipe detection
        document.addEventListener('touchmove', (e) => {
            if (!touchStart || e.target.closest('.btn')) return;
            
            const dx = e.touches[0].clientX - touchStart.x;
            const dy = e.touches[0].clientY - touchStart.y;

            if (Math.abs(dx) > minSwipe || Math.abs(dy) > minSwipe) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    inputDir = { x: dx > 0 ? 1 : -1, y: 0 };
                } else {
                    inputDir = { x: 0, y: dy > 0 ? 1 : -1 };
                }
                
                // Reset touch start for continuous swiping
                touchStart = { 
                    x: e.touches[0].clientX, 
                    y: e.touches[0].clientY,
                    time: Date.now()
                };
                
                // Hide hint after a few swipes
                swipeCount++;
                if (swipeCount > 3) {
                    document.getElementById('swipe-hint').classList.add('hidden');
                }
            }
        }, { passive: true });

        // Touch end - quick flick detection
        document.addEventListener('touchend', (e) => {
            if (!touchStart || e.target.closest('.btn')) {
                touchStart = null;
                return;
            }
            
            const touch = e.changedTouches[0];
            const dx = touch.clientX - touchStart.x;
            const dy = touch.clientY - touchStart.y;
            const dt = Date.now() - touchStart.time;
            
            // Quick flick (fast swipe)
            if (dt < 200 && (Math.abs(dx) > 20 || Math.abs(dy) > 20)) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    inputDir = { x: dx > 0 ? 1 : -1, y: 0 };
                } else {
                    inputDir = { x: 0, y: dy > 0 ? 1 : -1 };
                }
            }
            
            touchStart = null;
        });

        // Keyboard for testing
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp': case 'w': inputDir = { x: 0, y: -1 }; break;
                case 'ArrowDown': case 's': inputDir = { x: 0, y: 1 }; break;
                case 'ArrowLeft': case 'a': inputDir = { x: -1, y: 0 }; break;
                case 'ArrowRight': case 'd': inputDir = { x: 1, y: 0 }; break;
            }
        });

        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
    }

    window.addEventListener('load', init);
})();
