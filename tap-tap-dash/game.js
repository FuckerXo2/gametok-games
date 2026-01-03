// Tap Tap Dash - Tap to turn at corners
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
    const SPEED = 4;

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
        
        // Auto-start game
        setTimeout(startGame, 100);
    }

    function generatePath() {
        path = [];
        const centerX = Math.floor(width / 2 / TILE_SIZE);
        let x = centerX;
        let y = 0;
        
        // Start with a straight section going up
        for (let i = 0; i < 5; i++) {
            path.push({ x, y: y - i });
        }
        y = -4;
        
        // Generate zigzag path
        for (let i = 0; i < 50; i++) {
            // Go up for random amount
            const upCount = 2 + Math.floor(Math.random() * 4);
            for (let j = 0; j < upCount; j++) {
                y--;
                path.push({ x, y });
            }
            
            // Turn left or right
            const goLeft = Math.random() < 0.5;
            const sideCount = 2 + Math.floor(Math.random() * 3);
            
            for (let j = 0; j < sideCount; j++) {
                x += goLeft ? -1 : 1;
                // Keep in bounds
                x = Math.max(1, Math.min(Math.floor(width / TILE_SIZE) - 2, x));
                path.push({ x, y });
            }
        }
    }

    function startGame() {
        generatePath();
        
        player = {
            x: path[0].x * TILE_SIZE + TILE_SIZE / 2,
            y: path[0].y * TILE_SIZE + TILE_SIZE / 2,
            dir: 'up', // up, left, right
            nextDir: null
        };
        
        score = 0;
        cameraY = player.y - height * 0.7;
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
            
            // Toggle between up and sideways
            if (player.dir === 'up') {
                // Look ahead to see which way the path goes
                const nextTurn = findNextTurn();
                if (nextTurn === 'left') {
                    player.dir = 'left';
                } else if (nextTurn === 'right') {
                    player.dir = 'right';
                }
            } else {
                player.dir = 'up';
            }
        };
        
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            tap();
        }, { passive: false });
        document.addEventListener('mousedown', tap);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') tap();
        });
    }

    function findNextTurn() {
        const tileX = Math.floor(player.x / TILE_SIZE);
        const tileY = Math.floor(player.y / TILE_SIZE);
        
        // Look at nearby path tiles to determine turn direction
        const hasLeft = path.some(p => p.x === tileX - 1 && Math.abs(p.y - tileY) <= 1);
        const hasRight = path.some(p => p.x === tileX + 1 && Math.abs(p.y - tileY) <= 1);
        
        if (hasLeft && !hasRight) return 'left';
        if (hasRight && !hasLeft) return 'right';
        if (hasLeft) return 'left'; // Default to left if both
        return 'right';
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
        const moveAmount = SPEED * dt;
        
        if (player.dir === 'up') {
            player.y -= moveAmount;
        } else if (player.dir === 'left') {
            player.x -= moveAmount;
        } else if (player.dir === 'right') {
            player.x += moveAmount;
        }
        
        // Update camera smoothly
        const targetCameraY = player.y - height * 0.7;
        cameraY += (targetCameraY - cameraY) * 0.1;
        
        // Update score based on progress
        const newScore = Math.max(0, Math.floor(-player.y / TILE_SIZE));
        if (newScore > score) {
            score = newScore;
            updateUI();
        }
        
        // Check if still on path
        if (!isOnPath(player.x, player.y)) {
            gameOver();
            return;
        }
        
        // Check screen bounds
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
        
        // Draw path tiles
        for (let tile of path) {
            const screenY = tile.y * TILE_SIZE - cameraY;
            if (screenY < -TILE_SIZE * 2 || screenY > height + TILE_SIZE * 2) continue;
            
            // Main tile
            ctx.fillStyle = '#9b59b6';
            ctx.fillRect(
                tile.x * TILE_SIZE + 2, 
                tile.y * TILE_SIZE + 2, 
                TILE_SIZE - 4, 
                TILE_SIZE - 4
            );
            
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(
                tile.x * TILE_SIZE + 4, 
                tile.y * TILE_SIZE + 4, 
                TILE_SIZE - 8, 
                10
            );
        }
        
        // Draw player
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(player.x, player.y, PLAYER_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Direction indicator
        ctx.fillStyle = '#9b59b6';
        let dx = 0, dy = 0;
        if (player.dir === 'up') dy = -6;
        else if (player.dir === 'left') dx = -6;
        else if (player.dir === 'right') dx = 6;
        
        ctx.beginPath();
        ctx.arc(player.x + dx, player.y + dy, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Draw tap hint
        if (score < 3) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('TAP to turn at corners', width / 2, height - 50);
        }
    }

    window.addEventListener('load', init);
})();
