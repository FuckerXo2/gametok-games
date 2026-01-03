// Number Tap - Tap numbers 1-25 in order
(function() {
    'use strict';

    let nextNumber = 1;
    let startTime = 0;
    let timerInterval;
    let cells = [];

    function init() {

        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
        
        // Draw idle preview
        drawIdlePreview();
    }
    
    function drawIdlePreview() {
        const grid = document.getElementById('grid');
        grid.innerHTML = '';
        
        // Create preview grid with some numbers visible
        const previewNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
        
        previewNumbers.forEach(num => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = num;
            
            // Mark some as done for preview
            if (num <= 5) {
                cell.classList.add('done');
            }
            
            grid.appendChild(cell);
        });
        
        document.getElementById('game-area').classList.remove('hidden');
        
        // Animate cells with pulse
        let pulseTime = 0;
        function animateIdle() {
            // Check if game has started
            const doneCells = grid.querySelectorAll('.cell.done');
            if (doneCells.length > 5) return; // Game started
            
            pulseTime += 0.03;
            const cells = grid.querySelectorAll('.cell:not(.done)');
            cells.forEach((cell, i) => {
                const offset = i * 0.1;
                const scale = 1 + Math.sin(pulseTime + offset) * 0.03;
                cell.style.transform = `scale(${scale})`;
            });
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function startGame() {
        nextNumber = 1;
        cells = [];
        
        const grid = document.getElementById('grid');
        grid.innerHTML = '';
        
        // Create shuffled numbers 1-25
        const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
        shuffle(numbers);
        
        numbers.forEach(num => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = num;
            cell.dataset.number = num;
            cell.addEventListener('click', () => tapNumber(cell, num));
            cell.addEventListener('touchstart', (e) => {
                e.preventDefault();
                tapNumber(cell, num);
            }, { passive: false });
            grid.appendChild(cell);
            cells.push(cell);
        });

        document.getElementById('ui').classList.remove('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        
        updateUI();
        
        startTime = performance.now();
        timerInterval = setInterval(() => {
            const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
            document.getElementById('time').textContent = elapsed;
        }, 100);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function tapNumber(cell, num) {
        if (cell.classList.contains('done')) return;
        
        if (num === nextNumber) {
            cell.classList.add('correct');
            setTimeout(() => {
                cell.classList.remove('correct');
                cell.classList.add('done');
            }, 100);
            
            nextNumber++;
            updateUI();
            
            if (nextNumber > 25) {
                gameOver();
            }
        } else {
            cell.classList.add('wrong');
            setTimeout(() => cell.classList.remove('wrong'), 200);
        }
    }

    function updateUI() {
        document.getElementById('next').textContent = nextNumber > 25 ? '✓' : nextNumber;
    }

    function gameOver() {
        clearInterval(timerInterval);
        
        const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
        
        document.getElementById('game-area').classList.add('hidden');
        document.getElementById('ui').classList.add('hidden');
        document.getElementById('final-score').textContent = totalTime + 's';

        // Score: faster is better
        const score = Math.max(0, Math.round(2500 - totalTime * 50));
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    window.addEventListener('load', init);
})();
