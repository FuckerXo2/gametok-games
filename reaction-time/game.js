// Reaction Time - Test your reflexes
(function() {
    'use strict';

    const ROUNDS = 5;
    let currentRound = 0;
    let times = [];
    let state = 'waiting'; // waiting, ready, result, early
    let startTime = 0;
    let timeout = null;

    const screen = document.getElementById('game-screen');
    const message = document.getElementById('message');
    const timeDisplay = document.getElementById('time-display');
    const roundInfo = document.getElementById('round-info');

    function init() {

        screen.addEventListener('click', handleTap);
        screen.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleTap();
        }, { passive: false });
        
        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
        
        // Draw idle preview
        drawIdlePreview();
    }
    
    function drawIdlePreview() {
        // Show preview screen with pulsing effect
        screen.classList.remove('hidden');
        screen.className = 'ready'; // Green color
        message.textContent = 'Test Your Reflexes!';
        timeDisplay.classList.add('hidden');
        roundInfo.textContent = 'Tap to start';
        
        // Animate between colors
        let colorTime = 0;
        const colors = ['waiting', 'ready'];
        let colorIndex = 0;
        
        function animateIdle() {
            if (state === 'waiting' || state === 'ready' || state === 'result') {
                // Game has started
                return;
            }
            
            colorTime += 0.02;
            
            // Pulse effect
            const scale = 1 + Math.sin(colorTime * 2) * 0.02;
            screen.style.transform = `scale(${scale})`;
            
            // Change color periodically
            if (Math.floor(colorTime) % 3 === 0 && Math.floor(colorTime) !== Math.floor(colorTime - 0.02)) {
                colorIndex = (colorIndex + 1) % colors.length;
                screen.className = colors[colorIndex];
                message.textContent = colorIndex === 0 ? 'Wait for green...' : 'TAP NOW!';
            }
            
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function startGame() {
        currentRound = 0;
        times = [];

        screen.classList.remove('hidden');
        
        startRound();
    }

    function startRound() {
        currentRound++;
        state = 'waiting';
        
        screen.className = 'waiting';
        message.textContent = 'Wait for green...';
        timeDisplay.classList.add('hidden');
        roundInfo.textContent = `Round ${currentRound} of ${ROUNDS}`;
        
        // Random delay between 1-4 seconds
        const delay = 1000 + Math.random() * 3000;
        timeout = setTimeout(() => {
            state = 'ready';
            screen.className = 'ready';
            message.textContent = 'TAP NOW!';
            startTime = performance.now();
        }, delay);
    }

    function handleTap() {
        if (state === 'waiting') {
            // Tapped too early
            clearTimeout(timeout);
            state = 'early';
            screen.className = 'early';
            message.textContent = 'Too early! Tap to retry';
            timeDisplay.classList.add('hidden');
        } else if (state === 'ready') {
            // Good tap
            const reactionTime = Math.round(performance.now() - startTime);
            times.push(reactionTime);
            
            state = 'result';
            screen.className = 'result';
            message.textContent = 'Nice!';
            timeDisplay.textContent = reactionTime + ' ms';
            timeDisplay.classList.remove('hidden');
            
            setTimeout(() => {
                if (currentRound >= ROUNDS) {
                    gameOver();
                } else {
                    startRound();
                }
            }, 1500);
        } else if (state === 'early') {
            // Retry after early tap
            startRound();
        }
    }

    function gameOver() {
        screen.classList.add('hidden');
        
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        const best = Math.min(...times);
        
        document.getElementById('final-score').textContent = avg + ' ms';
        
        const results = document.getElementById('results');
        results.innerHTML = `
            <div>Best: ${best} ms</div>
            <div>All times: ${times.join(', ')} ms</div>
        `;

        // Score: lower is better, max 1000 for <150ms avg
        const score = Math.max(0, Math.round(1000 - (avg - 150) * 3));
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    window.addEventListener('load', init);
})();
