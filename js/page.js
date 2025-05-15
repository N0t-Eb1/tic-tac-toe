const init = document.querySelector(".init");
const startBtn = init.querySelector(".start-btn");

const names = document.querySelector(".names");
const nextBtn = names.querySelector(".next-btn");
const inputs = names.querySelectorAll("#player-name");

startBtn.addEventListener("click", () => {
    init.classList.add("hidden");
    setTimeout(() => {
        names.classList.remove("hidden");
    }, 801);
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
});
