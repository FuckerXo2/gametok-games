// Piano Tiles - Tap black tiles as they scroll DOWN
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height, tileW, tileH;
    let tiles = [];
    let score = 0;
    let speed = 5;
    let gameState = 'start';
    let lastTime = 0;

    const COLS = 4;
    const VISIBLE_ROWS = 4;

    // Audio context for piano sounds
    let audioCtx = null;
    
    // Piano note frequencies (C major scale + some extras)
    const NOTES = [
        261.63, // C4
        293.66, // D4
        329.63, // E4
        349.23, // F4
        392.00, // G4
        440.00, // A4
        493.88, // B4
        523.25, // C5
    ];
    
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    
    function playNote(col) {
        if (!audioCtx) return;
        
        try {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            // Pick a note based on column and add some randomness
            const noteIndex = (col + Math.floor(score / 4)) % NOTES.length;
            oscillator.frequency.value = NOTES[noteIndex];
            oscillator.type = 'sine';
            
            // Add a second oscillator for richer sound
            const oscillator2 = audioCtx.createOscillator();
            oscillator2.frequency.value = NOTES[noteIndex] * 2; // Octave higher
            oscillator2.type = 'sine';
            
            const gainNode2 = audioCtx.createGain();
            gainNode2.gain.value = 0.15; // Quieter overtone
            
            oscillator.connect(gainNode);
            oscillator2.connect(gainNode2);
            gainNode.connect(audioCtx.destination);
            gainNode2.connect(audioCtx.destination);
            
            // Piano-like envelope
            const now = audioCtx.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01); // Quick attack
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5); // Decay
            
            gainNode2.gain.setValueAtTime(0, now);
            gainNode2.gain.linearRampToValueAtTime(0.15, now + 0.01);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            oscillator.start(now);
            oscillator2.start(now);
            oscillator.stop(now + 0.5);
            oscillator2.stop(now + 0.3);
        } catch (e) {
            // Audio failed, continue silently
        }
    }
    
    function playGameOverSound() {
        if (!audioCtx) return;
        
        try {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.frequency.value = 150;
            oscillator.type = 'sawtooth';
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            const now = audioCtx.currentTime;
            gainNode.gain.setValueAtTime(0.3, now);
            oscillator.frequency.linearRampToValueAtTime(80, now + 0.3);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
            
            oscillator.start(now);
            oscillator.stop(now + 0.3);
        } catch (e) {}
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        tileW = width / COLS;
        tileH = height / VISIBLE_ROWS;
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);
        
        canvas.addEventListener('touchstart', handleTap, { passive: false });
        canvas.addEventListener('mousedown', handleTap);

        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
    }

    function startGame() {
        initAudio();
        score = 0;
        speed = 5;
        tiles = [];
        gameState = 'playing';
        
        // Create initial rows - tiles start ABOVE screen and move DOWN
        for (let i = 0; i < VISIBLE_ROWS + 2; i++) {
            addRow(-tileH * (i + 1));
        }

        document.getElementById('ui').classList.remove('hidden');
        updateScore();
        
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function addRow(y) {
        const blackCol = Math.floor(Math.random() * COLS);
        tiles.push({ y: y, blackCol: blackCol, tapped: false });
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
        // Move tiles DOWN
        for (let tile of tiles) {
            tile.y += speed * dt;
        }
        
        // Check if untapped black tile went past bottom - game over
        for (let tile of tiles) {
            if (!tile.tapped && tile.y > height) {
                gameOver();
                return;
            }
        }
        
        // Remove tiles that are fully off screen at bottom
        while (tiles.length > 0 && tiles[0].y > height + tileH) {
            tiles.shift();
        }
        
        // Add new tiles at top
        while (tiles.length < VISIBLE_ROWS + 3) {
            const topTile = tiles.reduce((min, t) => t.y < min.y ? t : min, tiles[0]);
            addRow(topTile.y - tileH);
        }
        
        // Increase speed
        speed = 5 + score * 0.08;
        if (speed > 20) speed = 20;
    }

    function handleTap(e) {
        if (gameState !== 'playing') return;
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        
        const col = Math.floor(x / tileW);
        
        // Find which tile was tapped (check from bottom to top - closest to tap point)
        let tappedTile = null;
        for (let tile of tiles) {
            if (tile.tapped) continue;
            if (y >= tile.y && y < tile.y + tileH) {
                tappedTile = tile;
                break;
            }
        }
        
        if (tappedTile) {
            if (col === tappedTile.blackCol) {
                // Correct tap
                tappedTile.tapped = true;
                playNote(col);
                score++;
                updateScore();
            } else {
                // Tapped white tile
                gameOver();
            }
        }
    }

    function gameOver() {
        gameState = 'gameover';
        playGameOverSound();
        document.getElementById('final-score').textContent = score;
        
        document.getElementById('ui').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    function updateScore() {
        document.querySelector('.score').textContent = score;
    }

    function draw() {
        // Dark background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        // Draw tiles
        for (let tile of tiles) {
            for (let col = 0; col < COLS; col++) {
                const x = col * tileW;
                const y = tile.y;
                
                // Skip if off screen
                if (y + tileH < 0 || y > height) continue;
                
                if (col === tile.blackCol && !tile.tapped) {
                    // Black tile
                    ctx.fillStyle = '#1a1a2e';
                    ctx.fillRect(x + 2, y + 2, tileW - 4, tileH - 4);
                    
                    // Inner darker
                    ctx.fillStyle = '#0d0d1a';
                    ctx.fillRect(x + 6, y + 6, tileW - 12, tileH - 12);
                } else if (col === tile.blackCol && tile.tapped) {
                    // Tapped - gray
                    ctx.fillStyle = '#3a3a5a';
                    ctx.fillRect(x + 2, y + 2, tileW - 4, tileH - 4);
                } else {
                    // White tile
                    ctx.fillStyle = '#f5f5f5';
                    ctx.fillRect(x + 2, y + 2, tileW - 4, tileH - 4);
                }
            }
        }
        
        // Grid lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        for (let i = 1; i < COLS; i++) {
            ctx.beginPath();
            ctx.moveTo(i * tileW, 0);
            ctx.lineTo(i * tileW, height);
            ctx.stroke();
        }
    }

    window.addEventListener('load', init);
})();
