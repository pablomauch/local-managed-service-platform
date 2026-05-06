@echo off
:: ============================================================
:: start-local.cmd
:: Start PostgreSQL and the local development server.
::
:: Usage:  scripts\start-local.cmd
::
:: Edit PG_DATA below to match your PostgreSQL data directory.
:: Do NOT put passwords in this file.
:: ============================================================

set PG_DATA=C:\dev\pg-data
set PG_LOG=%PG_DATA%\postgres.log
set APP_DIR=C:\dev\managed-service-platform

echo.
echo [1/4] Starting PostgreSQL...
pg_ctl start -D "%PG_DATA%" -l "%PG_LOG%"
if errorlevel 1 (
    echo.
    echo NOTE: pg_ctl returned a non-zero exit code.
    echo       PostgreSQL may already be running, or startup failed.
    echo       Check the log: %PG_LOG%
)

echo.
echo [2/4] Waiting for PostgreSQL to be ready...
timeout /t 3 /nobreak >nul

echo.
echo [3/4] Verifying port 5432...
netstat -an | findstr :5432 >nul
if errorlevel 1 (
    echo ERROR: Port 5432 is not listening.
    echo        PostgreSQL may not have started. Check: %PG_LOG%
    exit /b 1
)
echo Port 5432 is listening. PostgreSQL is up.

echo.
echo [4/4] Starting the app...
cd /d "%APP_DIR%"
if errorlevel 1 (
    echo ERROR: Cannot find app directory: %APP_DIR%
    exit /b 1
)
npm run dev
