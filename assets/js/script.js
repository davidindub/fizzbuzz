/* jshint esversion: 8 */

const btnNum = document.getElementById("btn-num");
const lastAnswerDisplay = document.getElementById("lastAnswerDisplay");
const statsGamesPlayedDisplay = document.getElementById("games-played-display");
const highScoreDisplay = document.getElementById("high-score-display");
const highScoreDateDisplay = document.getElementById("high-score-date-display");
const highScoreHardModeDisplay = document.getElementById("high-score-hard-display");
const highScoreHardModeDateDisplay = document.getElementById("high-score-hard-date-display");

const gameState = {
    gameOver: false,
    hardMode: false,
    currentScore: 0,
    currentNum: 1,
}

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
    lastAnswerDisplay.innerHTML = `Game Over❗️ Your score was ${gameState.currentScore}.`;

    updateGamesPlayed();
    logHighScore();

    // Stats modal appears after 3 seconds
    // setTimeout(() => {
    //     modals[1].style.display = "block";
    // }, 3000)

    handleGameReset();
}

function updateGamesPlayed() {
    let gamesPlayed = localStorage.getItem("gamesPlayed");
    gamesPlayed ? gamesPlayed = parseInt(gamesPlayed) : localStorage.setItem("gamesPlayed", 0);
    gamesPlayed += 1;
    statsGamesPlayedDisplay.innerHTML = gamesPlayed;
    localStorage.setItem("gamesPlayed", gamesPlayed);
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
     }
    else if (finalScore > localStorage.getItem("highscoreHardMode")) {
            localStorage.setItem("highscoreHardMode", finalScore);
            localStorage.setItem("highscoreDateHardMode", today.toDateString());
        }

        highScoreDisplay.innerHTML = `${localStorage.getItem("highscore")}`;
        highScoreDateDisplay.innerHTML = `${localStorage.getItem("highscoreDate")}`
        highScoreHardModeDisplay.innerHTML = `${localStorage.getItem("highscoreHardMode")}`;
        highScoreHardModeDateDisplay.innerHTML = `${localStorage.getItem("highscoreDateHardMode")}`;
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
        console.log(`checking input ${input} against answer ${checkNumber(gameState.currentNum)}`)

        if (isInputCorrect(input)) {
            gameState.currentNum += 1;
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

    // Modals

    // Get the modal
    const navItems = document.getElementsByClassName("nav-item");
    const modals = document.getElementsByClassName("modal");
    const closeSpans = document.getElementsByClassName("close");

    for (let navItem of navItems) {
        navItem.addEventListener("click", launchModal)
    }

    function launchModal() {
        let linkClicked = this.dataset.link;
        modals[this.dataset.link].style.display = "block";
    }

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