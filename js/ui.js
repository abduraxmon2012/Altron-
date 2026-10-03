/**
 * ALTRON USER INTERFACE CONTROLLER (ui.js)
 * Управление футуристическим интерфейсом, озвучкой, вкладками и рендерингом KaTeX
 */

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация графопостроителя
    const graphEngine = new AltronGraphEngine('mathCanvas');
    window.altronGraph = graphEngine;

    // Элементы интерфейса
    const chatContainer = document.getElementById('chatMessages');
    const queryInput = document.getElementById('queryInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceToggleBtn = document.getElementById('voiceToggleBtn');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const copyAllChatBtn = document.getElementById('copyAllChatBtn');
    const exportAllChatBtn = document.getElementById('exportAllChatBtn');
    const copyToast = document.getElementById('copyToast');
    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const quickChips = document.querySelectorAll('.chip');
    const keyButtons = document.querySelectorAll('.key-btn');
    const handbookContainer = document.getElementById('handbookList');
    const handbookSearch = document.getElementById('handbookSearch');

    // Настройки и история диалога
    let isVoiceEnabled = true;
    let isSoundEnabled = true;
    const dialogHistory = [];

    // Универсальное копирование в буфер обмена (работает как по http/https, так и по file://)
    function copyToClipboard(text, toastMsg = '✓ Скопировано в буфер обмена!') {
        function showToast(msg) {
            if (!copyToast) return;
            copyToast.textContent = msg;
            copyToast.classList.add('show');
            setTimeout(() => copyToast.classList.remove('show'), 2500);
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(toastMsg);
                playSciFiSound('beep');
            }).catch(() => {
                fallbackCopy(text, toastMsg);
            });
        } else {
            fallbackCopy(text, toastMsg);
        }
    }

    function fallbackCopy(text, toastMsg) {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                if (copyToast) {
                    copyToast.textContent = toastMsg;
                    copyToast.classList.add('show');
                    setTimeout(() => copyToast.classList.remove('show'), 2500);
                }
                playSciFiSound('beep');
            } else {
                alert("Пожалуйста, выделите текст и нажмите Ctrl+C");
            }
        } catch (err) {
            alert("Не удалось скопировать: выделите текст и нажмите Ctrl+C");
        }
    }

    // Web Audio API генератор звуков в стиле Альтрона / Джарвиса
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playSciFiSound(type = 'beep') {
        if (!isSoundEnabled || !audioCtx) return;
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;
            if (type === 'beep') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'compute') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.linearRampToValueAtTime(880, now + 0.15);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
                osc.frequency.setValueAtTime(1046.50, now + 0.14); // C6
                gain.gain.setValueAtTime(0.09, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            }
        } catch (e) {
            // Audio context failed
        }
    }

    // Синтез речи (Альтрон говорит)
    function speakText(text) {
        if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); // сброс предыдущей речи

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        utterance.rate = 1.05; // технологичный, уверенный темп
        utterance.pitch = 0.95; // чуть более низкий, кибернетический тон

        // Поиск русского голоса
        const voices = window.speechSynthesis.getVoices();
        const ruVoice = voices.find(v => v.lang.includes('ru') || v.lang.includes('RU'));
        if (ruVoice) utterance.voice = ruVoice;

        // Анимация голосового ядра Альтрона при речи
        const coreRing = document.querySelector('.altron-core-avatar');
        if (coreRing) coreRing.classList.add('speaking');
        utterance.onend = () => {
            if (coreRing) coreRing.classList.remove('speaking');
        };
        utterance.onerror = () => {
            if (coreRing) coreRing.classList.remove('speaking');
        };

        window.speechSynthesis.speak(utterance);
    }

    // Парсер простого Markdown в HTML
    function parseMarkdown(md) {
        let html = md
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/`([^`]+)`/gim, '<code>$1</code>')
            .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
            .replace(/\n\n/gim, '<br><br>');

        return html;
    }

    // Рендеринг KaTeX формул в элементе
    function renderMathFormulas(element) {
        if (typeof renderMathInElement !== 'undefined') {
            try {
                renderMathInElement(element, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                        { left: '\\[', right: '\\]', display: true },
                        { left: '\\(', right: '\\)', display: false }
                    ],
                    throwOnError: false
                });
            } catch (err) {
                console.warn("KaTeX render error:", err);
            }
        }
    }

    // Добавление сообщения в чат
    function addChatMessage(role, content, title = '') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${role}-message`;

        const avatar = role === 'altron' ? '🤖' : '👤';
        const author = role === 'altron' ? 'АЛЬТРОН' : 'ВЫ';

        // Сохраняем в историю диалога для полного копирования
        dialogHistory.push({
            role,
            avatar,
            author,
            title,
            content,
            time: new Date().toLocaleTimeString()
        });

        let innerHtml = `
            <div class="msg-header">
                <span class="msg-author">${avatar} ${author}</span>
                <span class="msg-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="msg-body">
                ${title ? `<div class="msg-title">${title}</div>` : ''}
                <div class="msg-content">${parseMarkdown(content)}</div>
            </div>
        `;

        if (role === 'altron') {
            innerHtml += `
                <div class="msg-actions">
                    <button class="action-btn copy-btn" title="Скопировать ответ"><i class="icon-copy"></i> Скопировать ответ</button>
                    <button class="action-btn speak-btn" title="Озвучить ответ"><i class="icon-volume"></i> Озвучить</button>
                </div>
            `;
        } else {
            innerHtml += `
                <div class="msg-actions">
                    <button class="action-btn copy-btn" title="Скопировать запрос">Скопировать запрос</button>
                </div>
            `;
        }

        msgDiv.innerHTML = innerHtml;
        chatContainer.appendChild(msgDiv);
        renderMathFormulas(msgDiv);

        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Обработчики кнопок внутри сообщения
        const copyBtn = msgDiv.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                copyToClipboard(content, '✓ Сообщение скопировано в буфер!');
                const orig = copyBtn.innerHTML;
                copyBtn.innerHTML = '✓ Скопировано';
                setTimeout(() => copyBtn.innerHTML = orig, 2000);
            });
        }

        const speakBtn = msgDiv.querySelector('.speak-btn');
        if (speakBtn) {
            speakBtn.addEventListener('click', () => {
                const plainText = content.replace(/[$#*`]/g, '');
                speakText(plainText);
            });
        }
    }

    // Обработчик кнопки «Скопировать всё» (весь диалог)
    if (copyAllChatBtn) {
        copyAllChatBtn.addEventListener('click', () => {
            if (dialogHistory.length === 0) {
                copyToClipboard("", "Диалог пуст");
                return;
            }
            let fullText = `# МАТЕМАТИЧЕСКИЙ ДИАЛОГ С ИИ «АЛЬТРОН»\nЭкспортировано: ${new Date().toLocaleString()}\n\n` +
                "==========================================================\n\n";

            dialogHistory.forEach(item => {
                fullText += `[${item.time}] ${item.author}:\n`;
                if (item.title) fullText += `Тема: ${item.title}\n`;
                fullText += `${item.content}\n\n`;
                fullText += "----------------------------------------------------------\n\n";
            });

            copyToClipboard(fullText, "✓ Весь диалог и решения скопированы!");
        });
    }

    // Обработчик кнопки «Экспорт» (скачать в файл .md)
    if (exportAllChatBtn) {
        exportAllChatBtn.addEventListener('click', () => {
            if (dialogHistory.length === 0) {
                alert("Диалог пуст");
                return;
            }
            let fullText = `# МАТЕМАТИЧЕСКИЙ ДИАЛОГ С ИИ «АЛЬТРОН»\nЭкспортировано: ${new Date().toLocaleString()}\n\n` +
                "==========================================================\n\n";

            dialogHistory.forEach(item => {
                fullText += `### [${item.time}] ${item.author}\n`;
                if (item.title) fullText += `**Тема:** ${item.title}\n\n`;
                fullText += `${item.content}\n\n`;
                fullText += "---\n\n";
            });

            const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `altron_math_session_${Date.now()}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (copyToast) {
                copyToast.textContent = "✓ Сессия сохранена в файл .md!";
                copyToast.classList.add('show');
                setTimeout(() => copyToast.classList.remove('show'), 2500);
            }
            playSciFiSound('success');
        });
    }

    // Индикатор размышлений Альтрона
    function showThinkingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'thinkingIndicator';
        indicator.className = 'chat-message altron-message thinking';
        indicator.innerHTML = `
            <div class="msg-header">
                <span class="msg-author">🤖 АЛЬТРОН</span>
                <span class="pulse-status">ВЫЧИСЛИТЕЛЬНЫЙ АНАЛИЗ...</span>
            </div>
            <div class="thinking-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        chatContainer.appendChild(indicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return indicator;
    }

    function removeThinkingIndicator() {
        const ind = document.getElementById('thinkingIndicator');
        if (ind) ind.remove();
    }

    // Отправка запроса
    async function handleUserQuery(text) {
        if (!text || !text.trim()) return;
        const query = text.trim();

        // Добавляем сообщение пользователя
        addChatMessage('user', query);
        queryInput.value = '';
        playSciFiSound('compute');

        const thinking = showThinkingIndicator();

        try {
            const response = await AltronCore.processQuery(query, graphEngine);
            removeThinkingIndicator();
            playSciFiSound('success');

            addChatMessage('altron', response.content, response.title);

            if (response.speech && isVoiceEnabled) {
                speakText(response.speech);
            }

            // Если был построен график, переключаем на вкладку графика
            if (response.type === 'graph') {
                switchTab('graphTab');
            }
        } catch (error) {
            removeThinkingIndicator();
            addChatMessage('altron', `⚠️ В ходе вычислений произошла ошибка: ${error.message}`);
        }
    }

    // Слушатели событий
    sendBtn.addEventListener('click', () => handleUserQuery(queryInput.value));
    queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserQuery(queryInput.value);
        }
    });

    // Переключение вкладок
    function switchTab(tabId) {
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });
        playSciFiSound('beep');

        if (tabId === 'graphTab') {
            setTimeout(() => graphEngine.resize(), 100);
        }
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Быстрые чипы (примеры)
    quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query;
            if (query) {
                queryInput.value = query;
                handleUserQuery(query);
            }
        });
    });

    // Виртуальная математическая клавиатура
    keyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const insertVal = btn.dataset.insert;
            if (!insertVal) return;
            playSciFiSound('beep');

            const start = queryInput.selectionStart;
            const end = queryInput.selectionEnd;
            const val = queryInput.value;

            queryInput.value = val.substring(0, start) + insertVal + val.substring(end);
            queryInput.focus();
            const newPos = start + insertVal.length;
            queryInput.setSelectionRange(newPos, newPos);
        });
    });

    // Переключатель озвучки
    voiceToggleBtn.addEventListener('click', () => {
        isVoiceEnabled = !isVoiceEnabled;
        voiceToggleBtn.classList.toggle('active', isVoiceEnabled);
        voiceToggleBtn.title = isVoiceEnabled ? "Озвучка включена" : "Озвучка отключена";
        if (!isVoiceEnabled && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        playSciFiSound('beep');
    });

    // Переключатель звуковых эффектов
    soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        soundToggleBtn.classList.toggle('active', isSoundEnabled);
        soundToggleBtn.title = isSoundEnabled ? "Звуки интерфейса включены" : "Звуки интерфейса выключены";
        if (isSoundEnabled) playSciFiSound('beep');
    });

    // Инициализация Справочника
    function renderHandbook(filter = '') {
        if (!handbookContainer || typeof AltronHandbook === 'undefined') return;
        handbookContainer.innerHTML = '';

        const filtered = AltronHandbook.filter(item => {
            const q = filter.toLowerCase();
            return item.title.toLowerCase().includes(q) ||
                   item.category.toLowerCase().includes(q) ||
                   item.description.toLowerCase().includes(q);
        });

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'handbook-card';
            card.innerHTML = `
                <div class="card-badge">${item.category}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="card-formula">$$${item.latex}$$</div>
                <div class="card-example"><strong>Пример:</strong> ${item.example}</div>
                <button class="use-formula-btn" data-expr="${item.example}">Использовать в Альтроне</button>
            `;
            handbookContainer.appendChild(card);
            renderMathFormulas(card);

            card.querySelector('.use-formula-btn').addEventListener('click', () => {
                queryInput.value = item.example;
                switchTab('chatTab');
                queryInput.focus();
            });
        });
    }

    renderHandbook();
    if (handbookSearch) {
        handbookSearch.addEventListener('input', (e) => renderHandbook(e.target.value));
    }

    // Управление графиком из вкладки Графопостроителя
    const plotInput = document.getElementById('graphExprInput');
    const plotBtn = document.getElementById('plotBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetGraphBtn = document.getElementById('resetGraphBtn');

    if (plotBtn && plotInput) {
        plotBtn.addEventListener('click', () => {
            if (plotInput.value.trim()) {
                graphEngine.setFunction(plotInput.value.trim());
                playSciFiSound('compute');
            }
        });
        plotInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') plotBtn.click();
        });
    }
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => graphEngine.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => graphEngine.zoomOut());
    if (resetGraphBtn) resetGraphBtn.addEventListener('click', () => graphEngine.resetView());

    // График по умолчанию
    graphEngine.setFunction("x^3 - 3*x");

    // Приветственное сообщение от Альтрона
    setTimeout(() => {
        addChatMessage('altron', `### ⚡ Ядро Альтрона в сети\n\nВсе математические протоколы загружены. Я готов к решению задач любой категории сложности: от школьных уравнений до тензорного анализа и вычисления интегралов.\n\n*Задайте задачу в поле ниже или выберите один из быстрых примеров.*`);
        if (isVoiceEnabled) {
            speakText("Ядро Альтрона активировано. Все математические протоколы в сети. Чем я могу помочь?");
        }
    }, 500);
});
