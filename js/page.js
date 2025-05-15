const startBtn = document.querySelector(".start-btn");
const init = document.querySelector(".init");
const names = document.querySelector(".names");

startBtn.addEventListener("click", () => {
    init.classList.add("hidden");
    setTimeout(() => {
        names.classList.remove("hidden");
    }, 801);
});
