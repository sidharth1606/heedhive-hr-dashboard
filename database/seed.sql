-- ============================================
-- Heedhive HR Dashboard - Seed Data
-- ============================================

USE heedhive_hr;

-- Admin user (password: heedhive@123)
INSERT INTO users (name, email, password_hash, role) VALUES
('HR Admin', 'hr@heedhive.in', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgRqZkHmGqT5F7K9YmX2Ky', 'admin');

-- Departments
INSERT INTO departments (name) VALUES
('SEO'), ('Content'), ('Development'), ('Social Media'), ('Paid Ads');

-- Employees
INSERT INTO employees (name, email, role, department_id, phone, join_date, avatar_color) VALUES
('Arjun Mehta',  'arjun@heedhive.in',  'SEO Analyst',       1, '9876543210', '2023-01-15', '#f5a623'),
('Priya Sharma', 'priya@heedhive.in',  'Content Writer',    2, '9876543211', '2023-03-10', '#818cf8'),
('Ravi Kumar',   'ravi@heedhive.in',   'Web Developer',     3, '9876543212', '2022-06-01', '#4ade80'),
('Meera Nair',   'meera@heedhive.in',  'Social Media Mgr',  4, '9876543213', '2023-09-05', '#f87171'),
('Aditya Patel', 'aditya@heedhive.in', 'PPC Specialist',    5, '9876543214', '2024-02-20', '#fb923c'),
('Kavya Reddy',  'kavya@heedhive.in',  'UI/UX Designer',    3, '9876543215', '2022-11-12', '#38bdf8'),
('Suresh Babu',  'suresh@heedhive.in', 'SEO Lead',          1, '9876543216', '2022-04-03', '#a78bfa'),
('Divya Rao',    'divya@heedhive.in',  'Copywriter',        2, '9876543217', '2024-01-08', '#34d399');

-- Sample attendance for today
INSERT INTO attendance (employee_id, date, status, check_in, check_out) VALUES
(1, CURDATE(), 'present', '09:05:00', '18:10:00'),
(2, CURDATE(), 'present', '09:15:00', '18:00:00'),
(3, CURDATE(), 'wfh',     '09:00:00', '18:30:00'),
(4, CURDATE(), 'present', '09:30:00', '17:45:00'),
(5, CURDATE(), 'absent',  NULL,        NULL),
(6, CURDATE(), 'wfh',     '09:10:00', '18:15:00'),
(7, CURDATE(), 'present', '08:55:00', '18:00:00'),
(8, CURDATE(), 'half',    '09:00:00', '13:00:00');
