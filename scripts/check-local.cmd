@echo off
:: ============================================================
:: check-local.cmd
:: Validate the local development environment.
:: Checks: Node.js, npm, PostgreSQL port, project folder.
::
:: Usage:  scripts\check-local.cmd
:: ============================================================

set APP_DIR=C:\dev\managed-service-platform
set ERRORS=0

echo.
echo ============================================================
echo  Local environment check
echo ============================================================

:: --- Node.js ---
echo.
echo [CHECK] Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo  FAIL  node not found on PATH.
    echo        Install Node.js v20+ from https://nodejs.org/
    set /a ERRORS+=1
) else (
    for /f %%v in ('node --version') do echo  OK    Node.js %%v
)

:: --- npm ---
echo.
echo [CHECK] npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo  FAIL  npm not found on PATH.
    set /a ERRORS+=1
) else (
    for /f %%v in ('npm --version') do echo  OK    npm %%v
)

:: --- pg_ctl ---
echo.
echo [CHECK] pg_ctl...
pg_ctl --version >nul 2>&1
if errorlevel 1 (
    echo  FAIL  pg_ctl not found on PATH.
    echo        Add the PostgreSQL bin directory to PATH,
    echo        e.g. C:\Program Files\PostgreSQL\16\bin
    set /a ERRORS+=1
) else (
    for /f %%v in ('pg_ctl --version') do echo  OK    %%v
)

:: --- PostgreSQL port 5432 ---
echo.
echo [CHECK] PostgreSQL port 5432...
netstat -an | findstr :5432 >nul
if errorlevel 1 (
    echo  WARN  Port 5432 is not listening.
    echo        Start PostgreSQL with: scripts\start-local.cmd
    echo        (Not counted as a hard failure — app will not connect until started.)
) else (
    echo  OK    Port 5432 is listening.
)

:: --- Project folder ---
echo.
echo [CHECK] Project folder %APP_DIR%...
if exist "%APP_DIR%\" (
    echo  OK    %APP_DIR% exists.
) else (
    echo  FAIL  %APP_DIR% not found.
    echo        Clone the repository there, or update APP_DIR in this script.
    set /a ERRORS+=1
)

:: --- .env.local ---
echo.
echo [CHECK] .env.local in project folder...
if exist "%APP_DIR%\.env.local" (
    echo  OK    .env.local found.
) else (
    echo  WARN  .env.local not found.
    echo        Copy .env.example to .env.local and fill in real values.
    echo        (Not counted as a hard failure — app will fail to start without it.)
)

:: --- node_modules ---
echo.
echo [CHECK] node_modules in project folder...
if exist "%APP_DIR%\node_modules\" (
    echo  OK    node_modules found.
) else (
    echo  WARN  node_modules not found. Run: npm install
)

:: --- Summary ---
echo.
echo ============================================================
if %ERRORS%==0 (
    echo  All required checks passed.
) else (
    echo  %ERRORS% check(s) failed. Fix the items marked FAIL above.
)
echo ============================================================
echo.

exit /b %ERRORS%
