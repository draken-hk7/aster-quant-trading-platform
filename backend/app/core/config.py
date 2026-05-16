from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: str = "local"
    app_name: str = "Aster Quant"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    frontend_origin: str = "http://localhost:3000"
    database_url: str = "postgresql+asyncpg://aster:aster@localhost:5432/aster"
    redis_url: str = "redis://localhost:6379/0"
    kafka_bootstrap_servers: str = "localhost:9092"
    jwt_issuer: str = "aster-quant"
    jwt_audience: str = "aster-terminal"
    jwt_secret: str = Field(default="dev-only-secret-change-me", min_length=16)
    access_token_minutes: int = 30
    daily_loss_limit: float = 250_000
    max_gross_exposure: float = 5_000_000
    max_order_notional: float = 250_000


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

