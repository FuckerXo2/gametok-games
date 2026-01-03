// Breakout - Classic brick breaker
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let paddle, ball, bricks;
    let score = 0, lives = 3;
    let gameState = 'preview'; // Start in preview mode
    let lastTime = 0;

    const PADDLE_WIDTH = 100;
    const PADDLE_HEIGHT = 15;
    const BALL_RADIUS = 8;
    const BRICK_ROWS = 6;
    const BRICK_COLS = 8;
    const BRICK_HEIGHT = 25;
    const BRICK_GAP = 4;
    
    const COLORS = ['#ff6b6b', '#ff9f43', '#feca57', '#1dd1a1', '#48dbfb', '#a55eea'];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        if (gameState === 'preview') drawPreview();
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);
        
        // Touch/mouse controls
        let touching = false;
        canvas.addEventListener('touchstart', (e) => { touching = true; movePaddle(e.touches[0].clientX); }, { passive: true });
        canvas.addEventListener('touchmove', (e) => { if (touching) movePaddle(e.touches[0].clientX); }, { passive: true });
        canvas.addEventListener('touchend', () => { touching = false; });
        canvas.addEventListener('mousemove', (e) => movePaddle(e.clientX));
        
        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
        
        // Show preview immediately
        setupPreview();
    }
    
    function setupPreview() {
        createBricks();
        paddle = { x: width / 2, y: height - 50 };
        ball = { x: width / 2, y: height - 100, vx: 0, vy: 0, speed: 6 };
        drawPreview();
    }
    
    function drawPreview() {
        draw();
    }

    function movePaddle(x) {
        if (gameState !== 'playing') return;
        paddle.x = Math.max(PADDLE_WIDTH / 2, Math.min(width - PADDLE_WIDTH / 2, x));
    }

    function startGame() {
        score = 0;
        lives = 3;
        createBricks();
        resetBall();
        gameState = 'playing';
        
        const ui = document.getElementById('ui');
        if (ui) ui.classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function createBricks() {
        bricks = [];
        const brickWidth = (width - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;
        
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                bricks.push({
                    x: BRICK_GAP + col * (brickWidth + BRICK_GAP) + brickWidth / 2,
                    y: 80 + row * (BRICK_HEIGHT + BRICK_GAP) + BRICK_HEIGHT / 2,
                    width: brickWidth,
                    height: BRICK_HEIGHT,
                    color: COLORS[row % COLORS.length],
                    alive: true
                });
            }
        }
    }

    function resetBall() {
        paddle = { x: width / 2, y: height - 50 };
        ball = {
            x: width / 2,
            y: height - 100,
            vx: (Math.random() - 0.5) * 6,
            vy: -6,
            speed: 6
        };
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
        // Move ball
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        
        // Wall collision
        if (ball.x - BALL_RADIUS < 0 || ball.x + BALL_RADIUS > width) {
            ball.vx = -ball.vx;
            ball.x = Math.max(BALL_RADIUS, Math.min(width - BALL_RADIUS, ball.x));
        }
        if (ball.y - BALL_RADIUS < 0) {
            ball.vy = -ball.vy;
            ball.y = BALL_RADIUS;
        }
        
        // Bottom - lose life
        if (ball.y + BALL_RADIUS > height) {
            lives--;
            updateUI();
            if (lives <= 0) {
                gameOver(false);
            } else {
                resetBall();
            }
            return;
        }
        
        // Paddle collision
        if (ball.vy > 0 &&
            ball.y + BALL_RADIUS > paddle.y - PADDLE_HEIGHT / 2 &&
            ball.y - BALL_RADIUS < paddle.y + PADDLE_HEIGHT / 2 &&
            ball.x > paddle.x - PADDLE_WIDTH / 2 &&
            ball.x < paddle.x + PADDLE_WIDTH / 2) {
            
            const hitPos = (ball.x - paddle.x) / (PADDLE_WIDTH / 2);
            ball.vx = hitPos * ball.speed;
            ball.vy = -Math.sqrt(ball.speed * ball.speed - ball.vx * ball.vx);
            ball.y = paddle.y - PADDLE_HEIGHT / 2 - BALL_RADIUS;
        }
        
        // Brick collision
        for (let brick of bricks) {
            if (!brick.alive) continue;
            
            if (ball.x + BALL_RADIUS > brick.x - brick.width / 2 &&
                ball.x - BALL_RADIUS < brick.x + brick.width / 2 &&
                ball.y + BALL_RADIUS > brick.y - brick.height / 2 &&
                ball.y - BALL_RADIUS < brick.y + brick.height / 2) {
                
                brick.alive = false;
                score += 10;
                updateUI();
                
                // Determine bounce direction
                const overlapX = Math.min(
                    ball.x + BALL_RADIUS - (brick.x - brick.width / 2),
                    (brick.x + brick.width / 2) - (ball.x - BALL_RADIUS)
                );
                const overlapY = Math.min(
                    ball.y + BALL_RADIUS - (brick.y - brick.height / 2),
                    (brick.y + brick.height / 2) - (ball.y - BALL_RADIUS)
                );
                
                if (overlapX < overlapY) {
                    ball.vx = -ball.vx;
                } else {
                    ball.vy = -ball.vy;
                }
                
                break;
            }
        }
        
        // Check win
        if (bricks.every(b => !b.alive)) {
            gameOver(true);
        }
    }

    function gameOver(won) {
        gameState = 'gameover';
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    function updateUI() {
        const scoreEl = document.getElementById('score');
        const livesEl = document.getElementById('lives');
        if (scoreEl) scoreEl.textContent = score;
        if (livesEl) livesEl.textContent = lives;
    }

    function draw() {
        // Background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, width, height);
        
        // Bricks
        for (let brick of bricks) {
            if (!brick.alive) continue;
            
            ctx.fillStyle = brick.color;
            ctx.beginPath();
            ctx.roundRect(
                brick.x - brick.width / 2,
                brick.y - brick.height / 2,
                brick.width,
                brick.height,
                4
            );
            ctx.fill();
            
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(
                brick.x - brick.width / 2 + 3,
                brick.y - brick.height / 2 + 3,
                brick.width - 6,
                4
            );
        }
        
        // Paddle
        const paddleGrad = ctx.createLinearGradient(
            paddle.x - PADDLE_WIDTH / 2, paddle.y,
            paddle.x + PADDLE_WIDTH / 2, paddle.y
        );
        paddleGrad.addColorStop(0, '#4a4a8a');
        paddleGrad.addColorStop(0.5, '#6a6aaa');
        paddleGrad.addColorStop(1, '#4a4a8a');
        ctx.fillStyle = paddleGrad;
        ctx.beginPath();
        ctx.roundRect(
            paddle.x - PADDLE_WIDTH / 2,
            paddle.y - PADDLE_HEIGHT / 2,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
            8
        );
        ctx.fill();
        
        // Ball
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        // Ball glow
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    window.addEventListener('load', init);
})();
