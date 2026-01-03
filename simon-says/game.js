// Simon Says - Repeat the color pattern
(function() {
    'use strict';

    const COLORS = ['green', 'red', 'yellow', 'blue'];
    let sequence = [];
    let playerIndex = 0;
    let level = 0;
    let canPlay = false;

    const pads = {};

    function init() {
        COLORS.forEach(color => {
            const pad = document.querySelector(`.pad.${color}`);
            pads[color] = pad;
            pad.addEventListener('click', () => handlePadClick(color));
            pad.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handlePadClick(color);
            }, { passive: false });
        });
        
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        
        // Auto-start game
        setTimeout(startGame, 100);
    }

    function startGame() {
        sequence = [];
        level = 0;
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        
        nextLevel();
    }

    function nextLevel() {
        level++;
        playerIndex = 0;
        canPlay = false;
        
        document.getElementById('level').textContent = `Level: ${level}`;
        document.getElementById('status').textContent = 'Watch the pattern...';
        
        // Add new color to sequence
        sequence.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
        
        // Play sequence
        setTimeout(() => playSequence(), 500);
    }

    function playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                canPlay = true;
                document.getElementById('status').textContent = 'Your turn!';
                return;
            }
            
            flashPad(sequence[i]);
            i++;
        }, 600);
    }

    function flashPad(color) {
        const pad = pads[color];
        pad.classList.add('active');
        setTimeout(() => pad.classList.remove('active'), 300);
    }

    function handlePadClick(color) {
        if (!canPlay) return;
        
        flashPad(color);
        
        if (color === sequence[playerIndex]) {
            playerIndex++;
            
            if (playerIndex >= sequence.length) {
                // Completed level
                canPlay = false;
                document.getElementById('status').textContent = 'Correct! 🎉';
                setTimeout(nextLevel, 1000);
            }
        } else {
            // Wrong!
            gameOver();
        }
    }

    function gameOver() {
        canPlay = false;
        document.getElementById('game-area').classList.add('hidden');
        document.getElementById('final-score').textContent = level - 1;
        document.getElementById('game-over').classList.remove('hidden');
        
        const score = (level - 1) * 50;
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    window.addEventListener('load', init);
})();
