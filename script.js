// To select the display elements from HTML and display on screen
const previousDisplay = document.querySelector('.previous-value');
const currentDisplay = document.querySelector('.new-value');

// To keep track of our numbers and chosen operator
let current = '0';
let previous = '';
let operator = '';
let shouldResetScreen = false;

// To show our current value on the screen
function updateDisplay() {
  currentDisplay.textContent = current;

  // To reduce the font if the number gets too long 
  if (current.length > 10) {
    currentDisplay.style.fontSize = '1.5rem';
  } else {
    currentDisplay.style.fontSize = '2.2rem';
  }

  // To show the previous number with the operator at the top
  if (operator !== '') {
    previousDisplay.textContent = `${previous} ${operator}`;
  } else {
    previousDisplay.textContent = '';
  }
}

// To handle when a number or 00 is clicked
function appendNumber(num) {
  if (current === 'Cannot divide by 0') {
    clearAll();
  }

  // If we just hit an operator or starting from zero, replace the text
  if (shouldResetScreen || current === '0') {
    current = num;
    shouldResetScreen = false;
  } else if (current.length < 12) {
    current += num;
  }
  updateDisplay();
}

// Add a decimal point if there isn't one already
function appendDecimal() {
  if (current === 'Cannot divide by 0' || shouldResetScreen) {
    current = '0.';
    shouldResetScreen = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
  updateDisplay();
}

// Store the operator and get ready for the next number
function chooseOperator(op) {
  if (current === 'Cannot divide by 0') return;

  // If there's already a calculation waiting, finish it first
  if (previous !== '' && operator !== '' && !shouldResetScreen) {
    calculate();
  }

  operator = op;
  previous = current;
  shouldResetScreen = true;
  updateDisplay();
}

// Actual calculation based on the operator and numbers
function calculate() {
  if (operator === '' || previous === '') return;

  const num1 = parseFloat(previous);
  const num2 = parseFloat(current);
  let result = 0;

  if (operator === '+') {
    result = num1 + num2;
  } else if (operator === '−' || operator === '-') {
    result = num1 - num2;
  } else if (operator === '×' || operator === '*') {
    result = num1 * num2;
  } else if (operator === '÷' || operator === '/') {
    if (num2 === 0) {
      current = 'Cannot divide by 0';
      previous = '';
      operator = '';
      shouldResetScreen = true;
      updateDisplay();
      return;
    }
    result = num1 / num2;
  }

  // Cleaning up floating point decimals like 0.1 + 0.2
  result = Math.round(result * 100000000) / 100000000;

  previousDisplay.textContent = `${previous} ${operator} ${current} =`;
  current = result.toString();
  previous = '';
  operator = '';
  shouldResetScreen = true;
  currentDisplay.textContent = current;
}

// Resetting everything back to start
function clearAll() {
  current = '0';
  previous = '';
  operator = '';
  shouldResetScreen = false;
  previousDisplay.textContent = '';
  updateDisplay();
}

// Deleting one character from the end
function deleteDigit() {
  if (current === 'Cannot divide by 0') {
    clearAll();
    return;
  }

  // If we just clicked an operator, backspace cancels that operator
  if (shouldResetScreen && operator !== '') {
    operator = '';
    current = previous;
    previous = '';
    shouldResetScreen = false;
    updateDisplay();
    return;
  }

  if (current.length > 1) {
    current = current.slice(0, -1);
    if (current === '-') current = '0';
  } else {
    current = '0';
  }
  updateDisplay();
}

// Switching between positive and negative numbers for calculation
function toggleSign() {
  if (current === '0' || current === 'Cannot divide by 0') return;

  if (current.startsWith('-')) {
    current = current.slice(1);
  } else {
    current = '-' + current;
  }
  updateDisplay();
}

// Turning number into percentage
function percentage() {
  if (current === 'Cannot divide by 0') return;
  const num = parseFloat(current);
  if (!isNaN(num)) {
    current = (num / 100).toString();
    updateDisplay();
  }
}

// We can also type with our keyboard to make it more accessible
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    appendNumber(e.key);
  } else if (e.key === '.' || e.key === ',') {
    appendDecimal();
  } else if (e.key === '+') {
    chooseOperator('+');
  } else if (e.key === '-') {
    chooseOperator('−');
  } else if (e.key === '*' || e.key.toLowerCase() === 'x') {
    chooseOperator('×');
  } else if (e.key === '/') {
    e.preventDefault();
    chooseOperator('÷');
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  } else if (e.key === 'Backspace') {
    deleteDigit();
  } else if (e.key === 'Escape') {
    clearAll();
  } else if (e.key === '%') {
    percentage();
  }
});
