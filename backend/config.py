import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MySQL
    MYSQL_HOST     = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_USER     = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    MYSQL_DB       = os.getenv('MYSQL_DB', 'heedhive_hr')

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
        f"@{MYSQL_HOST}/{MYSQL_DB}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY        = os.getenv('JWT_SECRET_KEY', 'heedhive-secret-key-change-in-prod')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)

    SECRET_KEY = os.getenv('SECRET_KEY', 'heedhive-flask-secret')
