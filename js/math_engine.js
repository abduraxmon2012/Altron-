/**
 * ALTRON MATHEMATICAL CORE ENGINE (math_engine.js)
 * Символьный и численный математический движок с пошаговыми решениями
 */

const AltronMath = (function() {
    'use strict';

    // Вспомогательное форматирование чисел
    function formatNum(n, precision = 6) {
        if (Math.abs(n) < 1e-12) return "0";
        if (Number.isInteger(n)) return n.toString();
        const rounded = Number(n.toFixed(precision));
        return rounded.toString();
    }

    // НОД (наибольший общий делитель)
    function gcd(a, b) {
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        while (b) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    // НОК (наименьшее общее кратное)
    function lcm(a, b) {
        if (a === 0 || b === 0) return 0;
        return Math.abs(Math.round(a * b)) / gcd(a, b);
    }

    // Факториал
    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }

    // Сочетания C(n, k)
    function combinations(n, k) {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;
        if (k > n / 2) k = n - k;
        let res = 1;
        for (let i = 1; i <= k; i++) {
            res = (res * (n - i + 1)) / i;
        }
        return Math.round(res);
    }

    // Размещение A(n, k)
    function permutations(n, k) {
        if (k < 0 || k > n) return 0;
        let res = 1;
        for (let i = 0; i < k; i++) {
            res *= (n - i);
        }
        return res;
    }

    // Проверка на простоту
    function isPrime(n) {
        n = Math.round(n);
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 === 0 || n % 3 === 0) return false;
        for (let i = 5; i * i <= n; i += 6) {
            if (n % i === 0 || n % (i + 2) === 0) return false;
        }
        return true;
    }

    // Факторизация на простые множители
    function primeFactors(n) {
        n = Math.abs(Math.round(n));
        const factors = {};
        if (n <= 1) return factors;
        
        let d = 2;
        while (d * d <= n) {
            while (n % d === 0) {
                factors[d] = (factors[d] || 0) + 1;
                n /= d;
            }
            d = d === 2 ? 3 : d + 2;
        }
        if (n > 1) {
            factors[n] = (factors[n] || 0) + 1;
        }
        return factors;
    }

    // -------------------------------------------------------------
    // АЛГЕБРА: Решение уравнений
    // -------------------------------------------------------------

    // Квадратное уравнение a*x^2 + b*x + c = 0
    function solveQuadratic(a, b, c) {
        const steps = [];
        steps.push(`Исходное квадратное уравнение: $${a}x^2 + (${b})x + (${c}) = 0$`);
        steps.push(`Коэффициенты уравнения: $a = ${a}$, $b = ${b}$, $c = ${c}$`);

        if (Math.abs(a) < 1e-12) {
            // Линейное уравнение
            if (Math.abs(b) < 1e-12) {
                if (Math.abs(c) < 1e-12) {
                    return {
                        roots: ["Уравнение имеет бесконечно много решений (0 = 0)"],
                        steps: steps.concat(["$0 = 0$ — верно для любого $x$."]),
                        latex: "x \\in \\mathbb{R}"
                    };
                } else {
                    return {
                        roots: ["Уравнение не имеет решений"],
                        steps: steps.concat([`Уравнение вида $${c} = 0$ противоречиво.`]),
                        latex: "\\emptyset"
                    };
                }
            }
            const root = -c / b;
            steps.push(`Так как $a = 0$, уравнение линейное: $${b}x + ${c} = 0$`);
            steps.push(`Переносим свободный член: $${b}x = ${-c}$`);
            steps.push(`Находим корень: $x = \\frac{${-c}}{${b}} = ${formatNum(root)}$`);
            return {
                roots: [formatNum(root)],
                steps,
                latex: `x = ${formatNum(root)}`
            };
        }

        const D = b * b - 4 * a * c;
        steps.push(`Вычисляем дискриминант: $D = b^2 - 4ac = (${b})^2 - 4 \\cdot (${a}) \\cdot (${c}) = ${D}$`);

        if (D > 1e-12) {
            const sqrtD = Math.sqrt(D);
            const x1 = (-b + sqrtD) / (2 * a);
            const x2 = (-b - sqrtD) / (2 * a);
            steps.push(`Так как $D > 0$, уравнение имеет два различных действительных корня:`);
            steps.push(`$x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{-(${b}) \\pm \\sqrt{${D}}}{2 \\cdot (${a})}$`);
            steps.push(`$x_1 = \\frac{${-b} + ${formatNum(sqrtD, 4)}}{${2 * a}} = ${formatNum(x1)}$`);
            steps.push(`$x_2 = \\frac{${-b} - ${formatNum(sqrtD, 4)}}{${2 * a}} = ${formatNum(x2)}$`);
            return {
                roots: [formatNum(x1), formatNum(x2)],
                steps,
                latex: `x_1 = ${formatNum(x1)}, \\quad x_2 = ${formatNum(x2)}`
            };
        } else if (Math.abs(D) <= 1e-12) {
            const x = -b / (2 * a);
            steps.push(`Так как $D = 0$, уравнение имеет один корень кратности 2 (два совпадающих корня):`);
            steps.push(`$x = \\frac{-b}{2a} = \\frac{-(${b})}{2 \\cdot (${a})} = ${formatNum(x)}$`);
            return {
                roots: [formatNum(x)],
                steps,
                latex: `x = ${formatNum(x)}`
            };
        } else {
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-D) / (2 * a);
            steps.push(`Так как $D < 0$, действительных корней нет. Находим комплексные корни:`);
            steps.push(`$x_{1,2} = \\frac{-b \\pm i\\sqrt{|D|}}{2a}$`);
            const root1 = `${formatNum(realPart)} + ${formatNum(Math.abs(imagPart))}i`;
            const root2 = `${formatNum(realPart)} - ${formatNum(Math.abs(imagPart))}i`;
            steps.push(`$x_1 = ${root1}$`);
            steps.push(`$x_2 = ${root2}$`);
            return {
                roots: [root1, root2],
                steps,
                latex: `x_{1,2} = ${formatNum(realPart)} \\pm ${formatNum(Math.abs(imagPart))}i`
            };
        }
    }

    // Решение системы 2x2 линейных уравнений методом Крамера:
    // a1*x + b1*y = c1
    // a2*x + b2*y = c2
    function solveSystem2x2(a1, b1, c1, a2, b2, c2) {
        const steps = [];
        steps.push(`Система линейных уравнений:\n$$\\begin{cases} ${a1}x + ${b1}y = ${c1} \\\\ ${a2}x + ${b2}y = ${c2} \\end{cases}$$`);
        steps.push(`Применим метод Крамера.`);
        
        const detMain = a1 * b2 - a2 * b1;
        steps.push(`Главный определитель системы $\\Delta$:\n$$\\Delta = \\begin{vmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{vmatrix} = (${a1}) \\cdot (${b2}) - (${b1}) \\cdot (${a2}) = ${detMain}$$`);

        const detX = c1 * b2 - c2 * b1;
        steps.push(`Определитель $\\Delta_x$ (заменяем 1-й столбец свободными членами):\n$$\\Delta_x = \\begin{vmatrix} ${c1} & ${b1} \\\\ ${c2} & ${b2} \\end{vmatrix} = (${c1}) \\cdot (${b2}) - (${b1}) \\cdot (${c2}) = ${detX}$$`);

        const detY = a1 * c2 - a2 * c1;
        steps.push(`Определитель $\\Delta_y$ (заменяем 2-й столбец свободными членами):\n$$\\Delta_y = \\begin{vmatrix} ${a1} & ${c1} \\\\ ${a2} & ${c2} \\end{vmatrix} = (${a1}) \\cdot (${c2}) - (${c1}) \\cdot (${a2}) = ${detY}$$`);

        if (Math.abs(detMain) > 1e-12) {
            const x = detX / detMain;
            const y = detY / detMain;
            steps.push(`Так как $\\Delta \\neq 0$, система имеет единственное решение:`);
            steps.push(`$x = \\frac{\\Delta_x}{\\Delta} = \\frac{${detX}}{${detMain}} = ${formatNum(x)}$`);
            steps.push(`$y = \\frac{\\Delta_y}{\\Delta} = \\frac{${detY}}{${detMain}} = ${formatNum(y)}$`);
            return {
                solution: { x, y },
                steps,
                latex: `x = ${formatNum(x)}, \\quad y = ${formatNum(y)}`
            };
        } else {
            if (Math.abs(detX) < 1e-12 && Math.abs(detY) < 1e-12) {
                steps.push(`Так как $\\Delta = 0$ и $\\Delta_x = \\Delta_y = 0$, система имеет бесконечно много решений.`);
                return {
                    solution: "Бесконечно много решений",
                    steps,
                    latex: "\\text{Бесконечно много решений}"
                };
            } else {
                steps.push(`Так как $\\Delta = 0$, но $\\Delta_x \\neq 0$ или $\\Delta_y \\neq 0$, система несовместна (не имеет решений).`);
                return {
                    solution: "Нет решений",
                    steps,
                    latex: "\\emptyset"
                };
            }
        }
    }

    // -------------------------------------------------------------
    // ЛИНЕЙНАЯ АЛГЕБРА: Матрицы
    // -------------------------------------------------------------

    // Определитель матрицы N x N
    function matrixDeterminant(matrix) {
        const n = matrix.length;
        if (n !== matrix[0].length) throw new Error("Матрица должна быть квадратной!");

        if (n === 1) return matrix[0][0];
        if (n === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        if (n === 3) {
            const m = matrix;
            return (
                m[0][0] * m[1][1] * m[2][2] +
                m[0][1] * m[1][2] * m[2][0] +
                m[0][2] * m[1][0] * m[2][1] -
                m[0][2] * m[1][1] * m[2][0] -
                m[0][0] * m[1][2] * m[2][1] -
                m[0][1] * m[1][0] * m[2][2]
            );
        }

        // Общий рекурсивный метод разложения по первой строке
        let det = 0;
        for (let j = 0; j < n; j++) {
            const subMatrix = [];
            for (let i = 1; i < n; i++) {
                subMatrix.push(matrix[i].filter((_, colIdx) => colIdx !== j));
            }
            const sign = j % 2 === 0 ? 1 : -1;
            det += sign * matrix[0][j] * matrixDeterminant(subMatrix);
        }
        return det;
    }

    // Транспонирование матрицы
    function matrixTranspose(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const res = [];
        for (let j = 0; j < cols; j++) {
            res[j] = [];
            for (let i = 0; i < rows; i++) {
                res[j][i] = matrix[i][j];
            }
        }
        return res;
    }

    // Умножение матриц
    function matrixMultiply(A, B) {
        const rowsA = A.length;
        const colsA = A[0].length;
        const rowsB = B.length;
        const colsB = B[0].length;

        if (colsA !== rowsB) {
            throw new Error(`Невозможно перемножить матрицы размеров ${rowsA}x${colsA} и ${rowsB}x${colsB}`);
        }

        const C = [];
        for (let i = 0; i < rowsA; i++) {
            C[i] = [];
            for (let j = 0; j < colsB; j++) {
                let sum = 0;
                for (let k = 0; k < colsA; k++) {
                    sum += A[i][k] * B[k][j];
                }
                C[i][j] = sum;
            }
        }
        return C;
    }

    // Обратная матрица
    function matrixInverse(matrix) {
        const n = matrix.length;
        if (n !== matrix[0].length) throw new Error("Матрица должна быть квадратной");
        const det = matrixDeterminant(matrix);
        if (Math.abs(det) < 1e-12) {
            throw new Error("Матрица вырождена (определитель = 0), обратной матрицы не существует.");
        }

        if (n === 1) return [[1 / matrix[0][0]]];

        // Матрица алгебраических дополнений
        const adj = [];
        for (let i = 0; i < n; i++) {
            adj[i] = [];
            for (let j = 0; j < n; j++) {
                const sub = [];
                for (let r = 0; r < n; r++) {
                    if (r === i) continue;
                    sub.push(matrix[r].filter((_, c) => c !== j));
                }
                const sign = (i + j) % 2 === 0 ? 1 : -1;
                adj[i][j] = sign * matrixDeterminant(sub);
            }
        }

        // Транспонируем adj и делим на det
        const inv = [];
        for (let i = 0; i < n; i++) {
            inv[i] = [];
            for (let j = 0; j < n; j++) {
                inv[i][j] = adj[j][i] / det;
            }
        }
        return inv;
    }

    // Форматирование матрицы в LaTeX
    function matrixToLatex(matrix) {
        const rows = matrix.map(row => row.map(v => formatNum(v, 4)).join(" & "));
        return "\\begin{pmatrix}\n" + rows.join(" \\\\\n") + "\n\\end{pmatrix}";
    }

    // -------------------------------------------------------------
    // СТАТИСТИКА И АНАЛИЗ ДАННЫХ
    // -------------------------------------------------------------
    function calculateStatistics(numbers) {
        if (!numbers || numbers.length === 0) throw new Error("Массив чисел пуст");
        const n = numbers.length;
        const sorted = [...numbers].sort((a, b) => a - b);
        
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        
        let median;
        if (n % 2 === 1) {
            median = sorted[Math.floor(n / 2)];
        } else {
            median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        }

        // Мода
        const counts = {};
        let maxCount = 0;
        numbers.forEach(num => {
            counts[num] = (counts[num] || 0) + 1;
            if (counts[num] > maxCount) maxCount = counts[num];
        });
        const modes = Object.keys(counts).filter(k => counts[k] === maxCount).map(Number);

        // Дисперсия и СКО
        const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n > 1 ? (n - 1) : 1);
        const stdDev = Math.sqrt(variance);

        const steps = [
            `Количество элементов: $N = ${n}$`,
            `Упорядоченный ряд: $(${sorted.join(", ")})$`,
            `Сумма элементов: $\\sum = ${formatNum(sum)}$`,
            `Среднее арифметическое: $\\bar{x} = \\frac{\\sum x}{N} = \\frac{${formatNum(sum)}}{${n}} = ${formatNum(mean)}$`,
            `Медиана: $Me = ${formatNum(median)}$`,
            `Мода: $Mo = ${modes.join(", ")}$ (встречается ${maxCount} раз)`,
            `Выборочная дисперсия: $s^2 = \\frac{1}{N-1} \\sum (x_i - \\bar{x})^2 = ${formatNum(variance)}$`,
            `Стандартное отклонение: $s = \\sqrt{s^2} = ${formatNum(stdDev)}$`,
            `Минимум: $${sorted[0]}$, Максимум: $${sorted[n - 1]}$, Размах: $${formatNum(sorted[n - 1] - sorted[0])}$`
        ];

        return {
            n,
            sum,
            mean,
            median,
            modes,
            variance,
            stdDev,
            min: sorted[0],
            max: sorted[n - 1],
            range: sorted[n - 1] - sorted[0],
            steps
        };
    }

    // -------------------------------------------------------------
    // ЧИСЛЕННЫЙ АНАЛИЗ И ИНТЕГРИРОВАНИЕ
    // -------------------------------------------------------------

    // Численное дифференцирование методом центральных разностей
    function numericalDerivative(fn, x, h = 1e-5) {
        return (fn(x + h) - fn(x - h)) / (2 * h);
    }

    // Численное интегрирование методом Симпсона
    function numericalIntegral(fn, a, b, n = 1000) {
        if (n % 2 !== 0) n++;
        const h = (b - a) / n;
        let sum = fn(a) + fn(b);

        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            sum += (i % 2 === 0 ? 2 : 4) * fn(x);
        }
        return (h / 3) * sum;
    }

    // Поиск корней функции на отрезке методом бисекции (дихотомии)
    function findRoots(fn, a, b, steps = 100) {
        const roots = [];
        const dx = (b - a) / steps;
        let prevX = a;
        let prevY = fn(prevX);

        for (let i = 1; i <= steps; i++) {
            const currX = a + i * dx;
            const currY = fn(currX);

            if (Math.abs(currY) < 1e-7) {
                roots.push(currX);
            } else if (prevY * currY < 0) {
                // Уточняем корень методом половинного деления
                let l = prevX, r = currX;
                for (let iter = 0; iter < 40; iter++) {
                    const mid = (l + r) / 2;
                    const fMid = fn(mid);
                    if (Math.abs(fMid) < 1e-9) {
                        l = mid;
                        break;
                    }
                    if (prevY * fMid < 0) {
                        r = mid;
                    } else {
                        l = mid;
                    }
                }
                roots.push((l + r) / 2);
            }
            prevX = currX;
            prevY = currY;
        }

        // Удаляем дубликаты
        const unique = [];
        for (let r of roots) {
            if (!unique.some(u => Math.abs(u - r) < 1e-4)) {
                unique.push(r);
            }
        }
        return unique;
    }

    // -------------------------------------------------------------
    // СИМВОЛЬНЫЕ ПРАВИЛА ДИФФЕРЕНЦИРОВАНИЯ И ИНТЕГРИРОВАНИЯ
    // -------------------------------------------------------------
    function differentiateSymbolic(exprStr) {
        const clean = exprStr.replace(/\s+/g, '').toLowerCase();

        // 1. Полиномы и степени вида: x^n или a*x^n
        const polyMatch = clean.match(/^([+-]?\d*(?:\.\d+)?)?\*?x(?:\^([+-]?\d+))?$/);
        if (polyMatch) {
            let coef = polyMatch[1] === "" || polyMatch[1] === undefined ? 1 : (polyMatch[1] === "-" ? -1 : Number(polyMatch[1]));
            let power = polyMatch[2] === undefined ? 1 : Number(polyMatch[2]);

            if (power === 0) {
                return {
                    result: "0",
                    latex: "0",
                    steps: [`Константа: $\\frac{d}{dx}(${coef}) = 0$`]
                };
            }
            if (power === 1) {
                return {
                    result: `${coef}`,
                    latex: `${coef}`,
                    steps: [`Степенное правило для степени 1: $\\frac{d}{dx}(${coef}x) = ${coef}$`]
                };
            }
            const newCoef = coef * power;
            const newPower = power - 1;
            const resLatex = newPower === 1 ? `${newCoef}x` : (newPower === 0 ? `${newCoef}` : `${newCoef}x^{${newPower}}`);
            return {
                result: newPower === 1 ? `${newCoef}*x` : (newPower === 0 ? `${newCoef}` : `${newCoef}*x^${newPower}`),
                latex: resLatex,
                steps: [
                    `Применяем правило дифференцирования степени: $\\frac{d}{dx}(c \\cdot x^n) = c \\cdot n \\cdot x^{n-1}$`,
                    `$(${coef}) \\cdot (${power}) \\cdot x^{${power} - 1} = ${resLatex}$`
                ]
            };
        }

        // 2. Стандартные тригонометрические и элементарные функции
        const rules = [
            { pattern: /^sin\(x\)$/, deriv: "cos(x)", derivLatex: "\\cos(x)", rule: "\\frac{d}{dx}\\sin(x) = \\cos(x)" },
            { pattern: /^cos\(x\)$/, deriv: "-sin(x)", derivLatex: "-\\sin(x)", rule: "\\frac{d}{dx}\\cos(x) = -\\sin(x)" },
            { pattern: /^tan\(x\)$/, deriv: "1/cos(x)^2", derivLatex: "\\frac{1}{\\cos^2(x)} = 1 + \\tan^2(x)", rule: "\\frac{d}{dx}\\tan(x) = \\frac{1}{\\cos^2(x)}" },
            { pattern: /^e\^x$/, deriv: "e^x", derivLatex: "e^x", rule: "\\frac{d}{dx}e^x = e^x" },
            { pattern: /^ln\(x\)$/, deriv: "1/x", derivLatex: "\\frac{1}{x}", rule: "\\frac{d}{dx}\\ln(x) = \\frac{1}{x}" },
            { pattern: /^sqrt\(x\)$/, deriv: "1/(2*sqrt(x))", derivLatex: "\\frac{1}{2\\sqrt{x}}", rule: "\\frac{d}{dx}\\sqrt{x} = \\frac{1}{2\\sqrt{x}}" }
        ];

        for (let r of rules) {
            if (r.pattern.test(clean)) {
                return {
                    result: r.deriv,
                    latex: r.derivLatex,
                    steps: [
                        `Табличная производная: $${r.rule}$`,
                        `Результат: $${r.derivLatex}$`
                    ]
                };
            }
        }

        // Если функция сложнее — используем Math.js (если подключен) или символьный разбор
        if (typeof math !== 'undefined' && math.derivative) {
            try {
                const d = math.derivative(exprStr, 'x');
                const simplified = math.simplify(d);
                return {
                    result: simplified.toString(),
                    latex: simplified.toTex(),
                    steps: [
                        `Дифференцируем выражение по переменной $x$:`,
                        `$\\frac{d}{dx}\\left(${exprStr}\\right) = ${d.toTex()}$`,
                        `Упрощаем результат: $${simplified.toTex()}$`
                    ]
                };
            } catch (e) {
                // fallback
            }
        }

        return {
            result: `d/dx(${exprStr})`,
            latex: `\\frac{d}{dx}\\left(${exprStr}\\right)`,
            steps: [`Выражение принято: $\\frac{d}{dx}\\left(${exprStr}\\right)$`]
        };
    }

    // -------------------------------------------------------------
    // АРИФМЕТИКА: Пошаговое решение примеров (+, -, *, /, скобки, дроби, %)
    // -------------------------------------------------------------
    function solveArithmeticWithSteps(exprStr) {
        let clean = exprStr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/:/g, '/')
            .replace(/,/g, '.')
            .replace(/\s+/g, ' ')
            .trim();

        const steps = [];

        // 1. Проценты: например "20% от 450"
        const percentMatch = clean.match(/(\d+(?:\.\d+)?)\s*%\s*(?:от|of)\s*(\d+(?:\.\d+)?)/i);
        if (percentMatch) {
            const p = parseFloat(percentMatch[1]);
            const total = parseFloat(percentMatch[2]);
            const fraction = p / 100;
            const res = fraction * total;

            steps.push(`Нахождение ${p}% от числа ${total}:`);
            steps.push(`1. Переводим проценты в десятичную дробь: $${p}\\% = \\frac{${p}}{100} = ${formatNum(fraction)}$`);
            steps.push(`2. Умножаем полученную дробь на число: $${formatNum(fraction)} \\times ${total} = ${formatNum(res)}$`);

            return {
                result: formatNum(res),
                latex: `${p}\\% \\text{ от } ${total} = ${formatNum(res)}`,
                steps,
                summary: `${p}% от ${total} равно ${formatNum(res)}`
            };
        }

        // 2. Обыкновенные дроби: a/b [+-*/] c/d
        const fracMatch = clean.match(/^(\d+)\/(\d+)\s*([+\-*\/])\s*(\d+)\/(\d+)$/);
        if (fracMatch) {
            const a = parseInt(fracMatch[1]);
            const b = parseInt(fracMatch[2]);
            const op = fracMatch[3];
            const c = parseInt(fracMatch[4]);
            const d = parseInt(fracMatch[5]);

            if (b === 0 || d === 0) throw new Error("Деление на ноль в знаменателе дроби невозможно!");

            if (op === '+') {
                const commonDenom = lcm(b, d);
                const m1 = commonDenom / b;
                const m2 = commonDenom / d;
                const numSum = a * m1 + c * m2;
                const g = gcd(numSum, commonDenom);
                const simpNum = numSum / g;
                const simpDen = commonDenom / g;

                steps.push(`Сложение дробей: $\\frac{${a}}{${b}} + \\frac{${c}}{${d}}$`);
                steps.push(`1. Находим общий знаменатель: $\\text{НОК}(${b}, ${d}) = ${commonDenom}$`);
                steps.push(`2. Приводим дроби к общему знаменателю (дополнительные множители ${m1} и ${m2}):\n$$\\frac{${a} \\cdot ${m1}}{${commonDenom}} + \\frac{${c} \\cdot ${m2}}{${commonDenom}} = \\frac{${a * m1} + ${c * m2}}{${commonDenom}} = \\frac{${numSum}}{${commonDenom}}$$`);
                if (g > 1) {
                    steps.push(`3. Сокращаем полученную дробь на $\\text{НОД} = ${g}$:\n$$\\frac{${numSum}}{${commonDenom}} = \\frac{${simpNum}}{${simpDen}}$$`);
                }
                const decVal = simpNum / simpDen;
                steps.push(`В виде десятичной дроби: $\\approx ${formatNum(decVal, 4)}$`);

                return {
                    result: simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`,
                    latex: `\\frac{${a}}{${b}} + \\frac{${c}}{${d}} = ${simpDen === 1 ? simpNum : `\\frac{${simpNum}}{${simpDen}}`}`,
                    steps,
                    summary: `Ответ: ${simpDen === 1 ? simpNum : `${simpNum}/${simpDen}`} (${formatNum(decVal, 4)})`
                };
            } else if (op === '-') {
                const commonDenom = lcm(b, d);
                const m1 = commonDenom / b;
                const m2 = commonDenom / d;
                const numDiff = a * m1 - c * m2;
                const g = gcd(Math.abs(numDiff), commonDenom);
                const simpNum = numDiff / g;
                const simpDen = commonDenom / g;

                steps.push(`Вычитание дробей: $\\frac{${a}}{${b}} - \\frac{${c}}{${d}}$`);
                steps.push(`1. Общий знаменатель: $\\text{НОК}(${b}, ${d}) = ${commonDenom}$`);
                steps.push(`2. Приводим дроби: $\\frac{${a * m1} - ${c * m2}}{${commonDenom}} = \\frac{${numDiff}}{${commonDenom}}$`);
                if (g > 1 && numDiff !== 0) {
                    steps.push(`3. Сокращаем на ${g}: $\\frac{${simpNum}}{${simpDen}}$`);
                }
                const decVal = simpNum / simpDen;

                return {
                    result: simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`,
                    latex: `\\frac{${a}}{${b}} - \\frac{${c}}{${d}} = ${simpDen === 1 ? simpNum : `\\frac{${simpNum}}{${simpDen}}`}`,
                    steps,
                    summary: `Ответ: ${simpDen === 1 ? simpNum : `${simpNum}/${simpDen}`} (${formatNum(decVal, 4)})`
                };
            } else if (op === '*') {
                const num = a * c;
                const den = b * d;
                const g = gcd(num, den);
                const simpNum = num / g;
                const simpDen = den / g;

                steps.push(`Умножение дробей: $\\frac{${a}}{${b}} \\times \\frac{${c}}{${d}}$`);
                steps.push(`1. Перемножаем числители и знаменатели:\n$$\\frac{${a} \\times ${c}}{${b} \\times ${d}} = \\frac{${num}}{${den}}$$`);
                if (g > 1) {
                    steps.push(`2. Сокращаем дробь на ${g}: $\\frac{${simpNum}}{${simpDen}}$`);
                }
                const decVal = simpNum / simpDen;

                return {
                    result: simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`,
                    latex: `\\frac{${a}}{${b}} \\times \\frac{${c}}{${d}} = ${simpDen === 1 ? simpNum : `\\frac{${simpNum}}{${simpDen}}`}`,
                    steps,
                    summary: `Ответ: ${simpDen === 1 ? simpNum : `${simpNum}/${simpDen}`} (${formatNum(decVal, 4)})`
                };
            } else if (op === '/') {
                if (c === 0) throw new Error("Деление на ноль невозможно!");
                const num = a * d;
                const den = b * c;
                const g = gcd(num, den);
                const simpNum = num / g;
                const simpDen = den / g;

                steps.push(`Деление дробей: $\\frac{${a}}{${b}} \\div \\frac{${c}}{${d}}$`);
                steps.push(`1. Умножаем первую дробь на перевернутую вторую:\n$$\\frac{${a}}{${b}} \\times \\frac{${d}}{${c}} = \\frac{${a} \\times ${d}}{${b} \\times ${c}} = \\frac{${num}}{${den}}$$`);
                if (g > 1) {
                    steps.push(`2. Сокращаем на ${g}: $\\frac{${simpNum}}{${simpDen}}$`);
                }
                const decVal = simpNum / simpDen;

                return {
                    result: simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`,
                    latex: `\\frac{${a}}{${b}} \\div \\frac{${c}}{${d}} = ${simpDen === 1 ? simpNum : `\\frac{${simpNum}}{${simpDen}}`}`,
                    steps,
                    summary: `Ответ: ${simpDen === 1 ? simpNum : `${simpNum}/${simpDen}`} (${formatNum(decVal, 4)})`
                };
            }
        }

        // 3. Простое бинарное действие: A + B, A - B, A * B, A / B
        const simpleMatch = clean.match(/^([+-]?\d+(?:\.\d+)?)\s*([+\-*\/^])\s*([+-]?\d+(?:\.\d+)?)$/);
        if (simpleMatch) {
            const num1 = parseFloat(simpleMatch[1]);
            const op = simpleMatch[2];
            const num2 = parseFloat(simpleMatch[3]);

            if (op === '+') {
                const res = num1 + num2;
                steps.push(`Операция сложения: $${num1} + ${num2}$`);
                steps.push(`Складываем слагаемые: $${num1} + ${num2} = ${formatNum(res)}$`);
                return {
                    result: formatNum(res),
                    latex: `${num1} + ${num2} = ${formatNum(res)}`,
                    steps,
                    summary: `${num1} плюс ${num2} равно ${formatNum(res)}`
                };
            } else if (op === '-') {
                const res = num1 - num2;
                steps.push(`Операция вычитания: $${num1} - ${num2}$`);
                steps.push(`Вычитаем: $${num1} - ${num2} = ${formatNum(res)}$`);
                return {
                    result: formatNum(res),
                    latex: `${num1} - ${num2} = ${formatNum(res)}`,
                    steps,
                    summary: `${num1} минус ${num2} равно ${formatNum(res)}`
                };
            } else if (op === '*') {
                const res = num1 * num2;
                steps.push(`Операция умножения: $${num1} \\times ${num2}$`);
                if (Number.isInteger(num1) && Number.isInteger(num2) && num2 > 10) {
                    const tens = Math.floor(num2 / 10) * 10;
                    const ones = num2 % 10;
                    if (ones !== 0) {
                        steps.push(`Разложение на разряды: $${num1} \\times (${tens} + ${ones}) = (${num1} \\times ${tens}) + (${num1} \\times ${ones}) = ${num1 * tens} + ${num1 * ones} = ${formatNum(res)}$`);
                    }
                }
                steps.push(`Результат умножения: $${num1} \\times ${num2} = ${formatNum(res)}$`);
                return {
                    result: formatNum(res),
                    latex: `${num1} \\times ${num2} = ${formatNum(res)}`,
                    steps,
                    summary: `${num1} умножить на ${num2} равно ${formatNum(res)}`
                };
            } else if (op === '/') {
                if (Math.abs(num2) < 1e-12) throw new Error("Деление на ноль невозможно!");
                const res = num1 / num2;
                steps.push(`Операция деления: $${num1} \\div ${num2}$`);
                if (Number.isInteger(num1) && Number.isInteger(num2)) {
                    const quotient = Math.floor(num1 / num2);
                    const remainder = num1 % num2;
                    if (remainder === 0) {
                        steps.push(`Деление нацело: $${num1} = ${num2} \\times ${quotient}$`);
                    } else {
                        steps.push(`Деление с остатком: $${num1} = ${num2} \\times ${quotient} + ${remainder}$ (остаток $${remainder}$)`);
                    }
                }
                steps.push(`Частное: $${num1} \\div ${num2} = ${formatNum(res, 4)}$`);
                return {
                    result: formatNum(res),
                    latex: `${num1} \\div ${num2} = ${formatNum(res, 4)}`,
                    steps,
                    summary: `${num1} разделить на ${num2} равно ${formatNum(res, 4)}`
                };
            } else if (op === '^') {
                const res = Math.pow(num1, num2);
                steps.push(`Возведение в степень: $${num1}^{${num2}}$`);
                steps.push(`$${num1}^{${num2}} = ${formatNum(res)}$`);
                return {
                    result: formatNum(res),
                    latex: `${num1}^{${num2}} = ${formatNum(res)}`,
                    steps,
                    summary: `${num1} в степени ${num2} равно ${formatNum(res)}`
                };
            }
        }

        // 4. Сложное арифметическое выражение с порядком действий
        try {
            let finalVal;
            if (typeof math !== 'undefined' && math.evaluate) {
                finalVal = math.evaluate(clean);
            } else {
                finalVal = Function(`"use strict"; return (${clean})`)();
            }

            steps.push(`Исходный пример: $${clean.replace(/\*/g, ' \\times ').replace(/\//g, ' \\div ')}$`);
            steps.push(`Определяем математический порядок действий:\n1. Действия в скобках $(\\dots)$\n2. Возведение в степень $(\\wedge)$\n3. Умножение и деление $(\\times, \\div)$ слева направо\n4. Сложение и вычитание $(+, -)$ слева направо`);

            // Имитация пошаговых вычислений
            let current = clean;
            let stepNum = 1;

            // Обработка выражений в скобках
            const parenRegex = /\(([^()]+)\)/;
            let parenMatch;
            while ((parenMatch = current.match(parenRegex)) && stepNum <= 6) {
                const subExpr = parenMatch[1];
                let subVal;
                try {
                    subVal = typeof math !== 'undefined' ? math.evaluate(subExpr) : Function(`return (${subExpr})`)();
                    steps.push(`Действие ${stepNum} (внутри скобок): $${subExpr.replace(/\*/g, ' \\times ').replace(/\//g, ' \\div ')} = ${formatNum(subVal)}$`);
                    current = current.replace(parenMatch[0], formatNum(subVal));
                    stepNum++;
                } catch (e) {
                    break;
                }
            }

            // Обработка умножения и деления
            const mulDivRegex = /(-?\d+(?:\.\d+)?)\s*([\*\/])\s*(-?\d+(?:\.\d+)?)/;
            let mulDivMatch;
            while ((mulDivMatch = current.match(mulDivRegex)) && stepNum <= 10) {
                const n1 = parseFloat(mulDivMatch[1]);
                const op = mulDivMatch[2];
                const n2 = parseFloat(mulDivMatch[3]);
                const opSymbol = op === '*' ? '\\times' : '\\div';
                const subVal = op === '*' ? n1 * n2 : n1 / n2;

                steps.push(`Действие ${stepNum} (${op === '*' ? 'умножение' : 'деление'}): $${n1} ${opSymbol} ${n2} = ${formatNum(subVal)}$`);
                current = current.replace(mulDivMatch[0], formatNum(subVal));
                stepNum++;
            }

            // Обработка сложения и вычитания
            const addSubRegex = /(-?\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)/;
            let addSubMatch;
            while ((addSubMatch = current.match(addSubRegex)) && stepNum <= 14) {
                const n1 = parseFloat(addSubMatch[1]);
                const op = addSubMatch[2];
                const n2 = parseFloat(addSubMatch[3]);
                const subVal = op === '+' ? n1 + n2 : n1 - n2;

                steps.push(`Действие ${stepNum} (${op === '+' ? 'сложение' : 'вычитание'}): $${n1} ${op} ${n2} = ${formatNum(subVal)}$`);
                current = current.replace(addSubMatch[0], formatNum(subVal));
                stepNum++;
            }

            steps.push(`**Итоговый ответ:** $${formatNum(finalVal)}$`);

            return {
                result: formatNum(finalVal),
                latex: `${clean.replace(/\*/g, ' \\times ').replace(/\//g, ' \\div ')} = ${formatNum(finalVal)}`,
                steps,
                summary: `Результат примера: ${formatNum(finalVal)}`
            };
        } catch (err) {
            throw new Error(`Ошибка вычисления выражения: ${err.message}`);
        }
    }

    // -------------------------------------------------------------
    // РАЗДЕЛ SAT MATH (7-11 КЛАССЫ)
    // -------------------------------------------------------------

    // 1. Линейные функции и прямые: наклон, перпендикуляр, уравнение y = mx + b
    function solveSATLine(x1, y1, x2, y2) {
        const steps = [];
        steps.push(`Даны две точки на координатной плоскости: $A(${x1}, ${y1})$ и $B(${x2}, ${y2})$`);

        if (Math.abs(x2 - x1) < 1e-12) {
            steps.push(`Так как $x_1 = x_2 = ${x1}$, прямая вертикальна.`);
            steps.push(`Уравнение прямой: $x = ${x1}$ (наклон не определен / undefined).`);
            return {
                m: "undefined",
                mPerp: 0,
                eq: `x = ${x1}`,
                latex: `x = ${x1}`,
                steps,
                summary: `Вертикальная прямая: x = ${x1}`
            };
        }

        const m = (y2 - y1) / (x2 - x1);
        steps.push(`1. Вычисляем наклон (Slope $m$):\n$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = ${formatNum(m)}$$`);

        const b = y1 - m * x1;
        steps.push(`2. Находим точку пересечения с осью Y ($y$-intercept $b$):\n$$b = y_1 - m \\cdot x_1 = ${y1} - (${formatNum(m)}) \\cdot (${x1}) = ${formatNum(b)}$$`);

        const eq = `y = ${formatNum(m)}x ${b >= 0 ? '+ ' + formatNum(b) : '- ' + formatNum(Math.abs(b))}`;
        steps.push(`3. Уравнение прямой в форме с угловым коэффициентом (Slope-Intercept Form):\n$$${eq}$$`);

        // Параллельные и перпендикулярные прямые (SAT)
        steps.push(`4. Свойства для SAT:`);
        steps.push(`- Параллельная прямая имеет такой же наклон: $m_{||} = ${formatNum(m)}$`);
        if (Math.abs(m) > 1e-12) {
            const mPerp = -1 / m;
            steps.push(`- Перпендикулярная прямая (Negative Reciprocal): $m_{\\perp} = -\\frac{1}{m} = ${formatNum(mPerp)}$`);
        } else {
            steps.push(`- Перпендикулярная прямая вертикальна ($x = c$).`);
        }

        const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        steps.push(`- Длина отрезка $AB$: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2} = ${formatNum(dist)}$`);
        steps.push(`- Середина отрезка (Midpoint): $M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right) = (${formatNum(midX)}, ${formatNum(midY)})$`);

        return {
            m: formatNum(m),
            b: formatNum(b),
            eq,
            latex: eq,
            dist: formatNum(dist),
            midpoint: `(${formatNum(midX)}, ${formatNum(midY)})`,
            steps,
            summary: `Прямая: ${eq}, наклон m = ${formatNum(m)}`
        };
    }

    // 2. Вершина параболы и форма вершины (SAT Vertex Form)
    function solveParabolaVertex(a, b, c) {
        const steps = [];
        steps.push(`Квадратичная функция: $y = ${a}x^2 + (${b})x + (${c})$`);

        if (Math.abs(a) < 1e-12) throw new Error("Коэффициент 'a' не может быть равен 0 для параболы.");

        const h = -b / (2 * a);
        const k = a * h * h + b * h + c;

        steps.push(`1. Находим координату $x$ вершины (ось симметрии параболы):\n$$h = -\\frac{b}{2a} = -\\frac{${b}}{2 \\cdot (${a})} = ${formatNum(h)}$$`);
        steps.push(`Ось симметрии (Axis of Symmetry): $x = ${formatNum(h)}$`);

        steps.push(`2. Находим координату $y$ вершины ($k = f(h)$):\n$$k = (${a}) \\cdot (${formatNum(h)})^2 + (${b}) \\cdot (${formatNum(h)}) + (${c}) = ${formatNum(k)}$$`);
        steps.push(`**Координаты вершины параболы (Vertex):** $(h, k) = (${formatNum(h)}, ${formatNum(k)})$`);

        const vertexForm = `y = ${a !== 1 ? (a === -1 ? '-' : a) : ''}(x ${h >= 0 ? '- ' + formatNum(h) : '+ ' + formatNum(Math.abs(h))})^2 ${k >= 0 ? '+ ' + formatNum(k) : '- ' + formatNum(Math.abs(k))}`;
        steps.push(`3. Форма вершины (Vertex Form, ключевой вопрос SAT):\n$$${vertexForm}$$`);

        if (a > 0) {
            steps.push(`4. Так как $a = ${a} > 0$, ветви параболы направлены **вверх** (Open Upward), функция имеет **минимум** в точке $y = ${formatNum(k)}$.`);
        } else {
            steps.push(`4. Так как $a = ${a} < 0$, ветви параболы направлены **вниз** (Open Downward), функция имеет **максимум** в точке $y = ${formatNum(k)}$.`);
        }

        const D = b * b - 4 * a * c;
        steps.push(`5. Дискриминант $D = b^2 - 4ac = ${D}$:\n- ${D > 0 ? "2 точки пересечения с осью X" : (D === 0 ? "1 точка касания оси X" : "нет пересечений с осью X (действительных корней нет)")}.`);

        return {
            h: formatNum(h),
            k: formatNum(k),
            vertex: `(${formatNum(h)}, ${formatNum(k)})`,
            vertexForm,
            latex: `\\text{Vertex: } (${formatNum(h)}, ${formatNum(k)}), \\quad ${vertexForm}`,
            steps,
            summary: `Вершина параболы: (${formatNum(h)}, ${formatNum(k)})`
        };
    }

    // 3. Уравнение окружности SAT: (x - h)^2 + (y - k)^2 = r^2
    function solveCircleSAT(h, k, r) {
        const steps = [];
        steps.push(`Окружность с центром в $(h, k) = (${h}, ${k})$ и радиусом $r = ${r}$:`);

        const r2 = r * r;
        const eq = `(x ${h >= 0 ? '- ' + h : '+ ' + Math.abs(h)})^2 + (y ${k >= 0 ? '- ' + k : '+ ' + Math.abs(k)})^2 = ${r2}`;
        steps.push(`1. Стандартное уравнение окружности (Circle Equation):\n$$(x - h)^2 + (y - k)^2 = r^2$$\n$$${eq}$$`);

        const area = Math.PI * r2;
        const circum = 2 * Math.PI * r;
        steps.push(`2. Площадь круга (Area): $A = \\pi r^2 = \\pi \\cdot (${r})^2 = ${r2}\\pi \\approx ${formatNum(area)}$`);
        steps.push(`3. Длина окружности (Circumference): $C = 2\\pi r = 2\\pi \\cdot ${r} = ${2 * r}\\pi \\approx ${formatNum(circum)}$`);
        steps.push(`4. Для угла секторов $\\theta$ (SAT Formulas):\n- Длина дуги (Arc length): $s = \\frac{\\theta}{360^\\circ} \\cdot 2\\pi r = r\\theta_{\\text{rad}}$\n- Площадь сектора (Sector Area): $A_{\\text{sector}} = \\frac{\\theta}{360^\\circ} \\cdot \\pi r^2$`);

        return {
            center: `(${h}, ${k})`,
            r,
            r2,
            eq,
            latex: eq,
            area: `${r2}\\pi`,
            circumference: `${2 * r}\\pi`,
            steps,
            summary: `Уравнение окружности: ${eq}`
        };
    }

    // 4. Специальные прямоугольные треугольники SAT (30-60-90 и 45-45-90)
    function solveSpecialTriangle(type, givenSide, val) {
        const steps = [];

        if (type === '30-60-90') {
            steps.push(`Специальный треугольник $30^\\circ - 60^\\circ - 90^\\circ$:`);
            steps.push(`Соотношение сторон в SAT: $x : x\\sqrt{3} : 2x$\n- Катет против $30^\\circ$: $x$\n- Катет против $60^\\circ$: $x\\sqrt{3}$\n- Гипотенуза против $90^\\circ$: $2x$`);

            let x, xSqrt3, h;
            if (givenSide === 'short' || givenSide === '30') {
                x = val;
                xSqrt3 = `${formatNum(x)}\\sqrt{3}`;
                h = 2 * x;
                steps.push(`Дан меньший катет (против $30^\\circ$): $x = ${val}$`);
            } else if (givenSide === 'hypotenuse' || givenSide === '90') {
                h = val;
                x = val / 2;
                xSqrt3 = `${formatNum(x)}\\sqrt{3}`;
                steps.push(`Дана гипотенуза: $2x = ${val} \\implies x = \\frac{${val}}{2} = ${formatNum(x)}$`);
            } else {
                // given long leg (60)
                const num = val;
                x = num / Math.sqrt(3);
                xSqrt3 = `${val}`;
                h = 2 * x;
                steps.push(`Дан больший катет (против $60^\\circ$): $x\\sqrt{3} = ${val} \\implies x = \\frac{${val}}{\\sqrt{3}} = \\frac{${val}\\sqrt{3}}{3}$`);
            }

            steps.push(`**Результаты вычисления сторон:**`);
            steps.push(`- Катет против $30^\\circ$: $x = ${formatNum(x)}$`);
            steps.push(`- Катет против $60^\\circ$: $x\\sqrt{3} = ${xSqrt3} \\approx ${formatNum(x * Math.sqrt(3))}$`);
            steps.push(`- Гипотенуза: $2x = ${formatNum(h)}$`);

            return {
                shortLeg: formatNum(x),
                longLeg: xSqrt3,
                hypotenuse: formatNum(h),
                latex: `30^\\circ \\to ${formatNum(x)}, \\quad 60^\\circ \\to ${xSqrt3}, \\quad 90^\\circ \\to ${formatNum(h)}`,
                steps,
                summary: `Треугольник 30-60-90: стороны ${formatNum(x)}, ${xSqrt3}, ${formatNum(h)}`
            };
        } else {
            // 45-45-90
            steps.push(`Специальный треугольник $45^\\circ - 45^\\circ - 90^\\circ$ (Равнобедренный прямоугольный):`);
            steps.push(`Соотношение сторон в SAT: $x : x : x\\sqrt{2}$\n- Катеты: $x$\n- Гипотенуза: $x\\sqrt{2}$`);

            let x, h;
            if (givenSide === 'leg' || givenSide === '45') {
                x = val;
                h = `${formatNum(x)}\\sqrt{2}`;
                steps.push(`Дан катет: $x = ${val}$`);
            } else {
                h = val;
                x = val / Math.sqrt(2);
                steps.push(`Дана гипотенуза: $x\\sqrt{2} = ${val} \\implies x = \\frac{${val}}{\\sqrt{2}} = \\frac{${val}\\sqrt{2}}{2}$`);
            }

            steps.push(`**Результаты вычисления:**`);
            steps.push(`- Катеты: $x = ${formatNum(x)}$`);
            steps.push(`- Гипотенуза: $x\\sqrt{2} = ${formatNum(x * Math.sqrt(2))}$`);

            return {
                leg: formatNum(x),
                hypotenuse: `${formatNum(x)}\\sqrt{2}`,
                latex: `x = ${formatNum(x)}, \\quad \\text{гипотенуза} = ${formatNum(x)}\\sqrt{2}`,
                steps,
                summary: `Треугольник 45-45-90: катеты ${formatNum(x)}, гипотенуза ${formatNum(x * Math.sqrt(2))}`
            };
        }
    }

    // 5. Сложные проценты SAT (Compound Interest)
    function solveCompoundInterest(P, rPercent, n, t) {
        const steps = [];
        steps.push(`Формула сложных процентов (SAT Compound Interest Formula):\n$$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$`);

        const r = rPercent / 100;
        steps.push(`Исходные данные:\n- Начальная сумма (Principal $P$): $${P}$\n- Годовая процентная ставка (Rate $r$): $${rPercent}\\% = ${r}$\n- Начислений в год ($n$): $${n}$ (${n === 1 ? 'ежегодно' : (n === 4 ? 'ежеквартально' : (n === 12 ? 'ежемесячно' : `${n} раз в год`))})\n- Время в годах (Time $t$): $${t}$ лет`);

        const base = 1 + r / n;
        const exponent = n * t;
        const A = P * Math.pow(base, exponent);
        const interest = A - P;

        steps.push(`1. Внутренняя скобка: $1 + \\frac{${r}}{${n}} = 1 + ${formatNum(r / n, 6)} = ${formatNum(base, 6)}$`);
        steps.push(`2. Показатель степени: $n \\times t = ${n} \\times ${t} = ${exponent}$`);
        steps.push(`3. Возведение в степень: $(${formatNum(base, 6)})^{${exponent}} = ${formatNum(Math.pow(base, exponent), 6)}$`);
        steps.push(`4. Итоговая сумма:\n$$A = ${P} \\times ${formatNum(Math.pow(base, exponent), 6)} = ${formatNum(A, 2)}$$`);
        steps.push(`5. Чистая прибыль (Interest Earned): $A - P = ${formatNum(A, 2)} - ${P} = ${formatNum(interest, 2)}$`);

        return {
            A: formatNum(A, 2),
            interest: formatNum(interest, 2),
            latex: `A = ${P}\\left(1 + \\frac{${r}}{${n}}\\right)^{${exponent}} = ${formatNum(A, 2)}`,
            steps,
            summary: `Итоговая сумма: ${formatNum(A, 2)}, начисленные проценты: ${formatNum(interest, 2)}`
        };
    }

    // 6. Комплексные числа SAT: i = sqrt(-1), i^2 = -1, операции
    function solveComplexSAT(a1, b1, op, a2, b2) {
        const steps = [];
        steps.push(`Комплексные числа (SAT Complex Numbers): $z_1 = ${a1} + (${b1})i$, $z_2 = ${a2} + (${b2})i$`);
        steps.push(`Фундаментальное правило: $i = \\sqrt{-1}, \\quad i^2 = -1, \\quad i^3 = -i, \\quad i^4 = 1$`);

        if (op === '+') {
            const re = a1 + a2;
            const im = b1 + b2;
            steps.push(`Сложение: группируем действительные и мнимые части:\n$$(${a1} + ${a2}) + (${b1} + ${b2})i = ${formatNum(re)} ${im >= 0 ? '+ ' + formatNum(im) : '- ' + formatNum(Math.abs(im))}i$$`);
            return {
                result: `${formatNum(re)} + ${formatNum(im)}i`,
                latex: `z_1 + z_2 = ${formatNum(re)} ${im >= 0 ? '+ ' + formatNum(im) : '- ' + formatNum(Math.abs(im))}i`,
                steps,
                summary: `Результат: ${formatNum(re)} + ${formatNum(im)}i`
            };
        } else if (op === '-') {
            const re = a1 - a2;
            const im = b1 - b2;
            steps.push(`Вычитание: $(${a1} - ${a2}) + (${b1} - ${b2})i = ${formatNum(re)} ${im >= 0 ? '+ ' + formatNum(im) : '- ' + formatNum(Math.abs(im))}i$$`);
            return {
                result: `${formatNum(re)} + ${formatNum(im)}i`,
                latex: `z_1 - z_2 = ${formatNum(re)} ${im >= 0 ? '+ ' + formatNum(im) : '- ' + formatNum(Math.abs(im))}i`,
                steps,
                summary: `Результат: ${formatNum(re)} + ${formatNum(im)}i`
            };
        } else if (op === '*') {
            // (a1 + b1*i)(a2 + b2*i) = a1*a2 + a1*b2*i + b1*a2*i + b1*b2*i^2
            const re = a1 * a2 - b1 * b2;
            const im = a1 * b2 + b1 * a2;
            steps.push(`1. Раскрываем скобки методом FOIL:\n$$(${a1})(${a2}) + (${a1})(${b2}i) + (${b1}i)(${a2}) + (${b1})(${b2})i^2$$`);
            steps.push(`2. Заменяем $i^2 = -1$:\n$$${a1 * a2} + ${a1 * b2}i + ${b1 * a2}i + (${b1 * b2})(-1)$$`);
            steps.push(`3. Приводим подобные слагаемые:\n$$(${a1 * a2} - ${b1 * b2}) + (${a1 * b2 + b1 * a2})i = ${formatNum(re)} ${im >= 0 ? '+ ' + formatNum(im) : '- ' + formatNum(Math.abs(im))}i$$`);
            return {
                result: `${formatNum(re)} + ${formatNum(im)}i`,
                latex: `z_1 \\times z_2 = ${formatNum(re)} ${im >= 0 ? '+ ' + formatNum(im) : '- ' + formatNum(Math.abs(im))}i`,
                steps,
                summary: `Результат умножения: ${formatNum(re)} + ${formatNum(im)}i`
            };
        } else if (op === '/') {
            // Умножение на сопряженное
            const denom = a2 * a2 + b2 * b2;
            if (denom === 0) throw new Error("Деление на ноль!");
            const re = (a1 * a2 + b1 * b2) / denom;
            const im = (b1 * a2 - a1 * b2) / denom;

            steps.push(`1. Умножаем числитель и знаменатель на сопряженное число знаменателя (Conjugate): $(${a2} - (${b2})i$)`);
            steps.push(`2. Знаменатель: $(${a2})^2 + (${b2})^2 = ${denom}$`);
            steps.push(`3. Результат деления:\n$$\\frac{${formatNum(a1 * a2 + b1 * b2)}}{${denom}} + \\frac{${formatNum(b1 * a2 - a1 * b2)}}{${denom}}i = ${formatNum(re)} ${im >= 0 ? '+ ' + formatNum(im) : '- ' + formatNum(Math.abs(im))}i$$`);

            return {
                result: `${formatNum(re)} + ${formatNum(im)}i`,
                latex: `\\frac{z_1}{z_2} = ${formatNum(re)} ${im >= 0 ? '+ ' + formatNum(im) : '- ' + formatNum(Math.abs(im))}i`,
                steps,
                summary: `Результат деления: ${formatNum(re)} + ${formatNum(im)}i`
            };
        }
    }

    return {
        formatNum,
        gcd,
        lcm,
        factorial,
        combinations,
        permutations,
        isPrime,
        primeFactors,
        solveQuadratic,
        solveSystem2x2,
        matrixDeterminant,
        matrixTranspose,
        matrixMultiply,
        matrixInverse,
        matrixToLatex,
        calculateStatistics,
        numericalDerivative,
        numericalIntegral,
        findRoots,
        differentiateSymbolic,
        solveArithmeticWithSteps,
        solveSATLine,
        solveParabolaVertex,
        solveCircleSAT,
        solveSpecialTriangle,
        solveCompoundInterest,
        solveComplexSAT
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AltronMath;
}
