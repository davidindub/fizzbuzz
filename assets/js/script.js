/* jshint esversion: 8 */

/** Keeps track of the game state */
const gameState = {
    isGameOver: false,
    isHardMode: false,
    isTimerOn: true,
    isSoundOn: true,
    currentScore: 0,
    currentNum: 1
}

const gameController = {
    newGame: function () {
        gameState.isGameOver = false;
        gameState.currentNum = 1;
        gameState.currentScore = 0;
        gameView.newGame();
    },
    modalClosed: function() {
        if (gameState.isGameOver) {
            this.newGame();
        }
    }

}

/** Statistics Modal Elements */
const statsView = {
    regularScore: document.querySelector("#scoreboard").rows[1].cells[1],
    regularDate: document.querySelector("#scoreboard").rows[1].cells[2],
    hardScore: document.querySelector("#scoreboard").rows[2].cells[1],
    hardDate: document.querySelector("#scoreboard").rows[2].cells[2],
    gamesPlayed: document.querySelector("#stats-games-played"),
    lastScore: document.querySelector("#stats-last-score"),
    clearStats: document.querySelector("#btn-clear-stats"),
    update: function () {
        this.regularScore.innerText = `${localStorage.getItem("highscore")}`;
        this.regularDate.innerText = `${localStorage.getItem("highscoreDate")}`
        this.hardScore.innerText = `${localStorage.getItem("highscoreHardMode")}`;
        this.hardDate.innerText = `${localStorage.getItem("highscoreDateHardMode")}`;
        this.gamesPlayed.innerText = `${localStorage.getItem("gamesPlayed")}`;
        this.lastScore.innerText = `${localStorage.getItem("latestScore")}`
    }
}

/** Preferences Modal Elements */
const prefsView = {
    toggles: document.querySelectorAll(".prefs-check"),
    btnHardMode: document.querySelector("#prefs-hard-mode"),
    btnDarkMode: document.querySelector("#prefs-dark-mode"),
    btnTimer: document.querySelector("#prefs-timer"),
    btnSounds: document.querySelector("#prefs-sounds"),
}

const localStorageController = {
    darkMode: function () {
        if (prefsView.btnDarkMode.checked === true) {
            localStorage.setItem("darkMode", true);
        } else {
            localStorage.setItem("darkMode", false);
        }
        themeController.update();
    },
    soundEffects: function () {
        if (prefsView.btnSounds.checked === true) {
            localStorage.setItem("isSoundOn", true);
        } else {
            localStorage.setItem("isSoundOn", false);
        }
    }
}

/** Game Area */
const gameView = {
    buttons: document.querySelectorAll(".btn-game"),
    btnNum: document.querySelector("#btn-num"),
    lastAnswer: document.querySelector("#last-answer-display"),
    update: function () {
        this.btnNum.innerText = gameState.currentNum;
    },
    newGame: function () {
        this.lastAnswer.innerText = "Start counting from 1...";
        this.btnNum.innerText = gameState.currentNum;   
        this.setBtnsDisabled(false);     
    },
    setBtnsDisabled: function (isDisabled) {
        for (let button of this.buttons) {
            button.disabled = isDisabled;
        }
    },
    gameOver: function () {
        this.setBtnsDisabled(true);
        timer.timerDisplay.classList.add("visually-hidden");
        this.lastAnswer.classList.remove("visually-hidden");
        document.getElementById("game-info").classList.add("game-over");
        this.lastAnswer.innerText = `Game Over! Your score was ${gameState.currentScore}.`;
    }
}

/** Handles Modals */
const modalView = {
    navItems: document.querySelectorAll(".nav-item"),
    modals: document.querySelectorAll(".modal"),
    closeBtns: document.querySelectorAll(".close"),
    addEL: function () {
        for (let navItem of this.navItems) {
            navItem.addEventListener("click", this.launchModal);
            navItem.classList.remove("nav-item-disabled");
        };
    },
    disablePrefsClick: function () {
        this.navItems[0].removeEventListener("click", this.launchModal);
        this.navItems[0].classList.add("nav-item-disabled");
    },
    hideAll: function () {
        for (let modal of this.modals) {
            modal.style.display = "none";
        }
        gameController.modalClosed();
    },
    showStats: function () {
        this.modals[1].style.display = "block";
    },
    launchModal: function () {
        modalView.modals[this.dataset.link].style.display = "block";
    }
}

const sounds = {
    gameOver: document.querySelector("#sound-game-over"),
    rightAnswer: document.querySelector("#sound-right-answer"),
    update: function () {
        if (localStorage.getItem("isSoundOn") === "true") {
            prefsView.btnSounds.checked = true;
            gameState.isSoundOn = true;
        } else {
            prefsView.btnSounds.checked = false;
            gameState.isSoundOn = false;
        }
    }
}

/** Dark Mode */
const themeController = {
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
            prefsView.btnDarkMode.checked = true;
            this.root.id = "dark";
        } else {
            prefsView.btnDarkMode.checked = false;
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
        this.secs = 0;
        this.timerDisplay.value = 0;
    }

    reset() {
        this.secs = 5000;
        this.timerDisplay.value = 100;
    }
}

/** Game Set Up */
modalView.addEL();
themeController.update();
sounds.update();
statsView.update();
gameView.update();
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
    if (gameState.isSoundOn) {
        sounds.gameOver.play();
    }
    modalView.addEL()
    gameState.isGameOver = true;

    gameView.gameOver();

    statsStorage.updateGamesPlayed();
    statsStorage.logHighScore();

    // Stats modal appears after 1.5 second
    setTimeout(() => {
        modalView.showStats();
    }, 1500)
}

/** Handles Stats in Local Storage */
const statsStorage = {
    logHighScore: function () {
        let finalScore = gameState.currentScore;
        let today = new Date();

        if (!gameState.isHardMode) {
            if (finalScore > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", finalScore);
                localStorage.setItem("highscoreDate", today.toLocaleDateString('en-GB'));
            }
        } else if (finalScore > localStorage.getItem("highscoreHardMode")) {
            localStorage.setItem("highscoreHardMode", finalScore);
            localStorage.setItem("highscoreDateHardMode", today.toLocaleDateString('en-GB'));
        }

        statsView.update();
    },
    resetStats: function () {
        localStorage.setItem("highscore", 0);
        localStorage.setItem("highscoreDate", "-");
        localStorage.setItem("highscoreHardMode", 0);
        localStorage.setItem("highscoreDateHardMode", "-");
        localStorage.setItem("gamesPlayed", 0);
        localStorage.setItem("latestScore", 0);
    },
    updateGamesPlayed: function () {
        let gamesPlayed = localStorage.getItem("gamesPlayed");
        gamesPlayed ? gamesPlayed = parseInt(gamesPlayed) : localStorage.setItem("gamesPlayed", 0);
        gamesPlayed += 1;
        localStorage.setItem("gamesPlayed", gamesPlayed);
        localStorage.setItem("latestScore", gameState.currentScore);

        statsView.update();
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
    if (event.code === "Escape") {
        modalView.hideAll();
    }
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

    // Start the timer if timer is toggled on
    if (input === 1 && gameState.isTimerOn) {
        timer.start();

        // Disable the preferences modal while playing
        modalView.disablePrefsClick();
    };

    if (isInputCorrect(input)) {

        /** If the input matches the expected result
         * Increase the number by one, or use a random number under 1000 for Hard Mode */

        if (!gameState.isHardMode) {
            gameState.currentNum += 1;
        } else {
            let randomNum = Math.floor(Math.random() * 999);
            gameState.currentNum = randomNum;
        };

        /** Restart the Timer if timer is toggled on */
        if (gameState.isTimerOn) {
            timer.reset();
        }

        /** Increase the Score by 1, Update the game area display */
        gameState.currentScore += 1;
        gameView.update()

        // Play the correct answer sound
        if (gameState.isSoundOn) {
            sounds.rightAnswer.currentTime = 0;
            sounds.rightAnswer.play();
        }

        gameView.lastAnswer.classList.add("visually-hidden");
        timer.timerDisplay.classList.remove("visually-hidden");

    } else handleGameOver();
}

/** Add click event listeners for game buttons and key presses */
for (button of gameView.buttons) {
    button.addEventListener("click", handleClick);
}

/** Event Listener for Key presses  */
document.addEventListener("keydown", handleKeyPress);

/** Event Listeners for Preferences Modal */
for (let prefToggle of prefsView.toggles) {
    prefToggle.addEventListener("change", (e) => {
        switch (e.target.id) {
            case "prefs-hard-mode":
                gameState.isHardMode = !gameState.isHardMode;
                break;
            case "prefs-dark-mode":
                localStorageController.darkMode();
                break;
            case "prefs-timer":
                gameState.isTimerOn = !gameState.isTimerOn;
                break;
            case "prefs-sounds":
                localStorageController.soundEffects();
                gameState.isSoundOn = !gameState.isSoundOn;
            default:
                break;
        }
    })
}

/** Preferences Modal - Share Button for Highscores */
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

/** Preferences Modal - Clear Stats in localstorage */
statsView.clearStats.addEventListener("click", () => {
    statsStorage.resetStats();
    statsView.update();
})


// Modals

/** Check if user is a first time visitor, if so show rules and check for system dark mode preference */
window.addEventListener("load", () => {
    if (localStorage.length === 0) {
        statsStorage.resetStats();
        statsView.update();
        modalView.modals[2].style.display = "block";
    }
    if (localStorage.getItem("darkMode") === null) {
        themeController.checkUserOSPref();
    }
}, {
    once: true
});

/** When the user clicks on <span> (x), close the modal
Reset Game State when user closes the stats modal after a game over */
for (let closeBtn of modalView.closeBtns) {
    closeBtn.addEventListener("click", () => {
        modalView.hideAll();
    })
};

// Close modal when the user clicks anywhere outside of the modal
for (let modal of modalView.modals) {
    modal.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            modalView.hideAll();
        }
    })
};