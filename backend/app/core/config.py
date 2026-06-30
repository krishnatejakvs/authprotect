from pydantic_settings import BaseSettings
from pydantic import PostgresDsn

class Settings(BaseSettings):
    PROJECT_NAME: str = "AuthProtect AI"
    # Default to a local postgres instance
    DATABASE_URL: PostgresDsn = "postgresql://postgres:postgres@localhost:5432/authprotect"
    
    REDIS_URL: str = "redis://localhost:6379/0"
    
    @property
    def CELERY_BROKER_URL(self) -> str:
        url = self.REDIS_URL
        if url.startswith("rediss://") and "ssl_cert_reqs" not in url:
            url += "?ssl_cert_reqs=CERT_NONE"
        return url
        
    @property
    def CELERY_RESULT_BACKEND(self) -> str:
        url = self.REDIS_URL
        if url.startswith("rediss://") and "ssl_cert_reqs" not in url:
            url += "?ssl_cert_reqs=CERT_NONE"
        return url

    class Config:
        env_file = ".env"

settings = Settings()
