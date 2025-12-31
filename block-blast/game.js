// Block Blast - Place blocks to clear lines
(function() {
    'use strict';

    const SIZE = 8;
    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b'];
    
    // Block shapes (relative positions)
    const SHAPES = [
        [[0,0]], // Single
        [[0,0], [1,0]], // 2 horizontal
        [[0,0], [0,1]], // 2 vertical
        [[0,0], [1,0], [2,0]], // 3 horizontal
        [[0,0], [0,1], [0,2]], // 3 vertical
        [[0,0], [1,0], [0,1]], // L small
        [[0,0], [1,0], [1,1]], // L small reverse
        [[0,0], [0,1], [1,1]], // L small 2
        [[0,0], [1,0], [0,1], [1,1]], // Square
        [[0,0], [1,0], [2,0], [3,0]], // 4 horizontal
        [[0,0], [0,1], [0,2], [0,3]], // 4 vertical
        [[0,0], [1,0], [2,0], [0,1]], // L
        [[0,0], [0,1], [0,2], [1,2]], // L vertical
        [[0,0], [1,0], [2,0], [1,1]], // T
        [[0,0], [0,1], [1,1], [0,2]], // S
    ];

    let board = [];
    let pieces = [];
    let score = 0;
    let dragPiece = null;
    let dragOffset = { x: 0, y: 0 };
    let previewCells = [];

    function init() {
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', startGame);
    }

    function startGame() {
        board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
        score = 0;
        pieces = [];
        
        createBoard();
        generatePieces();
        updateScore();
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
    }

    function createBoard() {
        const boardEl = document.getElementById('board');
        boardEl.innerHTML = '';
        
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                boardEl.appendChild(cell);
            }
        }
    }

    function generatePieces() {
        pieces = [];
        const container = document.getElementById('pieces-container');
        container.innerHTML = '';
        
        for (let i = 0; i < 3; i++) {
            const shapeIdx = Math.floor(Math.random() * SHAPES.length);
            const shape = SHAPES[shapeIdx];
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            
            pieces.push({ shape, color, used: false });
            
            const holder = document.createElement('div');
            holder.className = 'piece-holder';
            holder.dataset.index = i;
            
            const piece = createPieceElement(shape, color);
            holder.appendChild(piece);
            
            setupDrag(holder, i);
            container.appendChild(holder);
        }
    }

    function createPieceElement(shape, color) {
        const piece = document.createElement('div');
        piece.className = 'piece';
        
        // Find bounds
        let maxRow = 0, maxCol = 0;
        for (let [r, c] of shape) {
            maxRow = Math.max(maxRow, r);
            maxCol = Math.max(maxCol, c);
        }
        
        piece.style.gridTemplateColumns = `repeat(${maxCol + 1}, 1fr)`;
        piece.style.gridTemplateRows = `repeat(${maxRow + 1}, 1fr)`;
        
        // Create grid
        for (let r = 0; r <= maxRow; r++) {
            for (let c = 0; c <= maxCol; c++) {
                const cell = document.createElement('div');
                cell.className = 'piece-cell';
                if (shape.some(([sr, sc]) => sr === r && sc === c)) {
                    cell.classList.add('filled');
                    cell.style.background = color;
                }
                piece.appendChild(cell);
            }
        }
        
        return piece;
    }

    function setupDrag(holder, index) {
        let startX, startY;
        
        const onStart = (e) => {
            if (pieces[index].used) return;
            e.preventDefault();
            
            const touch = e.touches ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;
            
            dragPiece = index;
            holder.classList.add('dragging');
        };
        
        const onMove = (e) => {
            if (dragPiece === null) return;
            e.preventDefault();
            
            const touch = e.touches ? e.touches[0] : e;
            const boardEl = document.getElementById('board');
            const rect = boardEl.getBoundingClientRect();
            const cellSize = rect.width / SIZE;
            
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top - 60; // Offset for finger
            
            const col = Math.floor(x / cellSize);
            const row = Math.floor(y / cellSize);
            
            clearPreview();
            
            if (canPlace(pieces[dragPiece].shape, row, col)) {
                showPreview(pieces[dragPiece].shape, row, col, true);
            } else if (row >= 0 && row < SIZE && col >= 0 && col < SIZE) {
                showPreview(pieces[dragPiece].shape, row, col, false);
            }
        };
        
        const onEnd = (e) => {
            if (dragPiece === null) return;
            
            const touch = e.changedTouches ? e.changedTouches[0] : e;
            const boardEl = document.getElementById('board');
            const rect = boardEl.getBoundingClientRect();
            const cellSize = rect.width / SIZE;
            
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top - 60;
            
            const col = Math.floor(x / cellSize);
            const row = Math.floor(y / cellSize);
            
            if (canPlace(pieces[dragPiece].shape, row, col)) {
                placePiece(dragPiece, row, col);
            }
            
            clearPreview();
            holder.classList.remove('dragging');
            dragPiece = null;
        };
        
        holder.addEventListener('touchstart', onStart, { passive: false });
        holder.addEventListener('mousedown', onStart);
        
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mousemove', onMove);
        
        document.addEventListener('touchend', onEnd);
        document.addEventListener('mouseup', onEnd);
    }

    function canPlace(shape, row, col) {
        for (let [r, c] of shape) {
            const newRow = row + r;
            const newCol = col + c;
            
            if (newRow < 0 || newRow >= SIZE || newCol < 0 || newCol >= SIZE) {
                return false;
            }
            if (board[newRow][newCol] !== null) {
                return false;
            }
        }
        return true;
    }

    function showPreview(shape, row, col, valid) {
        previewCells = [];
        const cells = document.querySelectorAll('.cell');
        
        for (let [r, c] of shape) {
            const newRow = row + r;
            const newCol = col + c;
            
            if (newRow >= 0 && newRow < SIZE && newCol >= 0 && newCol < SIZE) {
                const idx = newRow * SIZE + newCol;
                cells[idx].classList.add(valid ? 'preview' : 'invalid');
                previewCells.push(idx);
            }
        }
    }

    function clearPreview() {
        const cells = document.querySelectorAll('.cell');
        for (let idx of previewCells) {
            cells[idx].classList.remove('preview', 'invalid');
        }
        previewCells = [];
    }

    function placePiece(pieceIndex, row, col) {
        const piece = pieces[pieceIndex];
        const cells = document.querySelectorAll('.cell');
        
        // Place on board
        for (let [r, c] of piece.shape) {
            const newRow = row + r;
            const newCol = col + c;
            board[newRow][newCol] = piece.color;
            
            const idx = newRow * SIZE + newCol;
            cells[idx].classList.add('filled');
            cells[idx].style.background = piece.color;
        }
        
        // Mark piece as used
        piece.used = true;
        const holder = document.querySelector(`.piece-holder[data-index="${pieceIndex}"]`);
        holder.innerHTML = '';
        holder.style.opacity = '0.3';
        
        // Check for completed lines
        checkLines();
        
        // Check if all pieces used
        if (pieces.every(p => p.used)) {
            generatePieces();
        }
        
        // Check game over
        if (isGameOver()) {
            gameOver();
        }
    }

    function checkLines() {
        const cells = document.querySelectorAll('.cell');
        let clearedRows = [];
        let clearedCols = [];
        
        // Check rows
        for (let row = 0; row < SIZE; row++) {
            if (board[row].every(cell => cell !== null)) {
                clearedRows.push(row);
            }
        }
        
        // Check columns
        for (let col = 0; col < SIZE; col++) {
            let full = true;
            for (let row = 0; row < SIZE; row++) {
                if (board[row][col] === null) {
                    full = false;
                    break;
                }
            }
            if (full) clearedCols.push(col);
        }
        
        // Clear rows
        for (let row of clearedRows) {
            for (let col = 0; col < SIZE; col++) {
                board[row][col] = null;
                const idx = row * SIZE + col;
                cells[idx].classList.remove('filled');
                cells[idx].style.background = '';
            }
        }
        
        // Clear columns
        for (let col of clearedCols) {
            for (let row = 0; row < SIZE; row++) {
                board[row][col] = null;
                const idx = row * SIZE + col;
                cells[idx].classList.remove('filled');
                cells[idx].style.background = '';
            }
        }
        
        // Score
        const linesCleared = clearedRows.length + clearedCols.length;
        if (linesCleared > 0) {
            score += linesCleared * SIZE * (linesCleared > 1 ? 2 : 1); // Bonus for multiple
            updateScore();
        }
    }

    function isGameOver() {
        // Check if any remaining piece can be placed
        for (let piece of pieces) {
            if (piece.used) continue;
            
            for (let row = 0; row < SIZE; row++) {
                for (let col = 0; col < SIZE; col++) {
                    if (canPlace(piece.shape, row, col)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function gameOver() {
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('game-container').classList.add('hidden');
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'gameOver', score: score }));
        }
    }

    function updateScore() {
        document.getElementById('score-display').textContent = score;
    }

    window.addEventListener('load', init);
})();
