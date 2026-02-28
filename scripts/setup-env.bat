

@echo off
echo Setting up FeynMind AI environment files...

REM Create backend .env file
(
echo OPENAI_API_KEY=
echo MODEL_NAME=gpt-4o-mini
echo ALLOWED_ORIGINS=http://localhost:5173
echo SUPABASE_URL=
echo SUPABASE_SERVICE_ROLE=
echo SUPABASE_JWT_AUD=authenticated
) > backend\.env

REM Create frontend .env file
(
echo VITE_API_BASE=http://localhost:8000
echo VITE_SUPABASE_URL=
echo VITE_SUPABASE_ANON_KEY=
echo VITE_ENABLE_MIC=true
) > frontend\.env

echo Environment files created!
echo.
echo Please edit the following files and add your API keys:
echo - backend\.env (add your OpenAI API key and Supabase credentials)
echo - frontend\.env (add your Supabase URL and anon key)
echo.
echo You can get your Supabase credentials from:
echo 1. Go to your Supabase project dashboard
echo 2. Go to Settings ^> API
echo 3. Copy the Project URL and anon public key
echo.
echo For OpenAI API key:
echo 1. Go to https://platform.openai.com/api-keys
echo 2. Create a new API key
echo.
echo After adding your keys, you can start the application:
echo Backend: cd backend ^&^& pip install -r requirements.txt ^&^& uvicorn main:app --reload --port 8000
echo Frontend: cd frontend ^&^& npm install ^&^& npm run dev
pause
