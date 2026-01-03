// Basketball - Swipe to shoot hoops
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let ball, hoop, gameState;
    let score = 0, streak = 0, misses = 0;
    let swipeStart = null;
    let lastTime = 0;

    const GRAVITY = 0.4;
    const BALL_RADIUS = 25;

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
        
        // Draw idle preview
        drawIdlePreview();
    }
    
    function drawIdlePreview() {
        // Initialize preview state
        ball = {
            x: width / 2,
            y: height - 150,
            vx: 0,
            vy: 0,
            rotation: 0,
            flying: false,
            scored: false
        };
        
        hoop = {
            x: width / 2,
            y: 250,
            width: 80,
            rimWidth: 10
        };
        
        draw();
        
        // Animate ball bobbing
        let bobTime = 0;
        function animateIdle() {
            if (gameState === 'aiming' || gameState === 'flying') return;
            
            bobTime += 0.04;
            ball.y = height - 150 + Math.sin(bobTime) * 10;
            ball.rotation = Math.sin(bobTime * 0.7) * 0.2;
            draw();
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function startGame() {
        score = 0;
        streak = 0;
        misses = 0;
        gameState = 'aiming';
        
        resetBall();
        moveHoop();
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function resetBall() {
        ball = {
            x: width / 2,
            y: height - 150,
            vx: 0,
            vy: 0,
            rotation: 0,
            flying: false,
            scored: false
        };
    }

    function moveHoop() {
        hoop = {
            x: 100 + Math.random() * (width - 200),
            y: 200 + Math.random() * 150,
            width: 80,
            rimWidth: 10
        };
    }

    function setupControls() {
        canvas.addEventListener('touchstart', (e) => {
            if (gameState !== 'aiming') return;
            e.preventDefault();
            swipeStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            if (!swipeStart || gameState !== 'aiming') return;
            e.preventDefault();
            
            const end = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            const dx = end.x - swipeStart.x;
            const dy = end.y - swipeStart.y;
            const dt = Date.now() - swipeStart.time;
            
            if (dy < -30 && dt < 500) {
                const power = Math.min(Math.sqrt(dx*dx + dy*dy) / 10, 25);
                ball.vx = dx / 15;
                ball.vy = -power;
                ball.flying = true;
                gameState = 'flying';
            }
            
            swipeStart = null;
        });
    }

    function gameLoop(time) {
        if (gameState === 'gameover') return;
        
        const dt = Math.min((time - lastTime) / 16.67, 3);
        lastTime = time;
        
        update(dt);
        draw();
        
        requestAnimationFrame(gameLoop);
    }

    function update(dt) {
        if (!ball.flying) return;
        
        ball.vy += GRAVITY * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        ball.rotation += ball.vx * 0.05;
        
        // Check hoop collision
        const hoopLeft = hoop.x - hoop.width / 2;
        const hoopRight = hoop.x + hoop.width / 2;
        const hoopY = hoop.y;
        
        // Ball going through hoop
        if (!ball.scored && ball.vy > 0) {
            if (ball.x > hoopLeft + 10 && ball.x < hoopRight - 10 &&
                ball.y > hoopY - 10 && ball.y < hoopY + 20) {
                ball.scored = true;
                score += 10 + streak * 5;
                streak++;
                updateUI();
            }
        }
        
        // Rim collision
        const rimLeft = { x: hoopLeft, y: hoopY };
        const rimRight = { x: hoopRight, y: hoopY };
        
        if (distToPoint(ball, rimLeft) < BALL_RADIUS + hoop.rimWidth/2) {
            bounceOffRim(rimLeft);
        }
        if (distToPoint(ball, rimRight) < BALL_RADIUS + hoop.rimWidth/2) {
            bounceOffRim(rimRight);
        }
        
        // Ball off screen
        if (ball.y > height + 50 || ball.x < -50 || ball.x > width + 50) {
            if (!ball.scored) {
                streak = 0;
                misses++;
                updateUI();
                
                if (misses >= 3) {
                    gameOver();
                    return;
                }
            }
            
            gameState = 'aiming';
            resetBall();
            moveHoop();
        }
    }

    function distToPoint(ball, point) {
        return Math.sqrt((ball.x - point.x) ** 2 + (ball.y - point.y) ** 2);
    }

    function bounceOffRim(rim) {
        const dx = ball.x - rim.x;
        const dy = ball.y - rim.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Normalize and bounce
        const nx = dx / dist;
        const ny = dy / dist;
        
        const dot = ball.vx * nx + ball.vy * ny;
        ball.vx = (ball.vx - 2 * dot * nx) * 0.7;
        ball.vy = (ball.vy - 2 * dot * ny) * 0.7;
        
        // Push out
        ball.x = rim.x + nx * (BALL_RADIUS + hoop.rimWidth/2 + 1);
        ball.y = rim.y + ny * (BALL_RADIUS + hoop.rimWidth/2 + 1);
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

    function updateUI() {
        document.getElementById('score').textContent = score;
        document.getElementById('streak').textContent = streak;
    }

    function draw() {
        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#1a1a2e');
        grad.addColorStop(1, '#16213e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        // Court floor
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(0, height - 80, width, 80);
        
        // Court lines
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height - 80);
        ctx.lineTo(width, height - 80);
        ctx.stroke();
        
        // Backboard
        ctx.fillStyle = '#fff';
        ctx.fillRect(hoop.x - 50, hoop.y - 60, 100, 70);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.strokeRect(hoop.x - 50, hoop.y - 60, 100, 70);
        
        // Backboard square
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.strokeRect(hoop.x - 25, hoop.y - 45, 50, 35);
        
        // Hoop rim
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = hoop.rimWidth;
        ctx.beginPath();
        ctx.moveTo(hoop.x - hoop.width/2, hoop.y);
        ctx.lineTo(hoop.x + hoop.width/2, hoop.y);
        ctx.stroke();
        
        // Net
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const x = hoop.x - hoop.width/2 + 10 + i * 15;
            ctx.beginPath();
            ctx.moveTo(x, hoop.y);
            ctx.quadraticCurveTo(x + (i % 2 ? 5 : -5), hoop.y + 30, x, hoop.y + 50);
            ctx.stroke();
        }
        
        // Ball
        ctx.save();
        ctx.translate(ball.x, ball.y);
        ctx.rotate(ball.rotation);
        
        // Ball gradient
        const ballGrad = ctx.createRadialGradient(-5, -5, 0, 0, 0, BALL_RADIUS);
        ballGrad.addColorStop(0, '#f39c12');
        ballGrad.addColorStop(1, '#d35400');
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        // Ball lines
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-BALL_RADIUS, 0);
        ctx.lineTo(BALL_RADIUS, 0);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, -BALL_RADIUS);
        ctx.lineTo(0, BALL_RADIUS);
        ctx.stroke();
        
        ctx.restore();
        
        // Aiming indicator
        if (gameState === 'aiming' && swipeStart) {
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(ball.x, ball.y - 100);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Miss indicators
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(width/2 - 30 + i * 30, height - 30, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#e74c3c';
        for (let i = 0; i < misses; i++) {
            ctx.beginPath();
            ctx.arc(width/2 - 30 + i * 30, height - 30, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    window.addEventListener('load', init);
})();
