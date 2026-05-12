from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes.auth import auth_bp
from routes.employees import employees_bp
from routes.attendance import attendance_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app, origins="*")
JWTManager(app)

app.register_blueprint(auth_bp,       url_prefix='/api/auth')
app.register_blueprint(employees_bp,  url_prefix='/api/employees')
app.register_blueprint(attendance_bp, url_prefix='/api/attendance')

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return {"message": "Heedhive HR API is running", "version": "1.0.0"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)