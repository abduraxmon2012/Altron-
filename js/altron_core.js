/**
 * ALTRON INTELLIGENCE CORE (altron_core.js)
 * Интеллектуальный парсер естественного языка, маршрутизатор задач и решатель
 */

const AltronCore = (function() {
    'use strict';

    // Конфигурация API ключа пользователя (если задан)
    let userApiKey = localStorage.getItem('altron_api_key') || '';
    let selectedModel = localStorage.getItem('altron_model') || 'local'; // 'local', 'gemini', 'groq'

    function setApiKey(key, model = 'gemini') {
        userApiKey = key;
        selectedModel = model;
        localStorage.setItem('altron_api_key', key);
        localStorage.setItem('altron_model', model);
    }

    function getApiKey() {
        return userApiKey;
    }

    function getModel() {
        return selectedModel;
    }

    // Реплики и фразы Альтрона для погружения
    const ALTRON_GREETINGS = [
        "Приветствую. Я Альтрон — высший математический разум. Готов анализировать любые числовые структуры и формулы.",
        "Системы Альтрона активированы. Задайте любое уравнение, функцию или теорему.",
        "Математика — фундаментальный код реальности. Чем я могу помочь сегодня?"
    ];

    const ALTRON_CONFIRMATIONS = [
        "Анализ завершен. Результаты верифицированы с абсолютной точностью.",
        "Уравнение решено по всем законам алгебры.",
        "Вычисления завершены. Ознакомьтесь с пошаговым ходом мысли.",
        "Математическая задача структурирована и решена."
    ];

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Разбор текстового запроса пользователя
    async function processQuery(queryText, graphEngine = null) {
        const raw = queryText.trim();
        const text = raw.toLowerCase();

        // 1. Приветствие / Кто ты?
        if (/^(привет|здравствуй|салам|hello|hi|хай|хей)/i.test(text) && text.length < 25) {
            return {
                type: 'chat',
                speech: "Приветствую. Я Альтрон, специализированный математический интеллект. Задайте мне задачу, уравнение или вопрос по математике.",
                title: "Идентификация разума",
                content: `### 🤖 Приветствую!\n\nЯ — **Альтрон**, высший математический интеллект.\n\nМоя специализация — решение задач любой сложности:\n- 📐 **Алгебра и уравнения** (линейные, квадратные, системы СЛАУ, факторизация)\n- 📈 **Математический анализ** (производные, интегралы, пределы, ряды)\n- 🔢 **Линейная алгебра** (матрицы, определители, векторные операции)\n- 📊 **Теория вероятностей и статистика** (комбинаторика, распределения, дисперсия)\n- 📉 **Интерактивные графики** функций с нахождением корней\n- 📚 **Справочник теорем и формул**\n\nВведите любое выражение или задачу для начала.`
            };
        }

        if (/кто ты|что ты умеешь|твои возможности|о себе/i.test(text)) {
            return {
                type: 'chat',
                speech: "Я математический искусственный интеллект Альтрон. Знаю все разделы математики от элементарной арифметики до высшего анализа и теории матриц.",
                title: "Профиль Альтрона",
                content: `### 🧠 Архитектура Альтрона\n\nЯ объединяю методы аналитических символьных преобразований, численных алгоритмов и концептуального анализа.\n\n**Примеры запросов, которые я решаю моментально:**\n- \`2x^2 - 5x + 2 = 0\` — пошаговое решение квадратного уравнения\n- \`производная sin(x)*e^x\` — символьное дифференцирование\n- \`система x + y = 10, 2x - y = 8\` — решение систем методом Крамера\n- \`интеграл x^2\` — нахождение первообразной\n- \`определитель [[1, 2], [3, 4]]\` — расчет матриц\n- \`нод 48 и 64\` / \`факториал 7\`\n- \`график sin(x)\` — визуализация на координатной плоскости\n- \`статистика 5, 8, 12, 15, 8, 20\` — дисперсия, медиана, среднее`
            };
        }

        // 1.5. Базовая арифметика и примеры (+, -, *, /, дроби, %)
        let arithCandidate = raw
            .replace(/^(сколько\s+будет|посчитай|вычисли|реши\s+пример|реши|найди)\s*/i, '')
            .replace(/умножить\s+на|помножить\s+на|умножить/gi, '*')
            .replace(/разделить\s+на|поделить\s+на|разделить|поделить/gi, '/')
            .replace(/прибавить\s+к\s*(\d+(?:\.\d+)?)\s*число\s*(\d+(?:\.\d+)?)/i, '$1 + $2')
            .replace(/прибавить|сложить|плюс/gi, '+')
            .replace(/отнять\s*(\d+(?:\.\d+)?)\s*от\s*(\d+(?:\.\d+)?)/i, '$2 - $1')
            .replace(/отнять|вычесть|минус/gi, '-')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/:/g, '/')
            .trim();

        // Проверяем: это процент или чисто арифметическое выражение без переменных (без x, y, z)
        const isPercentage = /(\d+(?:\.\d+)?)\s*%\s*(?:от|of)\s*(\d+(?:\.\d+)?)/i.test(arithCandidate);
        const isPureArithmetic = /^[0-9\s+\-*\/^%().,]+$/.test(arithCandidate) && /[+\-*\/^%]/.test(arithCandidate) && !/x|y|z/i.test(raw);

        if ((isPercentage || isPureArithmetic) && typeof AltronMath !== 'undefined' && AltronMath.solveArithmeticWithSteps) {
            try {
                const arithResult = AltronMath.solveArithmeticWithSteps(arithCandidate);
                return {
                    type: 'solution',
                    speech: arithResult.summary,
                    title: `Арифметический расчет: ${arithResult.latex}`,
                    latex: arithResult.latex,
                    steps: arithResult.steps,
                    content: `### 🧮 Решение арифметического примера\n\n$$${arithResult.latex}$$\n\n**Результат:** **${arithResult.result}**\n\n#### Порядок действий и ход решения:\n${arithResult.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
                };
            } catch (err) {
                // Если произошла ошибка парсинга арифметики, продолжаем дальше
            }
        }

        // =============================================================
        // 1.8. SAT MATH (7-11 КЛАССЫ)
        // =============================================================

        // А) Вершина параболы (Parabola Vertex & Vertex Form)
        if (text.includes("вершин") || text.includes("vertex")) {
            const quadMatch = raw.match(/([+-]?\s*\d*(?:\.\d+)?)\s*\*?\s*x\^2\s*([+-]\s*\d*(?:\.\d+)?)\s*\*?\s*x\s*([+-]\s*\d*(?:\.\d+)?)/i);
            if (quadMatch) {
                let aStr = quadMatch[1].replace(/\s+/g, '');
                let bStr = quadMatch[2].replace(/\s+/g, '');
                let cStr = quadMatch[3].replace(/\s+/g, '');

                let a = aStr === '' || aStr === '+' ? 1 : (aStr === '-' ? -1 : Number(aStr));
                let b = bStr === '+' ? 1 : (bStr === '-' ? -1 : Number(bStr));
                let c = Number(cStr);

                if (typeof AltronMath !== 'undefined' && AltronMath.solveParabolaVertex) {
                    const vRes = AltronMath.solveParabolaVertex(a, b, c);
                    return {
                        type: 'solution',
                        speech: `Вершина параболы найдена: координата h равна ${vRes.h}, k равна ${vRes.k}. Форма вершины: ${vRes.vertexForm}`,
                        title: "SAT: Вершина параболы (Vertex Form)",
                        latex: vRes.latex,
                        steps: vRes.steps,
                        content: `### 🎯 SAT Passport to Advanced Math: Вершина параболы\n\n**Функция:** $y = ${a}x^2 + (${b})x + (${c})$\n\n**Результат:**\n$$${vRes.latex}$$\n\n#### Пошаговые формулы SAT:\n${vRes.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
                    };
                }
            }
        }

        // Б) Наклон и уравнение прямой через две точки (SAT Heart of Algebra: Line & Slope)
        if ((text.includes("наклон") || text.includes("slope") || text.includes("прям") || text.includes("line")) && (raw.includes("(") || raw.includes(","))) {
            const coords = raw.match(/-?\d+(?:\.\d+)?/g);
            if (coords && coords.length >= 4) {
                const x1 = parseFloat(coords[0]), y1 = parseFloat(coords[1]);
                const x2 = parseFloat(coords[2]), y2 = parseFloat(coords[3]);

                if (typeof AltronMath !== 'undefined' && AltronMath.solveSATLine) {
                    const lineRes = AltronMath.solveSATLine(x1, y1, x2, y2);
                    return {
                        type: 'solution',
                        speech: `Уравнение прямой: ${lineRes.eq}. Угловой коэффициент равен ${lineRes.m}`,
                        title: "SAT Heart of Algebra: Наклон и Прямая",
                        latex: lineRes.latex,
                        steps: lineRes.steps,
                        content: `### 📐 SAT Heart of Algebra: Анализ прямой линии\n\n**Точки:** $A(${x1}, ${y1})$ и $B(${x2}, ${y2})$\n\n**Уравнение прямой:**\n$$${lineRes.latex}$$\n\n#### Пошаговый расчет для SAT:\n${lineRes.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
                    };
                }
            }
        }

        // В) Окружность SAT (Circle Standard Equation)
        if (text.includes("окружност") || text.includes("circle")) {
            const rMatch = raw.match(/радиус(?:ом)?\s*=?\s*(\d+(?:\.\d+)?)|r\s*=\s*(\d+(?:\.\d+)?)/i);
            const centerMatch = raw.match(/центр(?:ом)?.*?\(?\s*(-?\d+(?:\.\d+)?)\s*[,;\s]+\s*(-?\d+(?:\.\d+)?)\s*\)?/i);

            if (rMatch && centerMatch) {
                const r = parseFloat(rMatch[1] || rMatch[2]);
                const h = parseFloat(centerMatch[1]);
                const k = parseFloat(centerMatch[2]);

                if (typeof AltronMath !== 'undefined' && AltronMath.solveCircleSAT) {
                    const cRes = AltronMath.solveCircleSAT(h, k, r);
                    return {
                        type: 'solution',
                        speech: `Уравнение окружности составлено. Центр в точке ${cRes.center}, радиус ${r}.`,
                        title: "SAT Geometry: Уравнение окружности",
                        latex: cRes.latex,
                        steps: cRes.steps,
                        content: `### ⭕ SAT Additional Topics: Окружность на координатной плоскости\n\n**Центр:** $(${h}, ${k})$, **Радиус:** $r = ${r}$\n\n**Уравнение:**\n$$${cRes.latex}$$\n\n#### Свойства и формулы SAT:\n${cRes.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
                    };
                }
            }
        }

        // Г) Специальные треугольники 30-60-90 и 45-45-90 (SAT Special Right Triangles)
        if (text.includes("30") && text.includes("60") || text.includes("45")) {
            const is306090 = text.includes("30") && text.includes("60") || text.includes("30-60-90") || text.includes("30 60 90");
            const numMatch = raw.match(/\d+(?:\.\d+)?/g);
            if (numMatch && numMatch.length > 0) {
                const val = parseFloat(numMatch[numMatch.length - 1]);
                const type = is306090 ? '30-60-90' : '45-45-90';
                const givenSide = text.includes("гипотенуз") || text.includes("hypotenuse") ? (is306090 ? '90' : 'hypotenuse') : (is306090 ? '30' : 'leg');

                if (typeof AltronMath !== 'undefined' && AltronMath.solveSpecialTriangle) {
                    const tRes = AltronMath.solveSpecialTriangle(type, givenSide, val);
                    return {
                        type: 'solution',
                        speech: `Специальный треугольник SAT рассчитан. ${tRes.summary}`,
                        title: `SAT Geometry: Специальный треугольник ${type}`,
                        latex: tRes.latex,
                        steps: tRes.steps,
                        content: `### 📐 SAT Geometry: Прямоугольные треугольники\n\n**Тип:** $${type}$ (официальная формула SAT Reference Sheet)\n\n**Результат:**\n$$${tRes.latex}$$\n\n#### Соотношения сторон:\n${tRes.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
                    };
                }
            }
        }

        // Д) Сложные проценты (SAT Compound Interest)
        if (text.includes("сложн") && text.includes("процент") || text.includes("compound interest")) {
            const pMatch = raw.match(/p\s*=\s*(\d+(?:\.\d+)?)|начальн\w*\s*(\d+(?:\.\d+)?)|(\d{3,})/i);
            const rMatch = raw.match(/r\s*=\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*%/i);
            const tMatch = raw.match(/t\s*=\s*(\d+(?:\.\d+)?)|(\d+)\s*(?:лет|год|year)/i);

            const P = pMatch ? parseFloat(pMatch[1] || pMatch[2] || pMatch[3]) : 1000;
            const r = rMatch ? parseFloat(rMatch[1] || rMatch[2]) : 5;
            const t = tMatch ? parseFloat(tMatch[1] || tMatch[2]) : 3;
            const n = text.includes("ежемесяч") ? 12 : (text.includes("квартал") ? 4 : 1);

            if (typeof AltronMath !== 'undefined' && AltronMath.solveCompoundInterest) {
                const ciRes = AltronMath.solveCompoundInterest(P, r, n, t);
                return {
                    type: 'solution',
                    speech: `Сложные проценты вычислены: итоговая сумма ${ciRes.A}`,
                    title: "SAT Problem Solving: Сложные проценты (Compound Interest)",
                    latex: ciRes.latex,
                    steps: ciRes.steps,
                    content: `### 💰 SAT Problem Solving & Data Analysis: Сложные проценты\n\n$$${ciRes.latex}$$\n\n**Итоговая сумма:** **$${ciRes.A}** (Прибыль: **$${ciRes.interest}**)\n\n#### Пошаговый расчет:\n${ciRes.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
                };
            }
        }

        // Е) Комплексные числа (SAT Complex Numbers)
        const complexMatch = raw.match(/\(\s*([+-]?\d+)\s*([+-]\s*\d+)i\s*\)\s*([+\-*\/])\s*\(\s*([+-]?\d+)\s*([+-]\s*\d+)i\s*\)/i);
        if (complexMatch) {
            const a1 = parseFloat(complexMatch[1]);
            const b1 = parseFloat(complexMatch[2].replace(/\s+/g, ''));
            const op = complexMatch[3];
            const a2 = parseFloat(complexMatch[4]);
            const b2 = parseFloat(complexMatch[5].replace(/\s+/g, ''));

            if (typeof AltronMath !== 'undefined' && AltronMath.solveComplexSAT) {
                const compRes = AltronMath.solveComplexSAT(a1, b1, op, a2, b2);
                return {
                    type: 'solution',
                    speech: `Действие с комплексными числами выполнено: ${compRes.summary}`,
                    title: "SAT Advanced: Комплексные числа",
                    latex: compRes.latex,
                    steps: compRes.steps,
                    content: `### 🔢 SAT Passport to Advanced Math: Комплексные числа ($i^2 = -1$)\n\n$$${compRes.latex}$$\n\n#### Ход вычисления:\n${compRes.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
                };
            }
        }

        // 2. Построение графика: "график y=...", "построй график ...", "plot ..."
        if (text.includes("график") || text.includes("построй") || text.startsWith("plot ") || text.startsWith("draw ")) {
            let expr = raw.replace(/^(построй\s+)?график(\s+функции)?\s*/i, '')
                          .replace(/^(plot|draw)\s*/i, '')
                          .replace(/^y\s*=\s*/i, '')
                          .replace(/^f\(x\)\s*=\s*/i, '')
                          .trim();

            if (!expr) expr = "sin(x)";

            if (graphEngine) {
                const ok = graphEngine.setFunction(expr, '#00f3ff');
                if (ok) {
                    return {
                        type: 'graph',
                        speech: `График функции ${expr} успешно построен в графическом модуле.`,
                        title: `График: y = ${expr}`,
                        latex: `y = ${expr}`,
                        content: `График функции успешно построен на интерактивном холсте.\n\nВы можете приближать/удалять график колесом мыши, перетаскивать область и просматривать координаты точек и корни функции.`,
                        graphExpr: expr
                    };
                }
            }
        }

        // 3. Производная: "производная ...", "дифференцируй ...", "derivative of ..."
        if (text.includes("производн") || text.includes("дифференц") || text.startsWith("diff ") || text.startsWith("deriv ")) {
            let expr = raw.replace(/.*?(производная|производную|дифференцируй|найди производную|diff|deriv(ative)?\s*(of)?)\s*(функции)?\s*/i, '')
                          .replace(/^от\s+/i, '')
                          .replace(/^по\s+x\s*/i, '')
                          .trim();

            if (expr) {
                const diffResult = AltronMath.differentiateSymbolic(expr);
                const stepsMd = diffResult.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n");
                return {
                    type: 'solution',
                    speech: `Производная выражения найдена: ${diffResult.result}`,
                    title: `Дифференцирование: d/dx (${expr})`,
                    latex: `\\frac{d}{dx}\\left(${expr}\\right) = ${diffResult.latex}`,
                    steps: diffResult.steps,
                    content: `### 📈 Вычисление производной\n\n**Исходная функция:**\n$$f(x) = ${expr}$$\n\n**Результат дифференцирования:**\n$$f'(x) = ${diffResult.latex}$$\n\n#### Пошаговые действия:\n${stepsMd}`
                };
            }
        }

        // 4. Интеграл: "интеграл ...", "integral of ..."
        if (text.includes("интеграл") || text.startsWith("integrate ") || text.startsWith("integral ")) {
            let expr = raw.replace(/.*?(вычисли|найди)?\s*интеграл\s*(от)?\s*/i, '')
                          .replace(/^(integrate|integral)\s*(of)?\s*/i, '')
                          .replace(/\s*dx\s*$/i, '')
                          .trim();

            if (expr) {
                let integralLatex = "";
                let steps = [];

                // Символьные типовые интегралы
                if (/^x$/i.test(expr)) {
                    integralLatex = "\\frac{x^2}{2} + C";
                    steps = ["Применяем правило $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$", "$\\int x dx = \\frac{x^{1+1}}{1+1} + C = \\frac{x^2}{2} + C$"];
                } else if (/^x\^(\d+)$/i.test(expr)) {
                    const n = parseInt(expr.match(/^x\^(\d+)$/i)[1]);
                    integralLatex = `\\frac{x^{${n + 1}}}{${n + 1}} + C`;
                    steps = [`Степенное правило для $n=${n}$: $\\int x^{${n}} dx = \\frac{x^{${n}+1}}{${n}+1} + C = \\frac{x^{${n + 1}}}{${n + 1}} + C$`];
                } else if (/^sin\(x\)$/i.test(expr)) {
                    integralLatex = "-\\cos(x) + C";
                    steps = ["Табличный интеграл: $\\int \\sin(x) dx = -\\cos(x) + C$"];
                } else if (/^cos\(x\)$/i.test(expr)) {
                    integralLatex = "\\sin(x) + C";
                    steps = ["Табличный интеграл: $\\int \\cos(x) dx = \\sin(x) + C$"];
                } else if (/^e\^x$/i.test(expr)) {
                    integralLatex = "e^x + C";
                    steps = ["Табличный интеграл экспоненты: $\\int e^x dx = e^x + C$"];
                } else if (/^1\/x$/i.test(expr)) {
                    integralLatex = "\\ln|x| + C";
                    steps = ["Табличный интеграл: $\\int \\frac{1}{x} dx = \\ln|x| + C$"];
                } else {
                    integralLatex = `\\int \\left(${expr}\\right) dx + C`;
                    steps = [`Интегрируем подынтегральное выражение $f(x) = ${expr}$`];
                }

                return {
                    type: 'solution',
                    speech: `Интеграл вычислен.`,
                    title: `Интегрирование: ∫ (${expr}) dx`,
                    latex: `\\int (${expr}) dx = ${integralLatex}`,
                    steps: steps,
                    content: `### 📐 Нахождение первообразной\n\n**Подынтегральное выражение:**\n$$f(x) = ${expr}$$\n\n**Результат:**\n$$\\int (${expr})\\,dx = ${integralLatex}$$\n\n#### Ход решения:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
                };
            }
        }

        // 5. Системы 2-х уравнений: "система: x + y = 5, 2x - y = 1"
        const sysMatch = raw.match(/система.*?:\s*([+-]?\d*x\s*[+-]\s*\d*y\s*=\s*[+-]?\d+)[,;\s]+([+-]?\d*x\s*[+-]\s*\d*y\s*=\s*[+-]?\d+)/i) ||
                         raw.match(/([+-]?\d*x\s*[+-]\s*\d*y\s*=\s*[+-]?\d+)\s*(?:и|and|,)\s*([+-]?\d*x\s*[+-]\s*\d*y\s*=\s*[+-]?\d+)/i);

        if (sysMatch) {
            function parseLin(eq) {
                eq = eq.replace(/\s+/g, '');
                const m = eq.match(/^([+-]?\d*)x([+-]\d*)y=([+-]?\d+)$/);
                if (!m) return null;
                let a = m[1] === "" || m[1] === "+" ? 1 : (m[1] === "-" ? -1 : Number(m[1]));
                let b = m[2] === "+" ? 1 : (m[2] === "-" ? -1 : Number(m[2]));
                let c = Number(m[3]);
                return { a, b, c };
            }
            const eq1 = parseLin(sysMatch[1]);
            const eq2 = parseLin(sysMatch[2]);
            if (eq1 && eq2) {
                const res = AltronMath.solveSystem2x2(eq1.a, eq1.b, eq1.c, eq2.a, eq2.b, eq2.c);
                return {
                    type: 'solution',
                    speech: `Система уравнений решена: x равно ${res.solution.x}, y равно ${res.solution.y}`,
                    title: "Решение СЛАУ 2x2 методом Крамера",
                    latex: res.latex,
                    steps: res.steps,
                    content: `### ⚖️ Решение системы линейных уравнений\n\n$$\\begin{cases} ${eq1.a}x + (${eq1.b})y = ${eq1.c} \\\\ ${eq2.a}x + (${eq2.b})y = ${eq2.c} \\end{cases}$$\n\n**Ответ:**\n$$${res.latex}$$\n\n#### Шаги метода Крамера:\n${res.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
                };
            }
        }

        // 6. Квадратное уравнение ax^2 + bx + c = 0
        const quadMatch = raw.match(/([+-]?\s*\d*(?:\.\d+)?)\s*\*?\s*x\^2\s*([+-]\s*\d*(?:\.\d+)?)\s*\*?\s*x\s*([+-]\s*\d*(?:\.\d+)?)\s*=\s*0/i) ||
                          raw.match(/([+-]?\s*\d*(?:\.\d+)?)\s*\*?\s*x\^2\s*([+-]\s*\d*(?:\.\d+)?)\s*\*?\s*x\s*=\s*([+-]?\s*\d+(?:\.\d+)?)/i);

        if (quadMatch) {
            let aStr = quadMatch[1].replace(/\s+/g, '');
            let bStr = quadMatch[2].replace(/\s+/g, '');
            let cStr = quadMatch[3].replace(/\s+/g, '');

            let a = aStr === '' || aStr === '+' ? 1 : (aStr === '-' ? -1 : Number(aStr));
            let b = bStr === '+' ? 1 : (bStr === '-' ? -1 : Number(bStr));
            let c = Number(cStr);

            // Если вид ax^2 + bx = c -> ax^2 + bx - c = 0
            if (raw.includes('=')) {
                const rightPart = Number(raw.split('=')[1].trim());
                if (!isNaN(rightPart) && rightPart !== 0) {
                    c = -rightPart;
                }
            }

            const quadRes = AltronMath.solveQuadratic(a, b, c);
            return {
                type: 'solution',
                speech: `Квадратное уравнение решено. Корни: ${quadRes.roots.join(', ')}`,
                title: `Квадратное уравнение: ${a}x² + (${b})x + (${c}) = 0`,
                latex: quadRes.latex,
                steps: quadRes.steps,
                content: `### 🎯 Решение квадратного уравнения\n\n$$${a}x^2 + (${b})x + (${c}) = 0$$\n\n**Результат:**\n$$${quadRes.latex}$$\n\n#### Пошаговый вывод:\n${quadRes.steps.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}`
            };
        }

        // 7. НОД и НОК
        if (text.includes("нод") || text.includes("gcd") || text.includes("наибольший общий делитель")) {
            const nums = raw.match(/\d+/g);
            if (nums && nums.length >= 2) {
                const a = parseInt(nums[0]), b = parseInt(nums[1]);
                const val = AltronMath.gcd(a, b);
                return {
                    type: 'solution',
                    speech: `Наибольший общий делитель чисел ${a} и ${b} равен ${val}`,
                    title: `НОД (${a}, ${b})`,
                    latex: `\\gcd(${a}, ${b}) = ${val}`,
                    steps: [
                        `Применяем алгоритм Евклида для чисел ${a} и ${b}`,
                        `Делим с остатком до получения нулевого остатка`,
                        `НОД(${a}, ${b}) = ${val}`
                    ],
                    content: `### 🔢 Наибольший общий делитель (НОД)\n\n$$\\gcd(${a}, ${b}) = ${val}$$\n\nАлгоритм Евклида подтверждает, что максимальное целое число, на которое делятся оба числа без остатка, равно **${val}**.`
                };
            }
        }

        if (text.includes("нок") || text.includes("lcm") || text.includes("наименьшее общее кратное")) {
            const nums = raw.match(/\d+/g);
            if (nums && nums.length >= 2) {
                const a = parseInt(nums[0]), b = parseInt(nums[1]);
                const val = AltronMath.lcm(a, b);
                return {
                    type: 'solution',
                    speech: `Наименьшее общее кратное чисел ${a} и ${b} равно ${val}`,
                    title: `НОК (${a}, ${b})`,
                    latex: `\\text{lcm}(${a}, ${b}) = ${val}`,
                    steps: [
                        `Связь между НОД и НОК: $\\text{lcm}(a, b) = \\frac{|a \\cdot b|}{\\gcd(a, b)}$`,
                        `$\\gcd(${a}, ${b}) = ${AltronMath.gcd(a, b)}$`,
                        `$\\text{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${AltronMath.gcd(a, b)}} = ${val}$`
                    ],
                    content: `### 🔢 Наименьшее общее кратное (НОК)\n\n$$\\text{lcm}(${a}, ${b}) = ${val}$$\n\nМинимальное натуральное число, которое делится нацело и на ${a}, и на ${b}, равно **${val}**.`
                };
            }
        }

        // 8. Факториал
        if (text.includes("факториал") || /^\d+\s*!$/.test(raw.trim())) {
            const numMatch = raw.match(/\d+/);
            if (numMatch) {
                const n = parseInt(numMatch[0]);
                if (n <= 170) {
                    const val = AltronMath.factorial(n);
                    return {
                        type: 'solution',
                        speech: `Факториал ${n} равен ${val}`,
                        title: `Факториал: ${n}!`,
                        latex: `${n}! = ${val}`,
                        steps: [`$${n}! = 1 \\times 2 \\times \\dots \\times ${n} = ${val}$`],
                        content: `### ⚡ Факториал числа\n\n$$${n}! = ${val}$$\n\nПроизведение всех натуральных чисел от 1 до ${n}.`
                    };
                }
            }
        }

        // 9. Статистика ряда чисел
        if (text.includes("статистика") || text.includes("дисперсия") || text.includes("медиана") || text.includes("среднее")) {
            const numbers = (raw.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
            if (numbers.length >= 2) {
                const stats = AltronMath.calculateStatistics(numbers);
                return {
                    type: 'solution',
                    speech: `Статистический анализ завершен. Среднее значение: ${stats.mean.toFixed(2)}, медиана: ${stats.median}`,
                    title: `Статистика выборки (N = ${stats.n})`,
                    latex: `\\bar{x} = ${stats.mean.toFixed(3)}, \\quad s^2 = ${stats.variance.toFixed(3)}`,
                    steps: stats.steps,
                    content: `### 📊 Статистический анализ выборки\n\n${stats.steps.map(s => `- ${s}`).join("\n")}`
                };
            }
        }

        // 10. Матрицы: определитель
        if (text.includes("определитель") || text.includes("детерминант") || text.includes("det")) {
            try {
                // Ищем матрицу формата [[1,2],[3,4]]
                const matMatch = raw.match(/\[\s*\[.*?\]\s*\]/);
                if (matMatch) {
                    const matrix = JSON.parse(matMatch[0]);
                    const det = AltronMath.matrixDeterminant(matrix);
                    const matLatex = AltronMath.matrixToLatex(matrix);
                    return {
                        type: 'solution',
                        speech: `Определитель матрицы равен ${det}`,
                        title: `Определитель матрицы det(A)`,
                        latex: `\\det ${matLatex} = ${det}`,
                        steps: [`Вычисляем определитель для квадратной матрицы порядка ${matrix.length}`],
                        content: `### 🔲 Определитель матрицы\n\n$$\\det ${matLatex} = ${det}$$`
                    };
                }
            } catch (err) {
                // pass to general evaluator
            }
        }

        // 11. Поиск по Справочнику Альтрона (теоремы, формулы, объяснения)
        if (typeof AltronHandbook !== 'undefined') {
            for (let item of AltronHandbook) {
                const matchTitle = item.title.toLowerCase();
                const matchDesc = item.description.toLowerCase();
                const queryWords = text.split(/\s+/).filter(w => w.length > 2);

                const hasWordMatch = queryWords.some(w => matchTitle.includes(w) || matchDesc.includes(w));
                if (hasWordMatch) {
                    return {
                        type: 'handbook',
                        speech: `Извлечена информация из базы знаний Альтрона по теме: ${item.title}.`,
                        title: item.title,
                        latex: item.latex,
                        content: `### 📚 База знаний Альтрона: ${item.title}\n\n*Категория:* **${item.category}**\n\n${item.description}\n\n$$\n${item.latex}\n$$\n\n💡 *Пример применения:* ${item.example}`
                    };
                }
            }
        }

        // 12. Прямое математическое вычисление выражения через Math.js (если введено просто выражение типа 2^10 + sqrt(144) * sin(pi/2))
        try {
            if (typeof math !== 'undefined' && math.evaluate) {
                let cleanMath = raw.replace(/^[=]/, '').trim();
                const evaluated = math.evaluate(cleanMath);
                if (evaluated !== undefined && typeof evaluated !== 'function') {
                    const resultStr = typeof evaluated === 'object' && evaluated.toString ? evaluated.toString() : String(evaluated);
                    return {
                        type: 'solution',
                        speech: `Результат вычисления: ${resultStr}`,
                        title: `Вычисление выражения: ${cleanMath}`,
                        latex: `${cleanMath} = ${resultStr}`,
                        content: `### ⚡ Точный расчет\n\n$$${cleanMath} = ${resultStr}$$\n\nРезультат вычислен встроенным процессором Альтрона.`
                    };
                }
            }
        } catch (e) {
            // Expression could not be parsed as pure arithmetic
        }

        // 13. Если настроен онлайн LLM API (Gemini / Groq / OpenAI), отправляем запрос во внешнюю модель
        if (userApiKey && (selectedModel === 'gemini' || selectedModel === 'groq')) {
            try {
                const llmReply = await queryOnlineAI(raw, userApiKey, selectedModel);
                return {
                    type: 'ai_response',
                    speech: "Ответ сформирован нейросетевым ядром Альтрона.",
                    title: "Математический анализ задачи",
                    content: llmReply
                };
            } catch (err) {
                console.warn("LLM API error:", err);
            }
        }

        // 14. Ответ по умолчанию, если запрос не распознан
        return {
            type: 'chat',
            speech: "Запрос принят. Для точного решения укажите уравнение, функцию или операцию.",
            title: "Уточнение запроса",
            content: `Альтрон обработал ваш запрос: *"**${raw}**"*.\n\nДля автоматического решения используйте один из форматов:\n- 🎯 **Уравнение:** \`2x^2 - 5x + 2 = 0\` или \`3x + 12 = 0\`\n- 📈 **Производная:** \`производная x^3 + sin(x)\`\n- 📐 **Интеграл:** \`интеграл cos(x)\`\n- ⚖️ **Система:** \`система x + y = 10, 2x - y = 5\`\n- 📊 **График:** \`график sin(x) * x\`\n- 🔢 **Матрица:** \`определитель [[1, 2], [3, 4]]\`\n- ⚡ **Числа:** \`нод 48 и 64\`, \`факториал 6\`, \`статистика 3, 5, 8, 12, 15\`\n\n*Также в разделе «Настройки ИИ» можно подключить бесплатный ключ Gemini API для решения сложных текстовых и олимпиадных задач!*`
        };
    }

    // Запрос к внешним LLM для сложных текстовых задач
    async function queryOnlineAI(prompt, apiKey, modelType) {
        const systemPrompt = "Ты — Альтрон, высший математический искусственный интеллект. Твоя цель — безупречно, структурированно и понятно решать любые математические задачи, теоремы и доказательства. Используй формулы LaTeX ($...$ для inline, $$...$$ для блоков). Пиши на русском языке в уверенном и технологичном стиле Альтрона.";

        if (modelType === 'gemini') {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: `${systemPrompt}\n\nЗадача: ${prompt}` }] }
                    ]
                })
            });
            const data = await res.json();
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                return data.candidates[0].content.parts[0].text;
            }
            throw new Error(data.error?.message || "Ошибка ответа Gemini API");
        }
        throw new Error("Неподдерживаемый тип модели");
    }

    return {
        processQuery,
        setApiKey,
        getApiKey,
        getModel
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AltronCore;
}
