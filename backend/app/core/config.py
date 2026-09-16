import os


class Settings:
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")


settings = Settings()
