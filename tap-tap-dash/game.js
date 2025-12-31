// Tap Tap Dash - Tap to change direction
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let player, path, score;
    let gameState = 'start';
    let lastTime = 0;
    let cameraY = 0;

    const TILE_SIZE = 60;
    const PLAYER_SIZE = 20;
    const SPEED = 5;

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

    function generatePath() {
        path = [];
        let x = Math.floor(width / 2 / TILE_SIZE);
        let y = 0;
        let dir = 'up'; // up, left, right
        
        for (let i = 0; i < 200; i++) {
            path.push({ x, y, dir });
            
            if (dir === 'up') {
                y--;
                // Randomly turn
                if (Math.random() < 0.3 && i > 5) {
                    dir = Math.random() < 0.5 ? 'left' : 'right';
                }
            } else if (dir === 'left') {
                x--;
                if (Math.random() < 0.4 || x < 2) dir = 'up';
            } else if (dir === 'right') {
                x++;
                if (Math.random() < 0.4 || x > Math.floor(width / TILE_SIZE) - 2) dir = 'up';
            }
        }
    }

    function startGame() {
        generatePath();
        
        player = {
            x: path[0].x * TILE_SIZE + TILE_SIZE / 2,
            y: path[0].y * TILE_SIZE + TILE_SIZE / 2,
            dir: 'up' // up, left, right
        };
        
        score = 0;
        cameraY = 0;
        gameState = 'playing';
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function setupControls() {
        const tap = () => {
            if (gameState !== 'playing') return;
            
            // Change direction
            if (player.dir === 'up') {
                // Check which way to turn based on path
                const currentTile = getCurrentTile();
                if (currentTile && currentTile.dir !== 'up') {
                    player.dir = currentTile.dir;
                } else {
                    // Default turn right, then left
                    player.dir = player.dir === 'up' ? 'right' : 'up';
                }
            } else {
                player.dir = 'up';
            }
        };
        
        document.addEventListener('touchstart', tap, { passive: true });
        document.addEventListener('mousedown', tap);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') tap();
        });
    }

    function getCurrentTile() {
        const tileX = Math.floor(player.x / TILE_SIZE);
        const tileY = Math.floor(player.y / TILE_SIZE);
        return path.find(p => p.x === tileX && p.y === tileY);
    }

    function isOnPath(x, y) {
        const tileX = Math.floor(x / TILE_SIZE);
        const tileY = Math.floor(y / TILE_SIZE);
        return path.some(p => p.x === tileX && p.y === tileY);
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
        // Move player
        if (player.dir === 'up') {
            player.y -= SPEED * dt;
        } else if (player.dir === 'left') {
            player.x -= SPEED * dt;
        } else if (player.dir === 'right') {
            player.x += SPEED * dt;
        }
        
        // Update camera
        const targetCameraY = player.y - height * 0.7;
        cameraY += (targetCameraY - cameraY) * 0.1;
        
        // Update score
        score = Math.max(score, Math.floor(-player.y / TILE_SIZE));
        updateUI();
        
        // Check if on path
        if (!isOnPath(player.x, player.y)) {
            gameOver();
        }
        
        // Check bounds
        if (player.x < 0 || player.x > width) {
            gameOver();
        }
    }

    function gameOver() {
        gameState = 'gameover';
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('ui').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score * 10 }));
        }
    }

    function updateUI() {
        document.getElementById('score').textContent = score;
    }

    function draw() {
        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        ctx.save();
        ctx.translate(0, -cameraY);
        
        // Draw path
        for (let tile of path) {
            const screenY = tile.y * TILE_SIZE - cameraY;
            if (screenY < -TILE_SIZE || screenY > height + TILE_SIZE) continue;
            
            ctx.fillStyle = '#9b59b6';
            ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            
            // Tile border
            ctx.strokeStyle = '#8e44ad';
            ctx.lineWidth = 2;
            ctx.strokeRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
        
        // Draw player
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(player.x, player.y, PLAYER_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Direction indicator
        ctx.fillStyle = '#333';
        let indicatorX = player.x;
        let indicatorY = player.y;
        if (player.dir === 'up') indicatorY -= 5;
        else if (player.dir === 'left') indicatorX -= 5;
        else if (player.dir === 'right') indicatorX += 5;
        
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    window.addEventListener('load', init);
})();
