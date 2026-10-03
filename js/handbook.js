/**
 * ALTRON MATHEMATICAL HANDBOOK (handbook.js)
 * Энциклопедия математических знаний, формул и теорем Альтрона
 */

const AltronHandbook = [
    {
        category: "Арифметика и Числа",
        title: "Формулы сокращенного умножения",
        description: "Ключевые тождества для раскрытия скобок и разложения на множители.",
        latex: "(a \\pm b)^2 = a^2 \\pm 2ab + b^2 \\\\\na^2 - b^2 = (a - b)(a + b) \\\\\n(a \\pm b)^3 = a^3 \\pm 3a^2b + 3ab^2 \\pm b^3 \\\\\na^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)",
        example: "Раскрыть: (x + 3)^2 = x^2 + 6x + 9"
    },
    {
        category: "Арифметика и Числа",
        title: "Арифметическая и Геометрическая прогрессии",
        description: "Формулы n-го члена и суммы первых n членов прогрессий.",
        latex: "\\text{Арифметическая: } a_n = a_1 + (n - 1)d, \\quad S_n = \\frac{a_1 + a_n}{2} \\cdot n \\\\\n\\text{Геометрическая: } b_n = b_1 \\cdot q^{n-1}, \\quad S_n = \\frac{b_1(q^n - 1)}{q - 1} \\ (q \\neq 1)",
        example: "b1 = 2, q = 3, n = 4 => b4 = 2*27 = 54"
    },
    {
        category: "Алгебра",
        title: "Квадратные уравнения и Теорема Виета",
        description: "Решение уравнения ax² + bx + c = 0 через дискриминант и корни Виета.",
        latex: "D = b^2 - 4ac, \\quad x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a} \\\\\n\\text{Теорема Виета: } x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 \\cdot x_2 = \\frac{c}{a}",
        example: "x^2 - 5x + 6 = 0 => x1 = 2, x2 = 3"
    },
    {
        category: "Алгебра",
        title: "Свойства степеней и логарифмов",
        description: "Фундаментальные правила работы с показательными и логарифмическими выражениями.",
        latex: "a^x \\cdot a^y = a^{x+y}, \\quad \\frac{a^x}{a^y} = a^{x-y}, \\quad (a^x)^y = a^{xy} \\\\\n\\log_a(x \\cdot y) = \\log_a x + \\log_a y, \\quad \\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y \\\\\n\\log_a(x^p) = p \\cdot \\log_a x, \\quad \\log_a b = \\frac{\\ln b}{\\ln a}",
        example: "log2(8) = 3"
    },
    {
        category: "Тригонометрия",
        title: "Основные тригонометрические формулы",
        description: "Тождества для sin, cos, tan, двойных углов и преобразования сумм.",
        latex: "\\sin^2 x + \\cos^2 x = 1, \\quad 1 + \\tan^2 x = \\frac{1}{\\cos^2 x} \\\\\n\\sin(2x) = 2\\sin x \\cos x, \\quad \\cos(2x) = \\cos^2 x - \\sin^2 x \\\\\n\\sin(x \\pm y) = \\sin x \\cos y \\pm \\cos x \\sin y \\\\\n\\cos(x \\pm y) = \\cos x \\cos y \\mp \\sin x \\sin y",
        example: "sin(2*pi/6) = 2*sin(pi/6)*cos(pi/6) = sqrt(3)/2"
    },
    {
        category: "Математический анализ",
        title: "Таблица основных производных",
        description: "Правила дифференцирования элементарных функций.",
        latex: "(c)' = 0, \\quad (x^n)' = n x^{n-1}, \\quad (e^x)' = e^x, \\quad (a^x)' = a^x \\ln a \\\\\n(\\ln x)' = \\frac{1}{x}, \\quad (\\sin x)' = \\cos x, \\quad (\\cos x)' = -\\sin x \\\\\n(\\tan x)' = \\frac{1}{\\cos^2 x}, \\quad (\\arctan x)' = \\frac{1}{1 + x^2}",
        example: "(x^3)' = 3x^2, (sin(x))' = cos(x)"
    },
    {
        category: "Математический анализ",
        title: "Правила дифференцирования",
        description: "Производная суммы, произведения, дроби и сложной функции.",
        latex: "(u \\pm v)' = u' \\pm v' \\\\\n(u \\cdot v)' = u'v + uv' \\\\\n\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2} \\\\\n(f(g(x)))' = f'(g(x)) \\cdot g'(x)",
        example: "(x * sin(x))' = sin(x) + x*cos(x)"
    },
    {
        category: "Математический анализ",
        title: "Таблица интегралов и Ньютон-Лейбниц",
        description: "Неопределенные интегралы и вычисление площади под кривой.",
        latex: "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\ (n \\neq -1), \\quad \\int \\frac{1}{x} dx = \\ln|x| + C \\\\\n\\int e^x dx = e^x + C, \\quad \\int \\sin x dx = -\\cos x + C, \\quad \\int \\cos x dx = \\sin x + C \\\\\n\\text{Формула Ньютона-Лейбница: } \\int_a^b f(x) dx = F(b) - F(a)",
        example: "integral(0 to 1) x^2 dx = [x^3/3] = 1/3"
    },
    {
        category: "Математический анализ",
        title: "Замечательные пределы",
        description: "Классические пределы, раскрывающие неопределенности 0/0 и 1^inf.",
        latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1 \\\\\n\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e, \\quad \\lim_{x \\to 0} (1 + x)^{\\frac{1}{x}} = e \\\\\n\\lim_{x \\to 0} \\frac{\\ln(1 + x)}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1",
        example: "lim(x->0) sin(3x)/x = 3"
    },
    {
        category: "Линейная алгебра",
        title: "Матрицы и метод Крамера",
        description: "Определители матриц и решение систем линейных уравнений.",
        latex: "\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc \\\\\n\\text{Метод Крамера: } x_i = \\frac{\\Delta_i}{\\Delta}, \\quad (\\Delta \\neq 0) \\\\\nA \\cdot A^{-1} = I, \\quad A^{-1} = \\frac{1}{\\det A} \\cdot \\text{adj}(A)",
        example: "det([[1, 2], [3, 4]]) = 1*4 - 2*3 = -2"
    },
    {
        category: "Геометрия",
        title: "Планиметрия: Треугольник и Окружность",
        description: "Теорема Пифагора, формула Герона, площади и длины.",
        latex: "\\text{Теорема Пифагора: } a^2 + b^2 = c^2 \\\\\n\\text{Площадь треугольника: } S = \\frac{1}{2}ah = \\sqrt{p(p-a)(p-b)(p-c)}, \\quad p = \\frac{a+b+c}{2} \\\\\n\\text{Окружность: } C = 2\\pi R, \\quad S = \\pi R^2",
        example: "a = 3, b = 4 => c = sqrt(9+16) = 5"
    },
    {
        category: "Геометрия",
        title: "Стереометрия: Объем и Площадь тел",
        description: "Формулы для шара, цилиндра, конуса и параллелепипеда.",
        latex: "\\text{Шар: } V = \\frac{4}{3}\\pi R^3, \\quad S = 4\\pi R^2 \\\\\n\\text{Цилиндр: } V = \\pi R^2 h, \\quad S_{бок} = 2\\pi R h \\\\\n\\text{Конус: } V = \\frac{1}{3}\\pi R^2 h, \\quad S_{бок} = \\pi R l",
        example: "R = 3 => V(шара) = 4/3 * pi * 27 = 36*pi"
    },
    {
        category: "Теория вероятностей",
        title: "Комбинаторика и Распределения",
        description: "Число сочетаний, формула Бернулли и характеристики случайных величин.",
        latex: "C_n^k = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}, \\quad P_n = n!, \\quad A_n^k = \\frac{n!}{(n-k)!} \\\\\n\\text{Формула Бернулли: } P_n(k) = C_n^k p^k (1-p)^{n-k} \\\\\n\\text{Математическое ожидание: } M[X] = \\sum x_i p_i, \\quad D[X] = M[X^2] - (M[X])^2",
        example: "C(5, 2) = 5! / (2! * 3!) = 10"
    },
    // ==========================================
    // SAT MATH (7-11 КЛАССЫ)
    // ==========================================
    {
        category: "SAT Math (7-11 класс)",
        title: "SAT Heart of Algebra: Прямые и Наклон",
        description: "Уравнение прямой y = mx + b, угловой коэффициент (slope), параллельные и перпендикулярные прямые.",
        latex: "m = \\frac{y_2 - y_1}{x_2 - x_1}, \\quad y = mx + b \\\\\n\\text{Параллельные прямые: } m_1 = m_2 \\\\\n\\text{Перпендикулярные прямые: } m_1 \\cdot m_2 = -1 \\implies m_2 = -\\frac{1}{m_1} \\\\\n\\text{Расстояние: } d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}, \\quad \\text{Середина: } M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)",
        example: "наклон через точки (1, 2) и (3, 8)"
    },
    {
        category: "SAT Math (7-11 класс)",
        title: "SAT Passport: Вершина параболы (Vertex Form)",
        description: "Координаты вершины квадратичной функции, ось симметрии, стандартная форма и форма вершины.",
        latex: "y = ax^2 + bx + c \\implies y = a(x - h)^2 + k \\\\\nh = -\\frac{b}{2a}, \\quad k = c - \\frac{b^2}{4a} \\\\\n\\text{Ось симметрии: } x = -\\frac{b}{2a} \\\\\na > 0 \\implies \\text{минимум } k, \\quad a < 0 \\implies \\text{максимум } k",
        example: "вершина параболы y = 2x^2 - 8x + 6"
    },
    {
        category: "SAT Math (7-11 класс)",
        title: "SAT Geometry: Уравнение окружности",
        description: "Стандартное уравнение окружности с центром (h, k) и радиусом r, длина дуги и площадь сектора.",
        latex: "(x - h)^2 + (y - k)^2 = r^2 \\\\\n\\text{Длина дуги: } s = \\frac{\\theta^\\circ}{360^\\circ} \\cdot 2\\pi r = r \\theta_{\\text{rad}} \\\\\n\\text{Площадь сектора: } A = \\frac{\\theta^\\circ}{360^\\circ} \\cdot \\pi r^2 = \\frac{1}{2} r^2 \\theta_{\\text{rad}} \\\\\n\\text{Вписанный угол: } \\angle_{\\text{вписанный}} = \\frac{1}{2} \\angle_{\\text{центральный}}",
        example: "окружность центр (2, -3) радиус 5"
    },
    {
        category: "SAT Math (7-11 класс)",
        title: "SAT Geometry: Треугольники 30-60-90 и 45-45-90",
        description: "Специальные соотношения сторон прямоугольных треугольников из формуляра SAT.",
        latex: "30^\\circ - 60^\\circ - 90^\\circ: \\quad x : x\\sqrt{3} : 2x \\\\\n45^\\circ - 45^\\circ - 90^\\circ: \\quad x : x : x\\sqrt{2} \\\\\n\\text{Равносторонний треугольник: } S = \\frac{a^2\\sqrt{3}}{4}, \\quad h = \\frac{a\\sqrt{3}}{2}",
        example: "треугольник 30-60-90 гипотенуза 10"
    },
    {
        category: "SAT Math (7-11 класс)",
        title: "SAT Problem Solving: Проценты и Сложный процент",
        description: "Процентное изменение, налоги, скидки и начисление сложных процентов.",
        latex: "\\% \\text{ изменение} = \\frac{\\text{Новое} - \\text{Старое}}{\\text{Старое}} \\times 100\\% \\\\\n\\text{Сложный процент: } A = P\\left(1 + \\frac{r}{n}\\right)^{nt} \\\\\n\\text{Непрерывный процент: } A = P e^{rt} \\\\\n\\text{Экспоненциальный рост/спад: } y = a(1 \\pm r)^t",
        example: "сложные проценты P=1000 r=5% n=1 t=3"
    },
    {
        category: "SAT Math (7-11 класс)",
        title: "SAT Trig: Формулы Смежных углов и Радианы",
        description: "Соотношения sin(x) = cos(90 - x), перевод градусов в радианы и SOH-CAH-TOA.",
        latex: "\\sin(x^\\circ) = \\cos(90^\\circ - x^\\circ) \\iff \\sin(x) = \\cos\\left(\\frac{\\pi}{2} - x\\right) \\\\\n\\text{Радианы} = \\text{Градусы} \\times \\frac{\\pi}{180^\\circ}, \\quad \\text{Градусы} = \\text{Радианы} \\times \\frac{180^\\circ}{\\pi} \\\\\n\\sin\\theta = \\frac{\\text{Opp}}{\\text{Hyp}}, \\quad \\cos\\theta = \\frac{\\text{Adj}}{\\text{Hyp}}, \\quad \\tan\\theta = \\frac{\\text{Opp}}{\\text{Adj}} = \\frac{\\sin\\theta}{\\cos\\theta}",
        example: "sin(30) = cos(60)"
    },
    {
        category: "SAT Math (7-11 класс)",
        title: "SAT Advanced: Комплексные числа (i)",
        description: "Мнимая единица i = sqrt(-1), степени числа i и действия с комплексными числами.",
        latex: "i = \\sqrt{-1}, \\quad i^2 = -1, \\quad i^3 = -i, \\quad i^4 = 1, \\quad i^n = i^{n \\pmod 4} \\\\\n(a + bi)(a - bi) = a^2 + b^2 \\ (\\text{сопряженные числа}) \\\\\n(a + bi)(c + di) = (ac - bd) + (ad + bc)i",
        example: "комплексные (2 + 3i) * (4 - 5i)"
    },
    {
        category: "SAT Math (7-11 класс)",
        title: "SAT Advanced: Теорема Безу и Деление многочленов",
        description: "Остаток от деления многочлена P(x) на (x - a) равен P(a). Корень многочлена.",
        latex: "P(x) = (x - a) Q(x) + R \\implies R = P(a) \\\\\n\\text{Если } P(a) = 0, \\text{ то } (x - a) \\text{ — делитель } P(x) \\\\\n\\text{Количество решений системы: } \\\\\n\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases} \\implies \\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2} \\ (1 \\text{ решение}), \\quad \\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2} \\ (0 \\text{ решений}), \\quad \\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2} \\ (\\infty)",
        example: "теорема безу"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AltronHandbook;
}
