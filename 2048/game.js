// 2048 - Swipe to merge tiles
(function() {
    'use strict';

    const SIZE = 4;
    let board = [];
    let score = 0;

    function init() {
        createBoard();
        setupControls();
        
        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
        
        // Draw idle preview
        drawIdlePreview();
    }
    
    function startGame() {
        score = 0;
        document.getElementById('game-over').style.display = 'none';
        createBoard();
        addTile();
        addTile();
        render();
    }
    
    function drawIdlePreview() {
        // Set up a nice preview board state
        board = [
            [2, 4, 8, 16],
            [0, 2, 4, 8],
            [0, 0, 2, 4],
            [0, 0, 0, 2]
        ];
        render();
        
        // Animate tiles with subtle pulse
        let pulseTime = 0;
        function animateIdle() {
            if (document.getElementById('game-over').style.display === 'flex') return;
            // Check if game has started (tiles are being added)
            const cells = document.querySelectorAll('.cell');
            let hasHighTile = false;
            cells.forEach(cell => {
                const val = parseInt(cell.getAttribute('data-value'));
                if (val > 16) hasHighTile = true;
            });
            if (hasHighTile) return; // Game has started
            
            pulseTime += 0.03;
            const scale = 1 + Math.sin(pulseTime) * 0.02;
            cells.forEach((cell, i) => {
                if (cell.getAttribute('data-value') !== '0') {
                    cell.style.transform = `scale(${scale})`;
                }
            });
            requestAnimationFrame(animateIdle);
        }
        animateIdle();
    }

    function createBoard() {
        const boardEl = document.getElementById('board');
        boardEl.innerHTML = '';
        board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
        
        for (let i = 0; i < SIZE * SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            boardEl.appendChild(cell);
        }
    }

    function addTile() {
        const empty = [];
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                if (board[r][c] === 0) empty.push({ r, c });
            }
        }
        if (empty.length === 0) return;
        
        const { r, c } = empty[Math.floor(Math.random() * empty.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function render() {
        const cells = document.querySelectorAll('.cell');
        let idx = 0;
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                const val = board[r][c];
                cells[idx].textContent = val || '';
                cells[idx].setAttribute('data-value', val);
                idx++;
            }
        }
        document.getElementById('score').textContent = score;
        // Report score to React Native for multiplayer
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'score', score: score }));
        }
    }

    function slide(row) {
        let arr = row.filter(x => x !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                score += arr[i];
                arr.splice(i + 1, 1);
            }
        }
        while (arr.length < SIZE) arr.push(0);
        return arr;
    }

    function move(dir) {
        let moved = false;
        const oldBoard = JSON.stringify(board);
        
        if (dir === 'left') {
            for (let r = 0; r < SIZE; r++) {
                board[r] = slide(board[r]);
            }
        } else if (dir === 'right') {
            for (let r = 0; r < SIZE; r++) {
                board[r] = slide(board[r].reverse()).reverse();
            }
        } else if (dir === 'up') {
            for (let c = 0; c < SIZE; c++) {
                let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
                col = slide(col);
                for (let r = 0; r < SIZE; r++) board[r][c] = col[r];
            }
        } else if (dir === 'down') {
            for (let c = 0; c < SIZE; c++) {
                let col = [board[3][c], board[2][c], board[1][c], board[0][c]];
                col = slide(col);
                for (let r = 0; r < SIZE; r++) board[SIZE - 1 - r][c] = col[r];
            }
        }
        
        if (JSON.stringify(board) !== oldBoard) {
            addTile();
            render();
            if (isGameOver()) gameOver();
        }
    }

    function isGameOver() {
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                if (board[r][c] === 0) return false;
                if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return false;
                if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return false;
            }
        }
        return true;
    }

    function gameOver() {
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').style.display = 'flex';
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    // Pause/Resume for React Native (2048 doesn't need pause but adding for consistency)
    window.gamePause = function() {};
    window.gameResume = function() {};

    function restart() {
        score = 0;
        document.getElementById('game-over').style.display = 'none';
        createBoard();
        addTile();
        addTile();
        render();
    }

    function setupControls() {
        let startX, startY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            const minSwipe = 30;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > minSwipe) {
                    move(dx > 0 ? 'right' : 'left');
                }
            } else {
                if (Math.abs(dy) > minSwipe) {
                    move(dy > 0 ? 'down' : 'up');
                }
            }
        }, { passive: true });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') move('left');
            if (e.key === 'ArrowRight') move('right');
            if (e.key === 'ArrowUp') move('up');
            if (e.key === 'ArrowDown') move('down');
        });
    }

    window.addEventListener('load', init);
})();
