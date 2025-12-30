// Piano Tiles - Tap the black tiles
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height, tileW, tileH;
    let tiles = [];
    let score = 0;
    let speed = 4;
    let gameState = 'start';
    let lastTime = 0;

    const COLS = 4;
    const ROWS = 5;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        tileW = width / COLS;
        tileH = height / ROWS;
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);
        
        canvas.addEventListener('touchstart', handleTap, { passive: false });
        canvas.addEventListener('mousedown', handleTap);
        
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        
        draw();
    }

    function startGame() {
        score = 0;
        speed = 4;
        tiles = [];
        gameState = 'playing';
        
        // Create initial tiles
        for (let i = 0; i < ROWS + 1; i++) {
            addRow(-i * tileH);
        }
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        updateScore();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function addRow(y) {
        const blackCol = Math.floor(Math.random() * COLS);
        tiles.push({ y: y, blackCol: blackCol, tapped: false });
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
        // Move tiles down
        for (let tile of tiles) {
            tile.y += speed * dt;
        }
        
        // Check if black tile passed bottom without being tapped
        for (let tile of tiles) {
            if (!tile.tapped && tile.y > height - tileH) {
                gameOver();
                return;
            }
        }
        
        // Remove tiles that are off screen and add new ones
        while (tiles.length > 0 && tiles[0].y > height) {
            tiles.shift();
        }
        
        while (tiles.length < ROWS + 2) {
            const lastY = tiles.length > 0 ? tiles[tiles.length - 1].y : 0;
            addRow(lastY - tileH);
        }
        
        // Increase speed gradually
        speed = 4 + score * 0.05;
        if (speed > 15) speed = 15;
    }

    function handleTap(e) {
        if (gameState !== 'playing') return;
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        
        const col = Math.floor(x / tileW);
        
        // Find the lowest untapped tile
        let tapped = false;
        for (let tile of tiles) {
            if (tile.tapped) continue;
            if (y >= tile.y && y < tile.y + tileH) {
                if (col === tile.blackCol) {
                    tile.tapped = true;
                    score++;
                    updateScore();
                    tapped = true;
                } else {
                    // Tapped white tile
                    gameOver();
                }
                break;
            }
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

    function updateScore() {
        document.querySelector('.score').textContent = score;
    }

    function draw() {
        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        // Draw tiles
        for (let tile of tiles) {
            for (let col = 0; col < COLS; col++) {
                const x = col * tileW;
                const y = tile.y;
                
                if (col === tile.blackCol && !tile.tapped) {
                    // Black tile with gradient
                    const grad = ctx.createLinearGradient(x, y, x, y + tileH);
                    grad.addColorStop(0, '#2d2d44');
                    grad.addColorStop(1, '#1a1a2e');
                    ctx.fillStyle = grad;
                } else if (col === tile.blackCol && tile.tapped) {
                    // Tapped tile - gray
                    ctx.fillStyle = '#4a4a6a';
                } else {
                    // White tile
                    ctx.fillStyle = '#f0f0f5';
                }
                
                ctx.fillRect(x + 1, y + 1, tileW - 2, tileH - 2);
            }
        }
        
        // Draw grid lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        
        for (let i = 1; i < COLS; i++) {
            ctx.beginPath();
            ctx.moveTo(i * tileW, 0);
            ctx.lineTo(i * tileW, height);
            ctx.stroke();
        }
    }

    window.addEventListener('load', init);
})();
