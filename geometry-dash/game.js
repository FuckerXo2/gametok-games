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
    let levelLength = 3000;
    let speed = 6;
    let groundY;

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
        
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        
        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
    }

    function startGame() {
        player = {
            x: 100,
            y: groundY - PLAYER_SIZE,
            vy: 0,
            rotation: 0,
            onGround: true
        };
        
        obstacles = generateLevel();
        particles = [];
        distance = 0;
        
        gameState = 'playing';
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        document.getElementById('progress').classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function generateLevel() {
        const obs = [];
        let x = 400;
        
        while (x < levelLength) {
            const type = Math.random();
            
            if (type < 0.5) {
                // Spike
                obs.push({ type: 'spike', x: x, y: groundY, width: 40, height: 40 });
            } else if (type < 0.75) {
                // Block
                obs.push({ type: 'block', x: x, y: groundY - 50, width: 50, height: 50 });
            } else {
                // Double spike
                obs.push({ type: 'spike', x: x, y: groundY, width: 40, height: 40 });
                obs.push({ type: 'spike', x: x + 45, y: groundY, width: 40, height: 40 });
            }
            
            x += 200 + Math.random() * 200;
        }
        
        return obs;
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
        
        // Check win
        if (distance >= levelLength) {
            win();
            return;
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
        
        const percent = Math.floor((distance / levelLength) * 100);
        document.getElementById('final-score').textContent = percent + '%';
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('ui').classList.add('hidden');
        document.getElementById('progress').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: percent }));
        }
    }

    function win() {
        gameState = 'gameover';
        document.getElementById('game-over').querySelector('h1').textContent = 'LEVEL COMPLETE!';
        document.getElementById('final-score').textContent = '100%';
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('ui').classList.add('hidden');
        document.getElementById('progress').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: 100 }));
        }
    }

    function updateUI() {
        const percent = Math.floor((distance / levelLength) * 100);
        document.getElementById('score').textContent = percent;
        document.getElementById('progress-bar').style.width = percent + '%';
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
