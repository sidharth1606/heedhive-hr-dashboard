from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Attendance, Employee
from datetime import date, timedelta
import csv, io
from flask import make_response

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/', methods=['GET'])
@jwt_required()
def get_attendance():
    date_str  = request.args.get('date', date.today().isoformat())
    emp_id    = request.args.get('employee_id')
    from_date = request.args.get('from_date')
    to_date   = request.args.get('to_date')

    query = Attendance.query
    if emp_id:
        query = query.filter_by(employee_id=emp_id)
    if from_date and to_date:
        query = query.filter(Attendance.date.between(from_date, to_date))
    else:
        query = query.filter_by(date=date_str)

    records = query.all()
    return jsonify([r.to_dict() for r in records]), 200

@attendance_bp.route('/today', methods=['GET'])
@jwt_required()
def get_today():
    today   = date.today()
    records = Attendance.query.filter_by(date=today).all()
    employees = Employee.query.filter_by(status='active').all()

    result = []
    att_map = {r.employee_id: r for r in records}
    for emp in employees:
        att = att_map.get(emp.id)
        result.append({
            'employee_id':   emp.id,
            'employee_name': emp.name,
            'department':    emp.department.name if emp.department else None,
            'avatar_color':  emp.avatar_color,
            'status':        att.status if att else 'not_marked',
            'check_in':      str(att.check_in) if att and att.check_in else None,
            'check_out':     str(att.check_out) if att and att.check_out else None,
        })
    return jsonify(result), 200

@attendance_bp.route('/mark', methods=['POST'])
@jwt_required()
def mark_attendance():
    data     = request.get_json()
    identity = get_jwt_identity()
    emp_id   = data.get('employee_id')
    att_date = data.get('date', date.today().isoformat())
    status   = data.get('status')

    if not emp_id or not status:
        return jsonify({'error': 'employee_id and status required'}), 400
    if status not in ['present', 'absent', 'wfh', 'half']:
        return jsonify({'error': 'Invalid status'}), 400

    existing = Attendance.query.filter_by(employee_id=emp_id, date=att_date).first()
    if existing:
        existing.status    = status
        existing.check_in  = data.get('check_in')
        existing.check_out = data.get('check_out')
        existing.marked_by = identity['id']
    else:
        record = Attendance(
            employee_id = emp_id,
            date        = att_date,
            status      = status,
            check_in    = data.get('check_in'),
            check_out   = data.get('check_out'),
            notes       = data.get('notes'),
            marked_by   = identity['id'],
        )
        db.session.add(record)

    db.session.commit()
    return jsonify({'message': 'Attendance marked successfully'}), 200

@attendance_bp.route('/bulk-mark', methods=['POST'])
@jwt_required()
def bulk_mark():
    data     = request.get_json()
    identity = get_jwt_identity()
    records  = data.get('records', [])

    for item in records:
        existing = Attendance.query.filter_by(
            employee_id=item['employee_id'], date=item['date']
        ).first()
        if existing:
            existing.status    = item['status']
            existing.marked_by = identity['id']
        else:
            db.session.add(Attendance(
                employee_id = item['employee_id'],
                date        = item['date'],
                status      = item['status'],
                marked_by   = identity['id'],
            ))
    db.session.commit()
    return jsonify({'message': f'{len(records)} records saved'}), 200

@attendance_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    from_date = request.args.get('from_date', (date.today() - timedelta(days=30)).isoformat())
    to_date   = request.args.get('to_date', date.today().isoformat())
    records   = Attendance.query.filter(Attendance.date.between(from_date, to_date)).all()

    total = len(records)
    stats = {'present': 0, 'absent': 0, 'wfh': 0, 'half': 0}
    for r in records:
        stats[r.status] = stats.get(r.status, 0) + 1

    rate = round(((stats['present'] + stats['wfh'] + stats['half'] * 0.5) / total * 100), 1) if total else 0
    return jsonify({**stats, 'total': total, 'attendance_rate': rate}), 200

@attendance_bp.route('/export', methods=['GET'])
@jwt_required()
def export_csv():
    from_date = request.args.get('from_date', (date.today() - timedelta(days=30)).isoformat())
    to_date   = request.args.get('to_date', date.today().isoformat())
    records   = Attendance.query.filter(Attendance.date.between(from_date, to_date)).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Employee', 'Department', 'Date', 'Status', 'Check In', 'Check Out'])
    for r in records:
        emp = Employee.query.get(r.employee_id)
        writer.writerow([
            emp.name if emp else r.employee_id,
            emp.department.name if emp and emp.department else '',
            r.date, r.status,
            str(r.check_in) if r.check_in else '',
            str(r.check_out) if r.check_out else '',
        ])

    response = make_response(output.getvalue())
    response.headers['Content-Disposition'] = 'attachment; filename=heedhive_attendance.csv'
    response.headers['Content-Type'] = 'text/csv'
    return response
