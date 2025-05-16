const init = document.querySelector(".init");
const startBtn = init.querySelector(".start-btn");

const names = document.querySelector(".names");
const nextBtn = names.querySelector(".next-btn");
const inputs = names.querySelectorAll("#player-name");

const startingPlayer = document.querySelector(".starting-player");
const selection = document.querySelectorAll(".container div");

const playBtn = startingPlayer.querySelector(".play-btn");

const game = document.querySelector(".game");

startBtn.addEventListener("click", () => {
    init.classList.add("hidden");
    setTimeout(() => {
        names.classList.remove("hidden");
    }, 810);
});

nextBtn.addEventListener("click", () => {
    let count = 0;
    inputs.forEach((input) => {
        if (input.value.trim() === "") {
            input.value = "";
            input.parentElement.parentElement.classList.add("error");
            setTimeout(() => {
                input.parentElement.parentElement.classList.remove("error");
            }, 500);
            count++;
        }
    });
    if (count != 0) return;
    names.classList.add("hidden");
    setTimeout(() => {
        startingPlayer.classList.remove("hidden");
    }, 810);
});

selection.forEach((div) => {
    div.addEventListener("click", () => {
        div.classList.add("selected");
        selection.forEach((elm) => {
            if (elm != div) elm.classList.remove("selected");
        });
    });
});

playBtn.addEventListener("click", () => {
    let count = 0;
    selection.forEach((div) => {
        if (div.classList.contains("selected")) count++;
    });
    if (count === 0) {
        selection.forEach((div) => {
            div.classList.add("error");
            setTimeout(() => {
                div.classList.remove("error");
            }, 500);
        });
        return;
    }
    startingPlayer.classList.add("hidden");
    setTimeout(() => {
        game.classList.remove("hidden");
    }, 1010);
});
