// Whack-a-Mole - Tap moles as they pop up
(function() {
    'use strict';

    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let timerInterval;
    let moles = [];
    let gameActive = false;

    function init() {
        const grid = document.getElementById('grid');
        
        // Create 9 holes
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'hole';
            
            const mole = document.createElement('div');
            mole.className = 'mole';
            mole.dataset.index = i;
            mole.addEventListener('click', whackMole);
            mole.addEventListener('touchstart', (e) => {
                e.preventDefault();
                whackMole(e);
            }, { passive: false });
            
            hole.appendChild(mole);
            grid.appendChild(hole);
            moles.push(mole);
        }
        
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        
        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
    }

    function startGame() {
        score = 0;
        timeLeft = 30;
        gameActive = true;
        
        // Reset all moles
        moles.forEach(m => {
            m.classList.remove('up', 'hit');
        });
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        updateUI();
        
        // Start spawning moles
        gameInterval = setInterval(spawnMole, 800);
        
        // Start timer
        timerInterval = setInterval(() => {
            timeLeft--;
            updateUI();
            if (timeLeft <= 0) {
                gameOver();
            }
        }, 1000);
    }

    function spawnMole() {
        if (!gameActive) return;
        
        // Hide all moles first
        const upMoles = moles.filter(m => m.classList.contains('up'));
        if (upMoles.length >= 3) return; // Max 3 moles at once
        
        // Pick random hole that doesn't have a mole up
        const available = moles.filter(m => !m.classList.contains('up'));
        if (available.length === 0) return;
        
        const mole = available[Math.floor(Math.random() * available.length)];
        mole.classList.remove('hit');
        mole.classList.add('up');
        
        // Hide after random time
        const hideTime = 800 + Math.random() * 1000;
        setTimeout(() => {
            if (mole.classList.contains('up') && !mole.classList.contains('hit')) {
                mole.classList.remove('up');
            }
        }, hideTime);
    }

    function whackMole(e) {
        const mole = e.target;
        if (!gameActive || !mole.classList.contains('up') || mole.classList.contains('hit')) return;
        
        mole.classList.add('hit');
        score += 10;
        updateUI();
        
        setTimeout(() => {
            mole.classList.remove('up', 'hit');
        }, 200);
    }

    function updateUI() {
        document.getElementById('score').textContent = score;
        document.getElementById('time').textContent = timeLeft;
    }

    function gameOver() {
        gameActive = false;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        
        moles.forEach(m => m.classList.remove('up'));
        
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    window.addEventListener('load', init);
})();
