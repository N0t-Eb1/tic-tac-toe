const startBtn = document.querySelector(".start-btn");
const init = document.querySelector(".init");
const names = document.querySelector(".names");

startBtn.addEventListener("click", () => {
    init.classList.add("disappear");
    init.classList.remove("appear");
    setTimeout(() => {
        names.classList.add("appear");
    }, 800);
});
