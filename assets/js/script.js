/* jshint esversion: 8 */

let gameOver = false;
const btnNum = document.getElementById("btn-num");
let currentNum = 1;
btnNum.innerText = currentNum;

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
    gameOver = true;
    alert(`Game over! You counted to ${currentNum}`);

    // Pop up Modal with score/highscore

    handleGameReset();
}

/** Resets the game */
function handleGameReset() {
    gameOver = false;
    currentNum = 1;
    updateNumBtn()
}

/** Updates the number on the button */
function updateNumBtn() {
    btnNum.innerText = currentNum;
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
        handleInput(currentNum);
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
            handleInput(currentNum);
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
    if (input === checkNumber(currentNum)) {
        return true;
    } else return false;
}

/** Handles game input */
function handleInput(input) {
    console.log(`checking input ${input} against answer ${checkNumber(currentNum)}`)

    if (isInputCorrect(input)) {
        currentNum += 1;
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
const modalHowToPlay = document.getElementById("modalHowToPlay");

// Get the button that opens the modal
const linkHowToPlay = document.getElementById("linkHowToPlay");

// Get the <span> element that closes the modal
let closeSpan = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
linkHowToPlay.addEventListener("click", () => {
    modalHowToPlay.style.display = "block";
})

// const navItems = document.getElementsByTagName("nav")
// console.log(navItems);

// When the user clicks on <span> (x), close the modal
closeSpan.onclick = function () {
    modalHowToPlay.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (e) => {
    if (e.target == modalHowToPlay) {
        modalHowToPlay.style.display = "none";
    }
}) 