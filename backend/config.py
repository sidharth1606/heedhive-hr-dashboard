import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', '').replace('postgres://', 'postgresql://')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'heedhive-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
    SECRET_KEY = os.getenv('SECRET_KEY', 'heedhive-flask-secret')