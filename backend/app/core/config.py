from pydantic_settings import BaseSettings
from pydantic import PostgresDsn

class Settings(BaseSettings):
    PROJECT_NAME: str = "AuthProtect AI"
    # Default to a local postgres instance
    DATABASE_URL: PostgresDsn = "postgresql://postgres:postgres@localhost:5432/authprotect"

    class Config:
        env_file = ".env"

settings = Settings()
