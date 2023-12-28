document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const newGameButton = document.getElementById('new-game-btn');

    let score = 0;
    let highScore = 0;
    let board = [];

    // Variables to store initial touch coordinates
    let initialX = null;
    let initialY = null;

    // Function to initialize the game board
    function initializeBoard() {
        const newBoard = [];
        for (let i = 0; i < 4; i++) {
            newBoard[i] = [];
            for (let j = 0; j < 4; j++) {
                newBoard[i][j] = 0;
            }
        }
        return newBoard;
    }

    function getRandomAvailableCell() {
        const availableCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    availableCells.push({ row: i, col: j });
                }
            }
        }
        if (availableCells.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        return availableCells[randomIndex];
    }

    function placeRandomTile() {
        const cell = getRandomAvailableCell();
        if (cell !== null) {
            const value = Math.random() < 0.9 ? 2 : 4;
            board[cell.row][cell.col] = value;
        }
    }

    function updateBoard() {
        gameContainer.innerHTML = ''; // Clear the previous state

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tileValue = board[i][j];
                const tile = document.createElement('div');
                tile.className = `tile tile-${tileValue}`;
                tile.textContent = tileValue !== 0 ? tileValue : '';
                gameContainer.appendChild(tile);
                positionTile(tile, i, j);
            }
        }

        updateScore();
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = `High Score: ${highScore}`;
        }
    }

    function positionTile(tile, row, col) {
        const tileSize = 75; // Adjust as needed
        const top = row * tileSize;
        const left = col * tileSize;
        tile.style.top = `${top}px`;
        tile.style.left = `${left}px`;
    }

    function moveLeft() {
        let moved = false;

        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
                if (board[i][j] !== 0) {
                    let col = j;
                    while (col > 0 && board[i][col - 1] === 0) {
                        board[i][col - 1] = board[i][col];
                        board[i][col] = 0;
                        col--;
                        moved = true;
                    }

                    if (col > 0 && board[i][col - 1] === board[i][col]) {
                        board[i][col - 1] *= 2;
                        score += board[i][col - 1];
                        board[i][col] = 0;
                        moved = true;
                    }
                }
            }
        }

        if (moved) {
            placeRandomTile();
            updateBoard();
        }
    }

    function moveRight() {
        let moved = false;

        for (let i = 0; i < 4; i++) {
            for (let j = 2; j >= 0; j--) {
                if (board[i][j] !== 0) {
                    let col = j;
                    while (col < 3 && board[i][col + 1] === 0) {
                        board[i][col + 1] = board[i][col];
                        board[i][col] = 0;
                        col++;
                        moved = true;
                    }

                    if (col < 3 && board[i][col + 1] === board[i][col]) {
                        board[i][col + 1] *= 2;
                        score += board[i][col + 1];
                        board[i][col] = 0;
                        moved = true;
                    }
                }
            }
        }

        if (moved) {
            placeRandomTile();
            updateBoard();
        }
    }

    function moveUp() {
        let moved = false;

        for (let j = 0; j < 4; j++) {
            for (let i = 1; i < 4; i++) {
                if (board[i][j] !== 0) {
                    let row = i;
                    while (row > 0 && board[row - 1][j] === 0) {
                        board[row - 1][j] = board[row][j];
                        board[row][j] = 0;
                        row--;
                        moved = true;
                    }

                    if (row > 0 && board[row - 1][j] === board[row][j]) {
                        board[row - 1][j] *= 2;
                        score += board[row - 1][j];
                        board[row][j] = 0;
                        moved = true;
                    }
                }
            }
        }

        if (moved) {
            placeRandomTile();
            updateBoard();
        }
    }

    function moveDown() {
        let moved = false;

        for (let j = 0; j < 4; j++) {
            for (let i = 2; i >= 0; i--) {
                if (board[i][j] !== 0) {
                    let row = i;
                    while (row < 3 && board[row + 1][j] === 0) {
                        board[row + 1][j] = board[row][j];
                        board[row][j] = 0;
                        row++;
                        moved = true;
                    }

                    if (row < 3 && board[row + 1][j] === board[row][j]) {
                        board[row + 1][j] *= 2;
                        score += board[row + 1][j];
                        board[row][j] = 0;
                        moved = true;
                    }
                }
            }
        }

        if (moved) {
            placeRandomTile();
            updateBoard();
        }
    }

    function mergeTiles() {
        // This function is already used within moveLeft, moveRight, moveUp, and moveDown
        // It merges adjacent tiles with the same value
    }

    // Touch function starts here

    // Function to handle touch start event
    function handleTouchStart(event) {
        const touchWithinGame = isTouchWithinGame(event.touches[0]);
        if (touchWithinGame) {
            initialX = event.touches[0].clientX;
            initialY = event.touches[0].clientY;
            event.preventDefault(); // Prevent default scrolling behavior
        }
    }

    // Function to handle touch end event
    function handleTouchEnd(event) {
        // Determine the direction based on the initial and final touch positions
        // Call the corresponding movement function (e.g., moveLeft, moveRight, moveUp, moveDown)
        if (initialX === null || initialY === null) {
            return; // Ignore if touch start coordinates are not set
        }

        const finalX = event.changedTouches[0].clientX;
        const finalY = event.changedTouches[0].clientY;

        const deltaX = finalX - initialX;
        const deltaY = finalY - initialY;

        // Determine the direction based on the difference in coordinates
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                moveRight();
            } else {
                moveLeft();
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                moveDown();
            } else {
                moveUp();
            }
        }

        if (isGameOver()) {
            // Perform actions for game over
            console.log('Game Over!');
            // setTimeout(() => {
            //     alert('Game Over!');
            // }, 100);
        }

        // Reset initial touch coordinates
        initialX = null;
        initialY = null;
    }

    // Function to check if a touch event is within the game container
    function isTouchWithinGame(touch) {
        const rect = gameContainer.getBoundingClientRect();
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        return (
            touchX >= rect.left &&
            touchX <= rect.right &&
            touchY >= rect.top &&
            touchY <= rect.bottom
        );
    }

    // Touch function ends here

    function isGameOver() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    return false;
                }

                if (
                    (j < 3 && board[i][j] === board[i][j + 1]) ||
                    (i < 3 && board[i][j] === board[i + 1][j])
                ) {
                    return false;
                }
            }
        }

        alert('Game Over! Your score: ' + score);
        newGame();
        return true;
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            default:
                return; // Ignore other key presses
        }

        isGameOver();
    }

    function newGame() {
        board = initializeBoard();
        score = 0;
        placeRandomTile();
        placeRandomTile();
        updateBoard();
    }

    // Event listeners for touch events
    gameContainer.addEventListener('touchstart', handleTouchStart);
    gameContainer.addEventListener('touchend', handleTouchEnd);


    // Event listeners
    newGameButton.addEventListener('click', newGame);
    document.addEventListener('keydown', handleKeyPress);

    // Initial setup
    newGame();
});
