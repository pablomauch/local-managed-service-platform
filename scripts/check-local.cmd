@echo off
:: ============================================================
:: check-local.cmd
:: Validate the local development environment.
:: Can be run from any directory or via a desktop shortcut.
::
:: Shortcut target:
::   cmd.exe /k "C:\dev\managed-service-platform\scripts\check-local.cmd"
::
:: Checks: Node.js, npm, pg_ctl, PostgreSQL port, project folder,
::         package.json, .env.local, node_modules.
:: ============================================================

:: --- CONFIG --------------------------------------------------
set PG_CTL=C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe
set APP_DIR=C:\dev\managed-service-platform
set ERRORS=0
:: -------------------------------------------------------------

echo.
echo ============================================================
echo  Revisar Entorno Local
echo ============================================================

:: --- Node.js -------------------------------------------------
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

:: --- npm -----------------------------------------------------
echo.
echo [CHECK] npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo  FAIL  npm not found on PATH.
    set /a ERRORS+=1
) else (
    for /f %%v in ('npm --version') do echo  OK    npm %%v
)

:: --- pg_ctl (absolute path) ----------------------------------
echo.
echo [CHECK] pg_ctl at %PG_CTL%...
if exist "%PG_CTL%" (
    for /f %%v in ('"%PG_CTL%" --version') do echo  OK    %%v
) else (
    echo  FAIL  pg_ctl not found: %PG_CTL%
    echo        Check that PostgreSQL 18 is installed at C:\Program Files\PostgreSQL\18
    set /a ERRORS+=1
)

:: --- PostgreSQL port 5432 ------------------------------------
echo.
echo [CHECK] PostgreSQL port 5432...
netstat -an | findstr :5432 >nul
if errorlevel 1 (
    echo  WARN  Port 5432 is not listening.
    echo        Start PostgreSQL with: scripts\start-local.cmd
) else (
    echo  OK    Port 5432 is listening.
)

:: --- Project folder ------------------------------------------
echo.
echo [CHECK] Project folder %APP_DIR%...
if exist "%APP_DIR%\" (
    echo  OK    %APP_DIR% exists.
) else (
    echo  FAIL  %APP_DIR% not found.
    echo        Clone the repository to that path.
    set /a ERRORS+=1
)

:: --- package.json --------------------------------------------
echo.
echo [CHECK] package.json in project folder...
if exist "%APP_DIR%\package.json" (
    echo  OK    package.json found.
) else (
    echo  FAIL  package.json not found in %APP_DIR%
    echo        The repository may not be cloned correctly.
    set /a ERRORS+=1
)

:: --- .env.local ----------------------------------------------
echo.
echo [CHECK] .env.local in project folder...
if exist "%APP_DIR%\.env.local" (
    echo  OK    .env.local found.
) else (
    echo  WARN  .env.local not found.
    echo        Copy .env.example to .env.local and fill in real values.
)

:: --- node_modules --------------------------------------------
echo.
echo [CHECK] node_modules in project folder...
if exist "%APP_DIR%\node_modules\" (
    echo  OK    node_modules found.
) else (
    echo  WARN  node_modules not found.
    echo        Run: cd /d %APP_DIR% && npm install
)

:: --- Summary -------------------------------------------------
echo.
echo ============================================================
if %ERRORS%==0 (
    echo  All required checks passed.
) else (
    echo  %ERRORS% check(s) failed. Fix the items marked FAIL above.
)
echo ============================================================
echo.

pause
exit /b %ERRORS%
