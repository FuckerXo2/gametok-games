// Aim Trainer - Tap targets as fast as you can
(function() {
    'use strict';

    const TOTAL_TARGETS = 30;
    let hits = 0;
    let startTime = 0;
    let timerInterval;
    let currentTarget = null;

    const gameArea = document.getElementById('game-area');

    function init() {

        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
    }

    function startGame() {
        hits = 0;

        document.getElementById('ui').classList.remove('hidden');
        gameArea.classList.remove('hidden');
        gameArea.innerHTML = '';
        
        updateUI();
        
        startTime = performance.now();
        timerInterval = setInterval(() => {
            const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
            document.getElementById('time').textContent = elapsed;
        }, 100);
        
        spawnTarget();
    }

    function spawnTarget() {
        if (currentTarget) {
            currentTarget.remove();
        }
        
        const size = 50 + Math.random() * 30;
        const padding = size + 20;
        const x = padding + Math.random() * (window.innerWidth - padding * 2);
        const y = padding + 60 + Math.random() * (window.innerHeight - padding * 2 - 60);
        
        const target = document.createElement('div');
        target.className = 'target target-outer';
        target.style.width = size + 'px';
        target.style.height = size + 'px';
        target.style.left = x + 'px';
        target.style.top = y + 'px';
        
        // Middle ring
        const middle = document.createElement('div');
        middle.className = 'target-middle';
        middle.style.width = (size * 0.6) + 'px';
        middle.style.height = (size * 0.6) + 'px';
        target.appendChild(middle);
        
        // Inner circle
        const inner = document.createElement('div');
        inner.className = 'target-inner';
        inner.style.width = (size * 0.3) + 'px';
        inner.style.height = (size * 0.3) + 'px';
        target.appendChild(inner);
        
        target.addEventListener('click', hitTarget);
        target.addEventListener('touchstart', (e) => {
            e.preventDefault();
            hitTarget();
        }, { passive: false });
        
        gameArea.appendChild(target);
        currentTarget = target;
    }

    function hitTarget() {
        hits++;
        updateUI();
        
        if (hits >= TOTAL_TARGETS) {
            gameOver();
        } else {
            spawnTarget();
        }
    }

    function updateUI() {
        document.getElementById('hits').textContent = hits;
    }

    function gameOver() {
        clearInterval(timerInterval);
        
        const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
        const avgTime = (totalTime / TOTAL_TARGETS * 1000).toFixed(0);
        
        if (currentTarget) currentTarget.remove();
        
        gameArea.classList.add('hidden');
        document.getElementById('ui').classList.add('hidden');
        
        document.getElementById('final-score').textContent = totalTime + 's';
        document.getElementById('stats').textContent = `Average: ${avgTime}ms per target`;

        // Score: faster is better
        const score = Math.max(0, Math.round(3000 - totalTime * 100));
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    window.addEventListener('load', init);
})();
