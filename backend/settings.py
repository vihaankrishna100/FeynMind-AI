from pydantic_settings import BaseSettings
from typing import List
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    MODEL_NAME: str = "gpt-4o-mini"
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE: str
    SUPABASE_JWT_AUD: str = "authenticated"
    
    class Config:
        env_file = ".env"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

settings = Settings()
