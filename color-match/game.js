// Color Match - Tap the color that matches the word
(function() {
    'use strict';

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let gameState = 'start';
    let score = 0;
    let timeLeft = 30;
    let timerInterval;
    let currentWord, currentWordColor, correctColor;
    let colorButtons = [];
    let feedback = null;

    const COLORS = [
        { name: 'RED', hex: '#e74c3c' },
        { name: 'BLUE', hex: '#3498db' },
        { name: 'GREEN', hex: '#2ecc71' },
        { name: 'YELLOW', hex: '#f1c40f' },
        { name: 'PURPLE', hex: '#9b59b6' },
        { name: 'ORANGE', hex: '#e67e22' }
    ];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        setupButtons();
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
        // Set up preview state
        currentWord = 'BLUE';
        currentWordColor = '#e74c3c'; // Show BLUE in red color
        correctColor = COLORS.find(c => c.name === 'BLUE');
        
        setupButtons();
        draw();
        
        // Animate with subtle effects
        let pulseTime = 0;
        function animateIdle() {
            if (gameState === 'playing') return;
            
            pulseTime += 0.03;
            
            // Pulse the word
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, width, height);
            
            // Instructions
            ctx.fillStyle = '#888';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Tap the color that matches the WORD', width / 2, 100);
            
            // Word with pulse effect
            const scale = 1 + Math.sin(pulseTime) * 0.05;
            ctx.save();
            ctx.translate(width / 2, height / 3);
            ctx.scale(scale, scale);
            ctx.fillStyle = currentWordColor;
            ctx.font = 'bold 64px Arial';
            ctx.shadowColor = currentWordColor;
            ctx.shadowBlur = 20 + Math.sin(pulseTime) * 10;
            ctx.fillText(currentWord, 0, 0);
            ctx.shadowBlur = 0;
            ctx.restore();
            
            // Color buttons
            for (let btn of colorButtons) {
                ctx.fillStyle = btn.color.hex;
                ctx.shadowColor = btn.color.hex;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.roundRect(btn.x, btn.y, btn.size, btn.size, 15);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function setupButtons() {
        colorButtons = [];
        const buttonSize = Math.min(width / 3 - 20, 100);
        const startX = (width - buttonSize * 3 - 20) / 2;
        const startY = height / 2 + 50;
        
        for (let i = 0; i < 6; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            colorButtons.push({
                x: startX + col * (buttonSize + 10),
                y: startY + row * (buttonSize + 10),
                size: buttonSize,
                color: COLORS[i]
            });
        }
    }

    function startGame() {
        score = 0;
        timeLeft = 30;
        gameState = 'playing';
        
        nextRound();

        document.getElementById('ui').classList.remove('hidden');
        updateUI();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateUI();
            if (timeLeft <= 0) {
                gameOver();
            }
        }, 1000);
        
        requestAnimationFrame(gameLoop);
    }

    function nextRound() {
        // Shuffle colors for buttons
        const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
        for (let i = 0; i < colorButtons.length; i++) {
            colorButtons[i].color = shuffled[i];
        }
        
        // Pick word and display color (different from word meaning)
        correctColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        
        // Word shown is the correct color name
        currentWord = correctColor.name;
        
        // But displayed in a DIFFERENT color (the trick!)
        let displayColors = COLORS.filter(c => c.name !== correctColor.name);
        currentWordColor = displayColors[Math.floor(Math.random() * displayColors.length)].hex;
    }

    function setupControls() {
        const handleTap = (x, y) => {
            if (gameState !== 'playing') return;
            
            for (let btn of colorButtons) {
                if (x >= btn.x && x <= btn.x + btn.size &&
                    y >= btn.y && y <= btn.y + btn.size) {
                    
                    if (btn.color.name === correctColor.name) {
                        // Correct!
                        score += 10;
                        feedback = { correct: true, time: 20 };
                        nextRound();
                    } else {
                        // Wrong!
                        score = Math.max(0, score - 5);
                        feedback = { correct: false, time: 20 };
                    }
                    updateUI();
                    break;
                }
            }
        };
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleTap(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        
        canvas.addEventListener('click', (e) => {
            handleTap(e.clientX, e.clientY);
        });
    }

    function gameLoop() {
        if (gameState !== 'playing') return;
        
        if (feedback) {
            feedback.time--;
            if (feedback.time <= 0) feedback = null;
        }
        
        draw();
        requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        gameState = 'gameover';
        clearInterval(timerInterval);
        
        document.getElementById('final-score').textContent = score;
        
        document.getElementById('ui').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    function updateUI() {
        document.getElementById('timer').textContent = timeLeft;
        document.getElementById('score').textContent = score;
        
        // Timer color warning
        const timerEl = document.getElementById('timer');
        if (timeLeft <= 5) {
            timerEl.style.color = '#e74c3c';
        } else if (timeLeft <= 10) {
            timerEl.style.color = '#f39c12';
        } else {
            timerEl.style.color = '#fff';
        }
    }

    function draw() {
        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        // Instructions
        ctx.fillStyle = '#888';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Tap the color that matches the WORD', width / 2, 100);
        
        // Word display
        ctx.fillStyle = currentWordColor;
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = currentWordColor;
        ctx.shadowBlur = 20;
        ctx.fillText(currentWord, width / 2, height / 3);
        ctx.shadowBlur = 0;
        
        // Color buttons
        for (let btn of colorButtons) {
            ctx.fillStyle = btn.color.hex;
            ctx.shadowColor = btn.color.hex;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.roundRect(btn.x, btn.y, btn.size, btn.size, 15);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Feedback
        if (feedback) {
            ctx.fillStyle = feedback.correct ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = feedback.correct ? '#2ecc71' : '#e74c3c';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(feedback.correct ? '✓' : '✗', width / 2, height / 2 - 50);
        }
    }

    window.addEventListener('load', init);
})();
