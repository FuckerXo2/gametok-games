// Memory Match - Find matching pairs
(function() {
    'use strict';

    const EMOJIS = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎹', '🏀', '⚽', '🏈', '🎾', '🏐', '🎱'];
    
    let cards = [];
    let flipped = [];
    let matched = 0;
    let moves = 0;
    let totalPairs = 8;
    let canFlip = true;
    let startTime = 0;
    let timerInterval;

    function init() {
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        
        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
        
        // Draw idle preview
        drawIdlePreview();
    }
    
    function drawIdlePreview() {
        const grid = document.getElementById('grid');
        const container = document.getElementById('game-container');
        
        // Pick preview emojis
        const previewEmojis = ['🎮', '🎯', '🎨', '🎭', '🎸', '🏀', '🎮', '🎯', '🎨', '🎭', '🎸', '🏀', '⚽', '🎾', '🏈', '🎱'];
        
        // Calculate grid size
        const cols = 4;
        const rows = 4;
        const cardSize = Math.min((window.innerWidth - 60) / cols, (window.innerHeight - 150) / rows, 100);
        
        grid.style.gridTemplateColumns = `repeat(${cols}, ${cardSize}px)`;
        grid.innerHTML = '';
        
        // Create preview cards (some flipped to show emojis)
        for (let i = 0; i < 16; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.width = cardSize + 'px';
            card.style.height = cardSize + 'px';
            
            // Show some cards flipped
            if (i === 2 || i === 5 || i === 10 || i === 13) {
                card.classList.add('flipped');
                card.textContent = previewEmojis[i];
            } else {
                card.textContent = '?';
            }
            
            grid.appendChild(card);
        }
        
        container.classList.remove('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        
        // Animate cards with pulse
        let pulseTime = 0;
        function animateIdle() {
            if (document.getElementById('start-screen').classList.contains('hidden')) return;
            
            pulseTime += 0.03;
            const cards = grid.querySelectorAll('.card');
            cards.forEach((card, i) => {
                const offset = i * 0.2;
                const scale = 1 + Math.sin(pulseTime + offset) * 0.03;
                card.style.transform = `scale(${scale})`;
            });
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function startGame() {
        const grid = document.getElementById('grid');
        const container = document.getElementById('game-container');
        
        // Reset
        matched = 0;
        moves = 0;
        flipped = [];
        canFlip = true;
        
        // Pick random emojis
        const selected = EMOJIS.sort(() => Math.random() - 0.5).slice(0, totalPairs);
        cards = [...selected, ...selected].sort(() => Math.random() - 0.5);
        
        // Calculate grid size
        const cols = 4;
        const rows = Math.ceil(cards.length / cols);
        const cardSize = Math.min((window.innerWidth - 60) / cols, (window.innerHeight - 150) / rows, 100);
        
        grid.style.gridTemplateColumns = `repeat(${cols}, ${cardSize}px)`;
        grid.innerHTML = '';
        
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.width = cardSize + 'px';
            card.style.height = cardSize + 'px';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.textContent = '?';
            card.addEventListener('click', () => flipCard(card));
            grid.appendChild(card);
        });
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        container.classList.remove('hidden');
        
        document.getElementById('total-pairs').textContent = totalPairs;
        updateUI();
        
        startTime = Date.now();
        timerInterval = setInterval(() => {
            document.getElementById('time').textContent = Math.floor((Date.now() - startTime) / 1000);
        }, 1000);
    }

    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        card.textContent = card.dataset.emoji;
        flipped.push(card);
        
        if (flipped.length === 2) {
            moves++;
            updateUI();
            canFlip = false;
            
            const [card1, card2] = flipped;
            
            if (card1.dataset.emoji === card2.dataset.emoji) {
                // Match!
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matched++;
                    updateUI();
                    flipped = [];
                    canFlip = true;
                    
                    if (matched === totalPairs) {
                        gameOver();
                    }
                }, 300);
            } else {
                // No match
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    card1.textContent = '?';
                    card2.textContent = '?';
                    flipped = [];
                    canFlip = true;
                }, 800);
            }
        }
    }

    function updateUI() {
        document.getElementById('moves').textContent = moves;
        document.getElementById('pairs').textContent = matched;
    }

    function gameOver() {
        clearInterval(timerInterval);
        document.getElementById('final-score').textContent = moves;
        document.getElementById('game-over').classList.remove('hidden');
        
        // Score based on moves (fewer is better)
        const score = Math.max(0, 1000 - moves * 20);
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    window.addEventListener('load', init);
})();
