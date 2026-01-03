// Endless Runner - Swipe to jump and slide
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let player, obstacles, coins, particles;
    let gameState = 'start';
    let score = 0, bestScore = 0, coinsCollected = 0;
    let speed = 8;
    let lastTime = 0;
    let groundY;
    let swipeStart = null;

    const GRAVITY = 0.8;
    const JUMP_FORCE = -18;
    const PLAYER_WIDTH = 50;
    const PLAYER_HEIGHT = 80;
    const SLIDE_HEIGHT = 35;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        groundY = height - 120;
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);
        bestScore = parseInt(localStorage.getItem('endlessRunner_best') || '0');
        document.getElementById('best').textContent = bestScore;
        
        setupControls();
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        
        // Auto-start game
        setTimeout(startGame, 100);
    }

    function startGame() {
        player = {
            x: 80,
            y: groundY - PLAYER_HEIGHT,
            vy: 0,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            jumping: false,
            sliding: false,
            slideTimer: 0,
            runFrame: 0
        };
        
        obstacles = [];
        coins = [];
        particles = [];
        score = 0;
        coinsCollected = 0;
        speed = 8;
        
        gameState = 'playing';
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function setupControls() {
        document.addEventListener('touchstart', (e) => {
            if (gameState !== 'playing') return;
            swipeStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!swipeStart || gameState !== 'playing') return;
            
            const end = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            const dy = end.y - swipeStart.y;
            
            if (dy < -50) {
                jump();
            } else if (dy > 50) {
                slide();
            } else {
                // Tap = jump
                jump();
            }
            
            swipeStart = null;
        });

        document.addEventListener('keydown', (e) => {
            if (gameState !== 'playing') return;
            if (e.key === 'ArrowUp' || e.code === 'Space') jump();
            if (e.key === 'ArrowDown') slide();
        });
    }

    function jump() {
        if (player.jumping || player.sliding) return;
        player.vy = JUMP_FORCE;
        player.jumping = true;
        
        // Jump particles
        for (let i = 0; i < 5; i++) {
            particles.push({
                x: player.x + player.width / 2,
                y: groundY,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 5,
                life: 1,
                color: '#8b4513'
            });
        }
    }

    function slide() {
        if (player.jumping || player.sliding) return;
        player.sliding = true;
        player.slideTimer = 40;
        player.height = SLIDE_HEIGHT;
        player.y = groundY - SLIDE_HEIGHT;
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
        // Increase speed over time
        speed = 8 + score / 500;
        
        // Update score
        score += Math.floor(dt);
        updateUI();
        
        // Player physics
        if (player.jumping) {
            player.vy += GRAVITY * dt;
            player.y += player.vy * dt;
            
            if (player.y >= groundY - PLAYER_HEIGHT) {
                player.y = groundY - PLAYER_HEIGHT;
                player.vy = 0;
                player.jumping = false;
            }
        }
        
        // Slide timer
        if (player.sliding) {
            player.slideTimer -= dt;
            if (player.slideTimer <= 0) {
                player.sliding = false;
                player.height = PLAYER_HEIGHT;
                player.y = groundY - PLAYER_HEIGHT;
            }
        }
        
        // Run animation
        player.runFrame += 0.3 * dt;
        
        // Spawn obstacles
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < width - 300) {
            if (Math.random() < 0.02 * dt) {
                spawnObstacle();
            }
        }
        
        // Spawn coins
        if (Math.random() < 0.01 * dt) {
            const coinY = Math.random() < 0.5 ? groundY - 50 : groundY - 150;
            coins.push({
                x: width + 50,
                y: coinY,
                collected: false,
                rotation: 0
            });
        }
        
        // Update obstacles
        for (let obs of obstacles) {
            obs.x -= speed * dt;
        }
        obstacles = obstacles.filter(o => o.x > -100);
        
        // Update coins
        for (let coin of coins) {
            coin.x -= speed * dt;
            coin.rotation += 0.1 * dt;
        }
        coins = coins.filter(c => c.x > -50 && !c.collected);
        
        // Update particles
        for (let p of particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 0.3 * dt;
            p.life -= 0.03 * dt;
        }
        particles = particles.filter(p => p.life > 0);
        
        // Check coin collection
        for (let coin of coins) {
            if (!coin.collected &&
                player.x + player.width > coin.x - 15 &&
                player.x < coin.x + 15 &&
                player.y + player.height > coin.y - 15 &&
                player.y < coin.y + 15) {
                
                coin.collected = true;
                coinsCollected++;
                score += 50;
                
                // Coin particles
                for (let i = 0; i < 8; i++) {
                    particles.push({
                        x: coin.x,
                        y: coin.y,
                        vx: (Math.random() - 0.5) * 10,
                        vy: (Math.random() - 0.5) * 10,
                        life: 1,
                        color: '#f1c40f'
                    });
                }
            }
        }
        
        // Check collisions
        for (let obs of obstacles) {
            const playerBox = {
                x: player.x + 10,
                y: player.y + 5,
                width: player.width - 20,
                height: player.height - 10
            };
            
            if (playerBox.x + playerBox.width > obs.x &&
                playerBox.x < obs.x + obs.width &&
                playerBox.y + playerBox.height > obs.y &&
                playerBox.y < obs.y + obs.height) {
                
                gameOver();
                return;
            }
        }
    }

    function spawnObstacle() {
        const types = ['crate', 'barrier', 'bird'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let obs = { x: width + 50, type: type };
        
        if (type === 'crate') {
            obs.y = groundY - 50;
            obs.width = 50;
            obs.height = 50;
        } else if (type === 'barrier') {
            obs.y = groundY - 80;
            obs.width = 30;
            obs.height = 80;
        } else if (type === 'bird') {
            obs.y = groundY - 120;
            obs.width = 50;
            obs.height = 30;
            obs.wingFrame = 0;
        }
        
        obstacles.push(obs);
    }

    function gameOver() {
        gameState = 'gameover';
        
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('endlessRunner_best', bestScore.toString());
        }
        
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
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
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#87ceeb');
        skyGrad.addColorStop(0.6, '#e0f0ff');
        skyGrad.addColorStop(1, '#fff');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);
        
        // Clouds (parallax)
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for (let i = 0; i < 5; i++) {
            const x = ((i * 200 + score * 0.1) % (width + 200)) - 100;
            const y = 50 + i * 40;
            drawCloud(x, y, 30 + i * 10);
        }
        
        // Mountains (background)
        ctx.fillStyle = '#a0c4a0';
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        for (let x = 0; x <= width; x += 100) {
            const h = 100 + Math.sin(x * 0.01 + score * 0.001) * 50;
            ctx.lineTo(x, groundY - h);
        }
        ctx.lineTo(width, groundY);
        ctx.closePath();
        ctx.fill();
        
        // Ground
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(0, groundY, width, height - groundY);
        
        // Grass
        ctx.fillStyle = '#228b22';
        ctx.fillRect(0, groundY - 10, width, 15);
        
        // Ground details
        ctx.fillStyle = '#654321';
        for (let i = 0; i < 20; i++) {
            const x = ((i * 80 + score * speed * 0.5) % (width + 50)) - 25;
            ctx.fillRect(x, groundY + 20, 30, 5);
        }
        
        // Coins
        for (let coin of coins) {
            ctx.save();
            ctx.translate(coin.x, coin.y);
            ctx.scale(Math.cos(coin.rotation), 1);
            
            ctx.fillStyle = '#f1c40f';
            ctx.shadowColor = '#f1c40f';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#f1c40f';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
            
            ctx.shadowBlur = 0;
            ctx.restore();
        }
        
        // Obstacles
        for (let obs of obstacles) {
            if (obs.type === 'crate') {
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 3;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                ctx.beginPath();
                ctx.moveTo(obs.x, obs.y);
                ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
                ctx.moveTo(obs.x + obs.width, obs.y);
                ctx.lineTo(obs.x, obs.y + obs.height);
                ctx.stroke();
            } else if (obs.type === 'barrier') {
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = '#fff';
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(obs.x, obs.y + i * 20, obs.width, 10);
                }
            } else if (obs.type === 'bird') {
                obs.wingFrame += 0.2;
                const wingY = Math.sin(obs.wingFrame) * 10;
                
                ctx.fillStyle = '#333';
                // Body
                ctx.beginPath();
                ctx.ellipse(obs.x + 25, obs.y + 15, 20, 12, 0, 0, Math.PI * 2);
                ctx.fill();
                // Wings
                ctx.beginPath();
                ctx.moveTo(obs.x + 15, obs.y + 15);
                ctx.lineTo(obs.x, obs.y + wingY);
                ctx.lineTo(obs.x + 25, obs.y + 15);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(obs.x + 35, obs.y + 15);
                ctx.lineTo(obs.x + 50, obs.y + wingY);
                ctx.lineTo(obs.x + 25, obs.y + 15);
                ctx.fill();
                // Beak
                ctx.fillStyle = '#f39c12';
                ctx.beginPath();
                ctx.moveTo(obs.x + 45, obs.y + 15);
                ctx.lineTo(obs.x + 55, obs.y + 18);
                ctx.lineTo(obs.x + 45, obs.y + 20);
                ctx.closePath();
                ctx.fill();
            }
        }
        
        // Player
        drawPlayer();
        
        // Particles
        for (let p of particles) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function drawCloud(x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y - size * 0.3, size * 0.7, 0, Math.PI * 2);
        ctx.arc(x + size * 1.5, y, size * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawPlayer() {
        ctx.save();
        ctx.translate(player.x, player.y);
        
        const runOffset = Math.sin(player.runFrame) * 3;
        
        if (player.sliding) {
            // Sliding pose
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.ellipse(25, 20, 30, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Head
            ctx.fillStyle = '#f5d0c5';
            ctx.beginPath();
            ctx.arc(45, 15, 12, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Body
            ctx.fillStyle = '#3498db';
            ctx.fillRect(10, 25 + runOffset, 30, 35);
            
            // Head
            ctx.fillStyle = '#f5d0c5';
            ctx.beginPath();
            ctx.arc(25, 15 + runOffset, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Hair
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(25, 10 + runOffset, 12, Math.PI, 0);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(30, 13 + runOffset, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Legs (animated)
            ctx.fillStyle = '#2c3e50';
            const legAngle = Math.sin(player.runFrame * 2) * 0.5;
            
            // Left leg
            ctx.save();
            ctx.translate(18, 60 + runOffset);
            ctx.rotate(player.jumping ? 0.3 : legAngle);
            ctx.fillRect(-5, 0, 10, 25);
            ctx.restore();
            
            // Right leg
            ctx.save();
            ctx.translate(32, 60 + runOffset);
            ctx.rotate(player.jumping ? -0.3 : -legAngle);
            ctx.fillRect(-5, 0, 10, 25);
            ctx.restore();
            
            // Arms
            ctx.fillStyle = '#f5d0c5';
            const armAngle = Math.sin(player.runFrame * 2) * 0.6;
            
            ctx.save();
            ctx.translate(12, 30 + runOffset);
            ctx.rotate(player.jumping ? -0.5 : -armAngle);
            ctx.fillRect(-4, 0, 8, 20);
            ctx.restore();
            
            ctx.save();
            ctx.translate(38, 30 + runOffset);
            ctx.rotate(player.jumping ? 0.5 : armAngle);
            ctx.fillRect(-4, 0, 8, 20);
            ctx.restore();
        }
        
        ctx.restore();
    }

    window.addEventListener('load', init);
})();
