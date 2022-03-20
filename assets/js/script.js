/* jshint esversion: 8 */

const gameState = {
    isGameOver: false,
    hardMode: false,
    isTimerOn: true,
    currentScore: 0,
    currentNum: 1,
    newGame: function () {
        this.isGameOver = false;
        this.currentNum = 1;
        this.currentScore = 0;
        gameDisplay.newGame();
        gameDisplay.toggleDisable();
        prefsDisplay.enable(prefsDisplay.btnHardMode);
    }
}

const statsDisplay = {
    regularScore: document.querySelector("#scoreboard").rows[1].cells[1],
    regularDate: document.querySelector("#scoreboard").rows[1].cells[2],
    hardScore: document.querySelector("#scoreboard").rows[2].cells[1],
    hardDate: document.querySelector("#scoreboard").rows[2].cells[2],
    gamesPlayed: document.querySelector("#games-played-display"),
    clearStats: document.querySelector("#btn-clear-stats"),
    update: function () {
        this.regularScore.innerText = `${localStorage.getItem("highscore")}`;
        this.regularDate.innerText = `${localStorage.getItem("highscoreDate")}`
        this.hardScore.innerText = `${localStorage.getItem("highscoreHardMode")}`;
        this.hardDate.innerText = `${localStorage.getItem("highscoreDateHardMode")}`;
        this.gamesPlayed.innerText = `${localStorage.getItem("gamesPlayed")}`;
    }
}

const prefsDisplay = {
    toggles: document.querySelectorAll(".prefs-check"),
    btnHardMode: document.querySelector("#prefs-hard-mode"),
    btnDarkMode: document.querySelector("#prefs-dark-mode"),
    btnTimer: document.querySelector("#prefs-timer"),
    darkMode: function () {
        if (this.btnDarkMode.checked === true) {
            localStorage.setItem("darkMode", true);
        } else {
            localStorage.setItem("darkMode", false);
        }
        theme.update();
}
}

const gameDisplay = {
    buttons: document.querySelectorAll(".btn-game"),
    btnNum: document.querySelector("#btn-num"),
    lastAnswer: document.querySelector("#last-answer-display"),
    update: function () {
        this.btnNum.innerText = gameState.currentNum;
    },
    newGame: function () {
        this.lastAnswer.innerText = "Start counting from 1...";
        this.btnNum.innerText = gameState.currentNum;
    },
    toggleDisable: function () {
        for (let button of this.buttons) {
            button.disabled = !button.disabled;
        }
    }
}

const modalDisplay = {
    navItems: document.querySelectorAll(".nav-item"),
    modals: document.querySelectorAll(".modal"),
    closeBtns: document.querySelectorAll(".close"),
    addEL: function () {
        for (let navItem of this.navItems) {
            navItem.addEventListener("click", launchModal)
        };
    },
    removeEL: function () {
        for (let navItem of this.navItems) {
            navItem.removeEventListener("click", launchModal)
        };
    },
}

/** Dark Mode */
const theme = {
    root: document.querySelector(":root"),
    checkUserOSPref: function () {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            localStorage.setItem("darkMode", true);
        } else {
            localStorage.setItem("darkMode", false);
        }
        this.update();
    },
    update: function () {
        if (localStorage.getItem("darkMode") === "true") {
            prefsDisplay.btnDarkMode.checked = true;
            this.root.id = "dark";
        } else {
            prefsDisplay.btnDarkMode.checked = false;
            this.root.removeAttribute("id");
        }
    }
}

/** Timer Class */
class Timer {
    constructor() {
        this.interval = null;
        this.secs = 5000;
        this.timerDisplay = document.querySelector("#timer");
    }

    start() {
        this.interval = setInterval(() => {
            this.timerDisplay.value -= 4;
            this.secs -= 200;

            if (this.secs === 0) {
                handleGameOver();
                this.timeup();
            }
            
        }, 200);
    }

    timeup() {
        clearInterval(this.interval);
        this.interval = null;
        this.secs = 0;
        this.timerDisplay.value = 0;
    }

    reset() {
        this.interval = null;
        this.secs = 5000;
        this.timerDisplay.value = 100;
    }
}

/** Game Set Up */
modalDisplay.addEL();
theme.update();
statsDisplay.update();
gameDisplay.update();
let timer = new Timer();


/** Checks whether a number is a fizz, buzz, or fizzbuzz, otherwise returns the number */
function checkNumber(num) {
    if (typeof num != "number") return TypeError("Expects a number");

    num = parseInt(num);
    if (num % 15 === 0) return "fizzbuzz";
    if (num % 5 === 0) return "buzz";
    if (num % 3 === 0) return "fizz";
    else return num;
}

/** Handles a game over */
function handleGameOver() {
    if (timer.secs !== 0) {
        timer.timeup();
    }

    modalDisplay.addEL()
    gameDisplay.toggleDisable();
    gameState.isGameOver = true;
    gameDisplay.lastAnswer.innerText = `Game Over! Your score was ${gameState.currentScore}.`;

    statsStorage.updateGamesPlayed();
    statsStorage.logHighScore();

    // Stats modal appears after 1.5 second
    setTimeout(() => {
        modalDisplay.modals[1].style.display = "block";
    }, 1500)

    // gameState.reset();
}

/** Handles Stats in Local Storage */
const statsStorage = {
    logHighScore: function () {
        let finalScore = gameState.currentScore;
        let today = new Date();

        if (!gameState.hardMode) {
            if (finalScore > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", finalScore);
                localStorage.setItem("highscoreDate", today.toLocaleDateString('en-GB'));
            }
        } else if (finalScore > localStorage.getItem("highscoreHardMode")) {
            localStorage.setItem("highscoreHardMode", finalScore);
            localStorage.setItem("highscoreDateHardMode", today.toLocaleDateString('en-GB'));
        }

        statsDisplay.update();
    },
    resetStats: function () {
        localStorage.setItem("highscore", 0);
        localStorage.setItem("highscoreDate", "-");
        localStorage.setItem("highscoreHardMode", 0);
        localStorage.setItem("highscoreDateHardMode", "-");
        localStorage.setItem("gamesPlayed", 0);
    },
    updateGamesPlayed: function () {
        let gamesPlayed = localStorage.getItem("gamesPlayed");
        gamesPlayed ? gamesPlayed = parseInt(gamesPlayed) : localStorage.setItem("gamesPlayed", 0);
        gamesPlayed += 1;
        localStorage.setItem("gamesPlayed", gamesPlayed);

        statsDisplay.update();
    }
}

/** Handles clicks on the game buttons */
function handleClick() {
    if (this.dataset.gameBtn === "number") {
        handleInput(gameState.currentNum);
    } else {
        handleInput(this.dataset.gameBtn);
    }
}

/** Handles arrow key presses */
function handleKeyPress(event) {
    if (gameState.isGameOver) return;
    switch (event.code) {
        case "ArrowLeft":
            handleInput("fizz");
            break;
        case "ArrowRight":
            handleInput("buzz");
            break;
        case "ArrowUp":
            handleInput(gameState.currentNum);
            break;
        case "ArrowDown":
            handleInput("fizzbuzz");
            break;
        case "Escape":
            for (let modal of modalDisplay.modals) {
                modal.style.display = "none";
            }
            break
        default:
            return
    }
}

/** Checks if the input matches the expected result */
function isInputCorrect(input) {
    if (input === checkNumber(gameState.currentNum)) {
        return true;
    } else return false;
}

/** Handles game input */
function handleInput(input) {
    if (input === 1 && gameState.isTimerOn) {
        timer.start();
        modalDisplay.removeEL();
    };
    if (isInputCorrect(input)) {

        if (!gameState.hardMode) {
            gameState.currentNum += 1;
        } else {
            let randomNum = Math.floor(Math.random() * 999);
            gameState.currentNum = randomNum;
        };

        if (gameState.isTimerOn) {
            timer.reset();
        }

        gameState.currentScore += 1;
        gameDisplay.update()
        gameDisplay.lastAnswer.innerText = "👍";
        
    } else handleGameOver();
}

/** Add click event listeners for game buttons and key presses */
for (button of gameDisplay.buttons) {
    button.addEventListener("click", handleClick);
}

document.addEventListener("keydown", handleKeyPress);

for (let prefToggle of prefsDisplay.toggles) {
    prefToggle.addEventListener("change", (e) => {
        switch (e.target.id) {
            case "prefs-hard-mode":
                gameState.hardMode = !gameState.hardMode;
                break;
            case "prefs-dark-mode":
                prefsDisplay.darkMode();
                break;
            case "prefs-timer":
                gameState.isTimerOn = !gameState.isTimerOn;
            default:
                break;
        }
    })
}

/** Event Listener to clear stats in localstorage */
statsDisplay.clearStats.addEventListener("click", () => {
    statsStorage.resetStats();
    statsDisplay.update();
})

// Modals

/** Launch a modal */
function launchModal() {
    modalDisplay.modals[this.dataset.link].style.display = "block";
};

/** Check if user is a first time visitor, if so show rules and check for system dark mode preference */
window.addEventListener("load", () => {
    if (localStorage.length === 0) {
        statsStorage.resetStats();
        modals[2].style.display = "block";
    }
    if (localStorage.getItem("darkMode") === null) {
        theme.checkUserOSPref();
    }
}, {
    once: true
});

// When the user clicks on <span> (x), close the modal
for (let closeBtn of modalDisplay.closeBtns) {
    closeBtn.addEventListener("click", () => {
        for (let modal of modalDisplay.modals) {
            modal.style.display = "none";
        }
    })
};

/** Reset Game State when user closes the stats modal after a game over */
modalDisplay.closeBtns[1].addEventListener("click", () => {
    if (gameState.isGameOver) {
        gameState.newGame();
    }
})

// Close modal when the user clicks anywhere outside of the modal
for (let modal of modalDisplay.modals) {
    modal.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            modal.style.display = "none";
        }
    })
};

/** Share Button for Highscores */
document.querySelector("#btn-share").addEventListener("click", () => {
    let shareButtonText = document.querySelector("#btn-share").innerHTML;

    let shareMsg =
        `My highscore is ${localStorage.getItem("highscore")}, and ${localStorage.getItem("highscoreHardMode")} in Hard Mode on FizzBuzz! Play at https://www.davidindub.com/fizzbuzz/`;

    // Copies the high score to users clipboard
    document.querySelector("#btn-share").innerHTML = `Copied to clipboard!`
    navigator.clipboard.writeText(shareMsg);

    // Revert back to previous text after 1.5 sec
    setTimeout(() => {
        document.querySelector("#btn-share").innerHTML = shareButtonText;
    }, 1500)

})