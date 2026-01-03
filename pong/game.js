// Pong - Classic paddle game
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let player, ai, ball;
    let playerScore = 0, aiScore = 0;
    let gameState = 'start';
    let lastTime = 0;

    const PADDLE_WIDTH = 15;
    const PADDLE_HEIGHT = 100;
    const BALL_SIZE = 15;
    const WIN_SCORE = 5;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);
        setupControls();

        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
        
        // Draw idle preview
        drawIdlePreview();
    }
    
    function drawIdlePreview() {
        // Initialize preview state
        player = { y: height / 2 - PADDLE_HEIGHT / 2 };
        ai = { y: height / 2 - PADDLE_HEIGHT / 2 };
        ball = {
            x: width / 2,
            y: height / 2,
            vx: 0,
            vy: 0
        };
        
        draw();
        
        // Animate ball and paddles
        let animTime = 0;
        function animateIdle() {
            if (gameState === 'playing') return;
            
            animTime += 0.03;
            
            // Ball moves in a figure-8 pattern
            ball.x = width / 2 + Math.sin(animTime) * 100;
            ball.y = height / 2 + Math.sin(animTime * 2) * 50;
            
            // Paddles follow ball
            player.y = ball.y - PADDLE_HEIGHT / 2 + Math.sin(animTime * 0.5) * 20;
            ai.y = ball.y - PADDLE_HEIGHT / 2 - Math.sin(animTime * 0.5) * 20;
            
            // Clamp paddles
            player.y = Math.max(0, Math.min(height - PADDLE_HEIGHT, player.y));
            ai.y = Math.max(0, Math.min(height - PADDLE_HEIGHT, ai.y));
            
            draw();
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function startGame() {
        player = { y: height / 2 - PADDLE_HEIGHT / 2 };
        ai = { y: height / 2 - PADDLE_HEIGHT / 2 };
        playerScore = 0;
        aiScore = 0;
        
        resetBall();
        gameState = 'playing';

        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function resetBall() {
        ball = {
            x: width / 2,
            y: height / 2,
            vx: (Math.random() > 0.5 ? 1 : -1) * 6,
            vy: (Math.random() - 0.5) * 8
        };
    }

    function setupControls() {
        document.addEventListener('touchmove', (e) => {
            if (gameState !== 'playing') return;
            player.y = e.touches[0].clientY - PADDLE_HEIGHT / 2;
            player.y = Math.max(0, Math.min(height - PADDLE_HEIGHT, player.y));
        }, { passive: true });
        
        document.addEventListener('mousemove', (e) => {
            if (gameState !== 'playing') return;
            player.y = e.clientY - PADDLE_HEIGHT / 2;
            player.y = Math.max(0, Math.min(height - PADDLE_HEIGHT, player.y));
        });
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
        
        // Top/bottom bounce - clamp ball within bounds
        if (ball.y <= 0) {
            ball.vy = Math.abs(ball.vy);
            ball.y = 0;
        }
        if (ball.y >= height - BALL_SIZE) {
            ball.vy = -Math.abs(ball.vy);
            ball.y = height - BALL_SIZE;
        }
        
        // AI movement
        const aiCenter = ai.y + PADDLE_HEIGHT / 2;
        const ballCenter = ball.y + BALL_SIZE / 2;
        const aiSpeed = 4;
        
        if (aiCenter < ballCenter - 20) ai.y += aiSpeed * dt;
        if (aiCenter > ballCenter + 20) ai.y -= aiSpeed * dt;
        ai.y = Math.max(0, Math.min(height - PADDLE_HEIGHT, ai.y));
        
        // Player paddle collision (left side)
        if (ball.x <= 30 + PADDLE_WIDTH &&
            ball.y + BALL_SIZE > player.y &&
            ball.y < player.y + PADDLE_HEIGHT &&
            ball.vx < 0) {
            ball.vx = Math.abs(ball.vx) * 1.05;
            ball.vy += (ball.y - player.y - PADDLE_HEIGHT/2) * 0.1;
            ball.x = 30 + PADDLE_WIDTH + 1;
        }
        
        // AI paddle collision (right side)
        if (ball.x + BALL_SIZE >= width - 30 - PADDLE_WIDTH &&
            ball.y + BALL_SIZE > ai.y &&
            ball.y < ai.y + PADDLE_HEIGHT &&
            ball.vx > 0) {
            ball.vx = -Math.abs(ball.vx) * 1.05;
            ball.vy += (ball.y - ai.y - PADDLE_HEIGHT/2) * 0.1;
            ball.x = width - 30 - PADDLE_WIDTH - BALL_SIZE - 1;
        }
        
        // Scoring
        if (ball.x < -BALL_SIZE) {
            aiScore++;
            checkWin();
            resetBall();
        }
        if (ball.x > width + BALL_SIZE) {
            playerScore++;
            checkWin();
            resetBall();
        }
        
        // Cap ball speed
        const maxSpeed = 12;
        ball.vx = Math.max(-maxSpeed, Math.min(maxSpeed, ball.vx));
        ball.vy = Math.max(-maxSpeed, Math.min(maxSpeed, ball.vy));
    }

    function checkWin() {
        if (playerScore >= WIN_SCORE || aiScore >= WIN_SCORE) {
            gameState = 'gameover';
            document.getElementById('result').textContent = playerScore >= WIN_SCORE ? 'YOU WIN!' : 'YOU LOSE';
            document.getElementById('final-score').textContent = `${playerScore} - ${aiScore}`;

            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    type: 'gameOver', 
                    score: playerScore * 100 
                }));
            }
        }
    }

    function draw() {
        // Background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
        
        // Center line
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 15]);
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Scores
        ctx.fillStyle = '#333';
        ctx.font = 'bold 120px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(playerScore, width / 4, 120);
        ctx.fillText(aiScore, width * 3 / 4, 120);
        
        // Player paddle (left)
        const playerGrad = ctx.createLinearGradient(30, 0, 30 + PADDLE_WIDTH, 0);
        playerGrad.addColorStop(0, '#00d4ff');
        playerGrad.addColorStop(1, '#0099cc');
        ctx.fillStyle = playerGrad;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.roundRect(30, player.y, PADDLE_WIDTH, PADDLE_HEIGHT, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // AI paddle (right)
        const aiGrad = ctx.createLinearGradient(width - 30 - PADDLE_WIDTH, 0, width - 30, 0);
        aiGrad.addColorStop(0, '#ff6b6b');
        aiGrad.addColorStop(1, '#ee5a5a');
        ctx.fillStyle = aiGrad;
        ctx.shadowColor = '#ff6b6b';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.roundRect(width - 30 - PADDLE_WIDTH, ai.y, PADDLE_WIDTH, PADDLE_HEIGHT, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Ball
        if (ball) {
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(ball.x + BALL_SIZE/2, ball.y + BALL_SIZE/2, BALL_SIZE/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Touch zone indicator
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(0, 0, width / 3, height);
    }

    window.addEventListener('load', init);
})();
