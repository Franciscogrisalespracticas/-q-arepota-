@echo off
cd /d "%~dp0"
echo Q AREPOTA: DESCARGA DE VIDEOS REALES
where py >nul 2>nul
if not errorlevel 1 goto py_ok
where python >nul 2>nul
if not errorlevel 1 goto python_ok
echo Necesitas instalar Python 3, o descargar manualmente los MP4 de FUENTES_Y_LICENCIAS.md
goto finish
:py_ok
py -3 scripts\descargar_videos.py
goto finish
:python_ok
python scripts\descargar_videos.py
:finish
echo.
echo Abre la pagina con start.bat o con Live Server en preview\index.html.
pause
