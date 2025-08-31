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
        board.forEach(row => {
            row.forEach(cell => {
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

    const getPlayer = index => players[index];

    const changeName = (index, name) => {
        players[index].name = name;
    };

    return { getPlayer, changeName };
})();

const gameLogic = (function () {
    let currentPlayer;

    const getCurrent = () => currentPlayer;

    const setStartingPlayer = userInput => {
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

    const checkRow = row => {
        return gameBoard
            .getBoard()
            [row - 1].filter(cell => cell === currentPlayer.marker).length === 3
            ? true
            : false;
    };

    const checkColumn = column => {
        const arr = [];
        for (let i = 0; i < 3; i++) {
            if (gameBoard.getBoard()[i][column - 1] === currentPlayer.marker)
                arr.push(currentPlayer.marker);
        }
        return arr.length === 3 ? true : false;
    };

    //lineNumber 1 = top left to bottom right
    //lineNumber 2 = top right to bottom left
    const slopeLinesCheck = lineNumber => {
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

    return {
        setStartingPlayer,
        getCurrent,
        changeTurn,
        checkRow,
        checkColumn,
        slopeLinesCheck,
    };
})();

const GUIprops = (function () {
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
        options.forEach(elm => {
            if (elm.classList.contains("selected"))
                gameLogic.setStartingPlayer(+elm.dataset.player);
        });
    };

    const setSpan = () => {
        const span = document.querySelector(".player-turn span");
        span.textContent = gameLogic.getCurrent().name;
        span.style.color = gameLogic.getCurrent().color;
    };

    const placeMarker = cell => {
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

    const checkWinner = () => {
        const elems = [];

        for (let i = 1; i <= 3; i++) {
            if (gameLogic.checkRow(i)) {
                for (let j = 1; j <= 3; j++)
                    elems.push(
                        document.querySelector(
                            `.grid div[data-row="${i.toString()}"][data-col="${j.toString()}"] svg`
                        )
                    );
                break;
            }

            if (gameLogic.checkColumn(i)) {
                for (let j = 1; j <= 3; j++)
                    elems.push(
                        document.querySelector(
                            `.grid div[data-row="${j.toString()}"][data-col="${i.toString()}"] svg`
                        )
                    );
                break;
            }
        }

        if (elems.length === 0) {
            if (gameLogic.slopeLinesCheck(1))
                for (let i = 1; i <= 3; i++)
                    elems.push(
                        document.querySelector(
                            `.grid div[data-row="${i.toString()}"][data-col="${i.toString()}"] svg`
                        )
                    );
            if (gameLogic.slopeLinesCheck(2)) {
                for (let i = 1; i <= 3; i++)
                    for (let j = 1; j <= 3; j++)
                        if (i + j === 4)
                            elems.push(
                                document.querySelector(
                                    `.grid div[data-row="${i.toString()}"][data-col="${j.toString()}"] svg`
                                )
                            );
            }
        }

        if (elems.length === 0) {
            return false;
        } else {
            elems.forEach(elem => {
                elem.classList.add("winner");
            });
            return true;
        }
    };

    const renderWinner = () => {
        const text = document.createElement("div");
        const span = document.createElement("span");
        span.textContent = gameLogic.getCurrent().name;
        span.style.color = gameLogic.getCurrent().color;
        text.textContent = " won!";
        text.prepend(span);
        document.querySelector(".player-turn").replaceWith(text);
    };

    const renderDraw = () => {
        document.querySelector(".player-turn").textContent = "it's a draw!";
    };

    const toggleRestart = () => {
        document.querySelector(".restart-btn").classList.remove("invisible");
    };

    const cleanUp = () => {
        document.querySelector(".selected").classList.remove("selected");
        const elem = document.createElement("div");
        elem.classList.add("player-turn");
        elem.innerHTML = `<span></span>'s turn`;
        document.querySelector(".game > div").replaceWith(elem);
        gameBoard.cleanBoard();
        const markers = document.querySelectorAll(".grid div svg");
        markers.forEach(marker => {
            marker.remove();
        });
        document.querySelector(".grid").style.pointerEvents = "auto";
    };

    return {
        setNames,
        setStartingPlayer,
        setSpan,
        placeMarker,
        checkWinner,
        renderWinner,
        renderDraw,
        toggleRestart,
        cleanUp,
    };
})();

const actions = (function () {
    document.querySelector(".next-btn").addEventListener("click", () => {
        GUIprops.setNames();
    });

    document.querySelector(".play-btn").addEventListener("click", () => {
        GUIprops.setStartingPlayer();
        GUIprops.setSpan();
    });

    const gridContainer = document.querySelector(".grid");
    const gridCells = document.querySelectorAll(".grid div");
    gridCells.forEach(cell => {
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
            if (GUIprops.checkWinner()) {
                GUIprops.renderWinner();
                gridContainer.style.pointerEvents = "none";
                GUIprops.toggleRestart();
                return;
            }
            if (gameBoard.checkForFull()) {
                GUIprops.renderDraw();
                gridContainer.style.pointerEvents = "none";
                GUIprops.toggleRestart();
                return;
            }
            gameLogic.changeTurn();
            GUIprops.setSpan();
        });
    });

    const restartBtn = document.querySelector(".restart-btn");
    const game = document.querySelector(".game");
    const startingPlayer = document.querySelector(".starting-player");
    restartBtn.addEventListener("click", () => {
        game.classList.add("hidden");
        setTimeout(() => {
            GUIprops.cleanUp();
        }, 800);
        setTimeout(() => {
            startingPlayer.classList.remove("hidden");
            restartBtn.classList.add("invisible");
        }, 810);
    });
})();
