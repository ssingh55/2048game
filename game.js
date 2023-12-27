document.addEventListener('DOMContentLoaded', function () {
    const boardSize = 4;
    const board = [];
    let score = 0;

    // Initialize the game board
    function initializeBoard() {
        for (let i = 0; i < boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = 0;
            }
        }
        addNewTile();
        addNewTile();
        updateBoard();
    }

    // Add a new tile to the board
    function addNewTile() {
        const availableTiles = [];
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 0) {
                    availableTiles.push({ row: i, col: j });
                }
            }
        }

        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            const { row, col } = availableTiles[randomIndex];
            board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Update the game board UI
    function updateBoard() {
        const gameBoardElement = document.getElementById('game-board');
        gameBoardElement.innerHTML = '';

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const tileValue = board[i][j];
                const tileElement = document.createElement('div');
                tileElement.className = 'tile';
                tileElement.textContent = tileValue !== 0 ? tileValue : '';
                tileElement.style.backgroundColor = getTileColor(tileValue);
                gameBoardElement.appendChild(tileElement);
            }
        }
    }

    // Get the background color for a tile based on its value
    function getTileColor(value) {
        switch (value) {
            case 2:
                return '#eee4da';
            case 4:
                return '#ede0c8';
            case 8:
                return '#f2b179';
            case 16:
                return '#f59563';
            case 32:
                return '#f67c5f';
            case 64:
                return '#f65e3b';
            case 128:
                return '#edcf72';
            case 256:
                return '#edcc61';
            case 512:
                return '#edc850';
            case 1024:
                return '#edc53f';
            case 2048:
                return '#edc22e';
            default:
                return '#ccc0b3';
        }
    }

    // Handle key presses for game movement
    function handleKeyPress(event) {
        // Add your logic for handling key presses (up, down, left, right)
        // Update the board, add a new tile, and update the UI
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            moveTiles(event.key);
            addNewTile();
            updateBoard();
        }

        if (hasPlayerWon()) {
            alert('Congratulations! You won!'); // You can replace this with your winning message or UI
            resetGame();
        } else if (isGameOver()) {
            alert('Game Over!'); // You can replace this with your endgame message or UI
            resetGame();
        }
    }

    function moveTiles(direction) {
        // Clone the board to check for changes later
        const previousBoard = board.map(row => row.slice());

        switch (direction) {
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
        }

        // Check for changes and update the board if needed
        if (!isBoardEqual(previousBoard, board)) {
            updateBoard();
        }
    }

    // Move tiles to the left
    function moveLeft() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 1; j < boardSize; j++) {
                if (board[i][j] !== 0) {
                    let k = j - 1;
                    while (k >= 0 && board[i][k] === 0) {
                        board[i][k] = board[i][k + 1];
                        board[i][k + 1] = 0;
                        k--;
                    }

                    if (k >= 0 && board[i][k] === board[i][k + 1]) {
                        board[i][k] *= 2;
                        board[i][k + 1] = 0;
                    }
                }
            }
        }
    }

    // Move tiles to the right
    function moveRight() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = boardSize - 2; j >= 0; j--) {
                if (board[i][j] !== 0) {
                    let k = j + 1;
                    while (k < boardSize && board[i][k] === 0) {
                        board[i][k] = board[i][k - 1];
                        board[i][k - 1] = 0;
                        k++;
                    }

                    if (k < boardSize && board[i][k] === board[i][k - 1]) {
                        board[i][k] *= 2;
                        board[i][k - 1] = 0;
                    }
                }
            }
        }
    }

    // Move tiles up
    function moveUp() {
        for (let j = 0; j < boardSize; j++) {
            for (let i = 1; i < boardSize; i++) {
                if (board[i][j] !== 0) {
                    let k = i - 1;
                    while (k >= 0 && board[k][j] === 0) {
                        board[k][j] = board[k + 1][j];
                        board[k + 1][j] = 0;
                        k--;
                    }

                    if (k >= 0 && board[k][j] === board[k + 1][j]) {
                        board[k][j] *= 2;
                        board[k + 1][j] = 0;
                    }
                }
            }
        }
    }

    // Move tiles down
    function moveDown() {
        for (let j = 0; j < boardSize; j++) {
            for (let i = boardSize - 2; i >= 0; i--) {
                if (board[i][j] !== 0) {
                    let k = i + 1;
                    while (k < boardSize && board[k][j] === 0) {
                        board[k][j] = board[k - 1][j];
                        board[k - 1][j] = 0;
                        k++;
                    }

                    if (k < boardSize && board[k][j] === board[k - 1][j]) {
                        board[k][j] *= 2;
                        board[k - 1][j] = 0;
                    }
                }
            }
        }
    }

    // Check if two boards are equal
    function isBoardEqual(board1, board2) {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board1[i][j] !== board2[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Move tiles and merge if possible
    function moveTiles(direction) {
        // Clone the board to check for changes later
        const previousBoard = board.map(row => row.slice());

        switch (direction) {
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
        }

        // Check for changes and update the board if needed
        if (!isBoardEqual(previousBoard, board)) {
            updateBoard();
        }
    }

    // Move tiles to the left
    function moveLeft() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 1; j < boardSize; j++) {
                if (board[i][j] !== 0) {
                    let k = j - 1;
                    while (k >= 0 && board[i][k] === 0) {
                        board[i][k] = board[i][k + 1];
                        board[i][k + 1] = 0;
                        k--;
                    }

                    if (k >= 0 && board[i][k] === board[i][k + 1]) {
                        board[i][k] *= 2;
                        board[i][k + 1] = 0;
                    }
                }
            }
        }
    }

    // Move tiles to the right
    function moveRight() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = boardSize - 2; j >= 0; j--) {
                if (board[i][j] !== 0) {
                    let k = j + 1;
                    while (k < boardSize && board[i][k] === 0) {
                        board[i][k] = board[i][k - 1];
                        board[i][k - 1] = 0;
                        k++;
                    }

                    if (k < boardSize && board[i][k] === board[i][k - 1]) {
                        board[i][k] *= 2;
                        board[i][k - 1] = 0;
                    }
                }
            }
        }
    }

    // Move tiles up
    function moveUp() {
        for (let j = 0; j < boardSize; j++) {
            for (let i = 1; i < boardSize; i++) {
                if (board[i][j] !== 0) {
                    let k = i - 1;
                    while (k >= 0 && board[k][j] === 0) {
                        board[k][j] = board[k + 1][j];
                        board[k + 1][j] = 0;
                        k--;
                    }

                    if (k >= 0 && board[k][j] === board[k + 1][j]) {
                        board[k][j] *= 2;
                        board[k + 1][j] = 0;
                    }
                }
            }
        }
    }

    // Move tiles down
    function moveDown() {
        for (let j = 0; j < boardSize; j++) {
            for (let i = boardSize - 2; i >= 0; i--) {
                if (board[i][j] !== 0) {
                    let k = i + 1;
                    while (k < boardSize && board[k][j] === 0) {
                        board[k][j] = board[k - 1][j];
                        board[k - 1][j] = 0;
                        k++;
                    }

                    if (k < boardSize && board[k][j] === board[k - 1][j]) {
                        board[k][j] *= 2;
                        board[k - 1][j] = 0;
                    }
                }
            }
        }
    }

    // Check if two boards are equal
    function isBoardEqual(board1, board2) {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board1[i][j] !== board2[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Check if the game is over
    function isGameOver() {
        // Check for empty cells
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 0) {
                    return false;
                }
            }
        }

        // Check for possible merges
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize - 1; j++) {
                if (board[i][j] === board[i][j + 1]) {
                    return false;
                }
            }
        }

        for (let j = 0; j < boardSize; j++) {
            for (let i = 0; i < boardSize - 1; i++) {
                if (board[i][j] === board[i + 1][j]) {
                    return false;
                }
            }
        }

        return true;
    }

    // Check if the player has won
    function hasPlayerWon() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }


    // Reset the game
    function resetGame() {
        // Reset the board, score, or any other game state variables
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = 0;
            }
        }
        score = 0;

        // Initialize the board with two new tiles
        addNewTile();
        addNewTile();

        // Update the board UI
        updateBoard();
    }


    // Initialize the game
    initializeBoard();

    // Add event listener for key presses
    document.addEventListener('keydown', handleKeyPress);
});
