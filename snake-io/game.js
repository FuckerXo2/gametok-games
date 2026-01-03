// Snake.io - Multiplayer-style snake
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const minimap = document.getElementById('minimap');
    const minimapCtx = minimap.getContext('2d');
    
    let width, height;
    const WORLD_SIZE = 2000;
    const SEGMENT_SIZE = 12;
    const FOOD_SIZE = 8;
    
    let player, bots, food, camera;
    let score = 0;
    let gameState = 'start';
    let targetAngle = 0;
    let lastTime = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        minimap.width = 100;
        minimap.height = 100;
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
        player = createSnake(WORLD_SIZE / 2, WORLD_SIZE / 2, '#4ecca3', 15);
        
        bots = [];
        // Add a few preview bots
        const botPositions = [
            { x: WORLD_SIZE / 2 + 200, y: WORLD_SIZE / 2 - 100 },
            { x: WORLD_SIZE / 2 - 150, y: WORLD_SIZE / 2 + 150 }
        ];
        const colors = ['#ff6b6b', '#48dbfb'];
        botPositions.forEach((pos, i) => {
            bots.push(createSnake(pos.x, pos.y, colors[i], 8 + i * 3));
        });
        
        food = [];
        for (let i = 0; i < 50; i++) {
            food.push({
                x: WORLD_SIZE / 2 - 300 + Math.random() * 600,
                y: WORLD_SIZE / 2 - 300 + Math.random() * 600,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                size: FOOD_SIZE + Math.random() * 4
            });
        }
        
        camera = { x: player.segments[0].x, y: player.segments[0].y };
        
        draw();
        drawMinimap();
        
        // Animate snake moving in circle
        let animTime = 0;
        function animateIdle() {
            if (gameState === 'playing') return;
            
            animTime += 0.02;
            
            // Move player snake in a circle
            player.angle = animTime;
            const head = player.segments[0];
            const newHead = {
                x: WORLD_SIZE / 2 + Math.cos(animTime) * 100,
                y: WORLD_SIZE / 2 + Math.sin(animTime) * 100
            };
            
            // Update body to follow
            for (let i = player.segments.length - 1; i > 0; i--) {
                const prev = player.segments[i - 1];
                const curr = player.segments[i];
                curr.x += (prev.x - curr.x) * 0.3;
                curr.y += (prev.y - curr.y) * 0.3;
            }
            player.segments[0] = newHead;
            
            camera.x = newHead.x;
            camera.y = newHead.y;
            
            draw();
            drawMinimap();
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function startGame() {
        player = createSnake(WORLD_SIZE / 2, WORLD_SIZE / 2, '#4ecca3', 10);
        
        bots = [];
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * WORLD_SIZE;
            const y = Math.random() * WORLD_SIZE;
            const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];
            bots.push(createSnake(x, y, colors[i % colors.length], 5 + Math.floor(Math.random() * 15)));
            bots[i].targetAngle = Math.random() * Math.PI * 2;
        }
        
        food = [];
        for (let i = 0; i < 200; i++) {
            spawnFood();
        }
        
        camera = { x: player.segments[0].x, y: player.segments[0].y };
        score = player.segments.length;
        gameState = 'playing';

        document.getElementById('ui').classList.remove('hidden');
        document.getElementById('minimap').classList.remove('hidden');
        updateUI();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function createSnake(x, y, color, length) {
        const segments = [];
        for (let i = 0; i < length; i++) {
            segments.push({ x: x - i * SEGMENT_SIZE, y: y });
        }
        return { segments, color, angle: 0, speed: 3, boosting: false };
    }

    function spawnFood() {
        food.push({
            x: Math.random() * WORLD_SIZE,
            y: Math.random() * WORLD_SIZE,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            size: FOOD_SIZE + Math.random() * 4
        });
    }

    function setupControls() {
        // Touch - drag to steer
        let touching = false;
        
        document.addEventListener('touchstart', (e) => {
            touching = true;
            updateTarget(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (touching) {
                updateTarget(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            touching = false;
        });
        
        // Mouse
        document.addEventListener('mousemove', (e) => {
            updateTarget(e.clientX, e.clientY);
        });
        
        function updateTarget(x, y) {
            if (gameState !== 'playing') return;
            const dx = x - width / 2;
            const dy = y - height / 2;
            targetAngle = Math.atan2(dy, dx);
        }
    }

    function gameLoop(time) {
        if (gameState !== 'playing') return;
        
        const dt = Math.min((time - lastTime) / 16.67, 3);
        lastTime = time;
        
        update(dt);
        draw();
        drawMinimap();
        
        requestAnimationFrame(gameLoop);
    }

    function update(dt) {
        // Update player
        updateSnake(player, targetAngle, dt);
        
        // Update bots
        for (let bot of bots) {
            // Simple AI - wander and chase food
            if (Math.random() < 0.02) {
                const nearestFood = food.reduce((nearest, f) => {
                    const d = dist(bot.segments[0], f);
                    return d < dist(bot.segments[0], nearest) ? f : nearest;
                }, food[0]);
                
                if (nearestFood) {
                    bot.targetAngle = Math.atan2(
                        nearestFood.y - bot.segments[0].y,
                        nearestFood.x - bot.segments[0].x
                    );
                }
            }
            updateSnake(bot, bot.targetAngle, dt);
        }
        
        // Camera follows player
        camera.x += (player.segments[0].x - camera.x) * 0.1;
        camera.y += (player.segments[0].y - camera.y) * 0.1;
        
        // Check food collision for player
        for (let i = food.length - 1; i >= 0; i--) {
            if (dist(player.segments[0], food[i]) < SEGMENT_SIZE + food[i].size) {
                player.segments.push({ ...player.segments[player.segments.length - 1] });
                food.splice(i, 1);
                spawnFood();
                score = player.segments.length;
                updateUI();
            }
        }
        
        // Check food collision for bots
        for (let bot of bots) {
            for (let i = food.length - 1; i >= 0; i--) {
                if (dist(bot.segments[0], food[i]) < SEGMENT_SIZE + food[i].size) {
                    bot.segments.push({ ...bot.segments[bot.segments.length - 1] });
                    food.splice(i, 1);
                    spawnFood();
                }
            }
        }
        
        // Check collision with bots
        for (let bot of bots) {
            // Player hits bot body
            for (let i = 1; i < bot.segments.length; i++) {
                if (dist(player.segments[0], bot.segments[i]) < SEGMENT_SIZE * 1.5) {
                    gameOver();
                    return;
                }
            }
        }
        
        // Check wall collision
        const head = player.segments[0];
        if (head.x < 0 || head.x > WORLD_SIZE || head.y < 0 || head.y > WORLD_SIZE) {
            gameOver();
        }
    }

    function updateSnake(snake, target, dt) {
        // Smooth turning
        let angleDiff = target - snake.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        snake.angle += angleDiff * 0.1 * dt;
        
        // Move head
        const speed = snake.speed * dt;
        const head = snake.segments[0];
        const newHead = {
            x: head.x + Math.cos(snake.angle) * speed,
            y: head.y + Math.sin(snake.angle) * speed
        };
        
        // Move body
        for (let i = snake.segments.length - 1; i > 0; i--) {
            const prev = snake.segments[i - 1];
            const curr = snake.segments[i];
            const d = dist(prev, curr);
            if (d > SEGMENT_SIZE * 0.8) {
                const ratio = (d - SEGMENT_SIZE * 0.8) / d;
                curr.x += (prev.x - curr.x) * ratio;
                curr.y += (prev.y - curr.y) * ratio;
            }
        }
        
        snake.segments[0] = newHead;
    }

    function dist(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    function gameOver() {
        gameState = 'gameover';
        document.getElementById('final-score').textContent = score;
        
        document.getElementById('ui').classList.add('hidden');
        document.getElementById('minimap').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    function updateUI() {
        document.getElementById('score').textContent = score;
        document.getElementById('length').textContent = player.segments.length;
    }

    function draw() {
        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        const gridSize = 50;
        const offsetX = -camera.x % gridSize + width / 2;
        const offsetY = -camera.y % gridSize + height / 2;
        
        for (let x = offsetX; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = offsetY; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // World bounds
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.strokeRect(
            -camera.x + width / 2,
            -camera.y + height / 2,
            WORLD_SIZE,
            WORLD_SIZE
        );
        ctx.lineWidth = 1;
        
        // Food
        for (let f of food) {
            const sx = f.x - camera.x + width / 2;
            const sy = f.y - camera.y + height / 2;
            if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) continue;
            
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(sx, sy, f.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.arc(sx - 2, sy - 2, f.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Bots
        for (let bot of bots) {
            drawSnake(bot);
        }
        
        // Player
        drawSnake(player);
    }

    function drawSnake(snake) {
        // Body
        for (let i = snake.segments.length - 1; i >= 0; i--) {
            const seg = snake.segments[i];
            const sx = seg.x - camera.x + width / 2;
            const sy = seg.y - camera.y + height / 2;
            
            if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) continue;
            
            const size = SEGMENT_SIZE * (i === 0 ? 1.3 : 1 - i * 0.01);
            
            ctx.fillStyle = snake.color;
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.beginPath();
            ctx.arc(sx - size * 0.3, sy - size * 0.3, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Eyes on head
        const head = snake.segments[0];
        const hx = head.x - camera.x + width / 2;
        const hy = head.y - camera.y + height / 2;
        
        const eyeOffset = SEGMENT_SIZE * 0.5;
        const eyeAngle1 = snake.angle + 0.5;
        const eyeAngle2 = snake.angle - 0.5;
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(hx + Math.cos(eyeAngle1) * eyeOffset, hy + Math.sin(eyeAngle1) * eyeOffset, 4, 0, Math.PI * 2);
        ctx.arc(hx + Math.cos(eyeAngle2) * eyeOffset, hy + Math.sin(eyeAngle2) * eyeOffset, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(hx + Math.cos(eyeAngle1) * eyeOffset + Math.cos(snake.angle) * 2, hy + Math.sin(eyeAngle1) * eyeOffset + Math.sin(snake.angle) * 2, 2, 0, Math.PI * 2);
        ctx.arc(hx + Math.cos(eyeAngle2) * eyeOffset + Math.cos(snake.angle) * 2, hy + Math.sin(eyeAngle2) * eyeOffset + Math.sin(snake.angle) * 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawMinimap() {
        minimapCtx.fillStyle = 'rgba(0,0,0,0.7)';
        minimapCtx.fillRect(0, 0, 100, 100);
        
        const scale = 100 / WORLD_SIZE;
        
        // Food (dots)
        minimapCtx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let f of food) {
            minimapCtx.fillRect(f.x * scale, f.y * scale, 1, 1);
        }
        
        // Bots
        for (let bot of bots) {
            minimapCtx.fillStyle = bot.color;
            minimapCtx.fillRect(bot.segments[0].x * scale - 1, bot.segments[0].y * scale - 1, 3, 3);
        }
        
        // Player
        minimapCtx.fillStyle = '#4ecca3';
        minimapCtx.fillRect(player.segments[0].x * scale - 2, player.segments[0].y * scale - 2, 5, 5);
    }

    window.addEventListener('load', init);
})();
