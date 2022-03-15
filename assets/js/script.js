/* jshint esversion: 8 */

const gameState = {
    isGameOver: false,
    hardMode: false,
    currentScore: 0,
    currentNum: 1,
    reset: function () {
        this.isGameOver = false;
        this.currentNum = 1;
        this.currentScore = 0;
        gameDisplay.update();
        prefsDisplay.enable(prefsDisplay.hardMode);
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
        this.regularScore.innerHTML = `${localStorage.getItem("highscore")}`;
        this.regularDate.innerHTML = `${localStorage.getItem("highscoreDate")}`
        this.hardScore.innerHTML = `${localStorage.getItem("highscoreHardMode")}`;
        this.hardDate.innerHTML = `${localStorage.getItem("highscoreDateHardMode")}`;
        this.gamesPlayed.innerHTML = `${localStorage.getItem("gamesPlayed")}`;
    }
}

const prefsDisplay = {
    toggles: document.querySelectorAll(".prefs-check"),
    hardMode: document.querySelector("#prefs-hard-mode"),
    disable: function (btn) {
        btn.disabled = true;
    },
    enable: function (btn) {
        btn.disabled = false;
    }
}

const gameDisplay = {
    buttons: document.querySelectorAll(".btn-game"),
    btnNum: document.querySelector("#btn-num"),
    lastAnswer: document.querySelector("#lastAnswerDisplay"),
    update: function () {
        this.btnNum.innerText = gameState.currentNum;
    },
    toggleDisable: function () {
        for (let button of this.buttons) {
            button.disabled = !button.disabled;
        }
    }
}

/** Timer Class */
class Timer {
    constructor() {
        this.isTimeUp = false;
        this.isTimerRunning;
        this.secs = 5;
        this.timerDisplay = document.querySelector("#timer");
    }

    run() {
        this.interval = setInterval(() => {
            if (this.secs == 0) {
                this.timeup();

            } else {
                this.timerDisplay.value -= 20;
                this.secs -= 1;
                console.log(this.secs);
            }
        }, 1000);
    }

    timeup() {
        clearInterval(this.interval);
        this.secs = 0;
        this.timerDisplay.value = 0;
        this.isTimeUp = true;
        console.log("Timer Stopped!")
    }

    reset() {
        this.secs = 5;
        this.timerDisplay.value = 100;
        this.isTimeUp = false;
    }
}

/** Game Set Up */
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
    timer.timeup();
    gameDisplay.toggleDisable();
    gameState.isGameOver = true;
    gameDisplay.lastAnswer.innerHTML = `Game Over! Your score was ${gameState.currentScore}.`;

    statsStorage.updateGamesPlayed();
    statsStorage.logHighScore();

    // Stats modal appears after 2 seconds
    setTimeout(() => {
        modalDisplay.modals[1].style.display = "block";
    }, 2000)

    gameState.reset();
}

/** Handles Stats in Local Storage */
const statsStorage = {
    logHighScore: function () {
        let finalScore = gameState.currentScore;
        let today = new Date();

        if (!gameState.hardMode) {
            if (finalScore > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", finalScore);
                localStorage.setItem("highscoreDate", today.toDateString());
            }
        } else if (finalScore > localStorage.getItem("highscoreHardMode")) {
            localStorage.setItem("highscoreHardMode", finalScore);
            localStorage.setItem("highscoreDateHardMode", today.toDateString());
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
    updateGamesPlayed: function() {
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
    if (input === 1) {
        timer.run();
    };
    if (isInputCorrect(input)) {

        if (!gameState.hardMode) {
            gameState.currentNum += 1;
        } else {
            let randomNum = Math.floor(Math.random() * 999);
            gameState.currentNum = randomNum;
        };

        timer.reset();

        gameState.currentScore += 1;
        gameDisplay.update()
        gameDisplay.lastAnswer.innerHTML = "👍";
    } else handleGameOver();
}

/** Add click event listeners for game buttons and key presses */
for (button of gameDisplay.buttons) {
    button.addEventListener("click", handleClick);
}

document.addEventListener("keydown", handleKeyPress);

for (let prefToggle of prefsDisplay.toggles) {
    prefToggle.addEventListener("change", (e) => {
        switch(e.target.id) {
            case "prefs-hard-mode":
                gameState.hardMode = !gameState.hardMode;
                prefsDisplay.disable(prefsDisplay.hardMode);
                break;
            case "prefs-dark-mode":
                console.log("toggle dark mode")
                break;
            default:
                break;
        }
    })
}

statsDisplay.clearStats.addEventListener("click", () => {
    statsStorage.resetStats();
    statsDisplay.update();
})

// Modals

const modalDisplay = {
    navItems: document.querySelectorAll(".nav-item"),
    modals: document.querySelectorAll(".modal"),
    closeBtns: document.querySelectorAll(".close"),
}

for (let navItem of modalDisplay.navItems) {
    navItem.addEventListener("click", launchModal)
};

/** Launch a modal */
function launchModal() {
    modalDisplay.modals[this.dataset.link].style.display = "block";
};

/** Check if user is a first time visitor, if so show rules */
window.addEventListener("load", () => {
    if (localStorage.length === 0) {
        statsStorage.resetStats();
        modals[2].style.display = "block";
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