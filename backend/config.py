import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    db_url = os.getenv('DATABASE_URL', '')
    # Fix postgres:// -> postgresql://
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
    # Add SSL mode if not present
    if '?' not in db_url:
        db_url += '?sslmode=require'
    
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'heedhive-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
    SECRET_KEY = os.getenv('SECRET_KEY', 'heedhive-flask-secret')