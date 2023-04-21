var current = document.querySelector('.current');
var total = document.querySelector('.total');
var lastSymbol = current.textContent.charAt(current.textContent.length - 1);
var operatorButtons = Array.from(document.querySelectorAll('.operator')); 
var numberButtons = Array.from(document.querySelectorAll('.number'));

const operators = operatorButtons.map(button => button.textContent);
const numbers = numberButtons.map(button => button.textContent);
const ac = document.querySelector('.ac');
const ce = document.querySelector('.ce');
const equals = document.querySelector('.equals');
const decimal = document.querySelector('.decimal');

function operateSinglePair(firstNum, sign, secondNum){
    if (sign === '+'){
        return parseFloat(firstNum) + parseFloat(secondNum);
    }
    else if (sign === '-'){
        return firstNum - secondNum;
    }
    else if (sign === '*'){
        return firstNum * secondNum;
    }
    else if (sign === '/'){
        return firstNum / secondNum;
    }
    else if (firstNum === "Infinity"){
        return Infinity;
    }
}

function operateAll(arr){
    // if only one number is entered
    let result = arr[arr.length-1];
    
    // from array with numbers separated by operators, operate on each consecutive pair of numbers and replace each pair with a result
    while (arr.length > 2)
    {
        result = 0;
        let firstNum = arr.shift();
        let sign = arr.shift();
        let secondNum = arr.shift();
        result = operateSinglePair(firstNum, sign, secondNum);
        result = Math.round(result * Math.pow(10, 6)) / Math.pow(10, 6);
        arr.unshift(result);
    }
    return result;
}

function adjustNumbersInArray(arr){
    // I is the first leter from "Infinity", transform it into a single element
    if (arr.includes('I')){
        arr = arr.reduce((acc, val) => {
            if (isLetter(val) && acc.length > 0){
                acc[acc.length - 1] += val;
            }
            else{
                acc.push(val);
            }
            return acc;
        }, []);
    }
    let adjusted = arr.reduce((acc, val) => {
        if (!isNaN(val) && !isNaN(acc[acc.length - 1])) {
            // If both the current and previous elements are numeric, combine them and update the last element of the accumulator
            acc[acc.length - 1] += val;
        }
        else if (acc[acc.length - 1] === "-" && operators.includes(acc[acc.length - 2])){
            // if previous is "-" and one before previous is an operator
            acc[acc.length - 1] += val;
        }
        else if (acc[acc.length - 1] === "-" && acc.length === 1){
            // if "-" is the first element
            acc[acc.length - 1] += val;
        }
        else if (val === "."){
            acc[acc.length - 1] += val;
        }
        else {
            // Otherwise, just add the current element to the accumulator
            acc.push(val);
        }
        return acc;
    }, []);
    return adjusted;
}

function getResult(){
    if (operators.includes(lastSymbol)){
        return;
    }
    updateTotal(current.textContent);
    currentValueArray = adjustNumbersInArray(Array.from(current.textContent));
    let result = operateAll(currentValueArray);
    clearCurrent();
    updateCurrent(result);
}

function updateCurrent(operation){
    current.textContent += operation;
    lastSymbol = current.textContent.charAt(current.textContent.length - 1);
}

function updateTotal(operation){
    total.textContent = operation + " =";
}

function clearCurrent(){
    current.textContent = '';
}

function clearTotal(){
    total.textContent = '';
}

function clearLast(){
    temp = current.textContent.slice(0, -1);
    clearCurrent();
    updateCurrent(temp);
}

function zero(){
    current.textContent = '0';
    total.textContent = '0';
}

function reset(){
    clearCurrent();
    clearTotal();
    zero();
}

function isLetter(str) {
    return /^[a-z]+$/i.test(str);
}

function clearEntry(){
    if (current.textContent.length > 1 && Math.abs(current.textContent) != Infinity){
        clearLast();
    }
    else{
        reset();
    }
}

function numberClicked(button){
    currentValueArray = adjustNumbersInArray(Array.from(current.textContent));
    lastNumber = currentValueArray[currentValueArray.length-1]
    if (button.textContent === "."){
        if (lastNumber.includes(".") || operators.includes(lastSymbol)){
            return;
        }
    }
    if (["0", "-0"].includes(lastNumber)){
        // prevent e.g. "5-06"
        clearLast();
    }
    if (["0", "-0"].includes(current.textContent) && button.textContent != "."){
        // prevent "0000"
        clearCurrent();
    }
    updateCurrent(button.textContent);
}

function operatorClicked(button){
    if (current.textContent === '0' && button.textContent === '-'){
        clearCurrent();
    }
    if (['*', '/'].includes(lastSymbol) && numbers.includes(current.textContent[current.textContent.length - 2])){
        // if last symbol is * or \ and one before is a number
        if (button.textContent === '-'){
            // allow to multiply or divide by negative numbers
            updateCurrent(button.textContent);
            return;
        }
    }
    if(operators.includes(lastSymbol) || lastSymbol === "."){
        return;
    }
    updateCurrent(button.textContent);
}

operatorButtons.forEach(button => button.addEventListener('click', () => operatorClicked(button)));
numberButtons.forEach(button => button.addEventListener('click', () => numberClicked(button)));
equals.addEventListener('click', () => getResult());
ac.addEventListener('click', () => reset());
ce.addEventListener('click', () => clearEntry());

// populate current and total at the beginning
zero();


