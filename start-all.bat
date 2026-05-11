@echo off
setlocal
cd /d "%~dp0"

echo 🚀 Iniciando Plataforma Académica Modular...
echo.

echo [1/4] Iniciando Shell (puerto 4200)...
start "PAM Shell" /D "%~dp0shell" cmd /k npm start

timeout /t 3 /nobreak >nul

echo [2/4] Iniciando mf-estudiantes (puerto 4201)...
start "PAM mf-estudiantes" /D "%~dp0mf-estudiantes" cmd /k npm start

timeout /t 3 /nobreak >nul

echo [3/4] Iniciando mf-inscripciones (puerto 4202)...
start "PAM mf-inscripciones" /D "%~dp0mf-inscripciones" cmd /k npm start

timeout /t 3 /nobreak >nul

echo [4/4] Iniciando mf-calificaciones (puerto 4203)...
start "PAM mf-calificaciones" /D "%~dp0mf-calificaciones" cmd /k npm start

echo.
echo ✅ Todos los servicios iniciados!
echo    Shell:            http://localhost:4200
echo    Estudiantes:      http://localhost:4201
echo    Inscripciones:    http://localhost:4202
echo    Calificaciones:   http://localhost:4203
echo.
pause
