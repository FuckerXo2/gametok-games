// Geometry Dash - Tap to jump, avoid obstacles
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let player, obstacles, particles;
    let gameState = 'start';
    let lastTime = 0;
    let distance = 0;
    let speed = 6;
    let groundY;
    let nextObstacleX = 400;

    const GRAVITY = 0.8;
    const JUMP_FORCE = -15;
    const PLAYER_SIZE = 40;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        groundY = height - 100;
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
        groundY = height - 100;
        player = {
            x: 100,
            y: groundY - PLAYER_SIZE,
            vy: 0,
            rotation: 0,
            onGround: true
        };
        
        obstacles = [];
        particles = [];
        distance = 0;
        
        // Add some preview obstacles
        obstacles.push({ type: 'spike', x: 300, y: groundY, width: 40, height: 40 });
        obstacles.push({ type: 'spike', x: 500, y: groundY, width: 40, height: 40 });
        obstacles.push({ type: 'block', x: 700, y: groundY - 50, width: 50, height: 50 });
        
        draw();
        
        // Animate player with subtle effects
        let pulseTime = 0;
        function animateIdle() {
            if (gameState === 'playing') return;
            
            pulseTime += 0.04;
            
            // Redraw with pulsing player
            draw();
            
            // Draw pulsing player overlay
            ctx.save();
            ctx.translate(player.x + PLAYER_SIZE/2, player.y + PLAYER_SIZE/2);
            
            const scale = 1 + Math.sin(pulseTime) * 0.05;
            ctx.scale(scale, scale);
            
            ctx.fillStyle = '#00d4ff';
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 20 + Math.sin(pulseTime) * 10;
            ctx.fillRect(-PLAYER_SIZE/2, -PLAYER_SIZE/2, PLAYER_SIZE, PLAYER_SIZE);
            
            ctx.fillStyle = '#0099cc';
            ctx.fillRect(-PLAYER_SIZE/4, -PLAYER_SIZE/4, PLAYER_SIZE/2, PLAYER_SIZE/2);
            
            ctx.shadowBlur = 0;
            ctx.restore();
            
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function startGame() {
        player = {
            x: 100,
            y: groundY - PLAYER_SIZE,
            vy: 0,
            rotation: 0,
            onGround: true
        };
        
        obstacles = [];
        particles = [];
        distance = 0;
        speed = 6;
        nextObstacleX = 400;
        
        // Generate initial obstacles
        generateMoreObstacles();
        
        gameState = 'playing';

        document.getElementById('ui').classList.remove('hidden');
        document.getElementById('progress').classList.add('hidden'); // Hide progress bar - endless mode
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function generateMoreObstacles() {
        // Generate obstacles ahead of the player
        while (nextObstacleX < distance + width + 500) {
            const type = Math.random();
            
            if (type < 0.5) {
                // Spike
                obstacles.push({ type: 'spike', x: nextObstacleX, y: groundY, width: 40, height: 40 });
            } else if (type < 0.75) {
                // Block
                obstacles.push({ type: 'block', x: nextObstacleX, y: groundY - 50, width: 50, height: 50 });
            } else {
                // Double spike
                obstacles.push({ type: 'spike', x: nextObstacleX, y: groundY, width: 40, height: 40 });
                obstacles.push({ type: 'spike', x: nextObstacleX + 45, y: groundY, width: 40, height: 40 });
            }
            
            nextObstacleX += 200 + Math.random() * 200;
        }
        
        // Remove obstacles that are far behind
        obstacles = obstacles.filter(obs => obs.x > distance - 200);
    }

    function setupControls() {
        const jump = () => {
            if (gameState !== 'playing') return;
            if (player.onGround) {
                player.vy = JUMP_FORCE;
                player.onGround = false;
            }
        };
        
        document.addEventListener('touchstart', jump, { passive: true });
        document.addEventListener('mousedown', jump);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') jump();
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
        // Move world
        distance += speed * dt;
        
        // Gradually increase speed
        speed = 6 + Math.floor(distance / 500) * 0.5;
        if (speed > 15) speed = 15;
        
        // Generate more obstacles as we go
        generateMoreObstacles();
        
        // Apply gravity
        player.vy += GRAVITY * dt;
        player.y += player.vy * dt;
        
        // Ground collision
        if (player.y >= groundY - PLAYER_SIZE) {
            player.y = groundY - PLAYER_SIZE;
            player.vy = 0;
            player.onGround = true;
        }
        
        // Rotate player
        if (!player.onGround) {
            player.rotation += 0.15 * dt;
        } else {
            player.rotation = Math.round(player.rotation / (Math.PI/2)) * (Math.PI/2);
        }
        
        // Check collisions
        for (let obs of obstacles) {
            const obsX = obs.x - distance;
            
            if (obsX < -100 || obsX > width + 100) continue;
            
            if (obs.type === 'spike') {
                // Triangle collision (simplified)
                const cx = obsX + obs.width / 2;
                const cy = obs.y - obs.height / 2;
                
                if (player.x + PLAYER_SIZE > obsX + 10 &&
                    player.x < obsX + obs.width - 10 &&
                    player.y + PLAYER_SIZE > obs.y - obs.height + 10) {
                    crash();
                    return;
                }
            } else if (obs.type === 'block') {
                if (player.x + PLAYER_SIZE > obsX &&
                    player.x < obsX + obs.width &&
                    player.y + PLAYER_SIZE > obs.y &&
                    player.y < obs.y + obs.height) {
                    crash();
                    return;
                }
            }
        }
        
        // Spawn particles
        if (Math.random() < 0.3) {
            particles.push({
                x: player.x + PLAYER_SIZE/2,
                y: player.y + PLAYER_SIZE,
                vx: -speed * 0.5,
                vy: -Math.random() * 2,
                life: 1,
                color: `hsl(${180 + Math.random() * 60}, 100%, 50%)`
            });
        }
        
        // Update particles
        for (let p of particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= 0.03 * dt;
        }
        particles = particles.filter(p => p.life > 0);
        
        // Limit particles to prevent memory issues
        if (particles.length > 100) {
            particles = particles.slice(-100);
        }
        
        updateUI();
    }

    function crash() {
        gameState = 'gameover';
        
        // Explosion particles
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: player.x + PLAYER_SIZE/2,
                y: player.y + PLAYER_SIZE/2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                life: 1,
                color: '#00d4ff'
            });
        }
        
        const score = Math.floor(distance / 10);
        document.getElementById('final-score').textContent = score;
        
        document.getElementById('ui').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    function updateUI() {
        const score = Math.floor(distance / 10);
        document.getElementById('score').textContent = score;
    }

    function draw() {
        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#0f0c29');
        grad.addColorStop(0.5, '#302b63');
        grad.addColorStop(1, '#24243e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        // Stars
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            const x = ((i * 137 + distance * 0.1) % (width + 100)) - 50;
            const y = (i * 73) % (height - 150);
            ctx.globalAlpha = 0.3 + (i % 3) * 0.2;
            ctx.beginPath();
            ctx.arc(x, y, 1 + (i % 2), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        // Ground
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, groundY, width, height - groundY);
        
        // Ground line
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(width, groundY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Grid on ground
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let x = -distance % 50; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, groundY);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Obstacles
        for (let obs of obstacles) {
            const obsX = obs.x - distance;
            if (obsX < -100 || obsX > width + 100) continue;
            
            if (obs.type === 'spike') {
                ctx.fillStyle = '#ff4757';
                ctx.shadowColor = '#ff4757';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(obsX + obs.width / 2, obs.y - obs.height);
                ctx.lineTo(obsX + obs.width, obs.y);
                ctx.lineTo(obsX, obs.y);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (obs.type === 'block') {
                ctx.fillStyle = '#ff4757';
                ctx.shadowColor = '#ff4757';
                ctx.shadowBlur = 10;
                ctx.fillRect(obsX, obs.y, obs.width, obs.height);
                ctx.shadowBlur = 0;
            }
        }
        
        // Particles
        for (let p of particles) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        // Player
        if (gameState === 'playing') {
            ctx.save();
            ctx.translate(player.x + PLAYER_SIZE/2, player.y + PLAYER_SIZE/2);
            ctx.rotate(player.rotation);
            
            ctx.fillStyle = '#00d4ff';
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 20;
            ctx.fillRect(-PLAYER_SIZE/2, -PLAYER_SIZE/2, PLAYER_SIZE, PLAYER_SIZE);
            
            // Inner square
            ctx.fillStyle = '#0099cc';
            ctx.fillRect(-PLAYER_SIZE/4, -PLAYER_SIZE/4, PLAYER_SIZE/2, PLAYER_SIZE/2);
            
            ctx.shadowBlur = 0;
            ctx.restore();
        }
    }

    window.addEventListener('load', init);
})();
