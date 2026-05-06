@echo off
:: ============================================================
:: stop-postgres.cmd
:: Stop the local PostgreSQL instance.
:: Can be run from any directory or via a desktop shortcut.
::
:: Shortcut target:
::   cmd.exe /k "C:\dev\managed-service-platform\scripts\stop-postgres.cmd"
::
:: Do NOT put passwords in this file.
:: ============================================================

:: --- CONFIG --------------------------------------------------
set PG_CTL=C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe
set PG_DATA=C:\dev\managed-service-platform-data\postgres-data
:: -------------------------------------------------------------

echo.
echo ============================================================
echo  Detener PostgreSQL Local
echo ============================================================

echo.
echo [1/2] Stopping PostgreSQL...
echo       pg_ctl : "%PG_CTL%"
echo       data   : %PG_DATA%
echo.
"%PG_CTL%" stop -D "%PG_DATA%"
if errorlevel 1 (
    echo.
    echo NOTE: pg_ctl returned a non-zero exit code.
    echo       PostgreSQL may not have been running.
)

:: --- Verify port 5432 is closed ------------------------------
echo.
echo [2/2] Verifying port 5432 is closed...
timeout /t 2 /nobreak >nul
netstat -an | findstr :5432 >nul
if errorlevel 1 (
    echo       Port 5432 is closed. PostgreSQL is stopped.
) else (
    echo  NOTE: Port 5432 is still listening.
    echo        PostgreSQL may still be shutting down.
    echo        Wait a few seconds and run this script again if needed.
)

echo.
pause
