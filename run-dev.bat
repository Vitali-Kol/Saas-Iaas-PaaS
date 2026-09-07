@echo off
cd /d "%~dp0"
title CloudFlow SaaS (http://localhost:3000)
echo ==========================================================
echo   CloudFlow SaaS - Pilverakenduste Platvorm
echo   Host: http://localhost:3000
echo ==========================================================
call npm.cmd run dev
pause
