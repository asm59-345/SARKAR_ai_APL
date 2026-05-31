import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SarkarAI OS Backend"
    API_V1_STR: str = "/api/v1"
    
    # Mode
    DEMO_MODE: bool = True
    
    # Database Config
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "sarkarai_db"
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis Broker Config
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL_OVERRIDE: Optional[str] = "rediss://default:gQAAAAAAAiQjAAIgcDE3NDY0MjQwNGQ3NDc0YTkwOTczZDI3M2RkMDMzZjYwMA@valid-sculpin-140323.upstash.io:6379"
    
    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_URL_OVERRIDE:
            return self.REDIS_URL_OVERRIDE
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0"

    # JWT Config (Clerk integrations or local fallback keys)
    JWT_SECRET_KEY: str = "sarkarai_super_secret_jwting_vault_signature_hash"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week
    
    # Clerk
    CLERK_API_URL: str = "https://api.clerk.com/v1"
    CLERK_SECRET_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
