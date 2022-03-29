/* jshint esversion: 8 */

/** Keeps track of the game state */
const gameState = {
    isGameOver: false,
    isHardMode: false,
    isTimerOn: true,
    isSoundOn: true,
    isDarkMode: false,
    currentScore: 0,
    currentNum: 1
};

/** Controller for overall game logic */
const gameController = {
    newGame: function () {
        gameState.isGameOver = false;
        gameState.currentNum = 1;
        gameState.currentScore = 0;
        gameView.newGame();
    },
    modalClosed: function () {
        if (gameState.isGameOver) {
            this.newGame();
        }
    },
    onGameStarted: function () {
        /** Disable the preferences modal while playing */
        modalView.disablePrefsClick();

        /** Start the timer if timer is toggled on */
        if (gameState.isTimerOn) {
            gameView.hideGameInfoText();
            timer.show();

            timer.start();
        } else {
            gameView.timerOff();
        }
    },
    handleInput: function (input) {

        /** On starting a new game... */
        if (input === 1) {
            this.onGameStarted();
        }

        if (this.isInputCorrect(input)) {

            /** If the input matches the expected result
             * Increase the number by one, or use a random number under 1000 for Hard Mode */

            if (!gameState.isHardMode) {
                gameState.currentNum += 1;
            } else {
                let randomNum = Math.floor(Math.random() * 999);
                gameState.currentNum = randomNum;
            }

            /** Increase the Score by 1, Update the game area display */
            gameState.currentScore += 1;
            gameView.update();

            // Play the correct answer sound
            if (gameState.isSoundOn) {
                sounds.rightAnswer.currentTime = 0;
                sounds.rightAnswer.play();
            }

            /** Restart the Timer */
            if (gameState.isTimerOn) {
                timer.reset();
            }

        } else this.handleGameOver();
    },

    /** Checks if the input matches the expected result */
    isInputCorrect: function (input) {
        if (input === this.checkNumber(gameState.currentNum)) {
            return true;
        } else return false;
    },

    /** Checks whether a number is a fizz, buzz, or fizzbuzz, otherwise returns the number */
    checkNumber: function (num) {
        if (typeof num != "number") return TypeError("Expects a number");

        num = parseInt(num);
        if (num % 15 === 0) return "fizzbuzz";
        if (num % 5 === 0) return "buzz";
        if (num % 3 === 0) return "fizz";
        else return num;
    },

    /** Handles a game over */
    handleGameOver: function () {
        if (timer.secs !== 0) {
            timer.timeup();
        }
        if (gameState.isSoundOn) {
            sounds.gameOver.play();
        }
        modalView.addEL();
        gameState.isGameOver = true;

        gameView.gameOver();

        localStorageController.updateGamesPlayed();
        localStorageController.logHighScore();

        statsView.update();


        // Stats modal appears after 1.5 second
        setTimeout(() => {
            modalView.showStats();
        }, 1500);
    }

};

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
        this.regularDate.innerText = `${localStorage.getItem("highscoreDate")}`;
        this.hardScore.innerText = `${localStorage.getItem("highscoreHardMode")}`;
        this.hardDate.innerText = `${localStorage.getItem("highscoreDateHardMode")}`;
        this.gamesPlayed.innerText = `${localStorage.getItem("gamesPlayed")}`;
        this.lastScore.innerText = `${localStorage.getItem("latestScore")}`;
    }
};

/** Preferences Modal Elements */
const prefsView = {
    toggles: document.querySelectorAll(".prefs-check"),
    btnHardMode: document.querySelector("#prefs-hard-mode"),
    btnDarkMode: document.querySelector("#prefs-dark-mode"),
    btnTimer: document.querySelector("#prefs-timer"),
    btnSounds: document.querySelector("#prefs-sounds"),
    update: function () {
        this.btnSounds.checked = gameState.isSoundOn;
        this.btnDarkMode.checked = gameState.isDarkMode;
    }
};

/** Updates Localstorage from Game State */
const localStorageController = {
    updateFromGameState: function () {
        if (gameState.isDarkMode) {
            localStorage.setItem("isDarkMode", "true");
        } else {
            localStorage.setItem("isDarkMode", "false");
        }
        if (gameState.isSoundOn) {
            localStorage.setItem("isSoundOn", "true");
        } else {
            localStorage.setItem("isSoundOn", "false");
        }
    },
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
        gamesPlayed = parseInt(gamesPlayed);
        gamesPlayed += 1;
        localStorage.setItem("gamesPlayed", gamesPlayed);
        localStorage.setItem("latestScore", gameState.currentScore);
    }
};

/** Game Area */
const gameView = {
    buttons: document.querySelectorAll(".btn-game"),
    btnNum: document.querySelector("#btn-num"),
    gameInfo: document.querySelector(".game-info"),
    gameInfoText: document.querySelector("#game-info-text"),
    update: function () {
        this.btnNum.innerText = gameState.currentNum;
    },
    newGame: function () {
        this.gameInfoText.innerText = "Start counting from 1...";
        this.gameInfo.classList.remove("game-over");
        this.btnNum.innerText = gameState.currentNum;
        this.setBtnsDisabled(false);
    },
    timerOff: function () {
        this.gameInfoText.innerText = "Take Your Time…";
    },
    hideGameInfoText: function () {
        gameView.gameInfoText.classList.add("visually-hidden");
    },
    showGameInfoText: function () {
        gameView.gameInfoText.classList.remove("visually-hidden");
    },
    setBtnsDisabled: function (isDisabled) {
        for (let button of this.buttons) {
            button.disabled = isDisabled;
        }
    },
    gameOver: function () {
        this.setBtnsDisabled(true);
        timer.hide();
        this.showGameInfoText();
        this.gameInfo.classList.add("game-over");
        this.gameInfoText.innerText = `Game Over! Your score was ${gameState.currentScore}.`;
    }
};

/** Handles Modals */
const modalView = {
    navItems: document.querySelectorAll(".nav-item"),
    modals: document.querySelectorAll(".modal"),
    closeBtns: document.querySelectorAll(".close"),
    addEL: function () {
        for (let navItem of this.navItems) {
            navItem.addEventListener("click", this.launchModal);
            navItem.classList.remove("nav-item-disabled");
        }
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
};

const sounds = {
    gameOver: document.querySelector("#sound-game-over"),
    rightAnswer: document.querySelector("#sound-right-answer")
};

/** Dark Mode */
const themeController = {
    root: document.querySelector(":root"),
    themeMetaTag: document.querySelector('meta[name="theme-color"]'),
    checkUserOSPref: function () {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            localStorage.setItem("isDarkMode", true);
        } else {
            localStorage.setItem("isDarkMode", false);
        }
        this.update();
    },
    update: function () {
        if (gameState.isDarkMode) {
            this.root.id = "dark";
            this.themeMetaTag.content = "#121212";
        } else {
            this.root.removeAttribute("id");
            this.themeMetaTag.content = "#fff";
        }
    }
};

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
                gameController.handleGameOver();
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

    hide() {
        this.timerDisplay.classList.add("visually-hidden");
    }

    show() {
        this.timerDisplay.classList.remove("visually-hidden");
    }
}

function loadStateFromLocalStorage() {
    gameState.isSoundOn = (localStorage.getItem("isSoundOn") === "true");
    gameState.isDarkMode = (localStorage.getItem("isDarkMode") === "true");
}

/** Handles clicks on the game buttons */
function handleClick() {
    if (this.dataset.gameBtn === "number") {
        gameController.handleInput(gameState.currentNum);
    } else {
        gameController.handleInput(this.dataset.gameBtn);
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
            gameController.handleInput("fizz");
            break;
        case "ArrowRight":
            gameController.handleInput("buzz");
            break;
        case "ArrowUp":
            gameController.handleInput(gameState.currentNum);
            break;
        case "ArrowDown":
            gameController.handleInput("fizzbuzz");
            break;
        default:
            return;
    }
}

/** Add click event listeners for game buttons and key presses */
for (let button of gameView.buttons) {
    button.addEventListener("click", handleClick);
}

/** Event Listener for Key presses  */
document.addEventListener("keydown", handleKeyPress);

/** Event Listeners for Preferences Modal */
for (let prefToggle of prefsView.toggles) {
    prefToggle.addEventListener("change", (e) => {
        switch (e.target.id) {
            case "prefs-hard-mode":
                gameState.isHardMode = e.target.checked;
                break;
            case "prefs-dark-mode":
                gameState.isDarkMode = e.target.checked;
                themeController.update();
                break;
            case "prefs-timer":
                gameState.isTimerOn = e.target.checked;
                break;
            case "prefs-sounds":
                gameState.isSoundOn = e.target.checked;

                if (gameState.isSoundOn) {
                    sounds.rightAnswer.play();
                }
                break;
            default:
                break;
        }
        localStorageController.updateFromGameState();
    });
}

/** Preferences Modal - Share Button for Highscores */
document.querySelector("#btn-share").addEventListener("click", () => {
    let shareButtonText = document.querySelector("#btn-share").innerHTML;

    let shareMsg =
        `My highscore is ${localStorage.getItem("highscore")}, and ${localStorage.getItem("highscoreHardMode")} in Hard Mode on FizzBuzz! Play at https://www.davidindub.com/fizzbuzz/`;

    // Copies the high score to users clipboard
    document.querySelector("#btn-share").innerHTML = `Copied to clipboard!`;
    navigator.clipboard.writeText(shareMsg);

    // Revert back to previous text after 1.5 sec
    setTimeout(() => {
        document.querySelector("#btn-share").innerHTML = shareButtonText;
    }, 1500);
});

/** Preferences Modal - Clear Stats in localstorage */
statsView.clearStats.addEventListener("click", () => {
    localStorageController.resetStats();
    statsView.update();
});


// Modals

/** Check if user is a first time visitor, if so show rules and check for system dark mode preference */
window.addEventListener("load", () => {
    if (localStorage.length === 0) {
        localStorageController.resetStats();
        statsView.update();
        modalView.modals[2].style.display = "block";
    }
    if (localStorage.getItem("isDarkMode") === null) {
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
    });
}

// Close modal when the user clicks anywhere outside of the modal
for (let modal of modalView.modals) {
    modal.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            modalView.hideAll();
        }
    });
}


/** Game Set Up */

loadStateFromLocalStorage();

modalView.addEL();

themeController.update();

prefsView.update();

statsView.update();

let timer = new Timer();

gameView.update();