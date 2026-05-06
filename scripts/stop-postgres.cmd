@echo off
:: ============================================================
:: stop-postgres.cmd
:: Stop the local PostgreSQL instance.
::
:: Usage:  scripts\stop-postgres.cmd
::
:: Edit PG_DATA below to match your PostgreSQL data directory.
:: ============================================================

set PG_DATA=C:\dev\pg-data

echo.
echo Stopping PostgreSQL (data dir: %PG_DATA%)...
pg_ctl stop -D "%PG_DATA%"
if errorlevel 1 (
    echo.
    echo NOTE: pg_ctl returned a non-zero exit code.
    echo       PostgreSQL may not have been running.
    exit /b 1
)

echo.
echo Verifying port 5432 is closed...
timeout /t 2 /nobreak >nul
netstat -an | findstr :5432 >nul
if errorlevel 1 (
    echo Port 5432 is closed. PostgreSQL is stopped.
) else (
    echo NOTE: Port 5432 is still listening. PostgreSQL may still be shutting down.
    echo       Wait a few seconds and run this script again, or check Task Manager.
)
