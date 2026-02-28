#!/bin/bash

echo "Setting up FeynMind AI environment files..."

# Create backend .env file
cat > backend/.env << EOF
OPENAI_API_KEY=
MODEL_NAME=gpt-4o-mini
ALLOWED_ORIGINS=http://localhost:5173
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=
SUPABASE_JWT_AUD=authenticated
EOF

# Create frontend .env file
cat > frontend/.env << EOF
VITE_API_BASE=http://localhost:8000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ENABLE_MIC=true
EOF

echo "Environment files created!"
echo ""
echo "Please edit the following files and add your API keys:"
echo "- backend/.env (add your OpenAI API key and Supabase credentials)"
echo "- frontend/.env (add your Supabase URL and anon key)"
echo ""
echo "You can get your Supabase credentials from:"
echo "1. Go to your Supabase project dashboard"
echo "2. Go to Settings > API"
echo "3. Copy the Project URL and anon public key"
echo ""
echo "For OpenAI API key:"
echo "1. Go to https://platform.openai.com/api-keys"
echo "2. Create a new API key"
echo ""
echo "After adding your keys, you can start the application:"
echo "Backend: cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"
echo "Frontend: cd frontend && npm install && npm run dev"
