@echo off
cd /d "%~dp0"
if exist node_modules\vite\bin\vite.js (
 echo Starting Vite (React + TypeScript + GSAP + Three.js)...
 npm run dev
) else (
 echo Dependencies not installed. Starting verified offline preview.
 echo For full Vite version: npm install then npm run dev.
 node scripts\offline-server.cjs
)
pause
