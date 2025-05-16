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
        cleanBoard,
        checkForFull,
    };
})();

const players = (function () {
    const players = [
        {
            name: null,
            marker: "O",
            color: "#87cefa",
        },
        {
            name: null,
            marker: "X",
            color: "#f08080",
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
        checkForWinner,
    };
})();

const GUIprops = (function () {
    const span = document.querySelector(".player-turn span");

    const setNames = () => {
        const inputFields = document.querySelectorAll("#player-name");
        inputFields.forEach((elm, i) => {
            players.changeName(i, elm.value.trim());
            document.querySelector(
                `.container div:nth-child(${i + 1})`
            ).textContent = elm.value;
        });
    };

    const setStartingPlayer = () => {
        const options = document.querySelectorAll(".container div");
        options.forEach((elm) => {
            if (elm.classList.contains("selected"))
                gameLogic.setStartingPlayer(+elm.dataset.player);
        });
    };

    const setSpan = () => {
        span.textContent = gameLogic.getCurrent().name;
        span.style.color = gameLogic.getCurrent().color;
    };

    const placeMarker = (cell) => {
        cell.innerHTML =
            gameLogic.getCurrent().marker === "O"
                ? `<svg
                    class="circle"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="#e3e3e3"
                >
                    <path
                        d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                    />
                </svg>`
                : `<svg
                    class="x"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="#e3e3e3"
                >
                    <path
                        d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                    />
                </svg>`;
    };

    return { setNames, setStartingPlayer, setSpan, placeMarker };
})();

const actions = (function () {
    document.querySelector(".next-btn").addEventListener("click", () => {
        GUIprops.setNames();
    });

    document.querySelector(".play-btn").addEventListener("click", () => {
        GUIprops.setStartingPlayer();
        GUIprops.setSpan();
    });

    const gridCells = document.querySelectorAll(".grid div");
    gridCells.forEach((cell) => {
        cell.addEventListener("click", () => {
            if (cell.firstElementChild !== null) {
                cell.firstElementChild.classList.add("error--short");
                setTimeout(() => {
                    cell.firstElementChild.classList.remove("error--short");
                }, 300);
                return;
            }
            GUIprops.placeMarker(cell);
            gameBoard.updateWithPlayerChoice(
                +cell.dataset.row,
                +cell.dataset.col
            );
            gameLogic.changeTurn();
            GUIprops.setSpan();
        });
    });
})();

// const gameFlow = (function () {
//     const setPlayerNames = () => {
//         for (let i = 0; i < 2; i++) {
//             players.changeName(
//                 i,
//                 prompt(
//                     `please enter the player ${
//                         i === 0 ? "one" : "two"
//                     }'s name with marker "${players.getPlayer(i).marker}"`
//                 )
//             );
//         }
//     };

//     const startingPlayer = () => {
//         gameLogic.setStartingPlayer(
//             +prompt(
//                 "Which player should start the game?" +
//                     "\n\n" +
//                     "[1] Player number 1" +
//                     "\n" +
//                     "[2] Player number 2" +
//                     "\n" +
//                     "[3] Random"
//             )
//         );
//     };

//     const playRound = () => {
//         let playerChoice = gameBoard.updateWithPlayerChoice(
//             ...prompt(
//                 `${gameLogic.playerTurnRenderer()}\n\n` +
//                     `${gameBoard.boardRenderer()}\n\n` +
//                     `${gameLogic.playerInputGuideRenderer()}\n`
//             )
//                 .split(",")
//                 .map((num) => +num)
//         );
//         while (playerChoice === false) {
//             alert("The inputted cell is marked already");
//             playerChoice = gameBoard.updateWithPlayerChoice(
//                 ...prompt(
//                     `${gameLogic.playerTurnRenderer()}\n\n` +
//                         `${gameBoard.boardRenderer()}\n\n` +
//                         `${gameLogic.playerInputGuideRenderer()}\n`
//                 )
//                     .split(",")
//                     .map((num) => +num)
//             );
//         }
//         if (gameLogic.checkForWinner() === false) {
//             gameLogic.changeTurn();
//         } else {
//             return true;
//         }
//     };

//     const oneFullGame = () => {
//         let haveWinner = false;
//         startingPlayer();
//         while (1) {
//             let isWin = playRound();
//             let isFull = gameBoard.checkForFull();
//             if (isFull === true) break;
//             if (isWin === true) {
//                 haveWinner = true;
//                 break;
//             }
//         }
//         if (haveWinner === true) {
//             alert(
//                 `${gameLogic.winnerRenderer()}\n\n` +
//                     `${gameBoard.boardRenderer()}\n`
//             );
//         } else {
//             alert(
//                 `${gameLogic.noWinnerRenderer()}\n\n` +
//                     `${gameBoard.boardRenderer()}\n`
//             );
//         }
//         return +prompt(
//             "Do you want to play again?\n\n" + "[1] Yes\n" + "[2] No\n"
//         );
//     };
//     return { setPlayerNames, startingPlayer, playRound, oneFullGame };
// })();

// function startGame() {
//     gameFlow.setPlayerNames();
//     while (1) {
//         let playAgain = gameFlow.oneFullGame();
//         if (playAgain === 1) {
//             gameBoard.cleanBoard();
//         } else break;
//     }
//     alert("Thank you for playing my game");
// }
