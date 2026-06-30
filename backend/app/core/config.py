from pydantic_settings import BaseSettings
from pydantic import PostgresDsn

class Settings(BaseSettings):
    PROJECT_NAME: str = "AuthProtect AI"
    # Default to a local postgres instance
    DATABASE_URL: PostgresDsn = "postgresql://postgres:postgres@localhost:5432/authprotect"
    
    REDIS_URL: str = "redis://localhost:6379/0"
    
    @property
    def CELERY_BROKER_URL(self) -> str:
        return self.REDIS_URL
        
    @property
    def CELERY_RESULT_BACKEND(self) -> str:
        return self.REDIS_URL

    class Config:
        env_file = ".env"

settings = Settings()
