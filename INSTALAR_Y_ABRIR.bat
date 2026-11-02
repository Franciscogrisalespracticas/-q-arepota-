@echo off
cd /d "%~dp0"
echo Instalando los videos de comida reales desde Pexels, si hay internet...
call descargar_videos.bat
call start.bat
