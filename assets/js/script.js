/* jshint esversion: 8 */

const btnNum = document.getElementById("btn-num");
const lastAnswerDisplay = document.getElementById("lastAnswerDisplay");
const shareButtonText = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
class="bi bi-share-fill" viewBox="0 0 16 16">
<path
    d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
</svg>
Share Stats`;

const gameState = {
    gameOver: false,
    hardMode: false,
    currentScore: 0,
    currentNum: 1,
}

const statsDisplay = {
    regularScore: document.getElementById("scoreboard").rows[1].cells[1],
    regularDate: document.getElementById("scoreboard").rows[1].cells[2],
    hardScore: document.getElementById("scoreboard").rows[2].cells[1],
    hardDate: document.getElementById("scoreboard").rows[2].cells[2],
    gamesPlayed: document.getElementById("games-played-display")
}


/** Updates the values on the stats modal */
function updateStatsDisplay() {
    document.getElementById("btn-share").innerHTML = shareButtonText;
    statsDisplay.regularScore.innerHTML = `${localStorage.getItem("highscore")}`;
    statsDisplay.regularDate.innerHTML = `${localStorage.getItem("highscoreDate")}`
    statsDisplay.hardScore.innerHTML = `${localStorage.getItem("highscoreHardMode")}`;
    statsDisplay.hardDate.innerHTML = `${localStorage.getItem("highscoreDateHardMode")}`;
    statsDisplay.gamesPlayed.innerHTML = `${localStorage.getItem("gamesPlayed")}`;
}


updateStatsDisplay();

btnNum.innerText = gameState.currentNum;

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
    gameState.gameOver = true;
    lastAnswerDisplay.innerHTML = `Game Over! Your score was ${gameState.currentScore}.`;

    updateGamesPlayed();
    logHighScore();

    // Stats modal appears after 2 seconds
    setTimeout(() => {
        modals[1].style.display = "block";
    }, 2000)

    handleGameReset();
}

/** Increment the number of games played */
function updateGamesPlayed() {
    let gamesPlayed = localStorage.getItem("gamesPlayed");
    gamesPlayed ? gamesPlayed = parseInt(gamesPlayed) : localStorage.setItem("gamesPlayed", 0);
    gamesPlayed += 1;
    localStorage.setItem("gamesPlayed", gamesPlayed);

    updateStatsDisplay();
}

//** Logs High Score */
function logHighScore() {
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

    updateStatsDisplay();
}

/** Resets the game */
function handleGameReset() {
    gameState.gameOver = false;
    gameState.currentNum = 1;
    gameState.currentScore = 0;
    updateNumBtn()
}

/** Updates the number on the button */
function updateNumBtn() {
    btnNum.innerText = gameState.currentNum;
}

// Tests
// console.log(`Check 3: Expected result is FIZZ, actual result is ${checkNumber(3)} `)
// console.log(`Check 5: Expected result is BUZZ, actual result is ${checkNumber(5)} `)
// console.log(`Check 7: Expected result is 7, actual result is ${checkNumber(7)} `)
// console.log(`Check 15: Expected result is FIZZBUZZ, actual result is ${checkNumber(15)} `)
// console.log(`Check "string": Expected result is TypeError, actual result is ${checkNumber("string")} `)

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
    // console.log(`checking input ${input} against answer ${checkNumber(gameState.currentNum)}`)

    if (isInputCorrect(input)) {

        if (!gameState.hardMode) {
            gameState.currentNum += 1;
        } else {
            let randomNum = Math.floor(Math.random() * 300);
            gameState.currentNum = randomNum;
        }

        gameState.currentScore += 1;
        updateNumBtn()
        lastAnswerDisplay.innerHTML = "👍";
    } else handleGameOver();
}

/** Add click event listeners for game buttons and key presses */
const gameButtons = document.getElementsByClassName("btn-game");

for (button of gameButtons) {
    button.addEventListener("click", handleClick);
}

document.addEventListener("keydown", handleKeyPress);

document.addEventListener("change", () => {
    gameState.hardMode = !gameState.hardMode;
    console.log(`hard mode set to ${gameState.hardMode}`);
})

// Modals

// Get the modal
const navItems = document.getElementsByClassName("nav-item");
const modals = document.getElementsByClassName("modal");
const closeSpans = document.getElementsByClassName("close");

for (let navItem of navItems) {
    navItem.addEventListener("click", launchModal)
}

/** Launch a modal */
function launchModal() {
    let linkClicked = this.dataset.link;
    modals[this.dataset.link].style.display = "block";
}

/** Check if user is a first time visitor, if so show rules */
window.addEventListener("load", () => {
    if (localStorage.length === 0) {
        modals[2].style.display = "block";
    }
}, {
    once: true
})

// When the user clicks on <span> (x), close the modal
for (let closeSpan of closeSpans) {
    closeSpan.addEventListener("click", () => {
        for (let modal of modals) {
            modal.style.display = "none";
        }
    })
}

// Close modal when the user clicks anywhere outside of the modal
for (let modal of modals) {
    modal.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            modal.style.display = "none";
        }
    })
}

/** Share Button for Highscores */
document.getElementById("btn-share").addEventListener("click", () => {
    let shareMsg =
        `My top score is ${localStorage.getItem("highscore")} on FizzBuzz! Play at https://www.davidindub.com/fizzbuzz/`;

    // Copies the high score to users clipboard
    document.getElementById("btn-share").innerHTML = `Copied to clipboard!`
    navigator.clipboard.writeText(shareMsg);

    // Revert back to previous text after 1.5 sec
    setTimeout(() => {
        document.getElementById("btn-share").innerHTML = shareButtonText;
    }, 1500)

})