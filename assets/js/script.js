/** Checks whether a number is a fizz, buzz, or fizzbuzz, otherwise returns the number */
function checkNumber(num) {
    if (typeof num != "number") return TypeError("Expects a number");

    num = parseInt(num);

    if (num % 15 === 0) return "fizzbuzz";
    if (num % 5 === 0) return "buzz";
    if (num % 3 === 0) return "fizz";
    else return num;
}

// Tests
console.log(`Check 3: Expected result is FIZZ, actual result is ${checkNumber(3)} `)
console.log(`Check 5: Expected result is BUZZ, actual result is ${checkNumber(5)} `)
console.log(`Check 7: Expected result is 7, actual result is ${checkNumber(7)} `)
console.log(`Check 15: Expected result is FIZZBUZZ, actual result is ${checkNumber(15)} `)
console.log(`Check "string": Expected result is TypeError, actual result is ${checkNumber("string")} `)