@echo off
title MongoDB Starter (Low Memory Mode)
echo ============================================
echo   MongoDB Database Starter
echo ============================================
echo.

rem Check for admin rights, self-elevate if needed
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Admin permission chahiye - UAC popup me YES click karo...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Applying low-memory config (256MB cache for 4GB RAM system)...
copy /Y "c:\Users\user\Documents\real---estate-main\real---estate-main\real-estate-app-main\.vercel-tmp\mongod-lowmem.cfg" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg"

echo Starting MongoDB service...
net start MongoDB
if %errorlevel% equ 0 (
    echo.
    echo  SUCCESS! MongoDB chalu ho gaya hai.
    echo  Ab Compass bhi connect ho jayega aur app ka login/register kaam karega.
) else (
    echo.
    echo  MongoDB start nahi hua. Ho sakta hai already running ho.
    sc query MongoDB | find "RUNNING" >nul && echo  Confirmed: MongoDB already RUNNING hai!
)
echo.
pause
