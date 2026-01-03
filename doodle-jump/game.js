// Doodle Jump - Jump up platforms
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let player, platforms, score, maxHeight;
    let gameState = 'start';
    let lastTime = 0;
    let targetX = null;

    const GRAVITY = 0.5;
    const JUMP_FORCE = -15;
    const PLAYER_SIZE = 40;
    const PLATFORM_WIDTH = 70;
    const PLATFORM_HEIGHT = 15;

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
    }

    function startGame() {
        player = {
            x: width / 2,
            y: height - 100,
            vx: 0,
            vy: 0,
            facingRight: true
        };
        
        platforms = [];
        score = 0;
        maxHeight = 0;
        targetX = null;
        
        // Generate initial platforms
        for (let i = 0; i < 10; i++) {
            platforms.push({
                x: Math.random() * (width - PLATFORM_WIDTH),
                y: height - 50 - i * 80,
                type: i === 0 ? 'normal' : (Math.random() < 0.8 ? 'normal' : 'moving'),
                vx: Math.random() > 0.5 ? 2 : -2
            });
        }
        
        gameState = 'playing';

        document.getElementById('ui').classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function setupControls() {
        // Touch drag
        document.addEventListener('touchstart', (e) => {
            if (gameState !== 'playing') return;
            targetX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (gameState !== 'playing') return;
            targetX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            targetX = null;
        });
        
        // Mouse
        document.addEventListener('mousemove', (e) => {
            if (gameState !== 'playing') return;
            targetX = e.clientX;
        });
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') targetX = player.x - 100;
            if (e.key === 'ArrowRight') targetX = player.x + 100;
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
        // Move towards target
        if (targetX !== null) {
            const dx = targetX - player.x;
            player.vx = dx * 0.15;
            player.facingRight = dx > 0;
        } else {
            player.vx *= 0.9;
        }
        
        // Apply physics
        player.vy += GRAVITY * dt;
        player.x += player.vx * dt;
        player.y += player.vy * dt;
        
        // Wrap around screen
        if (player.x < -PLAYER_SIZE/2) player.x = width + PLAYER_SIZE/2;
        if (player.x > width + PLAYER_SIZE/2) player.x = -PLAYER_SIZE/2;
        
        // Update moving platforms
        for (let plat of platforms) {
            if (plat.type === 'moving') {
                plat.x += plat.vx * dt;
                if (plat.x < 0 || plat.x > width - PLATFORM_WIDTH) {
                    plat.vx *= -1;
                }
            }
        }
        
        // Check platform collisions (only when falling)
        if (player.vy > 0) {
            for (let plat of platforms) {
                if (player.x > plat.x - PLAYER_SIZE/2 &&
                    player.x < plat.x + PLATFORM_WIDTH + PLAYER_SIZE/2 &&
                    player.y + PLAYER_SIZE/2 > plat.y &&
                    player.y + PLAYER_SIZE/2 < plat.y + PLATFORM_HEIGHT + player.vy) {
                    
                    player.y = plat.y - PLAYER_SIZE/2;
                    player.vy = JUMP_FORCE;
                }
            }
        }
        
        // Scroll screen when player goes above middle
        if (player.y < height / 2) {
            const scroll = height / 2 - player.y;
            player.y = height / 2;
            
            for (let plat of platforms) {
                plat.y += scroll;
            }
            
            maxHeight += scroll;
            score = Math.floor(maxHeight / 10);
            updateUI();
        }
        
        // Remove platforms below screen and add new ones
        platforms = platforms.filter(p => p.y < height + 50);
        
        while (platforms.length < 10) {
            const topPlat = platforms.reduce((min, p) => p.y < min.y ? p : min, platforms[0]);
            platforms.push({
                x: Math.random() * (width - PLATFORM_WIDTH),
                y: topPlat.y - 60 - Math.random() * 40,
                type: Math.random() < 0.75 ? 'normal' : 'moving',
                vx: Math.random() > 0.5 ? 2 : -2
            });
        }
        
        // Game over if fall below screen
        if (player.y > height + 50) {
            gameOver();
        }
    }

    function gameOver() {
        gameState = 'gameover';
        document.getElementById('final-score').textContent = score;
        
        document.getElementById('ui').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    function updateUI() {
        document.getElementById('score').textContent = score;
    }

    function draw() {
        // Background - notebook paper
        ctx.fillStyle = '#f5e6d3';
        ctx.fillRect(0, 0, width, height);
        
        // Grid lines
        ctx.strokeStyle = 'rgba(200, 180, 160, 0.3)';
        ctx.lineWidth = 1;
        for (let y = 0; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Red margin line
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 0);
        ctx.lineTo(40, height);
        ctx.stroke();
        
        // Platforms
        for (let plat of platforms) {
            ctx.fillStyle = plat.type === 'moving' ? '#3498db' : '#4a7c59';
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, PLATFORM_WIDTH, PLATFORM_HEIGHT, 5);
            ctx.fill();
            
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(plat.x + 5, plat.y + 2, PLATFORM_WIDTH - 10, 4);
        }
        
        // Player (doodle character)
        ctx.save();
        ctx.translate(player.x, player.y);
        if (!player.facingRight) ctx.scale(-1, 1);
        
        // Body
        ctx.fillStyle = '#4a7c59';
        ctx.beginPath();
        ctx.ellipse(0, 5, 15, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Face
        ctx.fillStyle = '#8bc34a';
        ctx.beginPath();
        ctx.ellipse(0, -5, 18, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-7, -8, 6, 7, 0, 0, Math.PI * 2);
        ctx.ellipse(7, -8, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-5, -7, 3, 0, Math.PI * 2);
        ctx.arc(9, -7, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose/beak
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(12, -3);
        ctx.lineTo(22, 0);
        ctx.lineTo(12, 3);
        ctx.closePath();
        ctx.fill();
        
        // Feet
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.ellipse(-8, 22, 8, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(8, 22, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    window.addEventListener('load', init);
})();
