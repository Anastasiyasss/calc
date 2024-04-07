let currentInput = '';
let history = '';
let chart = null;
// Обработчики событий для кнопок калькулятора
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value === 'AC') {
            clearDisplay();
        } else if (value === '←') {
            backspace();
        } else if (value === '.') {
            inputDecimal(value);
        } else if (value === '=') {
            calculate();
        } else {
            inputSymbol(value);
        }
    });
});

// Обработчик событий для клавиатуры
document.addEventListener('keydown', event => {
    const value = event.key;
    if (!isNaN(value) || value === '.') {
        inputNumber(value);
    } else if (value === '+' || value === '-' || value === '*' || value === '/') {
        inputSymbol(value);
    } else if (value === 'Enter') {
        calculate();
    } else if (value === 'Backspace') {
        backspace();
    } else if (value === 'Escape') {
        clearDisplay();
    }
});

function clearDisplay() {
    currentInput = '';
    history = '';
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function inputNumber(num) {
    if (currentInput.length >= 10) return; // Prevent very long numbers
    currentInput += num;
    updateDisplay();
}

function inputSymbol(sym) {
    if (currentInput === '' && sym !== '(' && sym !== ')') {
        currentInput = sym;
    } else if (currentInput !== '' || sym === '(') {
        currentInput += sym;
    }
    updateDisplay();
}

function inputDecimal(point) {
    if (!currentInput.includes(point)) {
        currentInput += point;
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('result').textContent = currentInput;
    document.getElementById('history').textContent = 'История: ' + history;
}

function provideMathFact(operation) {
    const facts = {
        '+': 'Сложение является одной из самых старых математических операций, упоминание о которой можно найти в древних папирусах.',
        '-': 'Вычитание также известно с давних времён. Считается, что оно было освоено ещё до написания.',
        '*': 'Умножение изначально выполнялось как многократное сложение того же числа.',
        '/': 'Деление, как и многие другие операции, было затруднительно без изобретения нуля и позиционной системы счисления.',
        'sqrt': 'Квадратный корень из числа это операция обратная возведению числа в квадрат.',
        '^': 'Возведение в степень является достаточно быстрым методом увеличения числа, а его алгоритмы были разработаны еще в древности.',
        'sin': 'Функция синуса очень важна в тригонометрии, и её название происходит от латинского слова sinus, что означает "залив" или "передвижение".',
        'cos': 'Косинус также является основной тригонометрической функцией и аналогично синусу имеет давнюю историю.',
        'tan': 'Тангенс является соотношением синуса к косинусу и широко используется в математике и инженерии.',
        'log': 'Логарифмы используются для решения множества задач в науке, инженерии и экономике. Они также имеют широкое применение в криптографии.',
        'ln': 'Натуральные логарифмы имеют много интересных свойств и используются в различных областях, включая статистику, физику и математический анализ.',
        'pi': 'Число π (пи) является одним из наиболее известных и важных математических констант. Оно используется во многих формулах и имеет бесконечное число десятичных знаков.',
        'e': 'Число e является основой натурального логарифма и имеет множество применений в математике, науке и инженерии. Оно также обладает бесконечным количеством десятичных знаков.'
    };
    return facts[operation] || 'Математика полна интересных фактов и прикладных задач!';
}


// Генерация и отображение графика
function drawGraph(equation) {
    if (!chart) {
        // Инициализация графика, если он ещё не был создан
        chart = new Chart(document.getElementById('myChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'График функции',
                    data: []
                }]
            }
        });
    } else {
        // Обновление графика, если он уже инициализирован
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
    }

    // Генерация данных для графика с помощью math.js
    for(let x = -10; x <= 10; x += 0.5) {
        chart.data.labels.push(x);
        chart.data.datasets[0].data.push(math.evaluate(equation.replace(/x/g, '(' + x.toString() + ')')));
    }

    chart.update();
}


function calculate() {
    try {
        history += currentInput;

        // Определение последней операции для выбора факта
        let lastOperationMatch = history.match(/[\+\-\*\/\^\√sin|cos|tan|log|ln]+/g);
        let lastOperation = lastOperationMatch ? lastOperationMatch.pop().replace(/\(|\)/g, '') : '';

        let fixedHistory = history.replace(/sin\((-?\d+(\.\d+)?)\)/g, 'sin($1 deg)')
                                   .replace(/cos\((-?\d+(\.\d+)?)\)/g, 'cos($1 deg)')
                                   .replace(/tan\((-?\d+(\.\d+)?)\)/g, 'tan($1 deg)')
                                   .replace(/log\((-?\d+(\.\d+)?)\)/g, 'log($1, 10)')
                                   .replace(/ln\((-?\d+(\.\d+)?)\)/g, 'log($1)');
        
        // Расчет результата с помощью math.js
        let result = math.evaluate(fixedHistory);
        currentInput = result.toString();

        // Обновление дисплея
        updateDisplay();

        // Вывод интересного факта
        let mathFact = provideMathFact(lastOperation);
        document.getElementById('history').textContent = mathFact;

        // Проверка на наличие тригонометрической функции и отрисовка графика
        if (['sin', 'cos', 'tan'].includes(lastOperation)) {
            drawGraph(lastOperation + '(' + history + ')');
        }

        history = '';
    } catch (error) {
        currentInput = 'Ошибка!';
        history = '';
        updateDisplay();
    }
}




drawGraph('sin(x)');


// Начальное обновление дисплея
updateDisplay();
