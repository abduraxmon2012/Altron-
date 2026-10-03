/**
 * ALTRON GRAPH ENGINE (graph_engine.js)
 * Интерактивный Canvas-графопостроитель функций 2D
 */

class AltronGraphEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // Параметры системы координат
        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 2;
        this.scale = 40; // пикселей на 1 единицу
        this.minScale = 5;
        this.maxScale = 300;

        // Состояние перетаскивания и мыши
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.mouseX = null;
        this.mouseY = null;

        // Список отображаемых функций: [{ expr, color, fn }]
        this.functions = [];
        this.showRoots = true;
        this.showExtrema = true;

        this.initEvents();
        this.resize();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width || 800;
        this.canvas.height = 480;
        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 2;
        this.render();
    }

    initEvents() {
        window.addEventListener('resize', () => this.resize());

        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStartX = e.clientX - this.originX;
            this.dragStartY = e.clientY - this.originY;
            this.canvas.style.cursor = 'grabbing';
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.canvas.style.cursor = 'crosshair';
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;

            if (this.isDragging) {
                this.originX = e.clientX - this.dragStartX;
                this.originY = e.clientY - this.dragStartY;
            }
            this.render();
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
            this.render();
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseCanvasX = e.clientX - rect.left;
            const mouseCanvasY = e.clientY - rect.top;

            const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
            const newScale = Math.min(Math.max(this.scale * zoomFactor, this.minScale), this.maxScale);

            // Масштабируем относительно курсора
            this.originX = mouseCanvasX - (mouseCanvasX - this.originX) * (newScale / this.scale);
            this.originY = mouseCanvasY - (mouseCanvasY - this.originY) * (newScale / this.scale);
            this.scale = newScale;

            this.render();
        }, { passive: false });
    }

    resetView() {
        this.scale = 40;
        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 2;
        this.render();
    }

    zoomIn() {
        this.scale = Math.min(this.scale * 1.25, this.maxScale);
        this.render();
    }

    zoomOut() {
        this.scale = Math.max(this.scale * 0.8, this.minScale);
        this.render();
    }

    // Компиляция строкового выражения в функцию f(x)
    compileExpression(exprStr) {
        let clean = exprStr.trim();
        if (clean.startsWith('y=') || clean.startsWith('y =')) {
            clean = clean.split('=')[1].trim();
        }
        if (clean.startsWith('f(x)=') || clean.startsWith('f(x) =')) {
            clean = clean.split('=')[1].trim();
        }

        // Если доступен Math.js
        if (typeof math !== 'undefined' && math.compile) {
            try {
                const code = math.compile(clean);
                return (x) => {
                    try {
                        const val = code.evaluate({ x, e: Math.E, pi: Math.PI });
                        return typeof val === 'number' && isFinite(val) ? val : NaN;
                    } catch (e) {
                        return NaN;
                    }
                };
            } catch (err) {
                console.warn("Math.js compile failed, using JS parser", err);
            }
        }

        // Встроенный безопасный парсер
        try {
            let jsExpr = clean
                .replace(/\^/g, '**')
                .replace(/\bsin\b/g, 'Math.sin')
                .replace(/\bcos\b/g, 'Math.cos')
                .replace(/\btan\b/g, 'Math.tan')
                .replace(/\bexp\b/g, 'Math.exp')
                .replace(/\bln\b/g, 'Math.log')
                .replace(/\blog\b/g, 'Math.log10')
                .replace(/\bsqrt\b/g, 'Math.sqrt')
                .replace(/\babs\b/g, 'Math.abs')
                .replace(/\bpi\b/gi, 'Math.PI')
                .replace(/\be\b/gi, 'Math.E');

            // Замена скрытого умножения типа 2x -> 2*x
            jsExpr = jsExpr.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
            jsExpr = jsExpr.replace(/(\))([a-zA-Z\d(])/g, '$1*$2');

            const fn = new Function('x', `try { with(Math) { return ${jsExpr}; } } catch(e) { return NaN; }`);
            return (x) => {
                const val = fn(x);
                return typeof val === 'number' && isFinite(val) ? val : NaN;
            };
        } catch (e) {
            return null;
        }
    }

    setFunction(exprStr, color = '#00f3ff') {
        const fn = this.compileExpression(exprStr);
        if (!fn) return false;
        this.functions = [{ expr: exprStr, color, fn }];
        this.render();
        return true;
    }

    addFunction(exprStr, color = '#ff0055') {
        const fn = this.compileExpression(exprStr);
        if (!fn) return false;
        this.functions.push({ expr: exprStr, color, fn });
        this.render();
        return true;
    }

    clearFunctions() {
        this.functions = [];
        this.render();
    }

    // Преобразование координат математика <-> холст
    toCanvasX(mathX) {
        return this.originX + mathX * this.scale;
    }

    toCanvasY(mathY) {
        return this.originY - mathY * this.scale;
    }

    toMathX(canvasX) {
        return (canvasX - this.originX) / this.scale;
    }

    toMathY(canvasY) {
        return (this.originY - canvasY) / this.scale;
    }

    // Отрисовка координатной сетки и осей
    drawGrid() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;

        ctx.fillStyle = '#060a12';
        ctx.fillRect(0, 0, w, h);

        // Расчет шага сетки в зависимости от масштаба
        let step = 1;
        if (this.scale > 120) step = 0.5;
        if (this.scale > 200) step = 0.2;
        if (this.scale < 30) step = 2;
        if (this.scale < 15) step = 5;
        if (this.scale < 8) step = 10;

        const xMin = Math.floor(this.toMathX(0) / step) * step;
        const xMax = Math.ceil(this.toMathX(w) / step) * step;
        const yMin = Math.floor(this.toMathY(h) / step) * step;
        const yMax = Math.ceil(this.toMathY(0) / step) * step;

        // Вспомогательная сетка
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.07)';
        ctx.lineWidth = 1;

        for (let x = xMin; x <= xMax; x += step) {
            const cx = this.toCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(cx, 0);
            ctx.lineTo(cx, h);
            ctx.stroke();
        }

        for (let y = yMin; y <= yMax; y += step) {
            const cy = this.toCanvasY(y);
            ctx.beginPath();
            ctx.moveTo(0, cy);
            ctx.lineTo(w, cy);
            ctx.stroke();
        }

        // Основные оси координат X и Y
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
        ctx.lineWidth = 2;

        // Ось X
        ctx.beginPath();
        ctx.moveTo(0, this.originY);
        ctx.lineTo(w, this.originY);
        ctx.stroke();

        // Стрелка оси X
        ctx.fillStyle = 'rgba(0, 243, 255, 0.7)';
        ctx.beginPath();
        ctx.moveTo(w - 10, this.originY - 5);
        ctx.lineTo(w, this.originY);
        ctx.lineTo(w - 10, this.originY + 5);
        ctx.fill();

        // Ось Y
        ctx.beginPath();
        ctx.moveTo(this.originX, 0);
        ctx.lineTo(this.originX, h);
        ctx.stroke();

        // Стрелка оси Y
        ctx.beginPath();
        ctx.moveTo(this.originX - 5, 10);
        ctx.lineTo(this.originX, 0);
        ctx.lineTo(this.originX + 5, 10);
        ctx.fill();

        // Подписи чисел на осях
        ctx.font = '11px "JetBrains Mono", Consolas, monospace';
        ctx.fillStyle = 'rgba(160, 200, 230, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        for (let x = xMin; x <= xMax; x += step) {
            if (Math.abs(x) < 1e-9) continue;
            const cx = this.toCanvasX(x);
            if (cx > 10 && cx < w - 20) {
                ctx.fillText(Number(x.toFixed(2)), cx, Math.min(Math.max(this.originY + 6, 10), h - 20));
            }
        }

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let y = yMin; y <= yMax; y += step) {
            if (Math.abs(y) < 1e-9) continue;
            const cy = this.toCanvasY(y);
            if (cy > 15 && cy < h - 10) {
                ctx.fillText(Number(y.toFixed(2)), Math.min(Math.max(this.originX - 8, 30), w - 10), cy);
            }
        }

        // Подпись начала координат "0"
        ctx.fillText("0", this.originX - 6, this.originY + 12);
        ctx.fillText("x", w - 12, this.originY - 14);
        ctx.fillText("y", this.originX + 16, 12);
    }

    // Отрисовка графиков функций
    render() {
        this.drawGrid();
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.functions.forEach(({ expr, color, fn }) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.beginPath();

            let firstPoint = true;
            const stepPx = 1; // шаг 1 пиксель по горизонтали

            for (let px = 0; px <= w; px += stepPx) {
                const mathX = this.toMathX(px);
                const mathY = fn(mathX);

                if (isNaN(mathY) || !isFinite(mathY)) {
                    firstPoint = true;
                    continue;
                }

                const py = this.toCanvasY(mathY);
                // Отсечение резких разрывов (асимптот) типа 1/x или tan(x)
                if (firstPoint) {
                    ctx.moveTo(px, py);
                    firstPoint = false;
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0; // сброс тени

            // Отрисовка корней (пересечений с осью X)
            if (this.showRoots) {
                const xMin = this.toMathX(0);
                const xMax = this.toMathX(w);
                if (typeof AltronMath !== 'undefined') {
                    const roots = AltronMath.findRoots(fn, xMin, xMax, 150);
                    roots.forEach(root => {
                        const rx = this.toCanvasX(root);
                        const ry = this.toCanvasY(0);
                        if (rx >= 0 && rx <= w) {
                            ctx.fillStyle = '#00ff9d';
                            ctx.beginPath();
                            ctx.arc(rx, ry, 5, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = '#060a12';
                            ctx.lineWidth = 1.5;
                            ctx.stroke();

                            // Подпись корня
                            ctx.fillStyle = '#00ff9d';
                            ctx.font = '10px monospace';
                            ctx.textAlign = 'center';
                            ctx.fillText(`x=${root.toFixed(2)}`, rx, ry - 10);
                        }
                    });
                }
            }
        });

        // Отрисовка интерактивной точки под курсором
        if (this.mouseX !== null && this.mouseY !== null && this.functions.length > 0) {
            const hoverX = this.toMathX(this.mouseX);
            const activeFn = this.functions[0].fn;
            const hoverY = activeFn(hoverX);

            if (!isNaN(hoverY) && isFinite(hoverY)) {
                const cy = this.toCanvasY(hoverY);
                if (cy >= 0 && cy <= h) {
                    ctx.fillStyle = '#ff0055';
                    ctx.beginPath();
                    ctx.arc(this.mouseX, cy, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Тултип с точными координатами
                    const tooltipText = `(${hoverX.toFixed(3)}, ${hoverY.toFixed(3)})`;
                    ctx.fillStyle = 'rgba(10, 16, 30, 0.85)';
                    ctx.strokeStyle = '#00f3ff';
                    ctx.lineWidth = 1;

                    const textWidth = ctx.measureText(tooltipText).width + 16;
                    const tooltipX = Math.min(Math.max(this.mouseX + 12, 10), w - textWidth - 10);
                    const tooltipY = Math.min(Math.max(cy - 28, 10), h - 35);

                    ctx.fillRect(tooltipX, tooltipY, textWidth, 24);
                    ctx.strokeRect(tooltipX, tooltipY, textWidth, 24);

                    ctx.fillStyle = '#00f3ff';
                    ctx.font = '12px "JetBrains Mono", Consolas, monospace';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(tooltipText, tooltipX + 8, tooltipY + 12);
                }
            }
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AltronGraphEngine;
}
