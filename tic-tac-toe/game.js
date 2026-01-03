// Tic Tac Toe - Play against AI
(function() {
    'use strict';

    let board = [];
    let currentPlayer = 'X';
    let gameActive = true;
    let playerScore = 0;
    let aiScore = 0;
    let gamesPlayed = 0;
    const MAX_GAMES = 5;

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    function init() {
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
        
        // Auto-start game
        setTimeout(startGame, 100);
    }

    function startGame() {
        playerScore = 0;
        aiScore = 0;
        gamesPlayed = 0;
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        
        updateScoreBoard();
        newRound();
    }

    function newRound() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        const boardEl = document.getElementById('board');
        boardEl.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => makeMove(i));
            boardEl.appendChild(cell);
        }
        
        document.getElementById('status').textContent = 'Your turn (X)';
    }

    function makeMove(index) {
        if (!gameActive || board[index] || currentPlayer !== 'X') return;
        
        board[index] = 'X';
        updateBoard();
        
        if (checkWin('X')) {
            endRound('X');
            return;
        }
        
        if (board.every(cell => cell)) {
            endRound('draw');
            return;
        }
        
        currentPlayer = 'O';
        document.getElementById('status').textContent = 'AI thinking...';
        
        setTimeout(aiMove, 500);
    }

    function aiMove() {
        if (!gameActive) return;
        
        // Try to win
        let move = findWinningMove('O');
        
        // Block player
        if (move === -1) move = findWinningMove('X');
        
        // Take center
        if (move === -1 && !board[4]) move = 4;
        
        // Take corner
        if (move === -1) {
            const corners = [0, 2, 6, 8].filter(i => !board[i]);
            if (corners.length) move = corners[Math.floor(Math.random() * corners.length)];
        }
        
        // Take any
        if (move === -1) {
            const empty = board.map((v, i) => v ? -1 : i).filter(i => i !== -1);
            move = empty[Math.floor(Math.random() * empty.length)];
        }
        
        board[move] = 'O';
        updateBoard();
        
        if (checkWin('O')) {
            endRound('O');
            return;
        }
        
        if (board.every(cell => cell)) {
            endRound('draw');
            return;
        }
        
        currentPlayer = 'X';
        document.getElementById('status').textContent = 'Your turn (X)';
    }

    function findWinningMove(player) {
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            const line = [board[a], board[b], board[c]];
            const playerCount = line.filter(v => v === player).length;
            const emptyCount = line.filter(v => v === '').length;
            
            if (playerCount === 2 && emptyCount === 1) {
                return pattern[line.indexOf('')];
            }
        }
        return -1;
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, i) => {
            cell.textContent = board[i];
            cell.className = 'cell' + (board[i] ? ' ' + board[i].toLowerCase() : '');
        });
    }

    function checkWin(player) {
        for (let pattern of winPatterns) {
            if (pattern.every(i => board[i] === player)) {
                // Highlight winning cells
                const cells = document.querySelectorAll('.cell');
                pattern.forEach(i => cells[i].classList.add('win'));
                return true;
            }
        }
        return false;
    }

    function endRound(winner) {
        gameActive = false;
        gamesPlayed++;
        
        if (winner === 'X') {
            playerScore++;
            document.getElementById('status').textContent = 'You win! 🎉';
        } else if (winner === 'O') {
            aiScore++;
            document.getElementById('status').textContent = 'AI wins! 🤖';
        } else {
            document.getElementById('status').textContent = "It's a draw!";
        }
        
        updateScoreBoard();
        
        if (gamesPlayed >= MAX_GAMES) {
            setTimeout(gameOver, 1500);
        } else {
            setTimeout(newRound, 2000);
        }
    }

    function updateScoreBoard() {
        document.getElementById('player-score').textContent = playerScore;
        document.getElementById('ai-score').textContent = aiScore;
    }

    function gameOver() {
        document.getElementById('game-area').classList.add('hidden');
        
        let title = 'GAME OVER';
        if (playerScore > aiScore) title = 'YOU WIN! 🎉';
        else if (aiScore > playerScore) title = 'AI WINS! 🤖';
        else title = "IT'S A TIE!";
        
        document.getElementById('result-title').textContent = title;
        document.getElementById('final-result').textContent = `${playerScore} - ${aiScore}`;
        document.getElementById('game-over').classList.remove('hidden');
        
        const score = playerScore * 100;
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    window.addEventListener('load', init);
})();
