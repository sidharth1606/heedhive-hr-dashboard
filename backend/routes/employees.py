from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Employee, Department

employees_bp = Blueprint('employees', __name__)

@employees_bp.route('/', methods=['GET'])
@jwt_required()
def get_employees():
    dept   = request.args.get('department')
    status = request.args.get('status', 'active')
    search = request.args.get('search', '')

    query = Employee.query.filter_by(status=status)
    if dept:
        d = Department.query.filter_by(name=dept).first()
        if d:
            query = query.filter_by(department_id=d.id)
    if search:
        query = query.filter(Employee.name.ilike(f'%{search}%'))

    employees = query.all()
    return jsonify([e.to_dict() for e in employees]), 200

@employees_bp.route('/<int:emp_id>', methods=['GET'])
@jwt_required()
def get_employee(emp_id):
    emp = Employee.query.get_or_404(emp_id)
    return jsonify(emp.to_dict()), 200

@employees_bp.route('/', methods=['POST'])
@jwt_required()
def create_employee():
    data = request.get_json()
    required = ['name', 'email', 'role', 'department_id']
    for f in required:
        if not data.get(f):
            return jsonify({'error': f'{f} is required'}), 400

    if Employee.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409

    emp = Employee(
        name          = data['name'],
        email         = data['email'],
        role          = data['role'],
        department_id = data['department_id'],
        phone         = data.get('phone'),
        join_date     = data.get('join_date'),
        avatar_color  = data.get('avatar_color', '#f5a623'),
    )
    db.session.add(emp)
    db.session.commit()
    return jsonify(emp.to_dict()), 201

@employees_bp.route('/<int:emp_id>', methods=['PUT'])
@jwt_required()
def update_employee(emp_id):
    emp  = Employee.query.get_or_404(emp_id)
    data = request.get_json()
    for field in ['name', 'email', 'role', 'department_id', 'phone', 'join_date', 'status', 'avatar_color']:
        if field in data:
            setattr(emp, field, data[field])
    db.session.commit()
    return jsonify(emp.to_dict()), 200

@employees_bp.route('/<int:emp_id>', methods=['DELETE'])
@jwt_required()
def delete_employee(emp_id):
    emp = Employee.query.get_or_404(emp_id)
    emp.status = 'inactive'
    db.session.commit()
    return jsonify({'message': 'Employee deactivated'}), 200

@employees_bp.route('/departments', methods=['GET'])
@jwt_required()
def get_departments():
    depts = Department.query.all()
    return jsonify([{'id': d.id, 'name': d.name} for d in depts]), 200
