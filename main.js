let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function updateDisplay() {
    display.textContent = currentInput;
    // Add active effect
    display.classList.add('active');
    setTimeout(() => display.classList.remove('active'), 100);
}

function clearDisplay() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
    addRipple(event);
}

function appendToDisplay(value) {
    if (shouldResetDisplay && !isOperator(value)) {
        currentInput = '0';
        shouldResetDisplay = false;
    }

    if (currentInput === '0' && value !== '.') {
        if (isOperator(value)) {
            currentInput += value;
        } else {
            currentInput = value;
        }
    } else if (isOperator(value) && isOperator(currentInput[currentInput.length - 1])) {
        currentInput = currentInput.slice(0, -1) + value;
    } else if (value === '.' && currentInput.includes('.')) {
        // Prevent multiple decimal points in the same number
        let parts = currentInput.split(/[\+\-\*\/]/);
        if (parts[parts.length - 1].includes('.')) {
            return;
        }
        currentInput += value;
    } else {
        currentInput += value;
    }

    updateDisplay();
    addRipple(event);
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
    addRipple(event);
}

function calculate() {
    try {
        // Remove any trailing operators
        let expression = currentInput;
        while (isOperator(expression[expression.length - 1])) {
            expression = expression.slice(0, -1);
        }
                
        // Evaluate the expression
        let result = eval(expression);
                
        // Handle division by zero
        if (!isFinite(result)) {
            currentInput = 'Error';
        } else {
            // Round to avoid floating point issues
            result = Math.round(result * 100000000) / 100000000;
            currentInput = result.toString();
        }
        shouldResetDisplay = true;
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
    }
    updateDisplay();
    addRipple(event);
}

// Add ripple effect on button click
function addRipple(event) {
    if (!event || !event.target) return;
            
    const button = event.target;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
            
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
            
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
            
    button.appendChild(ripple);
            
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        appendToDisplay(event.key);
    } else if (event.key === '.') {
        appendToDisplay('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendToDisplay(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
    calculate();
    } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        deleteLast();
    }
});

// Add ripple effect to all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', addRipple);
});