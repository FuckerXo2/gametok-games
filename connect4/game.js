// Connect 4 - Get 4 in a row
(function() {
    'use strict';

    const ROWS = 6;
    const COLS = 7;
    let board = [];
    let currentPlayer = 'red';
    let gameOver = false;
    let isAITurn = false;

    function init() {

        // Expose startGame globally so app can trigger it
        window.startGame = startGame;
    }

    function startGame() {
        board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
        currentPlayer = 'red';
        gameOver = false;
        isAITurn = false;
        
        createBoard();

        document.getElementById('game-container').classList.remove('hidden');
        updateStatus();
    }

    function createBoard() {
        const boardEl = document.getElementById('board');
        boardEl.innerHTML = '';
        
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleClick(col));
                boardEl.appendChild(cell);
            }
        }
    }

    function handleClick(col) {
        if (gameOver || isAITurn) return;
        
        const row = getLowestEmptyRow(col);
        if (row === -1) return;
        
        dropPiece(row, col, 'red');
        
        if (checkWin(row, col, 'red')) {
            endGame('red');
            return;
        }
        
        if (isBoardFull()) {
            endGame('draw');
            return;
        }
        
        currentPlayer = 'yellow';
        updateStatus();
        isAITurn = true;
        
        setTimeout(aiMove, 500);
    }

    function aiMove() {
        if (gameOver) return;
        
        // Simple AI: Try to win, block, or random
        let col = findWinningMove('yellow');
        if (col === -1) col = findWinningMove('red');
        if (col === -1) col = findBestMove();
        
        const row = getLowestEmptyRow(col);
        if (row === -1) return;
        
        dropPiece(row, col, 'yellow');
        
        if (checkWin(row, col, 'yellow')) {
            endGame('yellow');
            return;
        }
        
        if (isBoardFull()) {
            endGame('draw');
            return;
        }
        
        currentPlayer = 'red';
        isAITurn = false;
        updateStatus();
    }

    function findWinningMove(player) {
        for (let col = 0; col < COLS; col++) {
            const row = getLowestEmptyRow(col);
            if (row === -1) continue;
            
            board[row][col] = player;
            const wins = checkWin(row, col, player);
            board[row][col] = null;
            
            if (wins) return col;
        }
        return -1;
    }

    function findBestMove() {
        // Prefer center columns
        const order = [3, 2, 4, 1, 5, 0, 6];
        for (let col of order) {
            if (getLowestEmptyRow(col) !== -1) return col;
        }
        return 0;
    }

    function getLowestEmptyRow(col) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!board[row][col]) return row;
        }
        return -1;
    }

    function dropPiece(row, col, player) {
        board[row][col] = player;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(player);
    }

    function checkWin(row, col, player) {
        const directions = [
            [[0, 1], [0, -1]],   // Horizontal
            [[1, 0], [-1, 0]],   // Vertical
            [[1, 1], [-1, -1]], // Diagonal
            [[1, -1], [-1, 1]]  // Anti-diagonal
        ];
        
        for (let [dir1, dir2] of directions) {
            let count = 1;
            const cells = [[row, col]];
            
            for (let [dr, dc] of [dir1, dir2]) {
                let r = row + dr;
                let c = col + dc;
                while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                    count++;
                    cells.push([r, c]);
                    r += dr;
                    c += dc;
                }
            }
            
            if (count >= 4) {
                // Highlight winning cells
                for (let [r, c] of cells.slice(0, 4)) {
                    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                    cell.classList.add('win');
                }
                return true;
            }
        }
        return false;
    }

    function isBoardFull() {
        return board[0].every(cell => cell !== null);
    }

    function updateStatus() {
        const status = document.getElementById('status');
        if (currentPlayer === 'red') {
            status.textContent = 'Your turn (Red)';
            status.style.color = '#ef4444';
        } else {
            status.textContent = 'AI thinking...';
            status.style.color = '#fbbf24';
        }
    }

    function endGame(winner) {
        gameOver = true;
        const result = document.getElementById('result');
        
        if (winner === 'red') {
            result.textContent = 'You Win!';
            result.className = 'result red';
        } else if (winner === 'yellow') {
            result.textContent = 'AI Wins!';
            result.className = 'result yellow';
        } else {
            result.textContent = "It's a Draw!";
            result.className = 'result';
            result.style.color = '#fff';
        }
        
        setTimeout(() => {
            
            document.getElementById('game-container').classList.add('hidden');
        }, 1000);
        
        if (window.ReactNativeWebView) {
            const score = winner === 'red' ? 100 : winner === 'draw' ? 50 : 0;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    window.addEventListener('load', init);
})();
