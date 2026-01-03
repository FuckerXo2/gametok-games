// Golf Putt - Drag to aim and putt
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let ball, hole, obstacles;
    let gameState = 'start';
    let currentHole = 1;
    let totalStrokes = 0;
    let holeStrokes = 0;
    let dragStart = null;
    let lastTime = 0;

    const BALL_RADIUS = 12;
    const HOLE_RADIUS = 18;
    const FRICTION = 0.98;
    const PAR = 27; // 3 per hole

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
    }

    function startGame() {
        currentHole = 1;
        totalStrokes = 0;
        
        setupHole();
        gameState = 'aiming';
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function setupHole() {
        holeStrokes = 0;
        obstacles = [];
        
        // Ball starts at bottom
        ball = {
            x: width / 2,
            y: height - 150,
            vx: 0,
            vy: 0
        };
        
        // Hole position varies by level
        const holePositions = [
            { x: 0.5, y: 0.25 },
            { x: 0.3, y: 0.2 },
            { x: 0.7, y: 0.3 },
            { x: 0.5, y: 0.15 },
            { x: 0.2, y: 0.25 },
            { x: 0.8, y: 0.2 },
            { x: 0.5, y: 0.2 },
            { x: 0.4, y: 0.15 },
            { x: 0.6, y: 0.25 }
        ];
        
        const pos = holePositions[(currentHole - 1) % holePositions.length];
        hole = {
            x: width * pos.x,
            y: height * pos.y
        };
        
        // Add obstacles for harder holes
        if (currentHole >= 3) {
            obstacles.push({
                x: width * 0.3,
                y: height * 0.5,
                width: 20,
                height: 100
            });
        }
        if (currentHole >= 5) {
            obstacles.push({
                x: width * 0.6,
                y: height * 0.4,
                width: 20,
                height: 80
            });
        }
        if (currentHole >= 7) {
            obstacles.push({
                x: width * 0.5 - 50,
                y: height * 0.35,
                width: 100,
                height: 15
            });
        }
    }

    function setupControls() {
        canvas.addEventListener('touchstart', (e) => {
            if (gameState !== 'aiming') return;
            e.preventDefault();
            dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            if (!dragStart || gameState !== 'aiming') return;
            e.preventDefault();
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            if (!dragStart || gameState !== 'aiming') return;
            e.preventDefault();
            
            const end = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            shoot(dragStart, end);
            dragStart = null;
        });

        canvas.addEventListener('mousedown', (e) => {
            if (gameState !== 'aiming') return;
            dragStart = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mouseup', (e) => {
            if (!dragStart || gameState !== 'aiming') return;
            shoot(dragStart, { x: e.clientX, y: e.clientY });
            dragStart = null;
        });
    }

    function shoot(start, end) {
        const dx = start.x - end.x;
        const dy = start.y - end.y;
        const power = Math.min(Math.sqrt(dx*dx + dy*dy) / 10, 20);
        
        if (power < 1) return;
        
        const angle = Math.atan2(dy, dx);
        ball.vx = Math.cos(angle) * power;
        ball.vy = Math.sin(angle) * power;
        
        holeStrokes++;
        totalStrokes++;
        gameState = 'rolling';
        updateUI();
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
        if (gameState !== 'rolling') return;
        
        // Apply velocity
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        
        // Apply friction
        ball.vx *= FRICTION;
        ball.vy *= FRICTION;
        
        // Wall bounces
        if (ball.x < BALL_RADIUS) {
            ball.x = BALL_RADIUS;
            ball.vx *= -0.8;
        }
        if (ball.x > width - BALL_RADIUS) {
            ball.x = width - BALL_RADIUS;
            ball.vx *= -0.8;
        }
        if (ball.y < BALL_RADIUS) {
            ball.y = BALL_RADIUS;
            ball.vy *= -0.8;
        }
        if (ball.y > height - BALL_RADIUS) {
            ball.y = height - BALL_RADIUS;
            ball.vy *= -0.8;
        }
        
        // Obstacle collisions
        for (let obs of obstacles) {
            if (ball.x + BALL_RADIUS > obs.x &&
                ball.x - BALL_RADIUS < obs.x + obs.width &&
                ball.y + BALL_RADIUS > obs.y &&
                ball.y - BALL_RADIUS < obs.y + obs.height) {
                
                // Simple bounce
                const fromLeft = ball.x < obs.x;
                const fromRight = ball.x > obs.x + obs.width;
                const fromTop = ball.y < obs.y;
                const fromBottom = ball.y > obs.y + obs.height;
                
                if (fromLeft || fromRight) {
                    ball.vx *= -0.8;
                    ball.x = fromLeft ? obs.x - BALL_RADIUS : obs.x + obs.width + BALL_RADIUS;
                }
                if (fromTop || fromBottom) {
                    ball.vy *= -0.8;
                    ball.y = fromTop ? obs.y - BALL_RADIUS : obs.y + obs.height + BALL_RADIUS;
                }
            }
        }
        
        // Check if ball in hole
        const dist = Math.sqrt((ball.x - hole.x) ** 2 + (ball.y - hole.y) ** 2);
        if (dist < HOLE_RADIUS - 5 && Math.abs(ball.vx) < 3 && Math.abs(ball.vy) < 3) {
            // Ball in hole!
            ball.x = hole.x;
            ball.y = hole.y;
            ball.vx = 0;
            ball.vy = 0;
            
            setTimeout(() => {
                if (currentHole >= 9) {
                    gameOver();
                } else {
                    currentHole++;
                    setupHole();
                    gameState = 'aiming';
                    updateUI();
                }
            }, 500);
            return;
        }
        
        // Stop when slow enough
        if (Math.abs(ball.vx) < 0.1 && Math.abs(ball.vy) < 0.1) {
            ball.vx = 0;
            ball.vy = 0;
            gameState = 'aiming';
        }
    }

    function gameOver() {
        gameState = 'gameover';
        
        const diff = totalStrokes - PAR;
        let result = 'GAME COMPLETE!';
        if (diff <= -5) result = 'AMAZING!';
        else if (diff < 0) result = 'UNDER PAR!';
        else if (diff === 0) result = 'PAR!';
        else result = 'OVER PAR';
        
        document.getElementById('result').textContent = result;
        document.getElementById('final-score').textContent = totalStrokes;
        document.getElementById('score-text').textContent = diff === 0 ? 'Even par!' : 
            (diff > 0 ? `+${diff} over par` : `${diff} under par`);
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('ui').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'gameOver', 
                score: Math.max(0, PAR * 2 - totalStrokes) * 10 
            }));
        }
    }

    function updateUI() {
        document.getElementById('hole').textContent = currentHole;
        document.getElementById('strokes').textContent = totalStrokes;
    }

    function draw() {
        // Green background
        ctx.fillStyle = '#228b22';
        ctx.fillRect(0, 0, width, height);
        
        // Grass texture
        ctx.fillStyle = 'rgba(0,100,0,0.3)';
        for (let i = 0; i < 100; i++) {
            const x = (i * 47) % width;
            const y = (i * 73) % height;
            ctx.fillRect(x, y, 3, 8);
        }
        
        // Obstacles (sand traps look)
        ctx.fillStyle = '#c2b280';
        for (let obs of obstacles) {
            ctx.beginPath();
            ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 5);
            ctx.fill();
        }
        
        // Hole
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, HOLE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        // Hole rim
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, HOLE_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
        
        // Flag
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(hole.x + HOLE_RADIUS - 3, hole.y - 80, 4, 80);
        
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(hole.x + HOLE_RADIUS + 1, hole.y - 80);
        ctx.lineTo(hole.x + HOLE_RADIUS + 35, hole.y - 65);
        ctx.lineTo(hole.x + HOLE_RADIUS + 1, hole.y - 50);
        ctx.closePath();
        ctx.fill();
        
        // Ball
        const ballGrad = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 0, ball.x, ball.y, BALL_RADIUS);
        ballGrad.addColorStop(0, '#fff');
        ballGrad.addColorStop(1, '#ddd');
        ctx.fillStyle = ballGrad;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Aim line when dragging
        if (dragStart && gameState === 'aiming') {
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            
            // Show direction (opposite of drag)
            const dx = dragStart.x - ball.x;
            const dy = dragStart.y - ball.y;
            ctx.lineTo(ball.x + dx, ball.y + dy);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Power indicator
            const power = Math.min(Math.sqrt(dx*dx + dy*dy) / 10, 20);
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Power: ${Math.round(power * 5)}%`, width / 2, height - 50);
        }
    }

    window.addEventListener('load', init);
})();
