@echo off
:: ============================================================
:: start-local.cmd
:: Start PostgreSQL and the local development server.
:: Can be run from any directory.
::
:: Usage:  scripts\start-local.cmd
::         (or double-click from Explorer)
::
:: Edit the paths in the CONFIG section below to match your machine.
:: Do NOT put passwords in this file.
:: ============================================================

:: --- CONFIG --------------------------------------------------
set PG_CTL=C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe
set PG_DATA=C:\dev\pg-data
set PG_LOG=C:\dev\pg-data\postgres.log
set APP_DIR=C:\dev\managed-service-platform
:: -------------------------------------------------------------

echo.
echo ============================================================
echo  Local startup — managed-service-platform
echo ============================================================

:: --- Step 1: Start PostgreSQL --------------------------------
echo.
echo [1/4] Starting PostgreSQL...
echo       pg_ctl : "%PG_CTL%"
echo       data   : %PG_DATA%
echo       log    : %PG_LOG%
echo.
"%PG_CTL%" start -D "%PG_DATA%" -l "%PG_LOG%"
if errorlevel 1 (
    echo.
    echo NOTE: pg_ctl returned a non-zero exit code.
    echo       PostgreSQL may already be running, or startup failed.
    echo       Check the log: %PG_LOG%
)

:: --- Step 2: Wait for PostgreSQL to be ready -----------------
echo.
echo [2/4] Waiting for PostgreSQL to be ready...
timeout /t 3 /nobreak >nul

:: --- Step 3: Verify port 5432 is listening -------------------
echo.
echo [3/4] Verifying port 5432 is listening...
netstat -an | findstr :5432 >nul
if errorlevel 1 (
    echo.
    echo ERROR: Port 5432 is not listening.
    echo        PostgreSQL did not start. Check the log: %PG_LOG%
    echo.
    pause
    exit /b 1
)
echo       Port 5432 is listening. PostgreSQL is up.

:: --- Step 4: Start the application ---------------------------
echo.
echo [4/4] Changing to app directory and starting dev server...
echo       app dir: %APP_DIR%
echo.
cd /d "%APP_DIR%"
if errorlevel 1 (
    echo ERROR: Cannot change to app directory: %APP_DIR%
    echo        Check that the repository is cloned to that path.
    echo.
    pause
    exit /b 1
)
npm run dev
