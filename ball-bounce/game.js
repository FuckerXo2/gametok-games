// Ball Bounce - Tap to bounce on platforms
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let ball, platforms, score, bestScore;
    let gameState = 'start';
    let lastTime = 0;

    const GRAVITY = 0.35;
    const BOUNCE_FORCE = -14;
    const BALL_RADIUS = 20;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);
        bestScore = parseInt(localStorage.getItem('ballBounce_best') || '0');
        document.getElementById('best').textContent = bestScore;
        
        setupControls();

        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
        
        // Draw idle preview
        drawIdlePreview();
    }
    
    function drawIdlePreview() {
        // Initialize preview state
        ball = {
            x: width / 2,
            y: height / 2,
            vy: 0,
            rotation: 0
        };
        
        platforms = [];
        // Create some preview platforms
        for (let i = 0; i < 5; i++) {
            platforms.push({
                x: Math.random() * (width - 100) + 20,
                y: height - 150 - i * 100,
                width: 80 + Math.random() * 40,
                height: 15,
                color: `hsl(${i * 60}, 70%, 50%)`,
                scored: false
            });
        }
        
        draw();
        
        // Animate ball bobbing
        let bobTime = 0;
        function animateIdle() {
            if (gameState === 'playing') return;
            
            bobTime += 0.04;
            ball.y = height / 2 + Math.sin(bobTime) * 20;
            ball.rotation = Math.sin(bobTime * 0.5) * 0.3;
            draw();
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function startGame() {
        ball = {
            x: width / 2,
            y: height / 2,
            vy: 0,
            rotation: 0
        };
        
        platforms = [];
        score = 0;
        
        // Generate initial platforms
        for (let i = 0; i < 8; i++) {
            platforms.push(createPlatform(height - 100 - i * 100));
        }
        
        gameState = 'playing';

        document.getElementById('ui').classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function createPlatform(y) {
        const platWidth = 80 + Math.random() * 60;
        return {
            x: Math.random() * (width - platWidth),
            y: y,
            width: platWidth,
            height: 15,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            scored: false
        };
    }

    function setupControls() {
        const bounce = () => {
            if (gameState !== 'playing') return;
            if (ball.vy > 0) {
                ball.vy = BOUNCE_FORCE;
            }
        };
        
        document.addEventListener('touchstart', bounce, { passive: true });
        document.addEventListener('mousedown', bounce);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') bounce();
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
        // Apply gravity
        ball.vy += GRAVITY * dt;
        ball.y += ball.vy * dt;
        ball.rotation += ball.vy * 0.02;
        
        // Scroll screen when ball goes above middle
        if (ball.y < height / 2) {
            const scroll = height / 2 - ball.y;
            ball.y = height / 2;
            
            for (let plat of platforms) {
                plat.y += scroll;
            }
        }
        
        // Check platform collisions (only when falling)
        if (ball.vy > 0) {
            for (let plat of platforms) {
                if (ball.x > plat.x - BALL_RADIUS &&
                    ball.x < plat.x + plat.width + BALL_RADIUS &&
                    ball.y + BALL_RADIUS > plat.y &&
                    ball.y + BALL_RADIUS < plat.y + plat.height + ball.vy * 2) {
                    
                    ball.y = plat.y - BALL_RADIUS;
                    ball.vy = BOUNCE_FORCE;
                    
                    if (!plat.scored) {
                        plat.scored = true;
                        score++;
                        updateUI();
                    }
                }
            }
        }
        
        // Remove platforms below screen and add new ones
        platforms = platforms.filter(p => p.y < height + 50);
        
        while (platforms.length < 8) {
            const topPlat = platforms.reduce((min, p) => p.y < min.y ? p : min, platforms[0]);
            platforms.push(createPlatform(topPlat.y - 80 - Math.random() * 40));
        }
        
        // Game over if fall below screen
        if (ball.y > height + 50) {
            gameOver();
        }
    }

    function gameOver() {
        gameState = 'gameover';
        
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('ballBounce_best', bestScore.toString());
        }
        
        document.getElementById('final-score').textContent = score;
        
        document.getElementById('ui').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    function updateUI() {
        document.getElementById('score').textContent = score;
        document.getElementById('best').textContent = bestScore;
    }

    function draw() {
        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#1a1a2e');
        grad.addColorStop(1, '#16213e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        // Platforms
        for (let plat of platforms) {
            ctx.fillStyle = plat.color;
            ctx.shadowColor = plat.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 8);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Ball
        ctx.save();
        ctx.translate(ball.x, ball.y);
        ctx.rotate(ball.rotation);
        
        // Ball gradient
        const ballGrad = ctx.createRadialGradient(-5, -5, 0, 0, 0, BALL_RADIUS);
        ballGrad.addColorStop(0, '#ff8a65');
        ballGrad.addColorStop(1, '#ff5722');
        ctx.fillStyle = ballGrad;
        ctx.shadowColor = '#ff5722';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        // Ball pattern
        ctx.strokeStyle = '#fff';
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
    }

    window.addEventListener('load', init);
})();
