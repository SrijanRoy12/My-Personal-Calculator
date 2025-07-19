document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    let currentInput = '0';
    let degreeMode = false; // false for radians, true for degrees
    let lastFunction = null;
    
    // Update display
    function updateDisplay() {
        display.value = currentInput;
    }
    
    // Clear display
    function clearDisplay() {
        currentInput = '0';
        lastFunction = null;
        updateDisplay();
    }
    
    // Backspace function
    function backspace() {
        if (currentInput.length === 1) {
            currentInput = '0';
        } else {
            currentInput = currentInput.slice(0, -1);
        }
        updateDisplay();
    }
    
    // Add to display
    function addToDisplay(value) {
        if (currentInput === '0' && value !== '.') {
            currentInput = value;
        } else {
            currentInput += value;
        }
        updateDisplay();
    }
    
    // Add operator
    function addOperator(op) {
        if (currentInput !== '0') {
            currentInput += op;
            updateDisplay();
        }
    }
    
    // Add scientific function
    function addFunction(func) {
        if (currentInput !== '0') {
            try {
                let value = parseFloat(currentInput);
                let result;
                
                // Convert to radians if in degree mode for trig functions
                if (['sin', 'cos', 'tan'].includes(func) && degreeMode) {
                    value = value * Math.PI / 180;
                }
                
                switch(func) {
                    case 'sin':
                        result = Math.sin(value);
                        break;
                    case 'cos':
                        result = Math.cos(value);
                        break;
                    case 'tan':
                        result = Math.tan(value);
                        break;
                    case 'asin':
                        result = Math.asin(value);
                        if (degreeMode) result = result * 180 / Math.PI;
                        break;
                    case 'acos':
                        result = Math.acos(value);
                        if (degreeMode) result = result * 180 / Math.PI;
                        break;
                    case 'atan':
                        result = Math.atan(value);
                        if (degreeMode) result = result * 180 / Math.PI;
                        break;
                    case 'log':
                        result = Math.log10(value);
                        break;
                    case 'ln':
                        result = Math.log(value);
                        break;
                    case 'sqrt':
                        result = Math.sqrt(value);
                        break;
                    case 'square':
                        result = Math.pow(value, 2);
                        break;
                    case 'cube':
                        result = Math.pow(value, 3);
                        break;
                    case 'pow10':
                        result = Math.pow(10, value);
                        break;
                    case 'abs':
                        result = Math.abs(value);
                        break;
                    case 'exp':
                        result = Math.exp(value);
                        break;
                    case 'reciprocal':
                        result = 1 / value;
                        break;
                    case 'factorial':
                        result = 1;
                        for (let i = 2; i <= value; i++) {
                            result *= i;
                        }
                        break;
                    default:
                        result = value;
                }
                
                currentInput = result.toString();
                createParticles();
                updateDisplay();
            } catch (error) {
                currentInput = 'Error';
                updateDisplay();
                setTimeout(() => {
                    currentInput = '0';
                    updateDisplay();
                }, 1000);
            }
        }
    }
    
    // Toggle angle mode
    function toggleAngleMode() {
        degreeMode = !degreeMode;
        const modeBtn = document.querySelector('.angle-mode');
        modeBtn.textContent = degreeMode ? 'DEG' : 'RAD';
        modeBtn.style.color = degreeMode ? '#00ff00' : '#ff00ff';
    }
    
    // Calculate final result
    function calculate() {
        try {
            // Replace visual operators with JavaScript equivalents
            let expression = currentInput
                .replace(/×/g, '*')
                .replace(/−/g, '-');
            
            // Handle percentages
            expression = expression.replace(/(\d+)%/g, '($1/100)');
            
            const result = eval(expression);
            currentInput = result.toString();
            createParticles();
            updateDisplay();
        } catch (error) {
            currentInput = 'Error';
            updateDisplay();
            setTimeout(() => {
                currentInput = '0';
                updateDisplay();
            }, 1000);
        }
    }
    
    // Create cyberpunk particles effect
    function createParticles() {
        const calculator = document.querySelector('.cyber-calculator');
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('cyber-particle');
            
            // Random direction and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 50;
            
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            
            // Random color from cyberpunk palette
            const colors = ['#00f2ff', '#ff00ff', '#9d00ff', '#00ff41'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            // Random position near the display
            particle.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
            particle.style.top = `${20 + Math.random() * 10}%`;
            
            calculator.appendChild(particle);
            
            // Remove after animation completes
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    // Initialize
    updateDisplay();
    
    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        
        // Map keys to calculator functions
        const keyMap = {
            '0': () => addToDisplay('0'),
            '1': () => addToDisplay('1'),
            '2': () => addToDisplay('2'),
            '3': () => addToDisplay('3'),
            '4': () => addToDisplay('4'),
            '5': () => addToDisplay('5'),
            '6': () => addToDisplay('6'),
            '7': () => addToDisplay('7'),
            '8': () => addToDisplay('8'),
            '9': () => addToDisplay('9'),
            '.': () => addToDisplay('.'),
            '+': () => addOperator('+'),
            '-': () => addOperator('-'),
            '*': () => addOperator('×'),
            '/': () => addOperator('/'),
            '^': () => addOperator('**'),
            '(': () => addToDisplay('('),
            ')': () => addToDisplay(')'),
            'Enter': calculate,
            '=': calculate,
            'Backspace': backspace,
            'Delete': clearDisplay,
            'Escape': clearDisplay
        };
        
        if (keyMap[key]) {
            e.preventDefault();
            keyMap[key]();
        }
    });
});