from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx

import json
from typing import List, Dict, Optional
from settings import settings

app = FastAPI(title="FeynMind AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Integrated pydanitic valiudation of the request sent to the backend

#three dots means required for the backend
class QuizRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=120)
    difficulty: Optional[str] = Field(None, pattern="^(easy|medium|hard)$")

class ChatRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=120)
    transcript: str = Field(..., max_length=2000)
    history: List[Dict[str, str]] = Field(default_factory=list)

#Log all question parameters
class QuizQuestion(BaseModel):
    id: str

    prompt: str
    choices: List[str] = Field(..., min_length=4, max_length=4)
    answerIndex: int = Field(..., ge=0, le=3)
    explanation: str

    #bloom level pattern
    bloom: str = Field(..., pattern="^(remember|understand|apply|analyze|evaluate|create)$")


class Quiz(BaseModel):
    topic: str

    #difficulty analysis(make sure to change prompt)
    difficulty: str = Field(..., pattern="^(easy|medium|hard|mixed)$")
    questions: List[QuizQuestion] = Field(..., min_length=5, max_length=10)

class ChatResponse(BaseModel):
    response: str
    followups: List[str] = Field(..., min_length=1, max_length=3)
    suggest_quiz: bool


#user's other tasks are effcientley handled using async

async def generate_quiz_openai(topic: str, difficulty: Optional[str] = None) -> Quiz:
    system_prompt = "Create a quiz with 5-7 multiple choice questions. Return JSON format only."

    user_prompt = f"Make a quiz about {topic}. Difficulty: {difficulty or 'mixed'}. Return JSON with topic, difficulty, and a questions array with id, prompt, 4 choices, answerIndex, explanation, and bloom level."

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": settings.MODEL_NAME,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                #reponse from the API key format for the model(highly reiterated)
                "response_format": {
                    "type": "json_schema",
                    "json_schema": {

                        "name": "quiz_response",
                        "strict": True,
                        "schema": {
                            "type": "object",
                            "additionalProperties": False,
                            "properties": {
                                "topic": {"type": "string"},


                                "difficulty": {"type": "string", "enum": ["easy", "medium", "hard", "mixed"]},
                                "questions": {
                                    "type": "array",
                                    "minItems": 5,
                                    "maxItems": 10,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "properties": {
                                            "id": {"type": "string"},
                                            "prompt": {"type": "string"},
                                            "choices": {
                                                "type": "array",

                                                "minItems": 4,
                                                "maxItems": 4,

                                                "items": {"type": "string"}
                                            },
                                            "answerIndex": {"type": "integer", "minimum": 0, "maximum": 3},
                                            "explanation": {"type": "string"},

                                            #bloom's taxonmy is what Feynman is based off of
                                            "bloom": {"type": "string", "enum": ["remember", "understand", "apply", "analyze", "evaluate", "create"]}
                                        },
                                        "required": ["id", "prompt", "choices", "answerIndex", "explanation", "bloom"]
                                    }
                                }
                            },
                            "required": ["topic", "difficulty", "questions"]
                        }
                    }
                },

                # tried multiple but recieved very short answers for the most part
                "max_tokens": 2000,

                #highly creative because I wanted to reduce repititon in questions which was a main problem
                "temperature": 0.7
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"OpenAI error: {response.text[:300]}")

        try:
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            quiz_data = json.loads(content)
            return Quiz(**quiz_data)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Quiz parse error: {str(e)}")



async def feynman_chat_openai(topic: str, transcript: str, history: List[Dict[str, str]]) -> ChatResponse:
    system_prompt = "You are a tutor. Ask probing questions to check understanding of the user. Keep it short."

    history_json = json.dumps(history) if history else "[]"
    user_prompt = f"Topic: {topic}\nStudent said: {transcript}\nChat history: {history_json}\nRespond with JSON that has response, followups array, and suggest_quiz boolean."

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": settings.MODEL_NAME,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 500,
                "temperature": 0.8
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="API error")
        
        result = response.json()
        content = result["choices"][0]["message"]["content"]
        chat_data = json.loads(content)
        return ChatResponse(**chat_data)

@app.get("/api/health")
async def health_check():
    return {"ok": True}

@app.post("/api/quiz", response_model=Quiz)
async def generate_quiz(request: QuizRequest):
    topic = request.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    quiz = await generate_quiz_openai(topic, request.difficulty)
    return quiz

@app.post("/api/chat", response_model=ChatResponse)
async def feynman_chat(request: ChatRequest):
    topic = request.topic.strip()
    transcript = request.transcript.strip()
    if not topic or not transcript:
        raise HTTPException(status_code=400, detail="Topic and transcript cannot be empty")
    response = await feynman_chat_openai(topic, transcript, request.history)
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
