document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.querySelector('.score-box .value');
    const bestScoreElement = document.querySelector('.best-box .value');
    const movesElement = document.querySelector('.moves-box .value');
    const newGameButton = document.getElementById('new-game-btn');
    // Help button
    const helpButton = document.getElementById('help-button');

    let score = 0; // Counter for the total scored on adding tiles
    let bestScore = 0; // Highest score scored in the session
    let moveCounter = 0; // Counter for the number of tiles moved
    let board = [];
    let promptShown = false;

    // Variables to store initial touch coordinates
    let initialX = null;
    let initialY = null;

    // Function to show the help modal
    function showHelp() {
        const helpModal = document.getElementById('help-modal');
        helpModal.style.display = 'block';
    }

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

    // Function to get random available cell
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

    // Function to place new random tile (mostly it will be used in move)
    function placeRandomTile() {
        const cell = getRandomAvailableCell();
        if (cell !== null) {
            const value = Math.random() < 0.9 ? 2 : 4;
            board[cell.row][cell.col] = value;
        }
    }

    // Function to update the scoreboard display
    function updateScoreboard() {
        if (score > bestScore) {
            bestScore = score;
        }
        // Update the score
        scoreElement.textContent = score;

        // Update the best score
        bestScoreElement.textContent = bestScore;

        // Update the moves
        movesElement.textContent = moveCounter;
    }

    function updateBoard() {
        gameContainer.innerHTML = ''; // Clear the previous state

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tileValue = board[i][j];
                const tile = document.createElement('div');
                tile.className = `tile tile-${tileValue}`;

                // Create a container for the icon and number
                const contentContainer = document.createElement('div');
                contentContainer.className = 'content-container';

                // Set the background icon using the Font Awesome class
                if (tileValue !== 0) {
                    const icon = document.createElement('i');
                    icon.className = `fas ${getIcon(tileValue)}`;
                    // tile.appendChild(icon);
                    contentContainer.appendChild(icon);


                    // Add the tile value (number) to the tile element
                    const tileNumber = document.createElement('div');
                    tileNumber.className = 'tile-number';
                    tileNumber.textContent = tileValue !== 0 ? tileValue : '';
                    contentContainer.appendChild(tileNumber);
                }

                // Append the content container to the tile
                tile.appendChild(contentContainer);

                gameContainer.appendChild(tile);
                positionTile(tile, i, j);

                // Check if the tile value is 2048 and the prompt hasn't been shown
                if (tileValue === 2048 && !promptShown) {
                    // Prompt the user
                    const shouldContinue = window.confirm('Congratulations! You have solved 2048 the Game of 2s! Do you want to continue?');

                    if (!shouldContinue) {
                        // If the user chooses not to continue, start a new game
                        newGame();
                        return;
                    }
                    // Set the promptShown flag to true after showing the prompt
                    promptShown = true;
                    // If the user chooses to continue, we need to add additional logic here
                }
            }
        }
        // Update the scoreboard
        updateScoreboard();
    }

    function getIcon(value) {
        // Define icon classes based on tile values
        const iconClasses = {
            2: 'fa-cat',   // Replace with actual icon class for 2
            4: 'fa-dog',   // Replace with actual icon class for 4
            8: 'fa-car',   // Replace with actual icon class for 8
            16: 'fa-tree', // Replace with actual icon class for 16
            // Add more mappings as needed
        };

        return `fas ${iconClasses[value] || 'fa-question'}`; // Default to a question mark if no mapping found
    }

    // Function to position tile on gameboard
    function positionTile(tile, row, col) {
        const tileSize = 75; // Adjust as needed
        const top = row * tileSize;
        const left = col * tileSize;
        tile.style.top = `${top}px`;
        tile.style.left = `${left}px`;
    }

    // Function to move tiles to the left
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

        // If tiles is moved then increase the move counter and update the scoreboard
        // Place the random tile and update the board
        if (moved) {
            moveCounter++;
            updateScoreboard();
            placeRandomTile();
            updateBoard();
        }
    }

    // Function to move tiles to the right
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
            moveCounter++;
            updateScoreboard();
            placeRandomTile();
            updateBoard();
        }
    }

    // Function to move tiles to the up
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
            moveCounter++;
            updateScoreboard();
            placeRandomTile();
            updateBoard();
        }
    }

    // Function to move tiles to the down
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
            moveCounter++;
            updateScoreboard();
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

        // Update the game board after each touch
        updateBoard();

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

    // Function to check if the game is over
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

    // Function to handle key presses
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

    // Function to start a new game whenever this function is called
    function newGame() {
        board = initializeBoard();
        score = 0;
        moveCounter = 0;
        placeRandomTile();
        placeRandomTile();
        updateBoard();
    }

    // Event listeners for touch events
    gameContainer.addEventListener('touchstart', handleTouchStart);
    gameContainer.addEventListener('touchend', handleTouchEnd);


    // Event listeners for new game
    newGameButton.addEventListener('click', newGame);
    document.addEventListener('keydown', handleKeyPress);

    // Event listeners for gelp button
    helpButton.addEventListener('click', showHelp);

    // Initial setup
    newGame();
});

// Function to hide the help modal
function hideHelp() {
    const helpModal = document.getElementById('help-modal');
    helpModal.style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
    const helpModal = document.getElementById('help-modal');
    if (event.target === helpModal) {
        helpModal.style.display = 'none';
    }
};