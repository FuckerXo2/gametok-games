// Bubble Pop - Pop bubbles before they escape
(function() {
    'use strict';

    let score = 0;
    let missed = 0;
    let timeLeft = 60;
    let gameActive = false;
    let spawnInterval;
    let timerInterval;

    const gameArea = document.getElementById('game-area');
    const MAX_MISSED = 10;

    function init() {

        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
        
        // Draw idle preview
        drawIdlePreview();
    }
    
    function drawIdlePreview() {
        // Show preview bubbles
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];
        
        for (let i = 0; i < 5; i++) {
            const size = 50 + Math.random() * 30;
            const x = 50 + Math.random() * (window.innerWidth - 100);
            const y = window.innerHeight * 0.3 + Math.random() * (window.innerHeight * 0.4);
            
            const bubble = document.createElement('div');
            bubble.className = 'bubble preview-bubble';
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = x + 'px';
            bubble.style.top = y + 'px';
            bubble.style.position = 'absolute';
            
            const hue = Math.random() * 360;
            bubble.style.background = `radial-gradient(circle at 30% 30%, 
                hsla(${hue}, 70%, 80%, 0.8), 
                hsla(${hue}, 70%, 60%, 0.3))`;
            
            gameArea.appendChild(bubble);
        }
        
        gameArea.classList.remove('hidden');
        
        // Animate bubbles floating
        let floatTime = 0;
        function animateIdle() {
            if (gameActive) {
                // Remove preview bubbles when game starts
                const previewBubbles = gameArea.querySelectorAll('.preview-bubble');
                previewBubbles.forEach(b => b.remove());
                return;
            }
            
            floatTime += 0.03;
            const previewBubbles = gameArea.querySelectorAll('.preview-bubble');
            previewBubbles.forEach((bubble, i) => {
                const offset = i * 0.5;
                const y = parseFloat(bubble.dataset.baseY || bubble.style.top);
                if (!bubble.dataset.baseY) bubble.dataset.baseY = y;
                bubble.style.top = (parseFloat(bubble.dataset.baseY) + Math.sin(floatTime + offset) * 15) + 'px';
                const scale = 1 + Math.sin(floatTime * 0.5 + offset) * 0.1;
                bubble.style.transform = `scale(${scale})`;
            });
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function startGame() {
        score = 0;
        missed = 0;
        timeLeft = 60;
        gameActive = true;
        
        gameArea.innerHTML = '';

        document.getElementById('ui').classList.remove('hidden');
        gameArea.classList.remove('hidden');
        
        updateUI();
        
        // Spawn bubbles
        spawnInterval = setInterval(spawnBubble, 500);
        
        // Timer
        timerInterval = setInterval(() => {
            timeLeft--;
            updateUI();
            if (timeLeft <= 0) {
                gameOver();
            }
        }, 1000);
    }

    function spawnBubble() {
        if (!gameActive) return;
        
        const size = 40 + Math.random() * 40;
        const x = size + Math.random() * (window.innerWidth - size * 2);
        const duration = 3 + Math.random() * 3;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = x + 'px';
        bubble.style.bottom = '-' + size + 'px';
        bubble.style.animationDuration = duration + 's';
        
        // Random color tint
        const hue = Math.random() * 360;
        bubble.style.background = `radial-gradient(circle at 30% 30%, 
            hsla(${hue}, 70%, 80%, 0.8), 
            hsla(${hue}, 70%, 60%, 0.3))`;
        
        const popBubble = (e) => {
            if (e) e.preventDefault();
            if (!gameActive || bubble.classList.contains('pop')) return;
            
            bubble.classList.add('pop');
            score += Math.round(80 / size * 10); // Smaller = more points
            updateUI();
            
            setTimeout(() => bubble.remove(), 200);
        };
        
        bubble.addEventListener('click', popBubble);
        bubble.addEventListener('touchstart', popBubble, { passive: false });
        
        // Remove when escaped
        bubble.addEventListener('animationend', () => {
            if (!bubble.classList.contains('pop')) {
                missed++;
                updateUI();
                bubble.remove();
                
                if (missed >= MAX_MISSED) {
                    gameOver();
                }
            }
        });
        
        gameArea.appendChild(bubble);
    }

    function updateUI() {
        document.getElementById('score').textContent = score;
        document.getElementById('missed').textContent = missed;
        document.getElementById('time').textContent = timeLeft;
    }

    function gameOver() {
        gameActive = false;
        clearInterval(spawnInterval);
        clearInterval(timerInterval);
        
        document.getElementById('final-score').textContent = score;

        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    window.addEventListener('load', init);
})();
