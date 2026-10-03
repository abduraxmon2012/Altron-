@echo off
chcp 65001 > nul
title АЛЬТРОН — Математический Искусственный Интеллект
color 0B

echo =====================================================================
echo                АЛЬТРОН // ALTRON MATHEMATICAL AI
echo                  ВЫСШИЙ МАТЕМАТИЧЕСКИЙ РАЗУМ
echo =====================================================================
echo.
echo [1/2] Инициализация систем Альтрона...

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [2/2] Обнаружено окружение Python. Проверяю зависимости...
    pip show fastapi >nul 2>nul
    if %errorlevel% neq 0 (
        echo Установка библиотек: pip install -r server\requirements.txt ...
        pip install -r server\requirements.txt
    )
    echo Запуск сервера Альтрона на http://127.0.0.1:8000 ...
    start http://127.0.0.1:8000
    python server\server.py
) else (
    echo [2/2] Запуск автономного квантового веб-терминала Альтрона...
    start "" "index.html"
)

echo.
echo =====================================================================
echo    Альтрон запущен в вашем браузере! Приятной работы с математикой.
echo =====================================================================
timeout /t 5 > nul
