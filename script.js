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

function updateCurrent(button){
    current.textContent += button.textContent;
    currentValue = current.textContent.trim();
    lastSymbol = currentValue.charAt(currentValue.length - 1);
}

operatorButtons.forEach(button => button.addEventListener('click', () => {
    if(operators.includes(lastSymbol)){
        current.textContent = current.textContent.slice(0, -1);
    }
    updateCurrent(button);
}));

numberButtons.forEach(button => button.addEventListener('click', () => {
    if (currentValue === '0'){
        current.textContent = '';
    }
    updateCurrent(button);
}));

equals.addEventListener('click', () => {
    if (operators.includes(lastSymbol)){
        return;
    }
    total.textContent = currentValue;
    currentValueArray = Array.from(currentValue);
    currentValueArray = currentValueArray.reduce((acc, val) => {
        if (!isNaN(val) && !isNaN(acc[acc.length - 1])) {
          // If both the current and previous elements are numeric, combine them and update the last element of the accumulator
          acc[acc.length - 1] += val;
        } else {
          // Otherwise, just add the current element to the accumulator
          acc.push(val);
        }
        return acc;
    }, []);
    while (currentValueArray.length > 2)
    {
        firstNum = currentValueArray.shift();
        sign = currentValueArray.shift();
        secondNum = currentValueArray.shift();
        result = operate(firstNum, sign, secondNum);
        currentValueArray.unshift(result);
        console.log(result);
        console.log(currentValueArray);
    }
})

function operate(firstNum, sign, secondNum){
    if (sign === '+'){
        return parseInt(firstNum) + parseInt(secondNum);
    }
    else if (sign === '-'){
        return firstNum - secondNum;
    }
    else if (sign === '*'){
        return firstNum * secondNum;
    }
    else{
        return firstNum / secondNum;
    }
}
// if NUMBER is clicked
    // if current === '0' => overwrite current with NUMBER
    // else => append current

// if OPERATOR is clicked
    // if last in operators => overwrite last
    // else append current

// if EQUALS is clicked
    // if last in operators => do nothing
    // else
        // calculate current
        // display current in total
        // display result in current

// if CE is clicked
    // clear last

// if AC is clicked
    // clear current and total