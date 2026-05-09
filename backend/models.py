from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(100), nullable=False)
    email         = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role          = db.Column(db.Enum('admin','hr','manager'), default='hr')
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

class Department(db.Model):
    __tablename__ = 'departments'
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(100), nullable=False)
    employees  = db.relationship('Employee', backref='department', lazy=True)

class Employee(db.Model):
    __tablename__ = 'employees'
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(150), nullable=False)
    email         = db.Column(db.String(150), unique=True, nullable=False)
    role          = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    phone         = db.Column(db.String(20))
    join_date     = db.Column(db.Date)
    status        = db.Column(db.Enum('active','inactive'), default='active')
    avatar_color  = db.Column(db.String(10), default='#f5a623')
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    attendance    = db.relationship('Attendance', backref='employee', lazy=True)

    def to_dict(self):
        return {
            'id':           self.id,
            'name':         self.name,
            'email':        self.email,
            'role':         self.role,
            'department':   self.department.name if self.department else None,
            'department_id':self.department_id,
            'phone':        self.phone,
            'join_date':    self.join_date.isoformat() if self.join_date else None,
            'status':       self.status,
            'avatar_color': self.avatar_color,
        }

class Attendance(db.Model):
    __tablename__ = 'attendance'
    id          = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    date        = db.Column(db.Date, nullable=False)
    status      = db.Column(db.Enum('present','absent','wfh','half'), nullable=False)
    check_in    = db.Column(db.Time)
    check_out   = db.Column(db.Time)
    notes       = db.Column(db.Text)
    marked_by   = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    __table_args__ = (db.UniqueConstraint('employee_id', 'date'),)

    def to_dict(self):
        return {
            'id':          self.id,
            'employee_id': self.employee_id,
            'date':        self.date.isoformat(),
            'status':      self.status,
            'check_in':    str(self.check_in) if self.check_in else None,
            'check_out':   str(self.check_out) if self.check_out else None,
            'notes':       self.notes,
        }

class LeaveRequest(db.Model):
    __tablename__ = 'leave_requests'
    id          = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    from_date   = db.Column(db.Date, nullable=False)
    to_date     = db.Column(db.Date, nullable=False)
    reason      = db.Column(db.Text)
    status      = db.Column(db.Enum('pending','approved','rejected'), default='pending')
    reviewed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
