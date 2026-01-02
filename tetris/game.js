// Tetris - Classic block stacking
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    const COLS = 10;
    const ROWS = 20;
    const BLOCK = 28;
    
    canvas.width = COLS * BLOCK;
    canvas.height = ROWS * BLOCK;

    const COLORS = ['#00f0f0', '#0000f0', '#f0a000', '#f0f000', '#00f000', '#a000f0', '#f00000'];
    
    const SHAPES = [
        [[1,1,1,1]],
        [[1,0,0],[1,1,1]],
        [[0,0,1],[1,1,1]],
        [[1,1],[1,1]],
        [[0,1,1],[1,1,0]],
        [[0,1,0],[1,1,1]],
        [[1,1,0],[0,1,1]]
    ];

    let board = [];
    let current = null;
    let currentX, currentY, currentColor;
    let score = 0, level = 1, lines = 0;
    let dropTime = 0, dropInterval = 1000;
    let gameState = 'start';
    let lastTime = 0;

    function init() {
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        
        // Button controls
        document.getElementById('btn-left').addEventListener('touchstart', (e) => { e.preventDefault(); move(-1); });
        document.getElementById('btn-right').addEventListener('touchstart', (e) => { e.preventDefault(); move(1); });
        document.getElementById('btn-down').addEventListener('touchstart', (e) => { e.preventDefault(); drop(); });
        document.getElementById('btn-rotate').addEventListener('touchstart', (e) => { e.preventDefault(); rotate(); });
        
        // Swipe controls
        let touchStartX, touchStartY;
        canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        canvas.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                move(dx > 0 ? 1 : -1);
            } else if (dy > 30) {
                drop();
            } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
                rotate();
            }
        });
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (gameState !== 'playing') return;
            if (e.key === 'ArrowLeft') move(-1);
            if (e.key === 'ArrowRight') move(1);
            if (e.key === 'ArrowDown') drop();
            if (e.key === 'ArrowUp') rotate();
        });
        
        draw();
    }

    function startGame() {
        board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
        score = 0; level = 1; lines = 0;
        dropInterval = 1000;
        gameState = 'playing';
        
        spawnPiece();
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function spawnPiece() {
        const idx = Math.floor(Math.random() * SHAPES.length);
        current = SHAPES[idx].map(row => [...row]);
        currentColor = COLORS[idx];
        currentX = Math.floor((COLS - current[0].length) / 2);
        currentY = 0;
        
        if (collision(currentX, currentY, current)) {
            gameOver();
        }
    }

    function collision(x, y, piece) {
        for (let row = 0; row < piece.length; row++) {
            for (let col = 0; col < piece[row].length; col++) {
                if (piece[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
                    if (newY >= 0 && board[newY][newX]) return true;
                }
            }
        }
        return false;
    }

    function merge() {
        for (let row = 0; row < current.length; row++) {
            for (let col = 0; col < current[row].length; col++) {
                if (current[row][col]) {
                    const y = currentY + row;
                    if (y >= 0) board[y][currentX + col] = currentColor;
                }
            }
        }
    }

    function clearLines() {
        let cleared = 0;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== 0)) {
                board.splice(row, 1);
                board.unshift(Array(COLS).fill(0));
                cleared++;
                row++;
            }
        }
        if (cleared > 0) {
            lines += cleared;
            score += [0, 100, 300, 500, 800][cleared] * level;
            level = Math.floor(lines / 10) + 1;
            dropInterval = Math.max(100, 1000 - (level - 1) * 100);
            updateUI();
        }
    }

    function move(dir) {
        if (gameState !== 'playing') return;
        if (!collision(currentX + dir, currentY, current)) {
            currentX += dir;
        }
    }

    function rotate() {
        if (gameState !== 'playing') return;
        const rotated = current[0].map((_, i) => current.map(row => row[i]).reverse());
        if (!collision(currentX, currentY, rotated)) {
            current = rotated;
        }
    }

    function drop() {
        if (gameState !== 'playing') return;
        while (!collision(currentX, currentY + 1, current)) {
            currentY++;
        }
        merge();
        clearLines();
        spawnPiece();
    }

    function gameLoop(time) {
        if (gameState !== 'playing') return;
        
        const dt = time - lastTime;
        lastTime = time;
        dropTime += dt;
        
        if (dropTime > dropInterval) {
            dropTime = 0;
            if (!collision(currentX, currentY + 1, current)) {
                currentY++;
            } else {
                merge();
                clearLines();
                spawnPiece();
            }
        }
        
        draw();
        requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        gameState = 'gameover';
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('game-container').classList.add('hidden');
        
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
            lastTime = performance.now();
            requestAnimationFrame(gameLoop);
        }
    };

    function updateUI() {
        document.getElementById('score').textContent = score;
        document.getElementById('level').textContent = level;
        document.getElementById('lines').textContent = lines;
    }

    function draw() {
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw board
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (board[row][col]) {
                    drawBlock(col, row, board[row][col]);
                } else {
                    // Grid
                    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                    ctx.strokeRect(col * BLOCK, row * BLOCK, BLOCK, BLOCK);
                }
            }
        }
        
        // Draw current piece
        if (current) {
            for (let row = 0; row < current.length; row++) {
                for (let col = 0; col < current[row].length; col++) {
                    if (current[row][col]) {
                        drawBlock(currentX + col, currentY + row, currentColor);
                    }
                }
            }
        }
    }

    function drawBlock(x, y, color) {
        const px = x * BLOCK;
        const py = y * BLOCK;
        
        // Main block
        ctx.fillStyle = color;
        ctx.fillRect(px + 1, py + 1, BLOCK - 2, BLOCK - 2);
        
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(px + 1, py + 1, BLOCK - 2, 4);
        ctx.fillRect(px + 1, py + 1, 4, BLOCK - 2);
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(px + BLOCK - 5, py + 1, 4, BLOCK - 2);
        ctx.fillRect(px + 1, py + BLOCK - 5, BLOCK - 2, 4);
    }

    window.addEventListener('load', init);
})();
