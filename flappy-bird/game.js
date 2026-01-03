// Flappy Bird - Tap to fly
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let bird, pipes, score, gameState;
    let lastTime = 0;
    let groundOffset = 0;

    const GRAVITY = 0.5;
    const JUMP = -8;
    const PIPE_SPEED = 3;
    const PIPE_GAP = 150;
    const PIPE_WIDTH = 60;
    const BIRD_SIZE = 30;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);
        
        canvas.addEventListener('touchstart', flap, { passive: false });
        canvas.addEventListener('mousedown', flap);
        document.addEventListener('keydown', (e) => { if (e.code === 'Space') flap(e); });

        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
    }

    function startGame() {
        bird = {
            x: width * 0.3,
            y: height / 2,
            vy: 0,
            rotation: 0
        };
        pipes = [];
        score = 0;
        gameState = 'playing';
        
        addPipe();

        document.getElementById('ui').classList.remove('hidden');
        document.getElementById('score').textContent = '0';
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function addPipe() {
        const minY = 100;
        const maxY = height - 200 - PIPE_GAP;
        const gapY = minY + Math.random() * (maxY - minY);
        
        pipes.push({
            x: width + PIPE_WIDTH,
            gapY: gapY,
            scored: false
        });
    }

    function flap(e) {
        if (gameState !== 'playing') return;
        e.preventDefault();
        bird.vy = JUMP;
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
        // Bird physics
        bird.vy += GRAVITY * dt;
        bird.y += bird.vy * dt;
        bird.rotation = Math.min(Math.max(bird.vy * 3, -30), 90);
        
        // Ground collision
        const groundY = height - 80;
        if (bird.y + BIRD_SIZE / 2 > groundY) {
            gameOver();
            return;
        }
        
        // Ceiling
        if (bird.y - BIRD_SIZE / 2 < 0) {
            bird.y = BIRD_SIZE / 2;
            bird.vy = 0;
        }
        
        // Move pipes
        for (let pipe of pipes) {
            pipe.x -= PIPE_SPEED * dt;
            
            // Score
            if (!pipe.scored && pipe.x + PIPE_WIDTH < bird.x) {
                pipe.scored = true;
                score++;
                document.getElementById('score').textContent = score;
                // Report score to React Native for multiplayer
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'score', score: score }));
                }
            }
            
            // Collision
            if (bird.x + BIRD_SIZE / 2 > pipe.x && bird.x - BIRD_SIZE / 2 < pipe.x + PIPE_WIDTH) {
                if (bird.y - BIRD_SIZE / 2 < pipe.gapY || bird.y + BIRD_SIZE / 2 > pipe.gapY + PIPE_GAP) {
                    gameOver();
                    return;
                }
            }
        }
        
        // Remove off-screen pipes
        pipes = pipes.filter(p => p.x + PIPE_WIDTH > 0);
        
        // Add new pipes
        if (pipes.length === 0 || pipes[pipes.length - 1].x < width - 250) {
            addPipe();
        }
        
        // Ground scroll
        groundOffset = (groundOffset + PIPE_SPEED * dt) % 24;
    }

    function gameOver() {
        gameState = 'gameover';
        document.getElementById('final-score').textContent = score;
        
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
            lastTime = performance.now();
            requestAnimationFrame(gameLoop);
        }
    };

    function draw() {
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#4ec0ca');
        skyGrad.addColorStop(0.7, '#71c5cf');
        skyGrad.addColorStop(1, '#ded895');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);
        
        // Clouds
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for (let i = 0; i < 5; i++) {
            const cx = ((i * 200 + groundOffset * 0.5) % (width + 100)) - 50;
            const cy = 80 + (i % 3) * 60;
            drawCloud(cx, cy);
        }
        
        // Pipes
        for (let pipe of pipes) {
            drawPipe(pipe);
        }
        
        // Ground
        const groundY = height - 80;
        ctx.fillStyle = '#ded895';
        ctx.fillRect(0, groundY, width, 80);
        
        // Ground pattern
        ctx.fillStyle = '#d4c882';
        for (let x = -groundOffset; x < width + 24; x += 24) {
            ctx.fillRect(x, groundY, 12, 20);
        }
        
        ctx.fillStyle = '#5d8c51';
        ctx.fillRect(0, groundY, width, 15);
        
        // Bird
        drawBird();
    }

    function drawCloud(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 25, y - 10, 30, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 25, y + 10, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawPipe(pipe) {
        const groundY = height - 80;
        
        // Top pipe
        ctx.fillStyle = '#73bf2e';
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        
        // Top pipe cap
        ctx.fillStyle = '#5aa31a';
        ctx.fillRect(pipe.x - 5, pipe.gapY - 30, PIPE_WIDTH + 10, 30);
        
        // Bottom pipe
        ctx.fillStyle = '#73bf2e';
        ctx.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, groundY - pipe.gapY - PIPE_GAP);
        
        // Bottom pipe cap
        ctx.fillStyle = '#5aa31a';
        ctx.fillRect(pipe.x - 5, pipe.gapY + PIPE_GAP, PIPE_WIDTH + 10, 30);
        
        // Highlights
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(pipe.x + 5, 0, 10, pipe.gapY - 30);
        ctx.fillRect(pipe.x + 5, pipe.gapY + PIPE_GAP + 30, 10, groundY - pipe.gapY - PIPE_GAP - 30);
    }

    function drawBird() {
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(bird.rotation * Math.PI / 180);
        
        // Body
        ctx.fillStyle = '#f7dc6f';
        ctx.beginPath();
        ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Wing
        ctx.fillStyle = '#e8c547';
        ctx.beginPath();
        ctx.ellipse(-5, 3, 10, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(8, -5, 7, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(10, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(22, 3);
        ctx.lineTo(12, 6);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    window.addEventListener('load', init);
})();
