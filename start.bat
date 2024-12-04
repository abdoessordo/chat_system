@echo off

:: Navigate to the backend directory
echo Activating Python virtual environment...
cd back\back-env\Scripts
call activate
cd ..\..\src

:: Run the backend
echo Starting the backend...
start cmd /k uvicorn main:app --host 0.0.0.0 --port 8000

:: Navigate to the frontend directory
echo Starting the frontend...
cd ..\..\front
start cmd /k npm run dev

echo Both servers are running. Close the windows to stop.
pause
