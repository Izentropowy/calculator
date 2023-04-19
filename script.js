var current = document.querySelector('.current');
var total = document.querySelector('.total');
var currentValue = current.textContent.trim();
var totalValue = total.textContent.trim();
var lastSymbol = currentValue.charAt(currentValue.length - 1);
var operatorButtons = Array.from(document.querySelectorAll('.operator')); 
var numberButtons = Array.from(document.querySelectorAll('.number'));

const ac = document.querySelector('.ac');
const ce = document.querySelector('.ce');
const equals = document.querySelector('.equals');
const operators = operatorButtons.map(button => button.textContent);
const numbers = numberButtons.map(button => button.textContent);

function updateCurrent(operation){
    current.textContent += operation;
    currentValue = current.textContent.trim();
    lastSymbol = currentValue.charAt(currentValue.length - 1);
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
    current.textContent = current.textContent.slice(0, -1);
}

function isLetter(str) {
    return /^[a-z]+$/i.test(str);
}

function adjustNumbersInArray(arr){
    // I is the first leter from "Infinity"
    if (arr.includes('I')){
        arr = arr.reduce((acc, val) => {
            console.log(acc, val);
            if (isLetter(val) && acc.length > 0){
                acc[acc.length - 1] += val;
            }
            else{
                acc.push(val);
            }
            return acc;
        }, []);
    }
    console.log(arr);
    let adjusted = arr.reduce((acc, val) => {
        if (!isNaN(val) && !isNaN(acc[acc.length - 1])) {
            // If both the current and previous elements are numeric, combine them and update the last element of the accumulator
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

function operateSinglePair(firstNum, sign, secondNum){
    if (sign === '+'){
        return parseInt(firstNum) + parseInt(secondNum);
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
    // if onle one number is entered
    let result = arr[arr.length-1];
    
    // from array with numbers separated by operators, operate on each consecutive pair of numbers and replace each pair with a result
    while (arr.length > 2)
    {
        result = 0;
        let firstNum = arr.shift();
        let sign = arr.shift();
        let secondNum = arr.shift();
        result = operateSinglePair(firstNum, sign, secondNum);
        arr.unshift(result);
    }
    return result;
}

operatorButtons.forEach(button => button.addEventListener('click', () => {
    if(operators.includes(lastSymbol)){
        clearLast();
    }
    updateCurrent(button.textContent);
}));

numberButtons.forEach(button => button.addEventListener('click', () => {
    if (currentValue === '0'){
        clearCurrent();
    }
    updateCurrent(button.textContent);
}));

equals.addEventListener('click', () => {
    if (operators.includes(lastSymbol)){
        return;
    }
    updateTotal(currentValue);
    currentValueArray = adjustNumbersInArray(Array.from(currentValue));
    let result = operateAll(currentValueArray);
    clearCurrent();
    updateCurrent(result);
})

ac.addEventListener('click', () => {
    clearCurrent();
    clearTotal();
    updateCurrent('0');
    total.textContent = '0';
})

ce.addEventListener('click', () => {
    if (currentValue.length > 1){
        clearLast();
    }
    else{
        updateCurrent('0');
    }
})
