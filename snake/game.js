// Snake - Classic snake game
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    const GRID = 20;
    const SIZE = 15;
    
    canvas.width = GRID * SIZE;
    canvas.height = GRID * SIZE;

    let snake = [];
    let food = {};
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let score = 0;
    let gameState = 'start';
    let lastMove = 0;
    let speed = 150;

    function init() {
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        setupControls();
        draw();
    }

    function startGame() {
        snake = [
            { x: 7, y: 7 },
            { x: 6, y: 7 },
            { x: 5, y: 7 }
        ];
        dir = { x: 1, y: 0 };
        nextDir = { x: 1, y: 0 };
        score = 0;
        speed = 150;
        spawnFood();
        gameState = 'playing';
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        updateScore();
        
        requestAnimationFrame(gameLoop);
    }

    function spawnFood() {
        do {
            food = {
                x: Math.floor(Math.random() * GRID),
                y: Math.floor(Math.random() * GRID)
            };
        } while (snake.some(s => s.x === food.x && s.y === food.y));
    }

    function gameLoop(time) {
        if (gameState !== 'playing') return;
        
        if (time - lastMove > speed) {
            lastMove = time;
            update();
        }
        
        draw();
        requestAnimationFrame(gameLoop);
    }

    function update() {
        dir = { ...nextDir };
        
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        
        // Wrap around
        if (head.x < 0) head.x = GRID - 1;
        if (head.x >= GRID) head.x = 0;
        if (head.y < 0) head.y = GRID - 1;
        if (head.y >= GRID) head.y = 0;
        
        // Check self collision
        if (snake.some(s => s.x === head.x && s.y === head.y)) {
            gameOver();
            return;
        }
        
        snake.unshift(head);
        
        // Check food
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            speed = Math.max(50, speed - 2);
            updateScore();
            spawnFood();
        } else {
            snake.pop();
        }
    }

    function draw() {
        ctx.fillStyle = '#16213e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(78, 204, 163, 0.1)';
        for (let i = 0; i <= GRID; i++) {
            ctx.beginPath();
            ctx.moveTo(i * SIZE, 0);
            ctx.lineTo(i * SIZE, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * SIZE);
            ctx.lineTo(canvas.width, i * SIZE);
            ctx.stroke();
        }
        
        // Draw snake
        snake.forEach((segment, i) => {
            const x = segment.x * SIZE;
            const y = segment.y * SIZE;
            
            if (i === 0) {
                // Head
                ctx.fillStyle = '#4ecca3';
                ctx.beginPath();
                ctx.roundRect(x + 1, y + 1, SIZE - 2, SIZE - 2, 4);
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = '#1a1a2e';
                const eyeOffset = 3;
                if (dir.x === 1) {
                    ctx.beginPath();
                    ctx.arc(x + SIZE - 5, y + eyeOffset + 2, 2, 0, Math.PI * 2);
                    ctx.arc(x + SIZE - 5, y + SIZE - eyeOffset - 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (dir.x === -1) {
                    ctx.beginPath();
                    ctx.arc(x + 5, y + eyeOffset + 2, 2, 0, Math.PI * 2);
                    ctx.arc(x + 5, y + SIZE - eyeOffset - 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (dir.y === 1) {
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset + 2, y + SIZE - 5, 2, 0, Math.PI * 2);
                    ctx.arc(x + SIZE - eyeOffset - 2, y + SIZE - 5, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset + 2, y + 5, 2, 0, Math.PI * 2);
                    ctx.arc(x + SIZE - eyeOffset - 2, y + 5, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Body
                const alpha = 1 - (i / snake.length) * 0.5;
                ctx.fillStyle = `rgba(78, 204, 163, ${alpha})`;
                ctx.beginPath();
                ctx.roundRect(x + 2, y + 2, SIZE - 4, SIZE - 4, 3);
                ctx.fill();
            }
        });
        
        // Draw food
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(food.x * SIZE + SIZE / 2, food.y * SIZE + SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Food shine
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(food.x * SIZE + SIZE / 2 - 2, food.y * SIZE + SIZE / 2 - 2, 3, 0, Math.PI * 2);
        ctx.fill();
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

    // Pause/Resume for React Native
    window.gamePause = function() {
        if (gameState === 'playing') {
            gameState = 'paused';
        }
    };
    
    window.gameResume = function() {
        if (gameState === 'paused') {
            gameState = 'playing';
            lastMove = performance.now();
            requestAnimationFrame(gameLoop);
        }
    };

    function updateScore() {
        document.getElementById('score').textContent = score;
    }

    function setupControls() {
        let startX, startY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            const minSwipe = 20;
            
            if (Math.abs(dx) > minSwipe || Math.abs(dy) > minSwipe) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0 && dir.x !== -1) nextDir = { x: 1, y: 0 };
                    else if (dx < 0 && dir.x !== 1) nextDir = { x: -1, y: 0 };
                } else {
                    if (dy > 0 && dir.y !== -1) nextDir = { x: 0, y: 1 };
                    else if (dy < 0 && dir.y !== 1) nextDir = { x: 0, y: -1 };
                }
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' && dir.y !== 1) nextDir = { x: 0, y: -1 };
            if (e.key === 'ArrowDown' && dir.y !== -1) nextDir = { x: 0, y: 1 };
            if (e.key === 'ArrowLeft' && dir.x !== 1) nextDir = { x: -1, y: 0 };
            if (e.key === 'ArrowRight' && dir.x !== -1) nextDir = { x: 1, y: 0 };
        });
    }

    window.addEventListener('load', init);
})();
