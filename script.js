const gameBoard = (function () {
    const board = [];

    const cleanBoard = () => {
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i].push("I");
            }
        }
    };

    const boardRenderer = () => {
        return board.reduce((str, row, i) => {
            row.forEach((cell, i) => {
                str += cell;
                if (i !== 2) str += "   ";
            });
            if (i !== 2) str += "\n";
            return str;
        }, "");
    };

    const getBoard = () => board;

    const updateWithPlayerChoice = (row, column) => {
        if (board[row - 1][column - 1] !== "I") return false;
        board[row - 1][column - 1] = gameLogic.getCurrent().marker;
    };

    const checkForFull = () => {
        let arr = [];
        board.forEach((row) => {
            row.forEach((cell) => {
                if (cell === "I") arr.push("I");
            });
        });
        return arr.length === 0 ? true : false;
    };

    cleanBoard();

    return {
        getBoard,
        updateWithPlayerChoice,
        boardRenderer,
        cleanBoard,
        checkForFull,
    };
})();

const players = (function () {
    const players = [
        {
            name: null,
            marker: "X",
        },
        {
            name: null,
            marker: "O",
        },
    ];

    const getPlayer = (index) => players[index];

    const changeName = (index, name) => {
        players[index].name = name;
    };

    return { getPlayer, changeName };
})();

const gameLogic = (function () {
    let currentPlayer;

    const getCurrent = () => currentPlayer;

    const setStartingPlayer = (userInput) => {
        switch (userInput) {
            case 1:
                currentPlayer = players.getPlayer(0);
                break;
            case 2:
                currentPlayer = players.getPlayer(1);
                break;
            case 3:
                const randomNum = Math.floor(Math.random() * 2);
                currentPlayer = players.getPlayer(randomNum);
                break;
        }
    };

    const changeTurn = () => {
        currentPlayer =
            currentPlayer === players.getPlayer(0)
                ? players.getPlayer(1)
                : players.getPlayer(0);
    };

    const playerTurnRenderer = () => {
        return `it's ${currentPlayer.name}'s turn`;
    };

    const winnerRenderer = () => {
        return `${currentPlayer.name} won!`;
    };

    const noWinnerRenderer = () => {
        return "There was no winner";
    };

    const playerInputGuideRenderer = () => {
        return (
            "Please enter your input in the following format or the game will end:\n" +
            '"row number, column number"'
        );
    };

    const checkRow = (row) => {
        return gameBoard
            .getBoard()
            [row - 1].filter((cell) => cell === currentPlayer.marker).length ===
            3
            ? true
            : false;
    };

    const checkColumn = (column) => {
        const arr = [];
        for (let i = 0; i < 3; i++) {
            if (gameBoard.getBoard()[i][column - 1] === currentPlayer.marker)
                arr.push(currentPlayer.marker);
        }
        return arr.length === 3 ? true : false;
    };

    //lineNumber 1 = top left to bottom right
    //lineNumber 2 = top right to bottom left
    const slopeLinesCheck = (lineNumber) => {
        const arr = [];
        if (lineNumber === 1) {
            for (let i = 0; i < 3; i++) {
                if (gameBoard.getBoard()[i][i] === currentPlayer.marker)
                    arr.push(currentPlayer.marker);
            }
        } else {
            for (let i = 0; i < 3; i++) {
                if (gameBoard.getBoard()[i][2 - i] === currentPlayer.marker)
                    arr.push(currentPlayer.marker);
            }
        }
        return arr.length === 3 ? true : false;
    };

    const checkForWinner = () => {
        let hasWinner = false;
        for (let i = 1; i <= 3; i++) {
            if (checkRow(i) || checkColumn(i)) hasWinner = true;
        }
        for (let i = 1; i <= 2; i++) {
            if (slopeLinesCheck(i)) hasWinner = true;
        }
        return hasWinner;
    };

    return {
        setStartingPlayer,
        getCurrent,
        changeTurn,
        playerTurnRenderer,
        winnerRenderer,
        noWinnerRenderer,
        playerInputGuideRenderer,
        checkForWinner,
    };
})();

const gameFlow = (function () {
    const setPlayerNames = () => {
        for (let i = 0; i < 2; i++) {
            players.changeName(
                i,
                prompt(
                    `please enter the player ${
                        i === 0 ? "one" : "two"
                    }'s name with marker "${players.getPlayer(i).marker}"`
                )
            );
        }
    };

    const startingPlayer = () => {
        gameLogic.setStartingPlayer(
            +prompt(
                "Which player should start the game?" +
                    "\n\n" +
                    "[1] Player number 1" +
                    "\n" +
                    "[2] Player number 2" +
                    "\n" +
                    "[3] Random"
            )
        );
    };

    const playRound = () => {
        let playerChoice = gameBoard.updateWithPlayerChoice(
            ...prompt(
                `${gameLogic.playerTurnRenderer()}\n\n` +
                    `${gameBoard.boardRenderer()}\n\n` +
                    `${gameLogic.playerInputGuideRenderer()}\n`
            )
                .split(",")
                .map((num) => +num)
        );
        while (playerChoice === false) {
            alert("The inputted cell is marked already");
            playerChoice = gameBoard.updateWithPlayerChoice(
                ...prompt(
                    `${gameLogic.playerTurnRenderer()}\n\n` +
                        `${gameBoard.boardRenderer()}\n\n` +
                        `${gameLogic.playerInputGuideRenderer()}\n`
                )
                    .split(",")
                    .map((num) => +num)
            );
        }
        if (gameLogic.checkForWinner() === false) {
            gameLogic.changeTurn();
        } else {
            return true;
        }
    };

    const oneFullGame = () => {
        let haveWinner = false;
        startingPlayer();
        while (1) {
            let isWin = playRound();
            let isFull = gameBoard.checkForFull();
            if (isFull === true) break;
            if (isWin === true) {
                haveWinner = true;
                break;
            }
        }
        if (haveWinner === true) {
            alert(
                `${gameLogic.winnerRenderer()}\n\n` +
                    `${gameBoard.boardRenderer()}\n`
            );
        } else {
            alert(
                `${gameLogic.noWinnerRenderer()}\n\n` +
                    `${gameBoard.boardRenderer()}\n`
            );
        }
        return +prompt(
            "Do you want to play again?\n\n" + "[1] Yes\n" + "[2] No\n"
        );
    };
    return { setPlayerNames, startingPlayer, playRound, oneFullGame };
})();

function startGame() {
    gameFlow.setPlayerNames();
    while (1) {
        let playAgain = gameFlow.oneFullGame();
        if (playAgain === 1) {
            gameBoard.cleanBoard();
        } else break;
    }
    alert("Thank you for playing my game");
}

startGame();
